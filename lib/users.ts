import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, QueryCommand, ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import bcrypt from 'bcryptjs';

const client = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = 'aws-learning-users';

export interface User {
  email: string;
  id: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
  profile: {
    avatar: string | null;
    bio: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
      emailUpdates: boolean;
    };
  };
  progress: {
    completedTutorials: string[];
    quizScores: Record<string, number>;
    totalTimeSpent: number;
    lastActivity: string | null;
    learningStreak: number;
    achievements: string[];
    recentActivity: Array<{
      type: 'tutorial' | 'quiz' | 'achievement';
      title: string;
      description: string;
      timestamp: string;
      link?: string;
    }>;
  };
  subscription: {
    plan: 'free' | 'premium' | 'admin';
    expiresAt: string | null;
  };
}

export interface UserWithoutPassword extends Omit<User, 'passwordHash'> {}

// Authentication functions
export async function authenticateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
  try {
    const result = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: marshall({
        ':email': email
      })
    }));

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const user = unmarshall(result.Items[0]) as User;
    
    if (!user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await updateLastLogin(user.email, user.id);

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function authenticateUserByUsername(username: string, password: string): Promise<UserWithoutPassword | null> {
  try {
    // Scan the table to find user by name (since name is not a key)
    const result = await client.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: marshall({
        ':name': username
      })
    }));

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const user = unmarshall(result.Items[0]) as User;
    
    if (!user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await updateLastLogin(user.email, user.id);

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication by username error:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<UserWithoutPassword | null> {
  try {
    const result = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: marshall({
        ':email': email
      })
    }));

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const user = unmarshall(result.Items[0]) as User;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<UserWithoutPassword | null> {
  try {
    const result = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'id-index',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: marshall({
        ':id': id
      })
    }));

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const user = unmarshall(result.Items[0]) as User;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
}

// Helper function to parse estimated time string to minutes
function parseEstimatedTime(timeString: string): number {
  const match = timeString.match(/(\d+)\s*(minute|hour|h|m)/i);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit === 'hour' || unit === 'h') {
    return value * 60;
  } else if (unit === 'minute' || unit === 'm') {
    return value;
  }
  
  return 0;
}

// Progress tracking functions
export async function updateUserProgress(
  email: string, 
  id: string, 
  updates: Partial<User['progress']>
): Promise<boolean> {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      const attrName = `#${key}`;
      const attrValue = `:${key}`;
      
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = value;
      updateExpressions.push(`${attrName} = ${attrValue}`);
    });

    // Always update lastActivity
    expressionAttributeNames['#lastActivity'] = 'lastActivity';
    expressionAttributeValues[':lastActivity'] = new Date().toISOString();
    updateExpressions.push('#lastActivity = :lastActivity');

    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues)
    }));

    return true;
  } catch (error) {
    console.error('Update progress error:', error);
    return false;
  }
}

export async function completeFlashcards(
  email: string, 
  id: string, 
  topicId: string,
  topicName?: string,
  cardCount?: number
): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const activityItem = {
      type: 'quiz' as const,
      title: topicName || `Flashcards ${topicId}`,
      description: `Completed ${cardCount || 0} flashcards in ${topicName || topicId}`,
      timestamp: now,
      link: `/games/flashcards`
    };

    // First, get the current user to check if recentActivity exists
    const currentUser = await getUserById(id);
    const currentRecentActivity = currentUser?.progress?.recentActivity || [];
    
    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: 'SET progress.lastActivity = :lastActivity, progress.recentActivity = :recentActivity',
      ExpressionAttributeValues: marshall({
        ':lastActivity': now,
        ':recentActivity': [activityItem, ...currentRecentActivity]
      })
    }));

    return true;
  } catch (error) {
    console.error('Complete flashcards error:', error);
    return false;
  }
}

