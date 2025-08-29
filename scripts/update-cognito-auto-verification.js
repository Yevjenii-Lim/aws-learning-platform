const { CognitoIdentityProviderClient, UpdateUserPoolCommand } = require('@aws-sdk/client-cognito-identity-provider');
require('dotenv').config({ path: '.env.local' });

async function updateCognitoAutoVerification() {
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

  // Get User Pool ID from environment or use the current one
  const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_GzUzM777v';

  console.log('🔧 Updating Cognito User Pool Auto Verification...');
  console.log(`User Pool ID: ${USER_POOL_ID}`);

  try {
    const updateCommand = new UpdateUserPoolCommand({
      UserPoolId: USER_POOL_ID,
      AutoVerifiedAttributes: [], // Disable auto-verification
    });

    await client.send(updateCommand);
    
    console.log('✅ Auto verification disabled successfully!');
    console.log('📋 Users will now need to manually verify their email addresses');
    
  } catch (error) {
    console.error('❌ Error updating auto verification:', error);
    process.exit(1);
  }
}

updateCognitoAutoVerification();
