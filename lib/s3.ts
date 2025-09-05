import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'aws-learning-platform-content';

// Content types
export const CONTENT_TYPES = {
  LESSON_JSON: 'application/json',
  IMAGE_PNG: 'image/png',
  IMAGE_JPG: 'image/jpeg',
  SCREENSHOT: 'image/png',
} as const;

// S3 utilities
export async function uploadLessonContent(
  key: string,
  content: any,
  contentType: string = CONTENT_TYPES.LESSON_JSON
): Promise<boolean> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(content),
      ContentType: contentType,
      CacheControl: 'max-age=3600', // 1 hour cache
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error uploading lesson content:', error);
    return false;
  }
}

export async function getLessonContent(key: string): Promise<any | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const content = await response.Body?.transformToString();
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error getting lesson content:', error);
    return null;
  }
}

export async function uploadScreenshot(
  serviceId: string,
  tutorialId: string,
  stepId: number,
  imageBuffer: Buffer
): Promise<string | null> {
  try {
    // Check if AWS credentials are available
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not configured');
      throw new Error('AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    }

    const key = `screenshots/${serviceId}/${tutorialId}/step-${stepId}.png`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: CONTENT_TYPES.IMAGE_PNG,
      CacheControl: 'max-age=86400', // 24 hours cache
      ACL: 'public-read', // Make the image publicly readable
    });

    await s3Client.send(command);
    console.log('S3 upload command executed successfully');
    
    // Try public URL first, fallback to signed URL if needed
    const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.log('Generated public URL:', publicUrl);
    
    // Test if public URL works by trying to fetch it
    try {
      const testResponse = await fetch(publicUrl, { method: 'HEAD' });
      console.log('Public URL test response:', testResponse.status);
      if (testResponse.ok) {
        console.log('Using public URL:', publicUrl);
        return publicUrl;
      }
    } catch (error) {
      console.log('Public URL not accessible, using signed URL:', error);
    }
    
    // Fallback to signed URL
    console.log('Generating signed URL for key:', key);
    const signedUrl = await getSignedImageUrl(key, 86400); // 24 hours
    console.log('Generated signed URL:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error uploading screenshot:', error);
    return null;
  }
}

export async function getSignedImageUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}

export async function listLessonAssets(prefix: string): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);
    return response.Contents?.map(obj => obj.Key!).filter(Boolean) || [];
  } catch (error) {
    console.error('Error listing lesson assets:', error);
    return [];
  }
}

// Content organization helpers
export function getLessonKey(serviceId: string, tutorialId: string): string {
  return `lessons/${serviceId}/${tutorialId}/content.json`;
}

export function getServiceKey(serviceId: string): string {
  return `services/${serviceId}/metadata.json`;
}

export function getScreenshotKey(serviceId: string, tutorialId: string, stepId: number): string {
  return `screenshots/${serviceId}/${tutorialId}/step-${stepId}.png`;
} 