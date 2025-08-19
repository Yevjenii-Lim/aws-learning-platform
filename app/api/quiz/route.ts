import { NextRequest, NextResponse } from 'next/server';
import { getAllQuizQuestions, getQuizQuestionsByCategory, getQuizQuestionById, putQuizQuestion, deleteQuizQuestion } from '../../../lib/dynamodb';

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

export async function POST(request: NextRequest) {
  try {
    const questionData = await request.json();
    
    // Validate required fields
    if (!questionData.question || !questionData.options || !questionData.explanation) {
      return NextResponse.json(
        { success: false, error: 'Question, options, and explanation are required' },
        { status: 400 }
      );
    }

    // Validate options array
    if (!Array.isArray(questionData.options) || questionData.options.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'Exactly 4 answer options are required' },
        { status: 400 }
      );
    }

    // Validate correct answer
    if (typeof questionData.correctAnswer !== 'number' || questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
      return NextResponse.json(
        { success: false, error: 'Valid correct answer index (0-3) is required' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!questionData.id) {
      questionData.id = `quiz-${Date.now()}`;
    }

    // Set default values
    const question = {
      id: questionData.id,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      category: questionData.category || 'general',
      difficulty: questionData.difficulty || 'Beginner',
      tags: questionData.tags || []
    };

    await putQuizQuestion(question);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quiz question created successfully',
      data: question 
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
    const questionData = await request.json();
    
    // Validate required fields
    if (!questionData.id || !questionData.question || !questionData.options || !questionData.explanation) {
      return NextResponse.json(
        { success: false, error: 'ID, question, options, and explanation are required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const existingQuestion = await getQuizQuestionById(questionData.id);
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: 'Quiz question not found' },
        { status: 404 }
      );
    }

    // Update question data
    const updatedQuestion = {
      ...existingQuestion,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      category: questionData.category || existingQuestion.category,
      difficulty: questionData.difficulty || existingQuestion.difficulty,
      tags: questionData.tags || existingQuestion.tags
    };

    await putQuizQuestion(updatedQuestion);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quiz question updated successfully',
      data: updatedQuestion 
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
    const questionId = searchParams.get('id');
    
    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const existingQuestion = await getQuizQuestionById(questionId);
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: 'Quiz question not found' },
        { status: 404 }
      );
    }

    await deleteQuizQuestion(questionId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quiz question deleted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 