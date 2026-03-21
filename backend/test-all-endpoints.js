/**
 * Comprehensive endpoint test script
 * Tests all major features and endpoints
 */
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const StartupProfile = require('./models/StartupProfile');
const SupporterProfile = require('./models/SupporterProfile');

function httpRequest(method, path, body, cookie) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers['Cookie'] = cookie;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const req = http.request({ hostname: 'localhost', port: 5000, path, method, headers }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(responseBody) }); }
        catch { resolve({ status: res.statusCode, data: responseBody }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testEndpoints() {
  console.log('=== COMPREHENSIVE ENDPOINT TESTS ===\n');
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  const tests = [];

  // Test 1: Health Check
  console.log('🧪 TEST: Health Check');
  const health = await httpRequest('GET', '/api/health');
  console.log(`   Status: ${health.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Response: ${health.data.status}\n`);
  tests.push({ name: 'Health Check', pass: health.status === 200 });

  // Test 2: Database Check
  console.log('🧪 TEST: Database Check');
  const dbcheck = await httpRequest('GET', '/api/db-check');
  console.log(`   Status: ${dbcheck.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   DB Connected: ${dbcheck.data.connected}\n`);
  tests.push({ name: 'Database Check', pass: dbcheck.status === 200 && dbcheck.data.connected });

  // Test 3: Get All Supporters
  console.log('🧪 TEST: Get All Supporters (GET /api/supporters)');
  const supporters = await httpRequest('GET', '/api/supporters');
  console.log(`   Status: ${supporters.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Found: ${Array.isArray(supporters.data) ? supporters.data.length : 0} supporters\n`);
  tests.push({ name: 'Get All Supporters', pass: supporters.status === 200 && Array.isArray(supporters.data) });

  // Test 4: Get All Startups
  console.log('🧪 TEST: Get All Startups (GET /api/startups)');
  const startups = await httpRequest('GET', '/api/startups');
  console.log(`   Status: ${startups.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Found: ${Array.isArray(startups.data) ? startups.data.length : 0} startups\n`);
  tests.push({ name: 'Get All Startups', pass: startups.status === 200 && Array.isArray(startups.data) });

  // Test 5: Get A Specific Startup
  if (Array.isArray(startups.data) && startups.data.length > 0) {
    const startup = startups.data[0];
    console.log(`🧪 TEST: Get Specific Startup (GET /api/startups/${startup._id})`);
    const specificStartup = await httpRequest('GET', `/api/startups/${startup._id}`);
    console.log(`   Status: ${specificStartup.status === 200 ? '✅ PASS' : '❌ FAIL'}\n`);
    tests.push({ name: 'Get Specific Startup', pass: specificStartup.status === 200 });
  }

  // Test 6: Get A Specific Supporter
  if (Array.isArray(supporters.data) && supporters.data.length > 0) {
    const supporter = supporters.data[0];
    console.log(`🧪 TEST: Get Specific Supporter (GET /api/supporters/${supporter._id})`);
    const specificSupporter = await httpRequest('GET', `/api/supporters/${supporter._id}`);
    console.log(`   Status: ${specificSupporter.status === 200 ? '✅ PASS' : '❌ FAIL'}\n`);
    tests.push({ name: 'Get Specific Supporter', pass: specificSupporter.status === 200 });
  }

  // Test 7: Auth Routes - Forgot Password (should work without auth)
  console.log('🧪 TEST: Forgot Password (POST /api/auth/forgot-password)');
  const forgotPassword = await httpRequest('POST', '/api/auth/forgot-password', { 
    email: 'test@example.com'
  });
  console.log(`   Status: ${forgotPassword.status >= 200 && forgotPassword.status < 400 ? '✅ PASS' : '❌ FAIL'}\n`);
  tests.push({ name: 'Forgot Password', pass: forgotPassword.status >= 200 && forgotPassword.status < 400 });

  // Test 8: Get All Connections
  console.log('🧪 TEST: Get All Connections (GET /api/connections) - without auth (should fail with 401)');
  const connections = await httpRequest('GET', '/api/connections');
  console.log(`   Status: ${connections.status === 401 ? '✅ PASS (Expected 401)' : `❌ FAIL (Got ${connections.status})`}\n`);
  tests.push({ name: 'Auth Protection on Connections', pass: connections.status === 401 });

  // Test 9: Get All Reviews
  console.log('🧪 TEST: Get All Reviews (GET /api/reviews)');
  const reviews = await httpRequest('GET', '/api/reviews');
  console.log(`   Status: ${reviews.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Response: ${Array.isArray(reviews.data) ? `Found ${reviews.data.length} reviews` : 'Error'}\n`);
  tests.push({ name: 'Get All Reviews', pass: reviews.status === 200 });

  // Test 10: Get All Notifications
  console.log('🧪 TEST: Get All Notifications (GET /api/notifications) - without auth (should fail)');
  const notifications = await httpRequest('GET', '/api/notifications');
  console.log(`   Status: ${notifications.status === 401 ? '✅ PASS (Expected 401)' : `❌ FAIL (Got ${notifications.status})`}\n`);
  tests.push({ name: 'Auth Protection on Notifications', pass: notifications.status === 401 });

  // Test 11: AI Routes Status
  console.log('🧪 TEST: AI Routes (POST /api/ai/assurance) - without auth (should fail)');
  const aiNoAuth = await httpRequest('POST', '/api/ai/assurance', { startupId: 'test' });
  console.log(`   Status: ${aiNoAuth.status === 401 ? '✅ PASS (Expected 401)' : `❌ FAIL (Got ${aiNoAuth.status})`}\n`);
  tests.push({ name: 'Auth Protection on AI Routes', pass: aiNoAuth.status === 401 });

  // Summary
  console.log('═══════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════');
  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  console.log(`\n✅ Passed: ${passed}/${total}`);
  if (passed === total) {
    console.log('🎉 All endpoint tests PASSED!');
  } else {
    console.log(`⚠️  ${total - passed} test(s) failed.\n`);
    console.log('Failed tests:');
    tests.filter(t => !t.pass).forEach(t => console.log(`  - ${t.name}`));
  }

  await mongoose.disconnect();
}

testEndpoints().catch(e => {
  console.error('❌', e.message);
  mongoose.disconnect();
  process.exit(1);
});
