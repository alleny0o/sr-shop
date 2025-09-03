import { S3Client } from '@aws-sdk/client-s3';

export function createS3Client(env: Env): S3Client | null {
  if (!env.AWS_REGION || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    console.warn('S3 environment variables missing; S3 client not created.');
    return null;
  }

  return new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
}
