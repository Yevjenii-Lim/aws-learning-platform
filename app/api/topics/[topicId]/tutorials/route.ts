import { NextRequest, NextResponse } from 'next/server';
import { dynamoDB } from '../../../../../lib/dynamodb';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const tutorial = await request.json();
    const { topicId } = params;
    
    // Get the existing topic from DynamoDB
    const getTopicResult = await dynamoDB.send(new GetCommand({
      TableName: 'aws-learning-topics',
      Key: { id: topicId }
    }));

    if (!getTopicResult.Item) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    const topic = getTopicResult.Item;
    const existingTutorials = topic.tutorials || [];
    
    // Check if tutorial already exists (for updates)
    const existingTutorialIndex = existingTutorials.findIndex((t: any) => t.id === tutorial.id);
    
    if (existingTutorialIndex >= 0) {
      // Update existing tutorial
      existingTutorials[existingTutorialIndex] = tutorial;
    } else {
      // Add new tutorial
      existingTutorials.push(tutorial);
    }

    // Update the topic with the new tutorial
    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-topics',
      Item: {
        ...topic,
        tutorials: existingTutorials,
        tutorialCount: existingTutorials.length
      }
    }));

    return NextResponse.json({ 
      success: true, 
      message: existingTutorialIndex >= 0 ? 'Tutorial updated successfully' : 'Tutorial created successfully',
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorialId = searchParams.get('tutorialId');
    const { topicId } = params;

    if (!tutorialId) {
      return NextResponse.json(
        { success: false, error: 'Missing tutorialId' },
        { status: 400 }
      );
    }

    // Get the existing topic from DynamoDB
    const getTopicResult = await dynamoDB.send(new GetCommand({
      TableName: 'aws-learning-topics',
      Key: { id: topicId }
    }));

    if (!getTopicResult.Item) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    const topic = getTopicResult.Item;
    const existingTutorials = topic.tutorials || [];
    
    // Remove the tutorial
    const updatedTutorials = existingTutorials.filter((t: any) => t.id !== tutorialId);

    // Update the topic
    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-topics',
      Item: {
        ...topic,
        tutorials: updatedTutorials,
        tutorialCount: updatedTutorials.length
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