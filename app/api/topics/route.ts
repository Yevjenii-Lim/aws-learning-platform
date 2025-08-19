import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics, getTopicById, putTopic, deleteTopic } from '../../../lib/dynamodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const topics = await getAllTopics();
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const topicData = await request.json();
    
    // Validate required fields
    if (!topicData.name || !topicData.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!topicData.id) {
      topicData.id = `topic-${Date.now()}`;
    }

    // Set default values
    const topic = {
      id: topicData.id,
      name: topicData.name,
      description: topicData.description,
      icon: topicData.icon || '📚',
      color: topicData.color || 'bg-blue-500',
      difficulty: topicData.difficulty || 'Beginner',
      services: topicData.services || [],
      serviceCount: topicData.services?.length || 0,
      tutorialCount: topicData.tutorialCount || 0,
      tutorials: topicData.tutorials || []
    };

    await putTopic(topic);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Topic created successfully',
      data: topic 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const topicData = await request.json();
    
    // Validate required fields
    if (!topicData.id || !topicData.name || !topicData.description) {
      return NextResponse.json(
        { success: false, error: 'ID, name and description are required' },
        { status: 400 }
      );
    }

    // Check if topic exists
    const existingTopic = await getTopicById(topicData.id);
    if (!existingTopic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Update topic data
    const updatedTopic = {
      ...existingTopic,
      name: topicData.name,
      description: topicData.description,
      icon: topicData.icon || existingTopic.icon,
      color: topicData.color || existingTopic.color,
      difficulty: topicData.difficulty || existingTopic.difficulty,
      services: topicData.services || existingTopic.services,
      serviceCount: topicData.services?.length || existingTopic.serviceCount
    };

    await putTopic(updatedTopic);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Topic updated successfully',
      data: updatedTopic 
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
    const { searchParams } = request.nextUrl;
    const topicId = searchParams.get('id');
    
    if (!topicId) {
      return NextResponse.json(
        { success: false, error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    // Check if topic exists
    const existingTopic = await getTopicById(topicId);
    if (!existingTopic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    await deleteTopic(topicId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Topic deleted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 