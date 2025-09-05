import { NextRequest, NextResponse } from 'next/server';
import { uploadScreenshot } from '../../../../lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Log environment information
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔧 AWS Region:', process.env.AWS_REGION);
    console.log('🪣 S3 Bucket:', process.env.AWS_S3_BUCKET);
    console.log('🔑 Has Access Key:', !!process.env.AWS_ACCESS_KEY_ID);
    console.log('🔑 Has Secret Key:', !!process.env.AWS_SECRET_ACCESS_KEY);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const serviceId = formData.get('serviceId') as string;
    const tutorialId = formData.get('tutorialId') as string;
    const stepId = formData.get('stepId') as string;

    if (!file || !serviceId || !tutorialId || !stepId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    console.log('Uploading to S3 with params:', { serviceId, tutorialId, stepId });
    const imageUrl = await uploadScreenshot(serviceId, tutorialId, parseInt(stepId), buffer);
    console.log('S3 upload result:', imageUrl);

    if (!imageUrl) {
      console.error('S3 upload failed - no imageUrl returned');
      return NextResponse.json(
        { success: false, error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    console.log('Screenshot upload successful, returning:', { success: true, imageUrl });
    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Screenshot uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading screenshot:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
