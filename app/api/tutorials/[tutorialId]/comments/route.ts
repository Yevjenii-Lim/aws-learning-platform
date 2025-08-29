import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dynamoDB } from '../../../../../lib/dynamodb';
import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { getUserByToken } from '@/lib/cognito';
import { getUserByEmail } from '@/lib/users';

export const dynamic = 'force-dynamic';

// Comments table name
const COMMENTS_TABLE = 'aws-learning-comments';

interface Comment {
  id: string;
  tutorialId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  replies: Comment[];
}

// Get comments for a tutorial
export async function GET(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  try {
    const { tutorialId } = params;

    // Query comments for this tutorial
    const result = await dynamoDB.send(new QueryCommand({
      TableName: COMMENTS_TABLE,
      KeyConditionExpression: 'tutorialId = :tutorialId',
      ExpressionAttributeValues: {
        ':tutorialId': tutorialId
      },
      ScanIndexForward: false, // Most recent first
    }));

    const comments = result.Items || [];

    return NextResponse.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Add a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  try {
    const { tutorialId } = params;
    const { content } = await request.json();

    // Get user from session
    const sessionToken = cookies().get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify session and get user info
    let user;
    
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
          
          user = {
            id: cognitoUser.id,
            email: cognitoUser.email,
            name: cognitoUser.name,
            role: cognitoUser.role,
            emailVerified: cognitoUser.emailVerified,
            status: cognitoUser.status,
            progress: dynamoUser?.progress || null
          };
        }
      }
    } else {
      // Legacy DynamoDB session (for migration period)
      const parts = sessionToken.split('_');
      const userId = parts.slice(1, -1).join('_');
      
      // Try to get user from DynamoDB
      const dynamoUser = await getUserByEmail(userId);
      
      if (dynamoUser) {
        user = dynamoUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Comment too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    const commentId = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const comment: Comment = {
      id: commentId,
      tutorialId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
      likes: [],
      replies: []
    };

    // Save comment to DynamoDB
    await dynamoDB.send(new PutCommand({
      TableName: COMMENTS_TABLE,
      Item: comment
    }));

    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
