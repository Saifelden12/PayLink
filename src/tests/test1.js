const assert = require('assert');

const BASE = 'http://localhost:5000';

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await fetch(BASE);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('Server did not start');
}

async function main() {
  try {
    await waitForServer();
    const res = await fetch(`${BASE}/`);
    assert.ok(res.status > 0);
    console.log('PASS: server is up');
    process.exit(0);
  } catch (err) {
    console.error('FAIL:', err.message);
    process.exit(1);
  }
}

main();