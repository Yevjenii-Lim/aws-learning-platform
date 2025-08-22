const { DynamoDBClient, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = 'aws-learning-users';

// Tutorial data mapping for estimated times
const tutorialData = {
  'create-vpc': { title: 'Create a VPC', estimatedTime: '15 minutes' },
  'launch-instance': { title: 'Launch EC2 Instance', estimatedTime: '20 minutes' },
  'create-bucket': { title: 'Create S3 Bucket', estimatedTime: '10 minutes' },
  // Add more tutorials as needed
};

function parseEstimatedTime(timeString) {
  if (!timeString) return 0;
  
  const match = timeString.match(/(\d+)\s*minutes?/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  return 0;
}

async function migrateTutorialData() {
  try {
    console.log('Starting tutorial data migration...');
    
    // Scan all users
    const result = await client.send(new ScanCommand({
      TableName: TABLE_NAME
    }));
    
    if (!result.Items || result.Items.length === 0) {
      console.log('No users found to migrate.');
      return;
    }
    
    console.log(`Found ${result.Items.length} users to process.`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const item of result.Items) {
      const user = unmarshall(item);
      
      if (!user.progress || !user.progress.completedTutorials) {
        skippedCount++;
        continue;
      }
      
      const completedTutorials = user.progress.completedTutorials;
      
      // Check if already in new format
      if (completedTutorials.length > 0 && typeof completedTutorials[0] === 'object') {
        console.log(`User ${user.email} already has new format, skipping.`);
        skippedCount++;
        continue;
      }
      
      // Convert string array to detailed object array
      const newCompletedTutorials = completedTutorials.map(tutorialId => {
        const tutorialInfo = tutorialData[tutorialId] || {
          title: `Tutorial ${tutorialId}`,
          estimatedTime: '10 minutes' // Default fallback
        };
        
        return {
          tutorialId,
          title: tutorialInfo.title,
          estimatedTime: tutorialInfo.estimatedTime,
          completedAt: new Date().toISOString() // Use current time as fallback
        };
      });
      
      // Update the user
      await client.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ email: user.email, id: user.id }),
        UpdateExpression: 'SET progress.completedTutorials = :completedTutorials',
        ExpressionAttributeValues: marshall({
          ':completedTutorials': newCompletedTutorials
        })
      }));
      
      console.log(`Migrated user ${user.email}: ${completedTutorials.length} tutorials`);
      migratedCount++;
    }
    
    console.log(`\nMigration completed!`);
    console.log(`- Migrated: ${migratedCount} users`);
    console.log(`- Skipped: ${skippedCount} users`);
    
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run the migration
migrateTutorialData(); 