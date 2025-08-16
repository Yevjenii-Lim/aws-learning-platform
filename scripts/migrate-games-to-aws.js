const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
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

// Flashcards data
const flashcards = [
  {
    id: '1',
    front: 'What is AWS VPC?',
    back: 'Virtual Private Cloud (VPC) is a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.',
    category: 'networking',
    tags: ['VPC', 'Networking', 'Security']
  },
  {
    id: '2',
    front: 'What is an EC2 instance?',
    back: 'Elastic Compute Cloud (EC2) provides scalable computing capacity in the AWS Cloud. It allows you to launch virtual servers, configure security and networking, and manage storage.',
    category: 'compute',
    tags: ['EC2', 'Compute', 'Virtual Machines']
  },
  {
    id: '3',
    front: 'What is S3?',
    back: 'Simple Storage Service (S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance.',
    category: 'storage',
    tags: ['S3', 'Storage', 'Object Storage']
  },
  {
    id: '4',
    front: 'What is a Security Group?',
    back: 'A Security Group acts as a virtual firewall for your EC2 instances to control incoming and outgoing traffic. It operates at the instance level.',
    category: 'security',
    tags: ['Security Groups', 'Firewall', 'Network Security']
  },
  {
    id: '5',
    front: 'What is RDS?',
    back: 'Relational Database Service (RDS) is a managed relational database service that supports multiple database engines including MySQL, PostgreSQL, Oracle, and SQL Server.',
    category: 'database',
    tags: ['RDS', 'Database', 'Managed Service']
  },
  {
    id: '6',
    front: 'What is CloudFront?',
    back: 'CloudFront is a content delivery network (CDN) service that delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.',
    category: 'networking',
    tags: ['CloudFront', 'CDN', 'Content Delivery']
  },
  {
    id: '7',
    front: 'What is Lambda?',
    back: 'AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources.',
    category: 'compute',
    tags: ['Lambda', 'Serverless', 'Functions']
  },
  {
    id: '8',
    front: 'What is IAM?',
    back: 'Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. You use IAM to control who is authenticated and authorized to use resources.',
    category: 'security',
    tags: ['IAM', 'Security', 'Access Control']
  },
  {
    id: '9',
    front: 'What is DynamoDB?',
    back: 'DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.',
    category: 'database',
    tags: ['DynamoDB', 'NoSQL', 'Database']
  },
  {
    id: '10',
    front: 'What is CloudWatch?',
    back: 'CloudWatch is a monitoring and observability service that provides data and actionable insights to monitor your applications, respond to system-wide performance changes, and optimize resource utilization.',
    category: 'monitoring',
    tags: ['CloudWatch', 'Monitoring', 'Observability']
  }
];

