import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics } from '../../../lib/dynamodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('REGION:', process.env.REGION);
    console.log('AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME);
    console.log('AWS_EXECUTION_ENV:', process.env.AWS_EXECUTION_ENV);
    console.log('ACCESS_KEY_ID exists:', !!process.env.ACCESS_KEY_ID);
    console.log('SECRET_ACCESS_KEY exists:', !!process.env.SECRET_ACCESS_KEY);
    
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