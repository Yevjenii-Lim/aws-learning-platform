const { DynamoDBClient, CreateTableCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');

const client = new DynamoDBClient({ region: 'us-east-1' });

const TABLE_NAME = 'aws-learning-users';

async function createUsersTable() {
  try {
    console.log('Creating users table...');
    
    const createTableCommand = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'id', KeyType: 'RANGE' }    // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'email', AttributeType: 'S' },
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'id-index',
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          }
        }
      ]
    });

    await client.send(createTableCommand);
    console.log('✅ Users table created successfully!');
    
    // Wait for table to be active
    console.log('Waiting for table to be active...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Create initial admin user
    await createInitialUsers();
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Table already exists, creating initial users...');
      await createInitialUsers();
    } else {
      console.error('❌ Error creating table:', error);
    }
  }
}

async function createInitialUsers() {
  try {
    console.log('Creating initial users...');
    
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
createUsersTable().catch(console.error); 