// Quiz questions data
const quizQuestions = [
  {
    id: 'vpc-q1',
    question: 'What is the primary purpose of a VPC?',
    options: [
      'To provide internet connectivity to all AWS services',
      'To create a logically isolated section of the AWS Cloud',
      'To manage database connections',
      'To store files and objects'
    ],
    correctAnswer: 1,
    explanation: 'A VPC (Virtual Private Cloud) is a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.',
    category: 'networking',
    tags: ['VPC', 'Networking', 'Isolation']
  },
  {
    id: 'vpc-q2',
    question: 'Which component allows instances in a private subnet to access the internet?',
    options: [
      'Internet Gateway',
      'NAT Gateway',
      'Route Table',
      'Security Group'
    ],
    correctAnswer: 1,
    explanation: 'A NAT Gateway allows instances in a private subnet to access the internet while remaining private. It translates the private IP addresses to public IP addresses.',
    category: 'networking',
    tags: ['VPC', 'NAT Gateway', 'Private Subnet']
  },
  {
    id: 'ec2-q1',
    question: 'What does EC2 stand for?',
    options: [
      'Elastic Compute Cloud',
      'Enterprise Cloud Computing',
      'Elastic Cloud Computing',
      'Enterprise Compute Cloud'
    ],
    correctAnswer: 0,
    explanation: 'EC2 stands for Elastic Compute Cloud, which is a web service that provides secure, resizable compute capacity in the cloud.',
    category: 'compute',
    tags: ['EC2', 'Compute', 'Definition']
  },
  {
    id: 'ec2-q2',
    question: 'Which of the following is NOT a valid EC2 instance type family?',
    options: [
      't3.micro',
      'm5.large',
      'c5.xlarge',
      's3.medium'
    ],
    correctAnswer: 3,
    explanation: 's3.medium is not a valid EC2 instance type. Valid families include t3, m5, c5, r5, i3, etc. S3 is a storage service, not an instance type.',
    category: 'compute',
    tags: ['EC2', 'Instance Types', 'Naming Convention']
  },
  {
    id: 's3-q1',
    question: 'What is the maximum size of a single object in S3?',
    options: [
      '1 TB',
      '5 TB',
      '10 TB',
      'Unlimited'
    ],
    correctAnswer: 1,
    explanation: 'The maximum size of a single object in S3 is 5 TB. For objects larger than 5 GB, you must use multipart upload.',
    category: 'storage',
    tags: ['S3', 'Object Size', 'Limits']
  },
  {
    id: 's3-q2',
    question: 'Which S3 storage class is designed for long-term storage with infrequent access?',
    options: [
      'S3 Standard',
      'S3 Standard-IA',
      'S3 Glacier',
      'S3 Intelligent-Tiering'
    ],
    correctAnswer: 2,
    explanation: 'S3 Glacier is designed for long-term storage with infrequent access. It offers the lowest storage cost but has longer retrieval times.',
    category: 'storage',
    tags: ['S3', 'Storage Classes', 'Glacier']
  },
  {
    id: 'security-q1',
    question: 'What is the primary purpose of IAM?',
    options: [
      'To encrypt data at rest',
      'To manage user access and permissions',
      'To monitor AWS resources',
      'To backup data automatically'
    ],
    correctAnswer: 1,
    explanation: 'IAM (Identity and Access Management) is used to manage user access and permissions to AWS resources securely.',
    category: 'security',
    tags: ['IAM', 'Security', 'Access Control']
  },
  {
    id: 'security-q2',
    question: 'Which of the following is a best practice for IAM?',
    options: [
      'Use root account for daily operations',
      'Create one IAM user for all team members',
      'Follow the principle of least privilege',
      'Share access keys via email'
    ],
    correctAnswer: 2,
    explanation: 'Following the principle of least privilege is a best practice - only grant the minimum permissions necessary for users to perform their tasks.',
    category: 'security',
    tags: ['IAM', 'Best Practices', 'Security']
  },
  {
    id: 'database-q1',
    question: 'What is RDS?',
    options: [
      'A NoSQL database service',
      'A managed relational database service',
      'A data warehouse service',
      'A caching service'
    ],
    correctAnswer: 1,
    explanation: 'RDS (Relational Database Service) is a managed relational database service that supports multiple database engines.',
    category: 'database',
    tags: ['RDS', 'Database', 'Managed Service']
  },
  {
    id: 'database-q2',
    question: 'Which database engine is NOT supported by RDS?',
    options: [
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Oracle'
    ],
    correctAnswer: 2,
    explanation: 'MongoDB is not supported by RDS. RDS supports MySQL, PostgreSQL, Oracle, SQL Server, and MariaDB. MongoDB is available as DocumentDB.',
    category: 'database',
    tags: ['RDS', 'Database Engines', 'Supported']
  }
];

async function migrateFlashcards() {
  console.log('Migrating flashcards to DynamoDB...');
  
  for (const flashcard of flashcards) {
    try {
      await dynamoDB.send(new PutCommand({
        TableName: 'aws-learning-flashcards',
        Item: flashcard
      }));
      console.log(`✅ Migrated flashcard: ${flashcard.id}`);
    } catch (error) {
      console.error(`❌ Failed to migrate flashcard ${flashcard.id}:`, error);
    }
  }
  
  console.log('Flashcards migration completed!');
}

async function migrateQuizQuestions() {
  console.log('Migrating quiz questions to DynamoDB...');
  
  for (const question of quizQuestions) {
    try {
      await dynamoDB.send(new PutCommand({
        TableName: 'aws-learning-quiz',
        Item: question
      }));
      console.log(`✅ Migrated quiz question: ${question.id}`);
    } catch (error) {
      console.error(`❌ Failed to migrate quiz question ${question.id}:`, error);
    }
  }
  
  console.log('Quiz questions migration completed!');
}

async function main() {
  try {
    console.log('🚀 Starting games data migration to AWS...');
    
    await migrateFlashcards();
    await migrateQuizQuestions();
    
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main(); 