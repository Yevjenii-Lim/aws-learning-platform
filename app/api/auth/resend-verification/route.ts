import { NextRequest, NextResponse } from 'next/server';
import { resendConfirmationCode } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Resend confirmation code with Cognito
    const result = await resendConfirmationCode(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Verification code resent successfully'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to resend verification code' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
