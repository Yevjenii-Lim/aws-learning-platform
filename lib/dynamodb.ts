import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const region = process.env.REGION || process.env.AWS_REGION || 'us-east-1';

// Check if we're in AWS environment (Amplify/Lambda) or local development
// More reliable detection for AWS environment
const isAWSEnvironment = process.env.AWS_LAMBDA_FUNCTION_NAME || 
                        process.env.AWS_EXECUTION_ENV || 
                        process.env.AWS_REGION ||
                        process.env.NODE_ENV === 'production';

console.log('isAWSEnvironment:', isAWSEnvironment);

let client: DynamoDBClient;

if (isAWSEnvironment) {
  // In AWS environment, use default credentials (IAM role)
  console.log('Using IAM role credentials for AWS environment');
  client = new DynamoDBClient({
    region,
  });
} else {
  // Local development - use access keys
  console.log('Using access key credentials for local development');
  const accessKeyId = process.env.ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials not found. Please set ACCESS_KEY_ID and SECRET_ACCESS_KEY environment variables for local development.');
  }
  
  client = new DynamoDBClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export const dynamoDB = DynamoDBDocumentClient.from(client);

// Table names
export const LESSONS_TABLE = 'aws-learning-lessons';
export const FLASHCARDS_TABLE = 'aws-learning-flashcards';
export const QUIZ_TABLE = 'aws-learning-quiz';
export const TOPICS_TABLE = 'aws-learning-topics';

// Interfaces for lessons (existing)
export interface AWSService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorials: AWSTutorial[];
}

export interface AWSTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  steps: any[];
  learningObjectives: string[];
}

// Interfaces for flashcards
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  tags: string[];
}

// Interface for learning topics
export interface LearningTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  services: string[];
  learningObjectives: string[];
  tutorialCount: number;
  serviceCount: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  cardCount: number;
}

// Interfaces for quiz questions
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

// Table creation functions
export async function createTables() {
  const { CreateTableCommand } = await import('@aws-sdk/client-dynamodb');
  
  const tables = [
    {
      TableName: LESSONS_TABLE,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' as const }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' as const }
      ],
      BillingMode: 'PAY_PER_REQUEST' as const
    },
    {
      TableName: FLASHCARDS_TABLE,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' as const }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' as const }
      ],
      BillingMode: 'PAY_PER_REQUEST' as const
    },
    {
      TableName: QUIZ_TABLE,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' as const }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' as const }
      ],
      BillingMode: 'PAY_PER_REQUEST' as const
    },
    {
      TableName: TOPICS_TABLE,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' as const }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' as const }
      ],
      BillingMode: 'PAY_PER_REQUEST' as const
    }
  ];

  for (const table of tables) {
    try {
      await client.send(new CreateTableCommand(table));
      console.log(`Created table: ${table.TableName}`);
    } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
        console.log(`Table ${table.TableName} already exists`);
      } else {
        console.error(`Error creating table ${table.TableName}:`, error);
      }
    }
  }
}

// Utility functions for lessons (existing)
export async function getAllServices(): Promise<AWSService[]> {
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new ScanCommand({
    TableName: LESSONS_TABLE,
  }));
  
  return result.Items as AWSService[] || [];
}

export async function getServiceById(serviceId: string): Promise<AWSService | null> {
  const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new GetCommand({
    TableName: LESSONS_TABLE,
    Key: { id: serviceId }
  }));
  
  return result.Item as AWSService || null;
}

export async function getTutorialById(serviceId: string, tutorialId: string): Promise<AWSTutorial | null> {
  const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new GetCommand({
    TableName: LESSONS_TABLE,
    Key: { id: `${serviceId}-${tutorialId}` }
  }));
  
  return result.Item as AWSTutorial || null;
}

// Utility functions for flashcards
export async function getAllFlashcards(): Promise<Flashcard[]> {
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new ScanCommand({
    TableName: FLASHCARDS_TABLE,
  }));
  
  return result.Items as Flashcard[] || [];
}

export async function getFlashcardsByCategory(category: string): Promise<Flashcard[]> {
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new ScanCommand({
    TableName: FLASHCARDS_TABLE,
    FilterExpression: 'category = :category',
    ExpressionAttributeValues: {
      ':category': category
    }
  }));
  
  return result.Items as Flashcard[] || [];
}

export async function getFlashcardById(id: string): Promise<Flashcard | null> {
  const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new GetCommand({
    TableName: FLASHCARDS_TABLE,
    Key: { id }
  }));
  
  return result.Item as Flashcard || null;
}

export async function putFlashcard(flashcard: Flashcard): Promise<void> {
  const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
  
  await dynamoDB.send(new PutCommand({
    TableName: FLASHCARDS_TABLE,
    Item: flashcard
  }));
}

export async function deleteFlashcard(id: string): Promise<void> {
  const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
  
  await dynamoDB.send(new DeleteCommand({
    TableName: FLASHCARDS_TABLE,
    Key: { id }
  }));
}

// Utility functions for quiz questions
export async function getAllQuizQuestions(): Promise<QuizQuestion[]> {
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new ScanCommand({
    TableName: QUIZ_TABLE,
  }));
  
  return result.Items as QuizQuestion[] || [];
}

// Utility functions for learning topics
export async function getAllTopics(): Promise<LearningTopic[]> {
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new ScanCommand({
    TableName: TOPICS_TABLE,
  }));
  
  return result.Items as LearningTopic[] || [];
}

export async function getTopicById(id: string): Promise<LearningTopic | null> {
  const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new GetCommand({
    TableName: TOPICS_TABLE,
    Key: { id }
  }));
  
  return result.Item as LearningTopic || null;
}

export async function putTopic(topic: LearningTopic): Promise<void> {
  const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
  
  await dynamoDB.send(new PutCommand({
    TableName: TOPICS_TABLE,
    Item: topic
  }));
}

export async function deleteTopic(id: string): Promise<void> {
  const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
  
  await dynamoDB.send(new DeleteCommand({
    TableName: TOPICS_TABLE,
    Key: { id }
  }));
}

export async function getQuizQuestionsByCategory(category: string): Promise<QuizQuestion[]> {
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new ScanCommand({
    TableName: QUIZ_TABLE,
    FilterExpression: 'category = :category',
    ExpressionAttributeValues: {
      ':category': category
    }
  }));
  
  return result.Items as QuizQuestion[] || [];
}

export async function getQuizQuestionById(id: string): Promise<QuizQuestion | null> {
  const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
  
  const result = await dynamoDB.send(new GetCommand({
    TableName: QUIZ_TABLE,
    Key: { id }
  }));
  
  return result.Item as QuizQuestion || null;
}

export async function putQuizQuestion(question: QuizQuestion): Promise<void> {
  const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
  
  await dynamoDB.send(new PutCommand({
    TableName: QUIZ_TABLE,
    Item: question
  }));
}

export async function deleteQuizQuestion(id: string): Promise<void> {
  const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
  
  await dynamoDB.send(new DeleteCommand({
    TableName: QUIZ_TABLE,
    Key: { id }
  }));
} 