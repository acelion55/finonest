// Test script to verify API endpoints
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  const endpoints = [
    `${API_URL}/creditcard-applications/all`,
    `${API_URL}/personal-loan-applications/all`,
    `${API_URL}/car-loan-applications/all`,
    `${API_URL}/offline-applications/all`,
    `${API_URL}/business-loan-applications/all`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Data count: ${data.data?.length || 0}`);
      console.log('---\n');
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

testEndpoints();
