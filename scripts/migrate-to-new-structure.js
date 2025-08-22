const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const region = process.env.REGION || process.env.AWS_REGION || 'us-east-1';
const client = new DynamoDBClient({ region });
const dynamoDB = DynamoDBDocumentClient.from(client);

// Table names
const OLD_LESSONS_TABLE = 'aws-learning-lessons';
const NEW_SERVICES_TABLE = process.env.AWS_DYNAMODB_SERVICES_TABLE || 'aws-learning-services';
const NEW_TUTORIALS_TABLE = process.env.AWS_DYNAMODB_TUTORIALS_TABLE || 'aws-learning-tutorials';

async function migrateToNewStructure() {
  console.log('🚀 Starting migration to new table structure...');

  try {
    // Scan the old lessons table
    const result = await dynamoDB.send(new ScanCommand({
      TableName: OLD_LESSONS_TABLE,
    }));

    console.log(`📊 Found ${result.Items?.length || 0} items in old table`);

    for (const item of result.Items || []) {
      console.log(`📦 Migrating service: ${item.name || item.id}`);

      // Create service data (without tutorials)
      const serviceData = {
        id: item.id,
        name: item.name,
        description: item.description,
        icon: item.icon || '☁️',
        color: item.color || 'bg-blue-500',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save service to new services table
      await dynamoDB.send(new PutCommand({
        TableName: NEW_SERVICES_TABLE,
        Item: serviceData,
      }));

      // Migrate tutorials to separate table
      if (item.tutorials && Array.isArray(item.tutorials)) {
        for (const tutorial of item.tutorials) {
          console.log(`  📚 Migrating tutorial: ${tutorial.title}`);

          const tutorialData = {
            PK: `SERVICE#${item.id}`,
            SK: `TUTORIAL#${tutorial.id}`,
            id: tutorial.id,
            title: tutorial.title,
            description: tutorial.description,
            difficulty: tutorial.difficulty,
            estimatedTime: tutorial.estimatedTime,
            category: tutorial.category,
            prerequisites: tutorial.prerequisites || [],
            learningObjectives: tutorial.learningObjectives || [],
            steps: tutorial.steps || [],
            createdAt: tutorial.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await dynamoDB.send(new PutCommand({
            TableName: NEW_TUTORIALS_TABLE,
            Item: tutorialData,
          }));
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Migrated ${result.Items?.length || 0} services`);
    console.log(`📚 Migrated ${result.Items?.reduce((acc, item) => acc + (item.tutorials?.length || 0), 0)} tutorials`);

    // Optionally, you can uncomment the following lines to delete the old table after migration
    // console.log('🗑️  Deleting old table...');
    // await dynamoDB.send(new DeleteTableCommand({ TableName: OLD_LESSONS_TABLE }));
    // console.log('✅ Old table deleted');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateToNewStructure()
  .then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  }); 