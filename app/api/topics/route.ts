import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics } from '../../../lib/dynamodb';

export async function GET(request: NextRequest) {
  try {
    // Get all topics from the topics table
    const topics = await getAllTopics();
    
    return NextResponse.json({ 
      success: true, 
      data: topics 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 