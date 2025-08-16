import { NextRequest, NextResponse } from 'next/server';
import { dynamoDB } from '../../../lib/dynamodb';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(request: NextRequest) {
  try {
    const service = await request.json();
    
    // Validate required fields
    if (!service.id || !service.name || !service.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, name, description' },
        { status: 400 }
      );
    }

    // Check if service already exists
    const existingService = await dynamoDB.send(new GetCommand({
      TableName: 'aws-learning-lessons',
      Key: { id: service.id }
    }));

    if (existingService.Item) {
      return NextResponse.json(
        { success: false, error: 'Service with this ID already exists' },
        { status: 409 }
      );
    }

    // Create the new service
    const serviceData = {
      id: service.id,
      name: service.name,
      description: service.description,
      icon: service.icon || '☁️',
      color: service.color || 'bg-blue-500',
      tutorials: service.tutorials || []
    };

    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-lessons',
      Item: serviceData
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'Service created successfully',
      data: serviceData 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    
    const result = await dynamoDB.send(new ScanCommand({
      TableName: 'aws-learning-lessons',
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: result.Items || [] 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 