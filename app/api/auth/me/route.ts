import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByToken } from '@/lib/cognito';
import { getUserByEmail } from '@/lib/users';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = cookies().get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if this is a Cognito session
    if (sessionToken.startsWith('cognito_')) {
      // Parse Cognito session token
      const parts = sessionToken.split('_');
      const cognitoUserId = parts[1];
      
      // Get Cognito access token
      const cognitoToken = cookies().get('cognito_token')?.value;
      
      if (cognitoToken) {
        // Verify token with Cognito
        const cognitoUser = await getUserByToken(cognitoToken);
        
        if (cognitoUser) {
          // Get user progress data from DynamoDB
          const dynamoUser = await getUserByEmail(cognitoUser.email);
          
          // Combine Cognito user data with DynamoDB progress data
          const userData = {
            id: cognitoUser.id,
            email: cognitoUser.email,
            name: cognitoUser.name,
            role: cognitoUser.role,
            emailVerified: cognitoUser.emailVerified,
            status: cognitoUser.status,
            // Include DynamoDB progress data if available
            progress: dynamoUser?.progress || null
          };
          
          return NextResponse.json({
            success: true,
            user: userData
          });
        }
      }
    } else {
      // Legacy DynamoDB session (for migration period)
      const parts = sessionToken.split('_');
      const userId = parts.slice(1, -1).join('_');
      
      // Try to get user from DynamoDB
      const user = await getUserByEmail(userId);
      
      if (user) {
        const userWithoutPassword = user;
        return NextResponse.json({
          success: true,
          user: userWithoutPassword
        });
      }
    }

    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 