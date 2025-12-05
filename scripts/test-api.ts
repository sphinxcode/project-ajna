/**
 * Test script for Human Design API
 * Run with: npx tsx scripts/test-api.ts
 */

const API_URL = 'https://humandesignmcp-production.up.railway.app';
const API_TOKEN = 'dGhpc0lzQVNlY3VyZVJhbmRvbUtleUZvclJhaWx3YXlBcGkxMjM0NTY3ODkw';

async function testHealthCheck() {
  console.log('Testing health check...');
  const response = await fetch(`${API_URL}/health`);
  const data = await response.json();
  console.log('Health check response:', JSON.stringify(data, null, 2));
  return data;
}

async function testChartCalculation() {
  console.log('\nTesting chart calculation...');

  const birthData = {
    birthDate: '1993-02-05',
    birthTime: '11:53',
    birthLocation: 'Manila, Philippines'
  };

  console.log('Request body:', JSON.stringify(birthData, null, 2));

  const response = await fetch(`${API_URL}/api/human-design`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(birthData),
  });

  console.log('Response status:', response.status);

  const data = await response.json();
  console.log('Chart calculation response:', JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  try {
    await testHealthCheck();
    await testChartCalculation();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
