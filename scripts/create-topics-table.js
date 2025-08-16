const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

const topics = [
  {
    id: 'networking',
    name: 'Networking & Security',
    description: 'Learn VPC, Security Groups, and network architecture',
    icon: '🌐',
    color: 'bg-blue-500',
    difficulty: 'Beginner',
    services: ['vpc'],
    tutorialCount: 1,
    serviceCount: 1
  },
  {
    id: 'compute',
    name: 'Compute Services',
    description: 'Master EC2, Lambda, and serverless computing',
    icon: '🖥️',
    color: 'bg-green-500',
    difficulty: 'Beginner',
    services: ['ec2'],
    tutorialCount: 1,
    serviceCount: 1
  },
  {
    id: 'storage',
    name: 'Storage & Databases',
    description: 'Explore S3, RDS, and data management',
    icon: '💾',
    color: 'bg-orange-500',
    difficulty: 'Beginner',
    services: ['s3'],
    tutorialCount: 1,
    serviceCount: 1
  },
  {
    id: 'security',
    name: 'Security & IAM',
    description: 'Understand AWS security best practices',
    icon: '🔒',
    color: 'bg-red-500',
    difficulty: 'Intermediate',
    services: [],
    tutorialCount: 0,
    serviceCount: 0
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Logging',
    description: 'Learn CloudWatch, CloudTrail, and observability',
    icon: '📊',
    color: 'bg-purple-500',
    difficulty: 'Intermediate',
    services: [],
    tutorialCount: 0,
    serviceCount: 0
  },
  {
    id: 'serverless',
    name: 'Serverless & Containers',
    description: 'Explore Lambda, ECS, and container services',
    icon: '⚡',
    color: 'bg-indigo-500',
    difficulty: 'Advanced',
    services: [],
    tutorialCount: 0,
    serviceCount: 0
  }
];

async function createTopicsTable() {
  try {
    await client.send(new CreateTableCommand({
      TableName: 'aws-learning-topics',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }));
    console.log('✅ Created table: aws-learning-topics');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Table aws-learning-topics already exists');
    } else {
      console.error('❌ Error creating table:', error.message);
    }
  }
}

async function populateTopicsTable() {
  for (const topic of topics) {
    try {
      await dynamoDB.send(new PutCommand({
        TableName: 'aws-learning-topics',
        Item: topic
      }));
      console.log(`✅ Added topic: ${topic.id}`);
    } catch (error) {
      console.error(`❌ Failed to add topic ${topic.id}:`, error);
    }
  }
}

async function main() {
  await createTopicsTable();
  await populateTopicsTable();
  console.log('🎉 Topics setup completed successfully!');
}

main(); 