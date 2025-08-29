import { NextRequest, NextResponse } from 'next/server';
import { confirmForgotPassword } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationCode, newPassword } = await request.json();

    if (!email || !confirmationCode || !newPassword) {
      return NextResponse.json(
        { error: 'Email, confirmation code, and new password are required' },
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

    // Validate password length (minimum 6 characters)
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Confirm password reset with Cognito
    const result = await confirmForgotPassword(email, confirmationCode, newPassword);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Password reset failed' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
