import type { ActionFunctionArgs } from '@shopify/remix-oxygen';
import { PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { moderateImageFromS3 } from '~/lib/rekognition';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_MIME = ['image/jpeg', 'image/jpg', 'image/png'] as const;

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
};

// Helper function to sanitize filename for HTTP headers
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .substring(0, 100); // Limit length
}

// Build CloudFront image URL
function buildCloudFrontUrl(cloudFrontDomain: string, s3Key: string): string {
  return `https://${cloudFrontDomain}/${s3Key}`;
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const requestId = crypto.randomUUID();
  let quarantineKey: string | undefined;
  let finalKey: string | undefined;

  try {
    const { S3_BUCKET_NAME, AWS_REGION, CLOUDFRONT_DOMAIN } = context.env;

    if (!context.s3Client || !context.rekognitionClient) {
      return new Response(JSON.stringify({ error: 'AWS services unavailable' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (!S3_BUCKET_NAME || !AWS_REGION || !CLOUDFRONT_DOMAIN) {
      return new Response(JSON.stringify({ error: 'S3 or CloudFront not configured' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (imageFile.size <= 0 || imageFile.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          error: `File size must be between 1 byte and ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      );
    }
    if (!new Set(ACCEPTED_IMAGE_MIME).has(imageFile.type as any)) {
      return new Response(
        JSON.stringify({
          error: `Unsupported image format. Allowed: ${ACCEPTED_IMAGE_MIME.join(', ')}`,
        }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      );
    }

    // Keys
    const fileId = crypto.randomUUID();
    const extension = MIME_TO_EXT[imageFile.type] ?? 'jpg';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    quarantineKey = `quarantine/${fileId}.${extension}`;
    finalKey = `customer-uploads/${year}/${month}/${fileId}.${extension}`;

    // Sanitize filename for metadata
    const sanitizedFilename = sanitizeFilename(imageFile.name);

    // Workers-safe bytes (no Buffer)
    const bytes = new Uint8Array(await imageFile.arrayBuffer());

    // 1) Upload to quarantine (private)
    await context.s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: quarantineKey,
        Body: bytes,
        ContentType: imageFile.type,
        Metadata: {
          'original-filename': sanitizedFilename,
          'upload-timestamp': new Date().toISOString(),
          status: 'pending-moderation',
          'request-id': requestId,
        },
      }),
    );

    // 2) Moderate via Rekognition (S3Object)
    const moderationResult = await moderateImageFromS3(context.rekognitionClient, S3_BUCKET_NAME, quarantineKey);

    if (!moderationResult.approved) {
      // cleanup quarantine on reject
      await context.s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET_NAME, Key: quarantineKey }));
      return new Response(
        JSON.stringify({
          success: false,
          error: moderationResult.reason || 'Image contains inappropriate content',
          moderationDetails: moderationResult.labels ?? [],
        }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      );
    }

    // 3) Copy to public path with CloudFront-optimized headers + metadata
    await context.s3Client.send(
      new CopyObjectCommand({
        Bucket: S3_BUCKET_NAME,
        CopySource: `${S3_BUCKET_NAME}/${quarantineKey}`,
        Key: finalKey,
        ContentType: imageFile.type,
        // CloudFront-optimized cache headers
        CacheControl: 'public, max-age=31536000, immutable', // 1 year cache
        MetadataDirective: 'REPLACE',
        Metadata: {
          'original-filename': sanitizedFilename,
          status: 'approved',
          'upload-timestamp': new Date().toISOString(),
          'moderation-status': 'approved',
          'request-id': requestId,
        },
      }),
    );

    // 4) Delete from quarantine
    await context.s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET_NAME, Key: quarantineKey }));

    // 5) Build CloudFront image URL
    const imageUrl = buildCloudFrontUrl(CLOUDFRONT_DOMAIN, finalKey);

    return new Response(
      JSON.stringify({
        success: true,
        moderationPassed: true,
        imageUrl, // CloudFront URL - fast & global! 🚀
        s3Key: finalKey,
        fileId,
        originalFilename: imageFile.name,
        contentType: imageFile.type,
        uploadedAt: new Date().toISOString(),
        fileSize: imageFile.size,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  } catch (err: any) {
    // best-effort cleanup if moderation/copy failed
    try {
      const { S3_BUCKET_NAME } = context.env;
      if (S3_BUCKET_NAME && quarantineKey) {
        await context.s3Client?.send(new DeleteObjectCommand({ Bucket: S3_BUCKET_NAME, Key: quarantineKey }));
      }
    } catch {
      // swallow cleanup errors
    }

    const message =
      err?.name === 'InvalidS3ObjectException'
        ? 'Image not found in S3 for moderation (check region/bucket/key).'
        : err?.name === 'ImageTooLargeException'
          ? 'Image exceeds maximum size for moderation (15MB).'
          : err?.name === 'InvalidImageFormatException'
            ? 'Invalid image format for moderation (use JPEG or PNG).'
            : err?.message || 'Upload failed';

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
