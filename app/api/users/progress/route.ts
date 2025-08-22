import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, completeTutorial, completeFlashcards, updateQuizScore, addLearningTime, updateUserProgress } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = cookies().get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse session token to get user ID
    // Format: session_${user.id}_${timestamp}
    const parts = sessionToken.split('_');
    // The user ID is parts[1] + '_' + parts[2] + '_' + parts[3] (e.g., "user_admin_001")
    const userId = parts.slice(1, -1).join('_');
    
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { action, data } = await request.json();

    let success = false;

    switch (action) {
      case 'complete_tutorial':
        success = await completeTutorial(user.email, user.id, data.tutorialId, data.tutorialTitle, data.serviceId, data.estimatedTime);
        break;
      
      case 'complete_flashcards':
        success = await completeFlashcards(user.email, user.id, data.topicId, data.topicName, data.cardCount);
        break;
      
      case 'update_quiz_score':
        success = await updateQuizScore(user.email, user.id, data.quizId, data.score);
        break;
      
      case 'add_learning_time':
        success = await addLearningTime(user.email, user.id, data.minutes);
        break;
      
      case 'update_progress':
        success = await updateUserProgress(user.email, user.id, data.progress);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Progress updated successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = cookies().get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse session token to get user ID
    // Format: session_${user.id}_${timestamp}
    const parts = sessionToken.split('_');
    // The user ID is parts[1] + '_' + parts[2] + '_' + parts[3] (e.g., "user_admin_001")
    const userId = parts.slice(1, -1).join('_');
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: user.progress
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 