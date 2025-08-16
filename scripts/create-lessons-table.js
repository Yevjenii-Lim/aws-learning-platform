const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config({ path: '.env.local' });

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

// Sample lessons data
const lessons = [
  {
    id: 'vpc',
    name: 'Virtual Private Cloud (VPC)',
    description: 'Learn how to create and configure VPCs for network isolation and security',
    icon: '🌐',
    color: 'bg-blue-500',
    tutorials: [
      {
        id: 'create-vpc',
        title: 'Create a VPC',
        description: 'Step-by-step guide to create your first VPC',
        difficulty: 'beginner',
        estimatedTime: '15 minutes',
        category: 'networking',
        steps: [
          {
            id: 1,
            title: 'Navigate to VPC Dashboard',
            description: 'Open the AWS Management Console and navigate to the VPC service',
            consoleInstructions: ['Go to AWS Management Console', 'Search for "VPC"', 'Click on "VPC" service'],
            cliCommands: ['aws ec2 describe-vpcs'],
            tips: ['Make sure you\'re in the correct AWS region']
          },
          {
            id: 2,
            title: 'Create VPC',
            description: 'Create a new VPC with custom CIDR block',
            consoleInstructions: ['Click "Create VPC"', 'Enter VPC name', 'Set CIDR block to 10.0.0.0/16'],
            cliCommands: ['aws ec2 create-vpc --cidr-block 10.0.0.0/16'],
            tips: ['Choose a CIDR block that doesn\'t conflict with your existing networks']
          }
        ],
        learningObjectives: ['Understand VPC concepts', 'Learn CIDR notation', 'Create basic VPC configuration']
      }
    ]
  },
  {
    id: 'ec2',
    name: 'Elastic Compute Cloud (EC2)',
    description: 'Master EC2 instances, AMIs, and instance management',
    icon: '🖥️',
    color: 'bg-green-500',
    tutorials: [
      {
        id: 'launch-instance',
        title: 'Launch an EC2 Instance',
        description: 'Learn how to launch and configure EC2 instances',
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        category: 'compute',
        steps: [
          {
            id: 1,
            title: 'Choose AMI',
            description: 'Select an Amazon Machine Image for your instance',
            consoleInstructions: ['Go to EC2 Dashboard', 'Click "Launch Instance"', 'Choose Amazon Linux 2 AMI'],
            cliCommands: ['aws ec2 describe-images --owners amazon'],
            tips: ['Use Amazon Linux 2 for best compatibility']
          },
          {
            id: 2,
            title: 'Configure Instance',
            description: 'Set instance type and configuration',
            consoleInstructions: ['Select t2.micro instance type', 'Configure storage', 'Add tags'],
            cliCommands: ['aws ec2 run-instances --image-id ami-12345678 --instance-type t2.micro'],
            tips: ['t2.micro is free tier eligible']
          }
        ],
        learningObjectives: ['Understand EC2 instance types', 'Learn AMI selection', 'Configure instance settings']
      }
    ]
  },
  {
    id: 's3',
    name: 'Simple Storage Service (S3)',
    description: 'Learn S3 bucket creation, object management, and storage classes',
    icon: '📦',
    color: 'bg-orange-500',
    tutorials: [
      {
        id: 'create-bucket',
        title: 'Create an S3 Bucket',
        description: 'Create and configure your first S3 bucket',
        difficulty: 'beginner',
        estimatedTime: '10 minutes',
        category: 'storage',
        steps: [
          {
            id: 1,
            title: 'Access S3 Console',
            description: 'Navigate to the S3 service in AWS Console',
            consoleInstructions: ['Go to AWS Management Console', 'Search for "S3"', 'Click on "S3" service'],
            cliCommands: ['aws s3 ls'],
            tips: ['S3 is a global service but buckets are region-specific']
          },
          {
            id: 2,
            title: 'Create Bucket',
            description: 'Create a new S3 bucket with unique name',
            consoleInstructions: ['Click "Create bucket"', 'Enter unique bucket name', 'Choose region'],
            cliCommands: ['aws s3 mb s3://my-unique-bucket-name'],
            tips: ['Bucket names must be globally unique across all AWS accounts']
          }
        ],
        learningObjectives: ['Understand S3 bucket concepts', 'Learn bucket naming rules', 'Configure bucket settings']
      }
    ]
  }
];

async function createLessonsTable() {
  console.log('🚀 Creating lessons table...');
  
  try {
    await client.send(new CreateTableCommand({
      TableName: 'aws-learning-lessons',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }));
    console.log('✅ Created table: aws-learning-lessons');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Table aws-learning-lessons already exists');
    } else {
      console.error('❌ Error creating table:', error.message);
      return;
    }
  }
}

async function populateLessonsTable() {
  console.log('📝 Populating lessons table...');
  
  for (const lesson of lessons) {
    try {
      await dynamoDB.send(new PutCommand({
        TableName: 'aws-learning-lessons',
        Item: lesson
      }));
      console.log(`✅ Added lesson: ${lesson.id}`);
    } catch (error) {
      console.error(`❌ Failed to add lesson ${lesson.id}:`, error);
    }
  }
  
  console.log('🎉 Lessons table population completed!');
}

async function main() {
  try {
    await createLessonsTable();
    await populateLessonsTable();
    console.log('🎉 Setup completed successfully!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main(); 