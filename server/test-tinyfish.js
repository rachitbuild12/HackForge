import assert from 'assert';
import { validateTargetUrl, validateResearchGoal } from './tinyfishService.js';

console.log('🧪 Testing TinyFish Service URL & SSRF Validation...');

// 1. Valid URLs
assert.strictEqual(validateTargetUrl('https://docs.github.com/en/rest').valid, true);
assert.strictEqual(validateTargetUrl('http://example.com/api').valid, true);

// 2. Invalid Protocol
assert.strictEqual(validateTargetUrl('ftp://example.com').valid, false);
assert.strictEqual(validateTargetUrl('javascript:alert(1)').valid, false);
assert.strictEqual(validateTargetUrl('file:///etc/passwd').valid, false);

// 3. Prohibited Loopback & Localhost
assert.strictEqual(validateTargetUrl('http://localhost:3000').valid, false);
assert.strictEqual(validateTargetUrl('http://127.0.0.1:8080').valid, false);
assert.strictEqual(validateTargetUrl('http://0.0.0.0').valid, false);

// 4. Prohibited Private IP subnets
assert.strictEqual(validateTargetUrl('http://10.0.0.1/admin').valid, false);
assert.strictEqual(validateTargetUrl('http://192.168.1.1/setup').valid, false);
assert.strictEqual(validateTargetUrl('http://172.16.0.5/api').valid, false);
assert.strictEqual(validateTargetUrl('http://169.254.169.254/latest/meta-data').valid, false);

// 5. Prohibited Internal Domains
assert.strictEqual(validateTargetUrl('http://service.internal/status').valid, false);
assert.strictEqual(validateTargetUrl('http://node.local/data').valid, false);
assert.strictEqual(validateTargetUrl('http://metadata.google.internal').valid, false);

console.log('✅ URL & SSRF validation passed completely.');

console.log('🧪 Testing TinyFish Research Goal Validation...');
assert.strictEqual(validateResearchGoal('').valid, false);
assert.strictEqual(validateResearchGoal('abc').valid, false); // < 5 chars
assert.strictEqual(validateResearchGoal('Explore GitHub API documentation and summarize commit endpoints').valid, true);
assert.strictEqual(validateResearchGoal('a'.repeat(3005)).valid, false); // > 3000 chars

console.log('✅ Research goal validation passed completely.');
console.log('🎉 All TinyFish service unit tests passed!');
