import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics } from '../../../lib/dynamodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Topics API: Starting request...');
    console.log('Topics API: Environment check:', {
      region: process.env.REGION || process.env.AWS_REGION,
      hasAccessKey: !!process.env.ACCESS_KEY_ID || !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.SECRET_ACCESS_KEY || !!process.env.AWS_SECRET_ACCESS_KEY,
      isAWSEnv: !!(process.env.AWS_REGION || process.env.REGION)
    });
    
    // Get all topics from the topics table
    const topics = await getAllTopics();
    
    console.log('Topics API: Successfully fetched topics:', topics.length);
    
    return NextResponse.json({ 
      success: true, 
      data: topics 
    });
  } catch (error) {
    console.error('Topics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 