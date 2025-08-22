const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB client
const region = process.env.REGION || process.env.AWS_REGION || 'us-east-1';
const client = new DynamoDBClient({ region });

// Table names
const SERVICES_TABLE = process.env.AWS_DYNAMODB_SERVICES_TABLE || 'aws-learning-services';
const TUTORIALS_TABLE = process.env.AWS_DYNAMODB_TUTORIALS_TABLE || 'aws-learning-tutorials';

async function createServicesTables() {
  console.log('🚀 Creating services and tutorials tables...');

  const tables = [
    {
      TableName: SERVICES_TABLE,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    },
    {
      TableName: TUTORIALS_TABLE,
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }
  ];

  for (const table of tables) {
    try {
      await client.send(new CreateTableCommand(table));
      console.log(`✅ Created table: ${table.TableName}`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`ℹ️  Table ${table.TableName} already exists`);
      } else {
        console.error(`❌ Error creating table ${table.TableName}:`, error);
      }
    }
  }

  console.log('🎉 Services tables creation completed!');
}

// Run the script
createServicesTables()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }); 