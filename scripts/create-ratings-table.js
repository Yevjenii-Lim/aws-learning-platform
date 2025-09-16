const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = 'aws-learning-tutorial-ratings';

async function createRatingsTable() {
  try {
    // Check if table already exists
    try {
      await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      console.log(`✅ Table ${TABLE_NAME} already exists`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Create the table
    const command = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'tutorialId',
          KeyType: 'HASH' // Partition key
        },
        {
          AttributeName: 'userId',
          KeyType: 'RANGE' // Sort key
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'tutorialId',
          AttributeType: 'S'
        },
        {
          AttributeName: 'userId',
          AttributeType: 'S'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      Tags: [
        {
          Key: 'Project',
          Value: 'AWS Learning Platform'
        },
        {
          Key: 'Environment',
          Value: 'Production'
        }
      ]
    });

    const result = await client.send(command);
    console.log(`✅ Created table ${TABLE_NAME}:`, result.TableDescription.TableStatus);

    // Wait for table to be active
    console.log('⏳ Waiting for table to become active...');
    let tableStatus = 'CREATING';
    while (tableStatus === 'CREATING') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const describeResult = await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      tableStatus = describeResult.Table.TableStatus;
      console.log(`   Table status: ${tableStatus}`);
    }

    if (tableStatus === 'ACTIVE') {
      console.log(`🎉 Table ${TABLE_NAME} is now active and ready to use!`);
    } else {
      console.log(`❌ Table creation failed with status: ${tableStatus}`);
    }

  } catch (error) {
    console.error('❌ Error creating ratings table:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createRatingsTable()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createRatingsTable };
