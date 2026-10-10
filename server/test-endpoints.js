import express from 'express';
import assert from 'assert';
import { createTinyFishRouter } from './tinyfishRoutes.js';

async function runEndpointTests() {
  console.log('🚀 Starting TinyFish API Endpoint Tests...');

  const app = express();
  app.use(express.json());
  app.use('/api/tinyfish', createTinyFishRouter());

  // Start on an available test port
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Test GET /api/tinyfish/status
    console.log('1️⃣ Testing GET /api/tinyfish/status...');
    const statusRes = await fetch(`${baseUrl}/api/tinyfish/status`);
    assert.strictEqual(statusRes.status, 200);
    const statusData = await statusRes.json();
    assert.strictEqual(typeof statusData.configured, 'boolean');
    assert.strictEqual(statusData.provider, 'TinyFish Web Agent');
    console.log('   ✅ Status endpoint returned correct metadata.');

    // 2. Test Missing API Key behavior
    console.log('2️⃣ Testing Missing API Key behavior...');
    const originalKey = process.env.TINYFISH_API_KEY;
    delete process.env.TINYFISH_API_KEY;

    const noKeyRes = await fetch(`${baseUrl}/api/tinyfish/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://docs.github.com/en/rest',
        goal: 'Explore REST API documentation'
      })
    });
    assert.strictEqual(noKeyRes.status, 500);
    const noKeyData = await noKeyRes.json();
    assert.strictEqual(noKeyData.error, 'MISSING_API_KEY');
    console.log('   ✅ Missing API key rejected with HTTP 500 MISSING_API_KEY.');

    // Restore key or set test key for validation tests
    process.env.TINYFISH_API_KEY = 'test_key_for_local_validation';

    // 3. Test Invalid URL format
    console.log('3️⃣ Testing Invalid URL format...');
    const invalidUrlRes = await fetch(`${baseUrl}/api/tinyfish/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'not-a-valid-url',
        goal: 'Explore documentation'
      })
    });
    assert.strictEqual(invalidUrlRes.status, 400);
    const invalidUrlData = await invalidUrlRes.json();
    assert.strictEqual(invalidUrlData.error, 'INVALID_URL');
    console.log('   ✅ Invalid URL format rejected with HTTP 400 INVALID_URL.');

    // 4. Test SSRF Protection (localhost / private IPs)
    console.log('4️⃣ Testing SSRF Protection against localhost and private subnets...');
    const ssrfRes = await fetch(`${baseUrl}/api/tinyfish/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'http://localhost:3000/internal-metrics',
        goal: 'Attempt internal SSRF access'
      })
    });
    assert.strictEqual(ssrfRes.status, 400);
    const ssrfData = await ssrfRes.json();
    assert.strictEqual(ssrfData.error, 'INVALID_URL');
    assert.ok(ssrfData.message.includes('prohibited'));
    console.log('   ✅ SSRF localhost target successfully blocked.');

    // 5. Test Missing / Short Goal
    console.log('5️⃣ Testing Missing Goal validation...');
    const invalidGoalRes = await fetch(`${baseUrl}/api/tinyfish/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://docs.github.com/en/rest',
        goal: 'hi'
      })
    });
    assert.strictEqual(invalidGoalRes.status, 400);
    const invalidGoalData = await invalidGoalRes.json();
    assert.strictEqual(invalidGoalData.error, 'INVALID_GOAL');
    console.log('   ✅ Short goal rejected with HTTP 400 INVALID_GOAL.');

    // Clean up test key
    if (originalKey) {
      process.env.TINYFISH_API_KEY = originalKey;
    } else {
      delete process.env.TINYFISH_API_KEY;
    }

    console.log('\n🏆 ALL 5 ENDPOINT TESTS PASSED COMPLETELY!');
  } finally {
    server.close();
  }
}

runEndpointTests().catch(err => {
  console.error('❌ Endpoint test failure:', err);
  process.exit(1);
});
