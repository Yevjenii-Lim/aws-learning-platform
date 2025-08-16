const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

const LESSONS_TABLE = 'aws-learning-lessons';
const TOPICS_TABLE = 'aws-learning-topics';

async function migrateTutorials() {
  try {
    console.log('Starting tutorial migration...');

    // 1. Get all lessons (old structure)
    const lessonsResult = await dynamoDB.send(new ScanCommand({
      TableName: LESSONS_TABLE
    }));

    console.log(`Found ${lessonsResult.Items.length} lessons`);

    // 2. Get all topics (new structure)
    const topicsResult = await dynamoDB.send(new ScanCommand({
      TableName: TOPICS_TABLE
    }));

    console.log(`Found ${topicsResult.Items.length} topics`);

    // 3. Create a mapping from service IDs to topic IDs
    const serviceToTopicMap = {
      'vpc': 'networking',
      'ec2': 'compute', 
      's3': 'storage',
      'rds': 'storage',
      'lambda': 'serverless',
      'ecs': 'serverless',
      'cloudwatch': 'monitoring',
      'iam': 'security'
    };

    // 4. Process each lesson and migrate its tutorials
    for (const lesson of lessonsResult.Items) {
      if (lesson.tutorials && Array.isArray(lesson.tutorials) && lesson.tutorials.length > 0) {
        console.log(`Processing lesson: ${lesson.name} (${lesson.id})`);
        
        // Find the corresponding topic
        const topicId = serviceToTopicMap[lesson.id];
        if (!topicId) {
          console.log(`No topic mapping found for service ${lesson.id}, skipping...`);
          continue;
        }

        const topic = topicsResult.Items.find(t => t.id === topicId);
        if (!topic) {
          console.log(`Topic ${topicId} not found, skipping...`);
          continue;
        }

        console.log(`Migrating tutorials to topic: ${topic.name}`);

        // Add tutorials to the topic
        const existingTutorials = topic.tutorials || [];
        const newTutorials = [...existingTutorials];

        lesson.tutorials.forEach(tutorial => {
          // Check if tutorial already exists
          const existingIndex = newTutorials.findIndex(t => t.id === tutorial.id);
          if (existingIndex >= 0) {
            console.log(`Tutorial ${tutorial.id} already exists in topic, updating...`);
            newTutorials[existingIndex] = {
              ...tutorial,
              topicId: topicId
            };
          } else {
            console.log(`Adding tutorial ${tutorial.id} to topic ${topicId}`);
            newTutorials.push({
              ...tutorial,
              topicId: topicId
            });
          }
        });

        // Update the topic with new tutorials
        await dynamoDB.send(new PutCommand({
          TableName: TOPICS_TABLE,
          Item: {
            ...topic,
            tutorials: newTutorials,
            tutorialCount: newTutorials.length
          }
        }));

        console.log(`Successfully migrated ${lesson.tutorials.length} tutorials to topic ${topic.name}`);
      }
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateTutorials(); 