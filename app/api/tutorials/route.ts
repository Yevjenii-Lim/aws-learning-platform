import { NextRequest, NextResponse } from 'next/server';
import { dynamoDB } from '../../../lib/dynamodb';
import { PutCommand, GetCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(request: NextRequest) {
  try {
    const tutorial = await request.json();
    
    // Store tutorial in separate tutorials table
    const tutorialData = {
      PK: `SERVICE#${tutorial.serviceId}`,
      SK: `TUTORIAL#${tutorial.id}`,
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description,
      difficulty: tutorial.difficulty,
      estimatedTime: tutorial.estimatedTime,
      category: tutorial.category,
      prerequisites: tutorial.prerequisites || [],
      learningObjectives: tutorial.learningObjectives || [],
      steps: tutorial.steps || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-tutorials',
      Item: tutorialData
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'Tutorial created successfully',
      data: tutorial 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorialId = searchParams.get('tutorialId');
    const serviceId = searchParams.get('serviceId');

    if (!tutorialId || !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Missing tutorialId or serviceId' },
        { status: 400 }
      );
    }

    // Delete the tutorial from the tutorials table
    await dynamoDB.send(new DeleteCommand({
      TableName: 'aws-learning-tutorials',
      Key: {
        PK: `SERVICE#${serviceId}`,
        SK: `TUTORIAL#${tutorialId}`
      }
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'Tutorial deleted successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 