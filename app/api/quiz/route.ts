import { NextRequest, NextResponse } from 'next/server';
import { getAllQuizQuestions, getQuizQuestionsByCategory, getQuizQuestionById } from '../../../lib/dynamodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (id) {
      // Get specific quiz question by ID
      const question = await getQuizQuestionById(id);
      if (!question) {
        return NextResponse.json(
          { success: false, error: 'Quiz question not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: question });
    }

    if (category) {
      // Get quiz questions by category
      const questions = await getQuizQuestionsByCategory(category);
      return NextResponse.json({ success: true, data: questions });
    }

    // Get all quiz questions
    const questions = await getAllQuizQuestions();
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
} 