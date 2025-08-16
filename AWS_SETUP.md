# 🚀 AWS Infrastructure Setup Guide

This guide will help you set up AWS services to store and manage your AWS Learning Platform lesson data.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js and npm installed

## 🏗️ AWS Services Setup

### 1. Amazon DynamoDB Tables

Create three DynamoDB tables for storing lesson data:

#### Services Table
```bash
aws dynamodb create-table \
  --table-name aws-learning-services \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

#### Tutorials Table
```bash
aws dynamodb create-table \
  --table-name aws-learning-tutorials \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

#### User Progress Table
```bash
aws dynamodb create-table \
  --table-name aws-learning-user-progress \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 2. Amazon S3 Bucket

Create an S3 bucket for storing lesson content and assets:

```bash
aws s3 mb s3://aws-learning-platform-content --region us-east-1
```

Configure bucket for static website hosting (optional):
```bash
aws s3 website s3://aws-learning-platform-content --index-document index.html --error-document error.html
```

### 3. IAM User and Permissions

Create an IAM user for the application:

```bash
aws iam create-user --user-name aws-learning-platform
```

Create access keys:
```bash
aws iam create-access-key --user-name aws-learning-platform
```

Attach policies for DynamoDB and S3 access:

#### DynamoDB Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/aws-learning-services",
        "arn:aws:dynamodb:us-east-1:*:table/aws-learning-tutorials",
        "arn:aws:dynamodb:us-east-1:*:table/aws-learning-user-progress"
      ]
    }
  ]
}
```

#### S3 Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::aws-learning-platform-content",
        "arn:aws:s3:::aws-learning-platform-content/*"
      ]
    }
  ]
}
```

## 🔧 Application Configuration

### 1. Environment Variables

Copy the environment example and configure your AWS credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your AWS credentials:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET=aws-learning-platform-content
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Migrate Existing Data

Run the migration script to move your existing lesson data to AWS:

```bash
npx ts-node scripts/migrate-to-aws.ts
```

## 🚀 Deployment Options

### Option 1: AWS Amplify (Recommended)

1. Connect your GitHub repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

### Option 2: AWS ECS with Fargate

1. Create a Docker image
2. Push to Amazon ECR
3. Deploy using ECS Fargate

### Option 3: AWS Lambda + API Gateway

1. Create Lambda functions for API endpoints
2. Set up API Gateway
3. Deploy frontend to S3 + CloudFront

## 📊 Monitoring and Analytics

### CloudWatch Metrics

Monitor your application with CloudWatch:
- DynamoDB read/write capacity
- S3 request metrics
- Application performance

### Cost Optimization

- Use DynamoDB on-demand billing for development
- Enable S3 lifecycle policies for old content
- Set up CloudWatch alarms for cost monitoring

## 🔒 Security Best Practices

1. **IAM Roles**: Use least privilege principle
2. **Encryption**: Enable encryption at rest and in transit
3. **VPC**: Deploy in private subnets when possible
4. **Secrets**: Use AWS Secrets Manager for sensitive data
5. **Monitoring**: Enable CloudTrail for audit logs

## 🧪 Testing

Test your AWS integration:

```bash
# Test DynamoDB connection
npm run test:aws

# Test S3 upload/download
npm run test:s3

# Test API endpoints
npm run test:api
```

## 📈 Scaling Considerations

- **DynamoDB**: Auto-scales based on demand
- **S3**: Unlimited storage and bandwidth
- **CDN**: Use CloudFront for global content delivery
- **Caching**: Implement Redis for session management

## 🆘 Troubleshooting

### Common Issues

1. **Permission Denied**: Check IAM policies
2. **Table Not Found**: Verify table names and regions
3. **Bucket Access**: Ensure bucket permissions are correct
4. **Environment Variables**: Verify all AWS credentials are set

### Debug Commands

```bash
# Test AWS credentials
aws sts get-caller-identity

# List DynamoDB tables
aws dynamodb list-tables

# List S3 buckets
aws s3 ls

# Check CloudWatch logs
aws logs describe-log-groups
```

## 📚 Additional Resources

- [AWS DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/)
- [AWS S3 Developer Guide](https://docs.aws.amazon.com/s3/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) 