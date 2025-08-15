# 🚀 AWS Deployment Guide

This guide will help you deploy your AWS Learning Platform to AWS using different methods.

## 📋 Prerequisites

- AWS Account
- AWS CLI installed and configured
- Git repository (GitHub, GitLab, or Bitbucket)

## 🎯 Deployment Options

### Option 1: AWS Amplify (Recommended - Easiest)

AWS Amplify is the easiest way to deploy Next.js applications on AWS.

#### Step 1: Prepare Your Repository
```bash
# Make sure your code is committed to Git
git add .
git commit -m "Prepare for AWS deployment"
git push origin main
```

#### Step 2: Deploy with AWS Amplify Console

1. **Go to AWS Amplify Console**
   - Open AWS Console
   - Search for "Amplify"
   - Click "Get started" or "New app" → "Host web app"

2. **Connect Repository**
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Authorize AWS Amplify to access your repository
   - Select your repository and branch (usually `main`)

3. **Configure Build Settings**
   - Amplify will auto-detect Next.js
   - Use the provided `amplify.yml` configuration
   - Click "Save and deploy"

4. **Wait for Deployment**
   - Amplify will build and deploy your app
   - You'll get a URL like: `https://main.d1234567890.amplifyapp.com`

#### Step 3: Custom Domain (Optional)
1. In Amplify Console, go to "Domain management"
2. Add your custom domain
3. Configure DNS settings

### Option 2: AWS ECS with Fargate

For more control and scalability.

#### Step 1: Build and Push Docker Image
```bash
# Build the Docker image
docker build -t aws-learning-platform .

# Tag for ECR
docker tag aws-learning-platform:latest YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/aws-learning-platform:latest

# Push to ECR
aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com
docker push YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/aws-learning-platform:latest
```

#### Step 2: Deploy to ECS
1. Create ECS cluster
2. Create task definition
3. Create service with Application Load Balancer
4. Configure auto-scaling

### Option 3: AWS EC2

For traditional server deployment.

#### Step 1: Launch EC2 Instance
```bash
# Launch Ubuntu/Debian instance
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

#### Step 2: Deploy Application
```bash
# Clone your repository
git clone YOUR_REPOSITORY_URL
cd aws-learning-platform

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "aws-learning-platform" -- start
pm2 startup
pm2 save
```

## 🔧 Environment Variables

If you need to add environment variables later:

### For Amplify:
1. Go to Amplify Console → Your App → Environment variables
2. Add key-value pairs

### For ECS:
1. Add to task definition environment variables

### For EC2:
1. Create `.env` file or use system environment variables

## 📊 Monitoring and Logs

### Amplify:
- Built-in monitoring in Amplify Console
- CloudWatch integration

### ECS:
- CloudWatch logs
- ECS service metrics

### EC2:
- CloudWatch logs
- PM2 monitoring: `pm2 monit`

## 🔒 Security Best Practices

1. **HTTPS Only**: All deployments use HTTPS by default
2. **IAM Roles**: Use least privilege principle
3. **Security Groups**: Restrict access to necessary ports only
4. **Environment Variables**: Never commit secrets to Git

## 💰 Cost Optimization

### Amplify:
- Free tier: 1,000 build minutes/month
- Pay per build minute after

### ECS:
- Pay for compute resources used
- Use Spot instances for cost savings

### EC2:
- Pay for instance hours
- Use reserved instances for long-term savings

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Amplify Console
   - Verify `amplify.yml` configuration
   - Ensure all dependencies are in `package.json`

2. **Runtime Errors**
   - Check application logs
   - Verify environment variables
   - Test locally first

3. **Performance Issues**
   - Enable caching in Amplify
   - Use CDN for static assets
   - Optimize images and code

## 📞 Support

- **AWS Amplify Documentation**: https://docs.aws.amazon.com/amplify/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **AWS Support**: Available with paid plans

## 🎉 Success!

Once deployed, your team can access the platform at:
- **Amplify**: `https://your-app.amplifyapp.com`
- **ECS**: `https://your-alb-domain.com`
- **EC2**: `http://your-ec2-ip:3000`

Share the URL with your teammates and start learning AWS together! 🚀 