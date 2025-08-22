// Test script for parseEstimatedTime function
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

// Test cases
const testCases = [
  '10 minutes',
  '2 hours',
  '30m',
  '1h',
  '15',
  '45',
  '1.5 hours',
  'invalid',
  '',
  '10 minutes and 30 seconds',
  '5',
  '120'
];

console.log('Testing parseEstimatedTime function:');
console.log('=====================================');

testCases.forEach(testCase => {
  const result = parseEstimatedTime(testCase);
  console.log(`"${testCase}" -> ${result} minutes`);
});

console.log('\nExpected behavior:');
console.log('- "10 minutes" -> 10 minutes');
console.log('- "2 hours" -> 120 minutes');
console.log('- "15" -> 15 minutes');
console.log('- "45" -> 45 minutes');
console.log('- "invalid" -> 0 minutes');
console.log('- "" -> 0 minutes'); 