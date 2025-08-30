import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';

export function createRekognitionClient(env: Env): RekognitionClient | null {
  if (!env.AWS_REGION || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    console.warn('Rekognition environment variables missing; moderation disabled.');
    return null;
  }
  return new RekognitionClient({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Rekognition S3 path supports JPEG/PNG and images up to 15MB.
 */
export async function moderateImageFromS3(
  rekognitionClient: RekognitionClient | null,
  bucketName: string,
  objectKey: string,
): Promise<{ approved: boolean; reason?: string; labels?: Array<{ name?: string; confidence?: number }> }> {
  if (!rekognitionClient) {
    // If disabled, allow to avoid blocking uploads in dev
    return { approved: true };
  }

  try {
    const res = await rekognitionClient.send(
      new DetectModerationLabelsCommand({
        Image: { S3Object: { Bucket: bucketName, Name: objectKey } },
        MinConfidence: 75,
      }),
    );

    const labels = (res.ModerationLabels ?? []).map(l => ({
      name: l.Name,
      confidence: l.Confidence,
    }));

    // crude but effective: reject obvious categories
    const blocked = new Set(['Explicit Nudity', 'Suggestive', 'Violence', 'Graphic Violence', 'Drugs', 'Hate Symbols']);
    const hasBad = (res.ModerationLabels ?? []).some(l => (l.Name ? blocked.has(l.Name) : false));

    if (hasBad) {
      return { approved: false, reason: 'Image contains inappropriate content', labels };
    }
    return { approved: true };
  } catch (error: any) {
    console.error('Error in S3 image moderation:', error);
    if (error.name === 'InvalidS3ObjectException') {
      throw error;
    }
    if (error.name === 'ImageTooLargeException') {
      throw error;
    }
    if (error.name === 'InvalidImageFormatException') {
      throw error;
    }
    throw new Error('Failed to moderate image from S3');
  }
}
