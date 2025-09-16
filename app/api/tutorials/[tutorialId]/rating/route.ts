import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dynamoDB } from '../../../../../lib/dynamodb';
import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getUserByToken } from '@/lib/cognito';
import { getUserByEmail } from '@/lib/users';

export const dynamic = 'force-dynamic';

// Tutorial ratings table name
const RATINGS_TABLE = 'aws-learning-tutorial-ratings';

interface TutorialRating {
  tutorialId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Get rating data for a tutorial
export async function GET(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  try {
    const { tutorialId } = params;

    // Get all ratings for this tutorial
    const result = await dynamoDB.send(new QueryCommand({
      TableName: RATINGS_TABLE,
      KeyConditionExpression: 'tutorialId = :tutorialId',
      ExpressionAttributeValues: {
        ':tutorialId': tutorialId
      }
    }));

    const ratings = result.Items as TutorialRating[] || [];
    
    // Calculate average rating and total count
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
      : 0;

    // Get user's rating if logged in
    let userRating: number | undefined;
    const sessionToken = cookies().get('session_token')?.value;
    
    if (sessionToken) {
      let user;
      
      // Check if this is a Cognito session
      if (sessionToken.startsWith('cognito_')) {
        const cognitoToken = cookies().get('cognito_token')?.value;
        
        if (cognitoToken) {
          const cognitoUser = await getUserByToken(cognitoToken);
          
          if (cognitoUser) {
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
        // Legacy DynamoDB session
        const parts = sessionToken.split('_');
        const userId = parts.slice(1, -1).join('_');
        const dynamoUser = await getUserByEmail(userId);
        
        if (dynamoUser) {
          user = dynamoUser;
        }
      }

      if (user) {
        const userRatingData = ratings.find(rating => rating.userId === user.id);
        userRating = userRatingData?.rating;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        rating: averageRating,
        totalRatings,
        averageRating,
        userRating
      }
    });

  } catch (error) {
    console.error('Error fetching tutorial ratings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// Submit or update a rating
export async function POST(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  try {
    const { tutorialId } = params;
    const { rating } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

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
      const cognitoToken = cookies().get('cognito_token')?.value;
      
      if (cognitoToken) {
        const cognitoUser = await getUserByToken(cognitoToken);
        
        if (cognitoUser) {
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
      // Legacy DynamoDB session
      const parts = sessionToken.split('_');
      const userId = parts.slice(1, -1).join('_');
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

    const now = new Date().toISOString();

    // Check if user already rated this tutorial
    const existingRatingResult = await dynamoDB.send(new QueryCommand({
      TableName: RATINGS_TABLE,
      KeyConditionExpression: 'tutorialId = :tutorialId AND userId = :userId',
      ExpressionAttributeValues: {
        ':tutorialId': tutorialId,
        ':userId': user.id
      }
    }));

    const existingRating = existingRatingResult.Items?.[0] as TutorialRating;

    const ratingData: TutorialRating = {
      tutorialId,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      rating,
      createdAt: existingRating?.createdAt || now,
      updatedAt: now
    };

    // Save or update rating
    await dynamoDB.send(new PutCommand({
      TableName: RATINGS_TABLE,
      Item: ratingData
    }));

    // Get updated rating statistics
    const allRatingsResult = await dynamoDB.send(new QueryCommand({
      TableName: RATINGS_TABLE,
      KeyConditionExpression: 'tutorialId = :tutorialId',
      ExpressionAttributeValues: {
        ':tutorialId': tutorialId
      }
    }));

    const allRatings = allRatingsResult.Items as TutorialRating[] || [];
    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0 
      ? allRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
      : 0;

    return NextResponse.json({
      success: true,
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      data: {
        rating: averageRating,
        totalRatings,
        averageRating,
        userRating: rating
      }
    });

  } catch (error) {
    console.error('Error submitting tutorial rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
