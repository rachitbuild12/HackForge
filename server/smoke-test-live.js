import express from 'express';
import dotenv from 'dotenv';
import { createTinyFishRouter } from './tinyfishRoutes.js';

dotenv.config();

async function runLiveSmokeTest() {
  console.log('🐟 Executing Single Live Smoke Test against TinyFish Agent API...');

  const app = express();
  app.use(express.json());
  app.use('/api/tinyfish', createTinyFishRouter());

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const res = await fetch(`${baseUrl}/api/tinyfish/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://docs.github.com/en/rest',
        goal: 'Identify the authentication header and rate limit documentation in the GitHub REST API quickstart.',
        browser_profile: 'lite'
      })
    });

    console.log(`📡 Response Status: ${res.status} ${res.statusText}`);
    console.log(`📡 Content-Type: ${res.headers.get('content-type')}`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('❌ Upstream Error:', JSON.stringify(err, null, 2));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let eventCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) {
          eventCount++;
          try {
            const parsed = JSON.parse(trimmed.slice(5).trim());
            console.log(`   ⚡ Event #${eventCount} received: [${parsed.type}] ${parsed.purpose || parsed.status || ''}`);
            if (parsed.type === 'STREAMING_URL') {
              console.log(`      🎥 Streaming URL provisioned: ${parsed.streaming_url ? 'Yes' : 'No'}`);
            }
            if (parsed.type === 'COMPLETE') {
              console.log(`      🏁 Completion Status: ${parsed.status}`);
              if (parsed.result) {
                console.log(`      📝 Result preview: ${typeof parsed.result === 'object' ? JSON.stringify(parsed.result).slice(0, 150) : String(parsed.result).slice(0, 150)}...`);
              }
            }
          } catch {
            console.log(`   ⚡ Event #${eventCount} raw chunk: ${trimmed.slice(0, 80)}`);
          }
        }
      }
    }

    console.log(`\n🎉 Live smoke test finished! Received ${eventCount} real-time SSE events from TinyFish.`);
  } catch (err) {
    console.error('❌ Smoke test exception:', err);
  } finally {
    server.close();
  }
}

runLiveSmokeTest();
