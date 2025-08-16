const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config({ path: '.env.local' });

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const tables = [
  {
    TableName: 'aws-learning-flashcards',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'aws-learning-quiz',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

async function createTables() {
  console.log('🚀 Creating DynamoDB tables for games data...');
  
  for (const table of tables) {
    try {
      await client.send(new CreateTableCommand(table));
      console.log(`✅ Created table: ${table.TableName}`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`ℹ️  Table ${table.TableName} already exists`);
      } else {
        console.error(`❌ Error creating table ${table.TableName}:`, error.message);
      }
    }
  }
  
  console.log('🎉 Table creation completed!');
}

createTables().catch(console.error); 