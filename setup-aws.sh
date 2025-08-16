#!/bin/bash

echo "🚀 AWS Learning Platform Setup Script"
echo "======================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

echo "✅ AWS CLI is installed"

# Test AWS credentials
echo "🔑 Testing AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS credentials are working"
    aws sts get-caller-identity
else
    echo "❌ AWS credentials are invalid or missing"
    echo "Please run: aws configure"
    echo "Or create an IAM user and get access keys from AWS Console"
    exit 1
fi

# Set region
REGION="us-east-1"
echo "🌍 Using region: $REGION"

# Create DynamoDB tables
echo "📊 Creating DynamoDB tables..."

# Services table
echo "Creating aws-learning-services table..."
aws dynamodb create-table \
  --table-name aws-learning-services \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION

# Tutorials table
echo "Creating aws-learning-tutorials table..."
aws dynamodb create-table \
  --table-name aws-learning-tutorials \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION

# User progress table
echo "Creating aws-learning-user-progress table..."
aws dynamodb create-table \
  --table-name aws-learning-user-progress \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION

# Create S3 bucket
BUCKET_NAME="aws-learning-platform-content-$(date +%s)"
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for website hosting (optional)
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document error.html

echo "✅ AWS infrastructure created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your AWS credentials to .env.local:"
echo "   AWS_REGION=$REGION"
echo "   AWS_ACCESS_KEY_ID=your_access_key"
echo "   AWS_SECRET_ACCESS_KEY=your_secret_key"
echo "   AWS_S3_BUCKET=$BUCKET_NAME"
echo ""
echo "2. Run the migration script:"
echo "   npx ts-node scripts/migrate-to-aws.ts"
echo ""
echo "3. Start your development server:"
echo "   npm run dev" 