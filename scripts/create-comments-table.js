const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

// Check if we're in AWS environment (Amplify/Lambda) or local development
const isAWSEnvironment = process.env.AWS_LAMBDA_FUNCTION_NAME || 
                        process.env.AWS_EXECUTION_ENV || 
                        process.env.AWS_REGION ||
                        process.env.NODE_ENV === 'production';

console.log('isAWSEnvironment:', isAWSEnvironment);

let client;

if (isAWSEnvironment) {
  // In AWS environment, use default credentials (IAM role)
  console.log('Using IAM role credentials for AWS environment');
  client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
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
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

const COMMENTS_TABLE = 'aws-learning-comments';

async function createCommentsTable() {
  try {
    console.log(`Creating comments table: ${COMMENTS_TABLE}`);

    const params = {
      TableName: COMMENTS_TABLE,
      KeySchema: [
        { AttributeName: 'tutorialId', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'id', KeyType: 'RANGE' }         // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'tutorialId', AttributeType: 'S' },
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'UserIdIndex',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          }
        }
      ],
      AttributeDefinitions: [
        { AttributeName: 'tutorialId', AttributeType: 'S' },
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' }
      ]
    };

    await client.send(new CreateTableCommand(params));
    console.log('✅ Comments table created successfully!');

  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Comments table already exists');
    } else {
      console.error('❌ Error creating comments table:', error);
    }
  }
}

// Run the script
createCommentsTable();
