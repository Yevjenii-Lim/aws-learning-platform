import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Generate a unique email if none provided
    let userEmail = email;
    if (!userEmail) {
      // Create a unique email-like identifier using username and timestamp
      const timestamp = Date.now();
      userEmail = `${username.toLowerCase()}_${timestamp}@aws-learning.local`;
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(userEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user data
    const userData = {
      email: userEmail,
      name: username,
      passwordHash,
      role: 'user' as const,
      lastLogin: null,
      isActive: true,
      profile: {
        avatar: null,
        bio: '',
        preferences: {
          theme: 'light' as const,
          notifications: true,
          emailUpdates: false,
        },
      },
      progress: {
        completedTutorials: [],
        quizScores: {},
        totalTimeSpent: 0,
        lastActivity: null,
        learningStreak: 0,
        achievements: [],
        recentActivity: [],
      },
      subscription: {
        plan: 'free' as const,
        expiresAt: null,
      },
    };

    // Create user
    const success = await createUser(userData);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'User created successfully',
        user: {
          email: userEmail,
          name: username,
          role: 'user'
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 