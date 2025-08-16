import { NextRequest, NextResponse } from 'next/server';
import { dynamoDB } from '../../../lib/dynamodb';
import { PutCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const FLASHCARDS_TABLE = 'aws-learning-flashcards';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Import ScanCommand here to avoid issues
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    
    let scanParams: any = {
      TableName: FLASHCARDS_TABLE
    };

    // If category is specified, filter by it
    if (category) {
      scanParams.FilterExpression = '#cat = :category';
      scanParams.ExpressionAttributeNames = {
        '#cat': 'category'
      };
      scanParams.ExpressionAttributeValues = {
        ':category': category
      };
    }

    const result = await dynamoDB.send(new ScanCommand(scanParams));

    return NextResponse.json({
      success: true,
      data: result.Items || []
    });

  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const flashcard = await request.json();

    // Validate required fields
    if (!flashcard.front || !flashcard.back || !flashcard.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: front, back, category' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!flashcard.id) {
      flashcard.id = `flashcard-${Date.now()}`;
    }

    // Ensure tags is an array
    if (!flashcard.tags) {
      flashcard.tags = [];
    }

    await dynamoDB.send(new PutCommand({
      TableName: FLASHCARDS_TABLE,
      Item: flashcard
    }));

    return NextResponse.json({
      success: true,
      message: 'Flashcard created successfully',
      data: flashcard
    });

  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create flashcard' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const flashcard = await request.json();

    // Validate required fields
    if (!flashcard.id || !flashcard.front || !flashcard.back || !flashcard.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, front, back, category' },
        { status: 400 }
      );
    }

    // Check if flashcard exists
    const existingFlashcard = await dynamoDB.send(new GetCommand({
      TableName: FLASHCARDS_TABLE,
      Key: { id: flashcard.id }
    }));

    if (!existingFlashcard.Item) {
      return NextResponse.json(
        { success: false, error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    // Ensure tags is an array
    if (!flashcard.tags) {
      flashcard.tags = [];
    }

    await dynamoDB.send(new PutCommand({
      TableName: FLASHCARDS_TABLE,
      Item: flashcard
    }));

    return NextResponse.json({
      success: true,
      message: 'Flashcard updated successfully',
      data: flashcard
    });

  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update flashcard' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing flashcard ID' },
        { status: 400 }
      );
    }

    // Check if flashcard exists
    const existingFlashcard = await dynamoDB.send(new GetCommand({
      TableName: FLASHCARDS_TABLE,
      Key: { id }
    }));

    if (!existingFlashcard.Item) {
      return NextResponse.json(
        { success: false, error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    await dynamoDB.send(new DeleteCommand({
      TableName: FLASHCARDS_TABLE,
      Key: { id }
    }));

    return NextResponse.json({
      success: true,
      message: 'Flashcard deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete flashcard' },
      { status: 500 }
    );
  }
} 