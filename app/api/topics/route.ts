import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics } from '../../../lib/dynamodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get all topics from the topics table
    const topics = await getAllTopics();
    
    return NextResponse.json({ 
      success: true, 
      data: topics 
    });
  } catch (error) {
    console.error('Topics API Error:', error);
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      message: errorMessage,
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 