export async function completeTutorial(
  email: string, 
  id: string, 
  tutorialId: string,
  tutorialTitle?: string,
  serviceId?: string,
  estimatedTime?: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const activityItem = {
      type: 'tutorial' as const,
      title: tutorialTitle || `Tutorial ${tutorialId}`,
      description: `Completed tutorial: ${tutorialTitle || tutorialId}`,
      timestamp: now,
      link: serviceId ? `/tutorial/${serviceId}/${tutorialId}` : undefined
    };

    // First, get the current user to check if recentActivity exists
    const currentUser = await getUserById(id);
    const currentRecentActivity = currentUser?.progress?.recentActivity || [];
    const currentCompletedTutorials = currentUser?.progress?.completedTutorials || [];
    const currentTotalTimeSpent = currentUser?.progress?.totalTimeSpent || 0;
    
    // Parse estimated time and add to total time spent
    const timeToAdd = estimatedTime ? parseEstimatedTime(estimatedTime) : 0;
    const newTotalTimeSpent = currentTotalTimeSpent + timeToAdd;
    
    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: 'SET progress.lastActivity = :lastActivity, progress.recentActivity = :recentActivity, progress.completedTutorials = :completedTutorials, progress.totalTimeSpent = :totalTimeSpent',
      ExpressionAttributeValues: marshall({
        ':lastActivity': now,
        ':recentActivity': [activityItem, ...currentRecentActivity],
        ':completedTutorials': [...currentCompletedTutorials, tutorialId],
        ':totalTimeSpent': newTotalTimeSpent
      })
    }));
    return true;
  } catch (error) {
    console.error('❌ Complete tutorial error:', error);
    return false;
  }
}

export async function updateQuizScore(
  email: string, 
  id: string, 
  quizId: string, 
  score: number
): Promise<boolean> {
  try {
    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: 'SET progress.quizScores.#quizId = :score, progress.lastActivity = :lastActivity',
      ExpressionAttributeNames: {
        '#quizId': quizId
      },
      ExpressionAttributeValues: marshall({
        ':score': score,
        ':lastActivity': new Date().toISOString()
      })
    }));

    return true;
  } catch (error) {
    console.error('Update quiz score error:', error);
    return false;
  }
}

export async function addLearningTime(
  email: string, 
  id: string, 
  minutes: number
): Promise<boolean> {
  try {
    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: 'ADD progress.totalTimeSpent :minutes SET progress.lastActivity = :lastActivity',
      ExpressionAttributeValues: marshall({
        ':minutes': minutes,
        ':lastActivity': new Date().toISOString()
      })
    }));

    return true;
  } catch (error) {
    console.error('Add learning time error:', error);
    return false;
  }
}

// User management functions
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> {
  try {
    const id = `user_${userData.role}_${Date.now()}`;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date().toISOString()
    };

    await client.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(user)
    }));

    return true;
  } catch (error) {
    console.error('Create user error:', error);
    return false;
  }
}

export async function updateUserProfile(
  email: string, 
  id: string, 
  profileUpdates: Partial<User['profile']>
): Promise<boolean> {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(profileUpdates).forEach(([key, value]) => {
      const attrName = `#${key}`;
      const attrValue = `:${key}`;
      
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = value;
      updateExpressions.push(`profile.${attrName} = ${attrValue}`);
    });

    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues)
    }));

    return true;
  } catch (error) {
    console.error('Update profile error:', error);
    return false;
  }
}

async function updateLastLogin(email: string, id: string): Promise<void> {
  try {
    await client.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ email, id }),
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: marshall({
        ':lastLogin': new Date().toISOString()
      })
    }));
  } catch (error) {
    console.error('Update last login error:', error);
  }
}

// Analytics functions
export async function getUserStats(email: string, id: string): Promise<{
  totalTutorials: number;
  totalQuizScores: number;
  averageQuizScore: number;
  totalTimeSpent: number;
  learningStreak: number;
  achievements: string[];
} | null> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const { progress } = user;
    const quizScores = Object.values(progress.quizScores);
    const averageQuizScore = quizScores.length > 0 
      ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length 
      : 0;

    return {
      totalTutorials: progress.completedTutorials.length,
      totalQuizScores: quizScores.length,
      averageQuizScore: Math.round(averageQuizScore * 100) / 100,
      totalTimeSpent: progress.totalTimeSpent,
      learningStreak: progress.learningStreak,
      achievements: progress.achievements
    };
  } catch (error) {
    console.error('Get user stats error:', error);
    return null;
  }
} 