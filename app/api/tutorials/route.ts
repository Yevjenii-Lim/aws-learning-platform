import { NextRequest, NextResponse } from 'next/server';
import { dynamoDB } from '../../../lib/dynamodb';
import { PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(request: NextRequest) {
  try {
    const tutorial = await request.json();
    
    // Get the existing service from DynamoDB
    const getServiceResult = await dynamoDB.send(new GetCommand({
      TableName: 'aws-learning-lessons',
      Key: { id: tutorial.serviceId }
    }));

    if (!getServiceResult.Item) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    const service = getServiceResult.Item;
    const existingTutorials = service.tutorials || [];
    
    // Check if tutorial already exists (for updates)
    const existingTutorialIndex = existingTutorials.findIndex((t: any) => t.id === tutorial.id);
    
    if (existingTutorialIndex >= 0) {
      // Update existing tutorial
      existingTutorials[existingTutorialIndex] = tutorial;
    } else {
      // Add new tutorial
      existingTutorials.push(tutorial);
    }

    // Update the service with the new tutorial
    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-lessons',
      Item: {
        ...service,
        tutorials: existingTutorials
      }
    }));

    // Update the topic's tutorial count
    const topicServices = service.services || [];
    for (const topicId of topicServices) {
      try {
        const getTopicResult = await dynamoDB.send(new GetCommand({
          TableName: 'aws-learning-topics',
          Key: { id: topicId }
        }));

        if (getTopicResult.Item) {
          const topic = getTopicResult.Item;
          const updatedTutorialCount = existingTutorials.length;
          
          await dynamoDB.send(new PutCommand({
            TableName: 'aws-learning-topics',
            Item: {
              ...topic,
              tutorialCount: updatedTutorialCount
            }
          }));
        }
      } catch (error) {
        console.error('Error updating topic tutorial count:', error);
      }
    }

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

    // Get the existing service from DynamoDB
    const getServiceResult = await dynamoDB.send(new GetCommand({
      TableName: 'aws-learning-lessons',
      Key: { id: serviceId }
    }));

    if (!getServiceResult.Item) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    const service = getServiceResult.Item;
    const existingTutorials = service.tutorials || [];
    
    // Remove the tutorial
    const updatedTutorials = existingTutorials.filter((t: any) => t.id !== tutorialId);

    // Update the service
    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-lessons',
      Item: {
        ...service,
        tutorials: updatedTutorials
      }
    }));

    // Update the topic's tutorial count
    const topicServices = service.services || [];
    for (const topicId of topicServices) {
      try {
        const getTopicResult = await dynamoDB.send(new GetCommand({
          TableName: 'aws-learning-topics',
          Key: { id: topicId }
        }));

        if (getTopicResult.Item) {
          const topic = getTopicResult.Item;
          const updatedTutorialCount = updatedTutorials.length;
          
          await dynamoDB.send(new PutCommand({
            TableName: 'aws-learning-topics',
            Item: {
              ...topic,
              tutorialCount: updatedTutorialCount
            }
          }));
        }
      } catch (error) {
        console.error('Error updating topic tutorial count:', error);
      }
    }

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