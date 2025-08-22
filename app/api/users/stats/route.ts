import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, getUserStats } from '@/lib/users';

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