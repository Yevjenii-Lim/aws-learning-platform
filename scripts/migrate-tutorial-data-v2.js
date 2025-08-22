const { DynamoDBClient, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = 'aws-learning-users';

// Fetch tutorial data from the API
async function fetchTutorialData() {
  try {
    const response = await fetch('http://localhost:3000/api/topics');
    const data = await response.json();
    
    if (data.success && data.data) {
      const tutorialMap = {};
      
      // Extract tutorials from all topics
      data.data.forEach(topic => {
        if (topic.tutorials && Array.isArray(topic.tutorials)) {
          topic.tutorials.forEach(tutorial => {
            tutorialMap[tutorial.id] = {
              title: tutorial.title,
              estimatedTime: tutorial.estimatedTime || '10 minutes'
            };
          });
        }
      });
      
      console.log(`Found ${Object.keys(tutorialMap).length} tutorials from API`);
      return tutorialMap;
    }
  } catch (error) {
    console.error('Error fetching tutorial data from API:', error);
  }
  
  // Fallback to hardcoded data if API fails
  return {
    'create-vpc': { title: 'Create a VPC', estimatedTime: '15 minutes' },
    'launch-instance': { title: 'Launch EC2 Instance', estimatedTime: '20 minutes' },
    'create-bucket': { title: 'Create S3 Bucket', estimatedTime: '10 minutes' },
    'setup-rds': { title: 'Setup RDS Database', estimatedTime: '25 minutes' },
    'configure-alb': { title: 'Configure Application Load Balancer', estimatedTime: '18 minutes' },
    'setup-ecs': { title: 'Setup ECS Cluster', estimatedTime: '30 minutes' },
    'create-lambda': { title: 'Create Lambda Function', estimatedTime: '12 minutes' },
    'setup-cloudfront': { title: 'Setup CloudFront Distribution', estimatedTime: '15 minutes' }
  };
}

function parseEstimatedTime(timeString) {
  if (!timeString) return 0;
  
  // Try to match explicit time formats first (e.g., "10 minutes", "2 hours")
  const timeMatch = timeString.match(/(\d+)\s*(minute|hour|h|m)/i);
  if (timeMatch) {
    const value = parseInt(timeMatch[1]);
    const unit = timeMatch[2].toLowerCase();
    
    if (unit === 'hour' || unit === 'h') {
      return value * 60;
    } else if (unit === 'minute' || unit === 'm') {
      return value;
    }
  }
  
  // If no explicit time format, try to parse as just a number (assume minutes)
  const numberMatch = timeString.match(/^(\d+)$/);
  if (numberMatch) {
    return parseInt(numberMatch[1]);
  }
  
  // If still no match, try to extract any number from the string
  const anyNumberMatch = timeString.match(/(\d+)/);
  if (anyNumberMatch) {
    return parseInt(anyNumberMatch[1]);
  }
  
  return 0;
}

async function migrateTutorialData() {
  try {
    console.log('Starting tutorial data migration (v2)...');
    
    // Fetch tutorial data from API
    const tutorialData = await fetchTutorialData();
    
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
      
      // Calculate total time spent
      const totalTimeSpent = newCompletedTutorials.reduce((total, tutorial) => {
        return total + parseEstimatedTime(tutorial.estimatedTime);
      }, 0);
      
      // Update the user
      await client.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ email: user.email, id: user.id }),
        UpdateExpression: 'SET progress.completedTutorials = :completedTutorials, progress.totalTimeSpent = :totalTimeSpent',
        ExpressionAttributeValues: marshall({
          ':completedTutorials': newCompletedTutorials,
          ':totalTimeSpent': totalTimeSpent
        })
      }));
      
      console.log(`Migrated user ${user.email}: ${completedTutorials.length} tutorials, ${totalTimeSpent} minutes total`);
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