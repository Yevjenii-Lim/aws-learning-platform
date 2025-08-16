const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Initialize clients
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: 'us-east-1',
}));

const s3Client = new S3Client({
  region: 'us-east-1',
});

// Sample data (expanded with more services)
const sampleServices = [
  {
    id: 'vpc',
    name: 'Virtual Private Cloud (VPC)',
    description: 'Create and manage isolated network environments in AWS',
    icon: '🌐',
    color: 'bg-blue-500',
    tutorials: [
      {
        id: 'create-vpc',
        title: 'Create Your First VPC',
        description: 'Learn how to create a Virtual Private Cloud with public and private subnets',
        difficulty: 'beginner',
        estimatedTime: '15 minutes',
        category: 'Networking',
        prerequisites: ['AWS Account', 'Basic networking knowledge'],
        learningObjectives: [
          'Understand VPC concepts and components',
          'Create a VPC with custom CIDR block',
          'Configure public and private subnets',
          'Set up Internet Gateway and Route Tables'
        ],
        steps: [
          {
            id: 1,
            title: 'Sign in to AWS Console',
            description: 'Access the AWS Management Console',
            consoleInstructions: [
              'Open your web browser and navigate to https://console.aws.amazon.com',
              'Sign in with your AWS account credentials',
              'Ensure you are in the correct AWS region (top right corner)'
            ],
            cliCommands: [
              'aws configure',
              'aws sts get-caller-identity'
            ],
            tips: [
              'Make sure you have the necessary permissions to create VPC resources',
              'Choose a region close to your users for better performance'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ec2',
    name: 'Elastic Compute Cloud (EC2)',
    description: 'Launch and manage virtual servers in the cloud',
    icon: '🖥️',
    color: 'bg-green-500',
    tutorials: [
      {
        id: 'launch-instance',
        title: 'Launch Your First EC2 Instance',
        description: 'Learn how to launch and configure an EC2 instance',
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        category: 'Compute',
        prerequisites: ['AWS Account', 'VPC created'],
        learningObjectives: [
          'Understand EC2 instance types and pricing',
          'Launch an EC2 instance from AMI',
          'Configure security groups',
          'Connect to your instance'
        ],
        steps: [
          {
            id: 1,
            title: 'Navigate to EC2 Service',
            description: 'Access the EC2 Management Console',
            consoleInstructions: [
              'In the AWS Console, search for "EC2"',
              'Click on "EC2" from the search results',
              'You will be taken to the EC2 Dashboard'
            ],
            cliCommands: [
              'aws ec2 describe-instances'
            ],
            tips: [
              'Make sure you have the necessary permissions to create EC2 instances',
              'Choose the right instance type for your workload'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 's3',
    name: 'Simple Storage Service (S3)',
    description: 'Store and retrieve any amount of data from anywhere',
    icon: '📦',
    color: 'bg-orange-500',
    tutorials: [
      {
        id: 'create-bucket',
        title: 'Create Your First S3 Bucket',
        description: 'Learn how to create and configure an S3 bucket',
        difficulty: 'beginner',
        estimatedTime: '10 minutes',
        category: 'Storage',
        prerequisites: ['AWS Account'],
        learningObjectives: [
          'Understand S3 bucket concepts',
          'Create a bucket with proper naming',
          'Configure bucket permissions',
          'Upload and manage objects'
        ],
        steps: [
          {
            id: 1,
            title: 'Navigate to S3 Service',
            description: 'Access the S3 Management Console',
            consoleInstructions: [
              'In the AWS Console, search for "S3"',
              'Click on "S3" from the search results',
              'You will be taken to the S3 Dashboard'
            ],
            cliCommands: [
              'aws s3 ls'
            ],
            tips: [
              'Bucket names must be globally unique across all AWS accounts',
              'Use lowercase letters, numbers, hyphens, and periods only'
            ]
          }
        ]
      }
    ]
  }
];

async function migrateToAWS() {
  console.log('🚀 Starting migration to AWS...');

  try {
    // Migrate services to DynamoDB
    for (const service of sampleServices) {
      console.log(`📦 Migrating service: ${service.name}`);

      // Create service metadata
      const serviceData = {
        PK: `SERVICE#${service.id}`,
        SK: 'METADATA',
        id: service.id,
        name: service.name,
        description: service.description,
        icon: service.icon,
        color: service.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to DynamoDB
      const serviceCommand = new PutCommand({
        TableName: 'aws-learning-services',
        Item: serviceData,
      });
      await dynamoClient.send(serviceCommand);

      // Migrate tutorials
      for (const tutorial of service.tutorials) {
        console.log(`  📚 Migrating tutorial: ${tutorial.title}`);

        const tutorialData = {
          PK: `SERVICE#${service.id}`,
          SK: `TUTORIAL#${tutorial.id}`,
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          difficulty: tutorial.difficulty,
          estimatedTime: tutorial.estimatedTime,
          category: tutorial.category,
          prerequisites: tutorial.prerequisites,
          learningObjectives: tutorial.learningObjectives,
          steps: tutorial.steps,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save to DynamoDB
        const tutorialCommand = new PutCommand({
          TableName: 'aws-learning-tutorials',
          Item: tutorialData,
        });
        await dynamoClient.send(tutorialCommand);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Migrated ${sampleServices.length} services`);
    console.log(`📚 Migrated ${sampleServices.reduce((acc, s) => acc + s.tutorials.length, 0)} tutorials`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateToAWS()
  .then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  }); 