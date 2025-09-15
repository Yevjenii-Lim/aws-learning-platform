import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, completeTutorial, completeFlashcards, updateQuizScore, addQuizActivity, addLearningTime, updateUserProgress, updateLearningStreak, addTestActivities, getUserByEmail } from '@/lib/users';
import { getUserByToken } from '@/lib/cognito';

export const dynamic = 'force-dynamic';

// Helper function to get user from either Cognito or legacy session
async function getAuthenticatedUser() {
  const cognitoToken = cookies().get('cognito_token')?.value;
  let user = null;

  if (cognitoToken) {
    // Use Cognito authentication
    const cognitoUser = await getUserByToken(cognitoToken);
    if (cognitoUser) {
      // Get user from DynamoDB using email instead of ID
      user = await getUserByEmail(cognitoUser.email);
      // Note: We don't create users here - they should be created during email confirmation
    }
  } else {
    // Fallback to legacy DynamoDB authentication
    const sessionToken = cookies().get('session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Parse session token to get user ID
    // Format: session_${user.id}_${timestamp}
    const parts = sessionToken.split('_');
    // The user ID is parts[1] + '_' + parts[2] + '_' + parts[3] (e.g., "user_admin_001")
    const userId = parts.slice(1, -1).join('_');
    user = await getUserById(userId);
  }

  return user;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
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
      
      case 'add_quiz_activity':
        success = await addQuizActivity(user.email, user.id, data.category, data.score, data.totalQuestions);
        break;
      
      case 'add_learning_time':
        success = await addLearningTime(user.email, user.id, data.minutes);
        break;
      
      case 'update_progress':
        success = await updateUserProgress(user.email, user.id, data.progress);
        break;
      
      case 'recalculate_streak':
        success = await updateLearningStreak(user.email, user.id);
        break;
      
      case 'add_test_activities':
        // Add test activities for streak testing (for development only)
        success = await addTestActivities(user.email, user.id, data.days);
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
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
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