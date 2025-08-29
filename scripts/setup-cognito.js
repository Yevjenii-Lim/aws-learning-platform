const { 
  CognitoIdentityProviderClient, 
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  DescribeUserPoolCommand,
  DescribeUserPoolClientCommand
} = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

async function setupCognito() {
  console.log('🚀 Setting up AWS Cognito for AWS Learning Platform...\n');
  
  try {
    // Step 1: Create User Pool
    console.log('📋 Creating User Pool...');
    const createUserPoolCommand = new CreateUserPoolCommand({
      PoolName: 'aws-learning-platform-users',
      Policies: {
        PasswordPolicy: {
          MinimumLength: 6,
          RequireUppercase: false,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireSymbols: false,
        },
      },
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email'],
      Schema: [
        {
          Name: 'email',
          AttributeDataType: 'String',
          Required: true,
          Mutable: true,
        },
        {
          Name: 'name',
          AttributeDataType: 'String',
          Required: true,
          Mutable: true,
        },
        {
          Name: 'role',
          AttributeDataType: 'String',
          Required: false,
          Mutable: true,
          StringAttributeConstraints: {
            MinLength: '1',
            MaxLength: '256',
          },
        },
      ],
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false,
      },
      EmailConfiguration: {
        EmailSendingAccount: 'COGNITO_DEFAULT',
      },
      MfaConfiguration: 'OFF',
      UserPoolTags: {
        Project: 'aws-learning-platform',
        Environment: 'production',
      },
    });

    const userPoolResponse = await client.send(createUserPoolCommand);
    const userPoolId = userPoolResponse.UserPool.Id;
    
    console.log(`✅ User Pool created: ${userPoolId}`);
    
    // Step 2: Create User Pool Client
    console.log('\n📱 Creating User Pool Client...');
    const createClientCommand = new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: 'aws-learning-platform-web',
      GenerateSecret: false, // Don't generate client secret for public clients
      ExplicitAuthFlows: [
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
        'ALLOW_USER_SRP_AUTH',
      ],
      PreventUserExistenceErrors: 'ENABLED',
      SupportedIdentityProviders: ['COGNITO'],
      CallbackURLs: ['http://localhost:3000', 'https://your-domain.com'], // Update with your domains
      LogoutURLs: ['http://localhost:3000', 'https://your-domain.com'], // Update with your domains
      AllowedOAuthFlows: ['code'],
      AllowedOAuthScopes: ['email', 'openid', 'profile'],
      AllowedOAuthFlowsUserPoolClient: true,
    });

    const clientResponse = await client.send(createClientCommand);
    const clientId = clientResponse.UserPoolClient.ClientId;
    
    console.log(`✅ User Pool Client created: ${clientId}`);
    
    // Step 3: Create admin user
    console.log('\n👤 Creating admin user...');
    const adminEmail = 'admin@awslearning.com';
    const adminPassword = 'Admin123!';
    
    try {
      const createAdminCommand = new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: adminEmail,
        UserAttributes: [
          {
            Name: 'email',
            Value: adminEmail,
          },
          {
            Name: 'name',
            Value: 'Admin User',
          },
          {
            Name: 'custom:role',
            Value: 'admin',
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
        MessageAction: 'SUPPRESS',
      });

      await client.send(createAdminCommand);
      
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: adminEmail,
        Password: adminPassword,
        Permanent: true,
      });

      await client.send(setPasswordCommand);
      
      console.log(`✅ Admin user created: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        console.log(`⚠️  Admin user already exists: ${adminEmail}`);
      } else {
        console.error(`❌ Error creating admin user: ${error.message}`);
      }
    }
    
    // Step 4: Display configuration
    console.log('\n📋 Configuration Summary:');
    console.log('='.repeat(50));
    console.log(`User Pool ID: ${userPoolId}`);
    console.log(`Client ID: ${clientId}`);
    console.log(`Admin Email: ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('='.repeat(50));
    
    // Step 5: Generate environment variables
    console.log('\n🔧 Environment Variables:');
    console.log('Add these to your .env.local file:');
    console.log('='.repeat(50));
    console.log(`COGNITO_USER_POOL_ID=${userPoolId}`);
    console.log(`COGNITO_CLIENT_ID=${clientId}`);
    console.log('='.repeat(50));
    
    // Step 6: Save configuration to file
    const fs = require('fs');
    const config = {
      userPoolId,
      clientId,
      adminEmail,
      adminPassword,
      createdAt: new Date().toISOString(),
    };
    
    fs.writeFileSync('cognito-config.json', JSON.stringify(config, null, 2));
    console.log('\n📄 Configuration saved to: cognito-config.json');
    
    console.log('\n✅ Cognito setup completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Add the environment variables to your .env.local file');
    console.log('2. Update your application to use Cognito authentication');
    console.log('3. Test the admin login with the credentials above');
    console.log('4. Run the migration script to move existing users:');
    console.log('   node scripts/migrate-users-to-cognito.js');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupCognito();
}

module.exports = { setupCognito };
