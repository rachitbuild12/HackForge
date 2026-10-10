import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import assert from 'assert';
import {
  generateGitHubAppJWT,
  verifyWebhookSignature,
  normalizeGitHubActivities
} from './githubAppService.js';
import { createGitHubAppRouter } from './githubAppRoutes.js';

async function runGitHubAppTests() {
  console.log('🤖 Starting GitHub App Integration Test Suite...\n');

  // -------------------------------------------------------------
  // TEST 1: RS256 JWT Generation & Verification
  // -------------------------------------------------------------
  console.log('1️⃣ Testing RS256 JWT Generation & Cryptographic Verification...');
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  const testAppId = '123456';
  const jwt = generateGitHubAppJWT(testAppId, privateKey);
  assert.ok(jwt, 'JWT was generated');
  const [headerB64, payloadB64, sigB64] = jwt.split('.');
  assert.ok(headerB64 && payloadB64 && sigB64, 'JWT has 3 base64url components');

  // Verify header & payload
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
  assert.strictEqual(header.alg, 'RS256');
  assert.strictEqual(header.typ, 'JWT');
  assert.strictEqual(payload.iss, testAppId);
  assert.ok(payload.exp > payload.iat, 'Expiration is strictly in the future');
  assert.ok(payload.exp - payload.iat <= 660, 'Expiration does not exceed GitHub maximum of 10 minutes');

  // Verify signature with public key
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerB64}.${payloadB64}`);
  const isSignatureValid = verifier.verify(publicKey, sigB64, 'base64url');
  assert.strictEqual(isSignatureValid, true, 'Cryptographic signature is valid');
  console.log('   ✅ RS256 JWT generation and validation verified.');

  // -------------------------------------------------------------
  // TEST 2: Webhook HMAC-SHA256 Signature Verification
  // -------------------------------------------------------------
  console.log('2️⃣ Testing Webhook HMAC-SHA256 Signature Verification...');
  const webhookSecret = 'test_webhook_secret_key_8849';
  const rawPayload = Buffer.from(JSON.stringify({ zen: 'Mind your words.', hook_id: 999 }));

  // Valid signature
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(rawPayload);
  const validSig = `sha256=${hmac.digest('hex')}`;
  assert.strictEqual(verifyWebhookSignature(rawPayload, validSig, webhookSecret), true);

  // Tampered payload
  const tamperedPayload = Buffer.from(JSON.stringify({ zen: 'Tampered words.', hook_id: 999 }));
  assert.strictEqual(verifyWebhookSignature(tamperedPayload, validSig, webhookSecret), false);

  // Invalid signature / missing secret
  assert.strictEqual(verifyWebhookSignature(rawPayload, 'sha256=invalidhex', webhookSecret), false);
  assert.strictEqual(verifyWebhookSignature(rawPayload, validSig, ''), false);
  console.log('   ✅ Webhook HMAC verification correctly accepts valid and rejects tampered signatures.');

  // -------------------------------------------------------------
  // TEST 3: Telemetry Normalization
  // -------------------------------------------------------------
  console.log('3️⃣ Testing GitHub Telemetry Normalization (ProjectActivity Schema)...');
  const mockCommits = [
    {
      sha: 'a1b2c3d4e5f6',
      html_url: 'https://github.com/org/repo/commit/a1b2c3d',
      commit: {
        message: 'feat: implement cryptographic passport verification\n\nFull details here',
        author: { name: 'Sophia Zhang', date: '2026-10-10T10:00:00Z' },
        verification: { verified: true }
      },
      author: { login: 'sophiaz', avatar_url: 'https://example.com/avatar.png' }
    }
  ];

  const mockPulls = [
    {
      id: 901,
      number: 14,
      title: 'Fix CORS middleware in API gateway',
      state: 'closed',
      merged_at: '2026-10-10T11:00:00Z',
      html_url: 'https://github.com/org/repo/pull/14',
      created_at: '2026-10-10T10:30:00Z',
      user: { login: 'arjun-ml' }
    }
  ];

  const activities = normalizeGitHubActivities('test-proj', mockCommits, mockPulls, []);
  assert.strictEqual(activities.length, 2);
  assert.strictEqual(activities[0].type, 'PULL_REQUEST'); // newest first
  assert.strictEqual(activities[0].merged, true);
  assert.strictEqual(activities[1].type, 'COMMIT');
  assert.strictEqual(activities[1].hash, 'a1b2c3d');
  assert.strictEqual(activities[1].title, 'feat: implement cryptographic passport verification');
  console.log('   ✅ Telemetry normalized into HackForge schema accurately.');

  // -------------------------------------------------------------
  // TEST 4: Express Router Endpoints & Security
  // -------------------------------------------------------------
  console.log('4️⃣ Testing Express Router Endpoints & CSRF / Webhook Protections...');
  const app = express();
  app.use(cookieParser());
  app.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));

  const testStore = new Map();
  // Set mock environment variables for test router
  process.env.GITHUB_APP_SLUG = 'test-hackforge-app';
  process.env.GITHUB_WEBHOOK_SECRET = webhookSecret;

  const router = createGitHubAppRouter(testStore);
  app.use('/api/github/app', router);

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 4.1 Status endpoint
    const statusRes = await fetch(`${baseUrl}/api/github/app/status`);
    assert.strictEqual(statusRes.status, 200);
    const statusData = await statusRes.json();
    assert.strictEqual(statusData.success, true);
    assert.strictEqual(statusData.permissions.metadata, 'read');
    assert.strictEqual(statusData.permissions.contents, 'read');

    // 4.2 CSRF mismatch on callback
    const csrfFailRes = await fetch(`${baseUrl}/api/github/app/callback?installation_id=12345&state=invalid_csrf_state`, {
      redirect: 'manual'
    });
    // Redirects to error URL
    assert.strictEqual(csrfFailRes.status, 302);
    const redirectLocation = csrfFailRes.headers.get('location');
    assert.ok(redirectLocation.includes('CSRF_STATE_MISMATCH') || redirectLocation.includes('CSRF'));
    console.log('   ✅ Callback rejected invalid CSRF state.');

    // 4.3 Webhook signature validation endpoint
    const validWebhookRes = await fetch(`${baseUrl}/api/github/app/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': validSig,
        'x-github-event': 'push',
        'x-github-delivery': 'del_123'
      },
      body: rawPayload
    });
    assert.strictEqual(validWebhookRes.status, 200);
    const webhookData = await validWebhookRes.json();
    assert.strictEqual(webhookData.received, true);
    assert.strictEqual(webhookData.event, 'push');
    console.log('   ✅ Webhook accepted valid signature with HTTP 200.');

    // 4.4 Webhook invalid signature rejection
    const invalidWebhookRes = await fetch(`${baseUrl}/api/github/app/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': 'sha256=badf00d',
        'x-github-event': 'push',
        'x-github-delivery': 'del_124'
      },
      body: rawPayload
    });
    assert.strictEqual(invalidWebhookRes.status, 401);
    const invalidData = await invalidWebhookRes.json();
    assert.strictEqual(invalidData.error, 'INVALID_SIGNATURE');
    console.log('   ✅ Webhook rejected invalid signature with HTTP 401.');

    // 4.5 Disconnect endpoint
    const disconnectRes = await fetch(`${baseUrl}/api/github/app/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: 'test-proj' })
    });
    assert.strictEqual(disconnectRes.status, 200);
    const disconnectData = await disconnectRes.json();
    assert.strictEqual(disconnectData.success, true);
    console.log('   ✅ Disconnect endpoint cleared repository cleanly.');

    console.log('\n🏆 ALL GITHUB APP INTEGRATION TESTS PASSED (100%)!');
  } finally {
    server.close();
  }
}

runGitHubAppTests().catch(err => {
  console.error('❌ Test failure:', err);
  process.exit(1);
});
