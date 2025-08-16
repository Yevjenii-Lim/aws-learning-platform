import { NextRequest, NextResponse } from 'next/server';
import { getAllFlashcards, getFlashcardsByCategory, getFlashcardById } from '../../../lib/dynamodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (id) {
      // Get specific flashcard by ID
      const flashcard = await getFlashcardById(id);
      if (!flashcard) {
        return NextResponse.json(
          { success: false, error: 'Flashcard not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: flashcard });
    }

    if (category) {
      // Get flashcards by category
      const flashcards = await getFlashcardsByCategory(category);
      return NextResponse.json({ success: true, data: flashcards });
    }

    // Get all flashcards
    const flashcards = await getAllFlashcards();
    return NextResponse.json({ success: true, data: flashcards });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
} 