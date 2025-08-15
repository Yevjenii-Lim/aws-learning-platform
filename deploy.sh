#!/bin/bash

# AWS Learning Platform Deployment Script
# This script helps you deploy to AWS Amplify

echo "🚀 AWS Learning Platform Deployment Script"
echo "=========================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ You are not logged in to AWS. Please run:"
    echo "   aws configure"
    exit 1
fi

echo "✅ AWS CLI is configured"

# Check if git repository is ready
if [ ! -d ".git" ]; then
    echo "❌ This is not a git repository. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository is ready"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    exit 1
fi

echo "✅ All changes are committed"

# Build the application locally to check for errors
echo "🔨 Building application..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo ""
echo "🎉 Your application is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub/GitLab/Bitbucket:"
echo "   git remote add origin YOUR_REPOSITORY_URL"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to AWS Amplify:"
echo "   - Go to AWS Console → Amplify"
echo "   - Click 'New app' → 'Host web app'"
echo "   - Connect your Git repository"
echo "   - Amplify will auto-detect Next.js"
echo "   - Click 'Save and deploy'"
echo ""
echo "3. Your app will be available at:"
echo "   https://main.YOUR_APP_ID.amplifyapp.com"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🚀 Happy deploying!" 