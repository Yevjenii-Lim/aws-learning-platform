import { NextRequest, NextResponse } from 'next/server';
import { getTutorialById } from '../../../../../../lib/dynamodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string; tutorialId: string } }
) {
  try {
    const tutorial = await getTutorialById(params.serviceId, params.tutorialId);
    if (!tutorial) {
      return NextResponse.json(
        { success: false, error: 'Tutorial not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: tutorial });
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tutorial' },
      { status: 500 }
    );
  }
} 