// Test script for mobile API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5003';

async function testMobileAPI() {
  console.log('🧪 Testing Mobile API Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get Categories
    console.log('2. Testing Get Categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/mobile/categories`);
    console.log('✅ Categories:', categoriesResponse.data);
    console.log('');

    // Test 3: Get Priorities
    console.log('3. Testing Get Priorities...');
    const prioritiesResponse = await axios.get(`${BASE_URL}/api/mobile/priorities`);
    console.log('✅ Priorities:', prioritiesResponse.data);
    console.log('');

    // Test 4: Submit Test Report
    console.log('4. Testing Report Submission...');
    const testReport = {
      title: 'Test Mobile Report',
      description: 'This is a test report from mobile API integration',
      category: 'pothole',
      priority: 'medium',
      location: 'Test Location, Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      citizen_name: 'Test User',
      citizen_phone: '+91-9876543210',
      citizen_email: 'test@example.com'
    };

    const reportResponse = await axios.post(`${BASE_URL}/api/mobile/reports`, testReport);
    console.log('✅ Report Submitted:', reportResponse.data);
    const reportId = reportResponse.data.data.id;
    console.log('');

    // Test 5: Get Report Status
    if (reportId) {
      console.log('5. Testing Get Report Status...');
      const statusResponse = await axios.get(`${BASE_URL}/api/mobile/reports/${reportId}`);
      console.log('✅ Report Status:', statusResponse.data);
      console.log('');
    }

    // Test 6: Get User Reports
    console.log('6. Testing Get User Reports...');
    const userReportsResponse = await axios.get(`${BASE_URL}/api/mobile/reports?phone=+91-9876543210`);
    console.log('✅ User Reports:', userReportsResponse.data);
    console.log('');

    console.log('🎉 All Mobile API Tests Passed!');
    console.log('\n📱 Your Kotlin app can now integrate using these endpoints.');
    console.log(`🔗 Base URL: ${BASE_URL}`);

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
}

// Run tests
testMobileAPI();