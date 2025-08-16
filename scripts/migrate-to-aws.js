const { awsServices } = require('../data/aws-services');
const { dynamoClient, TABLES } = require('../lib/dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { uploadLessonContent, getLessonKey, getServiceKey } = require('../lib/s3');

async function migrateToAWS() {
  console.log('🚀 Starting migration to AWS...');

  try {
    // Migrate services to DynamoDB
    for (const service of awsServices) {
      console.log(`📦 Migrating service: ${service.name}`);

      // Create service metadata
      const serviceData = {
        PK: `SERVICE#${service.id}`,
        SK: 'METADATA',
        id: service.id,
        name: service.name,
        description: service.description,
        icon: service.icon,
        color: service.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to DynamoDB
      const serviceCommand = new PutCommand({
        TableName: TABLES.SERVICES,
        Item: serviceData,
      });
      await dynamoClient.send(serviceCommand);

      // Upload service metadata to S3
      await uploadLessonContent(getServiceKey(service.id), serviceData);

      // Migrate tutorials
      for (const tutorial of service.tutorials) {
        console.log(`  📚 Migrating tutorial: ${tutorial.title}`);

        const tutorialData = {
          PK: `SERVICE#${service.id}`,
          SK: `TUTORIAL#${tutorial.id}`,
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          difficulty: tutorial.difficulty,
          estimatedTime: tutorial.estimatedTime,
          category: tutorial.category,
          prerequisites: tutorial.prerequisites,
          learningObjectives: tutorial.learningObjectives,
          steps: tutorial.steps,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save to DynamoDB
        const tutorialCommand = new PutCommand({
          TableName: TABLES.TUTORIALS,
          Item: tutorialData,
        });
        await dynamoClient.send(tutorialCommand);

        // Upload tutorial content to S3
        await uploadLessonContent(getLessonKey(service.id, tutorial.id), tutorialData);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Migrated ${awsServices.length} services`);
    console.log(`📚 Migrated ${awsServices.reduce((acc, s) => acc + s.tutorials.length, 0)} tutorials`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateToAWS()
  .then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  }); 