import { NextRequest, NextResponse } from 'next/server';
import { confirmSignUp, getUserByUsername } from '@/lib/cognito';
import { createUser } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationCode } = await request.json();

    if (!email || !confirmationCode) {
      return NextResponse.json(
        { error: 'Email and confirmation code are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate confirmation code format
    if (!/^\d{6}$/.test(confirmationCode)) {
      return NextResponse.json(
        { error: 'Invalid confirmation code format. Please enter a 6-digit code.' },
        { status: 400 }
      );
    }

    // Confirm sign up with Cognito
    const result = await confirmSignUp(email, confirmationCode);

    if (result.success) {
      // Get the confirmed user from Cognito to get their ID and details
      const cognitoUser = await getUserByUsername(email);
      
      if (cognitoUser) {
        // Create user record in DynamoDB for progress tracking
        const userData = {
          email: cognitoUser.email,
          name: cognitoUser.name,
          role: cognitoUser.role,
          passwordHash: '', // Empty since we're using Cognito for auth
          isActive: true,
          profile: {
            avatar: null,
            bio: '',
            preferences: {
              theme: 'light' as const,
              notifications: true,
              emailUpdates: true
            }
          },
          progress: {
            completedTutorials: [],
            quizScores: {},
            recentActivity: [],
            learningStreak: 0,
            totalTimeSpent: 0,
            achievements: [],
            lastActivity: null
          },
          subscription: {
            plan: 'free' as const,
            expiresAt: null
          },
          lastLogin: new Date().toISOString()
        };

        // Note: We'll use the createUser function which generates its own ID
        // The Cognito ID will be used for authentication, but DynamoDB will have a different ID
        // This is fine because we look up users by email in most cases
        await createUser(userData);
      }

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully! You can now log in.'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Verification failed' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Confirm registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
