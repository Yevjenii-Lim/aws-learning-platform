export interface AWSStep {
  id: number;
  title: string;
  description: string;
  consoleInstructions: string[];
  cliCommands: string[];
  screenshot?: string;
  tips: string[];
}

export interface AWSTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  steps: AWSStep[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface AWSService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorials: AWSTutorial[];
}

export const awsServices: AWSService[] = [
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
          },
          {
            id: 2,
            title: 'Navigate to VPC Service',
            description: 'Find and access the VPC service in AWS Console',
            consoleInstructions: [
              'In the AWS Console search bar, type "VPC"',
              'Click on "VPC" from the search results',
              'You will be taken to the VPC Dashboard'
            ],
            cliCommands: [
              'aws ec2 describe-vpcs'
            ],
            tips: [
              'You can also find VPC under "Networking & Content Delivery" in the services menu'
            ]
          },
          {
            id: 3,
            title: 'Create VPC',
            description: 'Create a new VPC with custom settings',
            consoleInstructions: [
              'Click "Create VPC" button',
              'Select "VPC and more" for automatic setup',
              'Enter VPC name: "MyFirstVPC"',
              'Set IPv4 CIDR block: "10.0.0.0/16"',
              'Choose "No IPv6 CIDR block" for now',
              'Set Number of Availability Zones: 2',
              'Set Number of public subnets: 2',
              'Set Number of private subnets: 2',
              'Click "Create VPC"'
            ],
            cliCommands: [
              'aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications ResourceType=vpc,Tags=[{Key=Name,Value=MyFirstVPC}]'
            ],
            tips: [
              'The CIDR block 10.0.0.0/16 provides 65,536 IP addresses',
              'Using multiple AZs provides high availability',
              'Public subnets have route to Internet Gateway'
            ]
          },
          {
            id: 4,
            title: 'Verify VPC Creation',
            description: 'Confirm that your VPC was created successfully',
            consoleInstructions: [
              'In the VPC Dashboard, click "Your VPCs"',
              'You should see your new VPC listed',
              'Note the VPC ID (e.g., vpc-12345678)',
              'Check that the state shows "Available"'
            ],
            cliCommands: [
              'aws ec2 describe-vpcs --filters "Name=tag:Name,Values=MyFirstVPC"'
            ],
            tips: [
              'Keep track of your VPC ID as you will need it for other resources',
              'The default VPC cannot be deleted, but custom VPCs can be'
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
        id: 'launch-ec2-instance',
        title: 'Launch Your First EC2 Instance',
        description: 'Learn how to launch and connect to an EC2 instance',
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        category: 'Compute',
        prerequisites: ['AWS Account', 'VPC Tutorial completed'],
        learningObjectives: [
          'Understand EC2 instance types and pricing',
          'Launch an EC2 instance with proper security',
          'Connect to your instance using SSH',
          'Terminate instances to avoid charges'
        ],
        steps: [
          {
            id: 1,
            title: 'Navigate to EC2 Service',
            description: 'Access the EC2 service in AWS Console',
            consoleInstructions: [
              'In the AWS Console search bar, type "EC2"',
              'Click on "EC2" from the search results',
              'You will be taken to the EC2 Dashboard'
            ],
            cliCommands: [
              'aws ec2 describe-instances'
            ],
            tips: [
              'EC2 is one of the most fundamental AWS services'
            ]
          },
          {
            id: 2,
            title: 'Launch Instance',
            description: 'Start the process of launching a new EC2 instance',
            consoleInstructions: [
              'Click "Launch Instance" button',
              'Enter instance name: "MyFirstInstance"',
              'Choose "Amazon Linux 2023" as the AMI',
              'Select "t2.micro" instance type (free tier eligible)',
              'Click "Next: Configure Instance Details"'
            ],
            cliCommands: [
              'aws ec2 run-instances --image-id ami-12345678 --count 1 --instance-type t2.micro --key-name MyKeyPair'
            ],
            tips: [
              't2.micro is free tier eligible for 12 months',
              'Choose the AMI based on your application needs'
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
        id: 'create-s3-bucket',
        title: 'Create and Configure S3 Bucket',
        description: 'Learn how to create an S3 bucket with proper security settings',
        difficulty: 'beginner',
        estimatedTime: '10 minutes',
        category: 'Storage',
        prerequisites: ['AWS Account'],
        learningObjectives: [
          'Understand S3 bucket naming requirements',
          'Configure bucket permissions and security',
          'Upload and manage objects in S3',
          'Enable versioning and lifecycle policies'
        ],
        steps: [
          {
            id: 1,
            title: 'Navigate to S3 Service',
            description: 'Access the S3 service in AWS Console',
            consoleInstructions: [
              'In the AWS Console search bar, type "S3"',
              'Click on "S3" from the search results',
              'You will be taken to the S3 Dashboard'
            ],
            cliCommands: [
              'aws s3 ls'
            ],
            tips: [
              'S3 is one of the most popular AWS services'
            ]
          },
          {
            id: 2,
            title: 'Create Bucket',
            description: 'Create a new S3 bucket with unique name',
            consoleInstructions: [
              'Click "Create bucket" button',
              'Enter bucket name: "my-unique-bucket-name-2024"',
              'Select your preferred region',
              'Keep default settings for now',
              'Click "Create bucket"'
            ],
            cliCommands: [
              'aws s3 mb s3://my-unique-bucket-name-2024'
            ],
            tips: [
              'Bucket names must be globally unique across all AWS accounts',
              'Use lowercase letters, numbers, hyphens, and periods only'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'rds',
    name: 'Relational Database Service (RDS)',
    description: 'Managed relational database service',
    icon: '🗄️',
    color: 'bg-purple-500',
    tutorials: [
      {
        id: 'create-rds-instance',
        title: 'Create RDS Database Instance',
        description: 'Learn how to create and configure a managed database',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        category: 'Database',
        prerequisites: ['AWS Account', 'VPC Tutorial completed'],
        learningObjectives: [
          'Understand RDS instance types and engines',
          'Configure database security groups',
          'Set up automated backups',
          'Connect to your database'
        ],
        steps: [
          {
            id: 1,
            title: 'Navigate to RDS Service',
            description: 'Access the RDS service in AWS Console',
            consoleInstructions: [
              'In the AWS Console search bar, type "RDS"',
              'Click on "RDS" from the search results',
              'You will be taken to the RDS Dashboard'
            ],
            cliCommands: [
              'aws rds describe-db-instances'
            ],
            tips: [
              'RDS supports multiple database engines: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server'
            ]
          }
        ]
      }
    ]
  }
]; 