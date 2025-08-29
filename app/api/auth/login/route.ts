import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signIn, adminSignIn } from '@/lib/cognito';
import { getUserByEmail } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!email && !username) {
      return NextResponse.json(
        { error: 'Email or username is required' },
        { status: 400 }
      );
    }

    // Try Cognito authentication first
    let authResult;
    if (email) {
      authResult = await signIn(email, password);
    } else {
      authResult = await signIn(username, password);
    }

    // If Cognito fails, try admin authentication (for migration period)
    if (!authResult.success && authResult.error === 'User not found') {
      console.log('User not found in Cognito, trying admin authentication...');
      if (email) {
        authResult = await adminSignIn(email, password);
      } else {
        authResult = await adminSignIn(username, password);
      }
    }

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Handle authentication challenges (like password change required)
    if (authResult.challengeName) {
      return NextResponse.json({
        success: false,
        error: authResult.error || 'Authentication challenge required',
        challengeName: authResult.challengeName,
        challengeParameters: authResult.challengeParameters
      }, { status: 200 });
    }

    if (!authResult.user) {
      return NextResponse.json(
        { error: 'User data not available' },
        { status: 500 }
      );
    }

    // Get user progress data from DynamoDB
    const dynamoUser = await getUserByEmail(authResult.user.email);
    
    // Create a session token with Cognito user ID
    const sessionToken = `cognito_${authResult.user.id}_${Date.now()}`;
    
    // Set cookie with Cognito session
    cookies().set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Store Cognito access token in a separate cookie
    if (authResult.session) {
      cookies().set('cognito_token', authResult.session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day (Cognito tokens expire)
        path: '/'
      });
    }

    // Combine Cognito user data with DynamoDB progress data
    const userData = {
      id: authResult.user.id,
      email: authResult.user.email,
      name: authResult.user.name,
      role: authResult.user.role,
      emailVerified: authResult.user.emailVerified,
      status: authResult.user.status,
      // Include DynamoDB progress data if available
      progress: dynamoUser?.progress || null
    };
    
    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 