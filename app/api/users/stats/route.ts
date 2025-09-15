import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, getUserStats, getUserByEmail } from '@/lib/users';
import { getUserByToken } from '@/lib/cognito';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cognitoToken = cookies().get('cognito_token')?.value;
    let user = null;

    if (cognitoToken) {
      const cognitoUser = await getUserByToken(cognitoToken);
      if (cognitoUser) {
        user = await getUserByEmail(cognitoUser.email);
        if (!user) {
          // User doesn't exist in DynamoDB yet, return empty stats
          return NextResponse.json({
            success: true,
            stats: {
              totalTutorials: 0,
              totalQuizScores: 0,
              averageQuizScore: 0,
              totalTimeSpent: 0,
              learningStreak: 0,
              achievements: []
            },
            user: {
              name: cognitoUser.name,
              email: cognitoUser.email,
              role: cognitoUser.role,
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString()
            }
          });
        }
      }
    } else {
      const sessionToken = cookies().get('session_token')?.value;

      if (!sessionToken) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }

      const parts = sessionToken.split('_');
      const userId = parts.slice(1, -1).join('_');
      user = await getUserById(userId);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const stats = await getUserStats(user.email, user.id);

    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to get user stats' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stats,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 