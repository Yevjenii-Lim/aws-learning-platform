const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');

const client = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = 'aws-learning-users';

async function addInitialUsers() {
  try {
    console.log('Adding initial users...');
    
    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const userPasswordHash = await bcrypt.hash('user123', 12);
    
    const users = [
      {
        email: 'admin@example.com',
        id: 'user_admin_001',
        name: 'Admin User',
        passwordHash: adminPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        profile: {
          avatar: null,
          bio: 'Platform Administrator',
          preferences: {
            theme: 'light',
            notifications: true,
            emailUpdates: true
          }
        },
        progress: {
          completedTutorials: [],
          quizScores: {},
          totalTimeSpent: 0,
          lastActivity: null,
          learningStreak: 0,
          achievements: []
        },
        subscription: {
          plan: 'admin',
          expiresAt: null
        }
      },
      {
        email: 'user@example.com',
        id: 'user_regular_001',
        name: 'Regular User',
        passwordHash: userPasswordHash,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        profile: {
          avatar: null,
          bio: 'AWS Learning Enthusiast',
          preferences: {
            theme: 'light',
            notifications: true,
            emailUpdates: true
          }
        },
        progress: {
          completedTutorials: [],
          quizScores: {},
          totalTimeSpent: 0,
          lastActivity: null,
          learningStreak: 0,
          achievements: []
        },
        subscription: {
          plan: 'free',
          expiresAt: null
        }
      }
    ];

    for (const user of users) {
      const putCommand = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(user)
      });
      
      await client.send(putCommand);
      console.log(`✅ Created user: ${user.email}`);
    }
    
    console.log('🎉 All initial users created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  }
}

// Run the script
addInitialUsers().catch(console.error); 