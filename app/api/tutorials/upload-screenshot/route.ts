import { NextRequest, NextResponse } from 'next/server';
import { uploadScreenshot } from '../../../../lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
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
    const imageUrl = await uploadScreenshot(serviceId, tutorialId, parseInt(stepId), buffer);

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload image' },
        { status: 500 }
      );
    }

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
