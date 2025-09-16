const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

async function updateEC2Tutorial() {
  try {
    // Get the current compute topic
    const getResponse = await dynamoDB.send(new GetCommand({
      TableName: 'aws-learning-topics',
      Key: { id: 'compute' }
    }));

    if (!getResponse.Item) {
      console.log('Compute topic not found');
      return;
    }

    const topic = getResponse.Item;
    
    // Update the tutorial with 9 steps
    const updatedTutorial = {
      id: 'launch-instance',
      title: 'Complete EC2 Instance Setup',
      description: 'Learn how to launch and configure EC2 instances from start to finish',
      difficulty: 'beginner',
      estimatedTime: '30 minutes',
      category: 'compute',
      topicId: 'compute',
      learningObjectives: [
        'Understand EC2 instance types and pricing',
        'Learn AMI selection and configuration', 
        'Configure security groups and key pairs',
        'Launch and connect to EC2 instances',
        'Understand storage options and networking'
      ],
      steps: [
        {
          id: 1,
          title: 'Navigate to EC2 Dashboard',
          description: 'Access the EC2 service in the AWS Management Console',
          consoleInstructions: [
            'Sign in to AWS Management Console',
            'Navigate to EC2 service',
            'Click on Instances in the left sidebar'
          ],
          cliCommands: ['aws ec2 describe-instances'],
          tips: [
            'Make sure you are in the correct AWS region',
            'EC2 is available in all AWS regions'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-1.png'
        },
        {
          id: 2,
          title: 'Launch New Instance',
          description: 'Start the process of creating a new EC2 instance',
          consoleInstructions: [
            'Click the Launch Instance button',
            'Enter a name for your instance',
            'Select Amazon Linux 2023 AMI'
          ],
          cliCommands: ['aws ec2 describe-images --owners amazon --filters Name=name,Values=amzn2-ami-hvm-*'],
          tips: [
            'Choose Amazon Linux 2023 for the latest features',
            'AMI selection affects the operating system and pre-installed software'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-2.png'
        },
        {
          id: 3,
          title: 'Select Instance Type',
          description: 'Choose the appropriate instance type for your workload',
          consoleInstructions: [
            'Select t2.micro instance type',
            'Review the instance specifications',
            'Click Next: Configure Instance Details'
          ],
          cliCommands: ['aws ec2 describe-instance-types --instance-types t2.micro'],
          tips: [
            't2.micro is free tier eligible',
            'Consider your application requirements when selecting instance type'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-3.png'
        },
        {
          id: 4,
          title: 'Configure Instance Details',
          description: 'Set up networking, IAM role, and other instance configurations',
          consoleInstructions: [
            'Select your VPC and subnet',
            'Enable Auto-assign Public IP',
            'Configure IAM role if needed',
            'Click Next: Add Storage'
          ],
          cliCommands: [
            'aws ec2 describe-vpcs',
            'aws ec2 describe-subnets'
          ],
          tips: [
            'Use default VPC for simplicity',
            'Public IP allows internet access to your instance'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-4.png'
        },
        {
          id: 5,
          title: 'Configure Storage',
          description: 'Set up storage volumes for your instance',
          consoleInstructions: [
            'Review the default 8GB root volume',
            'Add additional EBS volumes if needed',
            'Configure encryption settings',
            'Click Next: Add Tags'
          ],
          cliCommands: ['aws ec2 describe-volumes'],
          tips: [
            '8GB is sufficient for basic testing',
            'Consider encryption for sensitive data'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-5.png'
        },
        {
          id: 6,
          title: 'Add Tags',
          description: 'Add metadata tags to organize and identify your instance',
          consoleInstructions: [
            'Click Add Tag',
            'Set Key: Name and Value: My-EC2-Instance',
            'Add additional tags as needed',
            'Click Next: Configure Security Group'
          ],
          cliCommands: ['aws ec2 create-tags --resources i-1234567890abcdef0 --tags Key=Name,Value=My-EC2-Instance'],
          tips: [
            'Tags help organize resources and track costs',
            'Use consistent naming conventions'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-6.png'
        },
        {
          id: 7,
          title: 'Configure Security Group',
          description: 'Set up firewall rules to control network access',
          consoleInstructions: [
            'Create a new security group',
            'Add rule: Type SSH, Port 22, Source My IP',
            'Add rule: Type HTTP, Port 80, Source 0.0.0.0/0',
            'Click Review and Launch'
          ],
          cliCommands: ['aws ec2 create-security-group --group-name my-sg --description My security group'],
          tips: [
            'Only open necessary ports',
            'Use My IP for SSH to restrict access'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-7.png'
        },
        {
          id: 8,
          title: 'Create Key Pair',
          description: 'Generate or select a key pair for secure SSH access',
          consoleInstructions: [
            'Select Create a new key pair',
            'Enter key pair name: my-key-pair',
            'Download the .pem file',
            'Click Launch Instances'
          ],
          cliCommands: ['aws ec2 create-key-pair --key-name my-key-pair --query KeyMaterial --output text > my-key-pair.pem'],
          tips: [
            'Store the .pem file securely',
            'You cannot download it again later'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-8.png'
        },
        {
          id: 9,
          title: 'Launch and Connect',
          description: 'Launch your instance and connect to it via SSH',
          consoleInstructions: [
            'Click View Instances',
            'Wait for instance state to be running',
            'Note the public IP address',
            'Connect via SSH using your key pair'
          ],
          cliCommands: [
            'ssh -i my-key-pair.pem ec2-user@your-instance-ip',
            'aws ec2 describe-instances --instance-ids i-1234567890abcdef0'
          ],
          tips: [
            'Instance may take a few minutes to be ready',
            'Use the public IP to connect from outside AWS'
          ],
          screenshot: 'https://aws-learning-platform-content-1755358162.s3.amazonaws.com/screenshots/compute/launch-instance/step-9.png'
        }
      ]
    };

    // Update the topic with the new tutorial
    const updatedTopic = {
      ...topic,
      tutorials: [updatedTutorial],
      tutorialCount: 1
    };

    await dynamoDB.send(new PutCommand({
      TableName: 'aws-learning-topics',
      Item: updatedTopic
    }));

    console.log('✅ Successfully updated EC2 tutorial with 9 steps');
    console.log(`📚 Tutorial: ${updatedTutorial.title}`);
    console.log(`🔢 Steps: ${updatedTutorial.steps.length}`);
    
  } catch (error) {
    console.error('❌ Error updating tutorial:', error);
  }
}

updateEC2Tutorial();
