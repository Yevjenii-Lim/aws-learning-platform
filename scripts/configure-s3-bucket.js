const { S3Client, PutBucketPolicyCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'aws-learning-platform-content';

async function configureS3Bucket() {
  try {
    console.log(`Configuring S3 bucket: ${BUCKET_NAME}`);

    // 1. Configure CORS for the bucket
    const corsConfiguration = {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
          AllowedOrigins: ['*'], // In production, specify your domain
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3000,
        },
      ],
    };

    console.log('Setting CORS configuration...');
    await s3Client.send(new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: corsConfiguration,
    }));
    console.log('✅ CORS configuration set successfully');

    // 2. Configure bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
        },
      ],
    };

    console.log('Setting bucket policy for public read access...');
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy),
    }));
    console.log('✅ Bucket policy set successfully');

    console.log('\n🎉 S3 bucket configured successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your S3 bucket has "Block Public Access" settings disabled for:');
    console.log('   - Block public access to buckets and objects granted through new access control lists (ACLs)');
    console.log('   - Block public access to buckets and objects granted through any access control lists (ACLs)');
    console.log('   - Block public access to buckets and objects granted through new public bucket or access point policies');
    console.log('   - Block public access to buckets and objects granted through any public bucket or access point policies');
    console.log('\n2. Test the screenshot upload feature in your admin panel');
    console.log('\n3. Check that images display properly in tutorials');

  } catch (error) {
    console.error('❌ Error configuring S3 bucket:', error);
    
    if (error.name === 'AccessDenied') {
      console.log('\n💡 This error usually means:');
      console.log('1. Your AWS credentials don\'t have sufficient permissions');
      console.log('2. The bucket doesn\'t exist');
      console.log('3. You need to manually configure the bucket in AWS Console');
      console.log('\nManual configuration steps:');
      console.log('1. Go to AWS S3 Console');
      console.log('2. Select your bucket:', BUCKET_NAME);
      console.log('3. Go to "Permissions" tab');
      console.log('4. Disable "Block Public Access" settings');
      console.log('5. Add the bucket policy from the script above');
      console.log('6. Add CORS configuration from the script above');
    }
  }
}

// Run the configuration
configureS3Bucket();
