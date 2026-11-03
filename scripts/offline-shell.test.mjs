import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
function worker(fetch) {
  const listeners = {}; const files = new Map(); const batches = [];
  const cache = {
    addAll: async (urls) => {
      batches.push(urls);
      for (const url of urls) files.set(url, new Response(url === '/' ? '<script src="/assets/app-hash.js"></script><link href="/assets/app-hash.css" rel="stylesheet">' : 'asset'));
    },
    match: async (key) => files.get(key)?.clone(),
    put: async (key, response) => { files.set(key, response); },
  };
  vm.runInNewContext(source, { URL, Response, Set, fetch,
    caches: { open: async () => cache, match: cache.match },
    self: { location: { origin: 'https://tracker.example' }, skipWaiting: async () => {}, addEventListener: (type, fn) => { listeners[type] = fn; } },
  });
  return { listeners, batches, files };
}
test('the first service-worker install caches the HTML-referenced JS and CSS', async () => {
  const w = worker(); let task;
  w.listeners.install({ waitUntil: (promise) => { task = promise; } });
  await task;
  assert.deepEqual(Array.from(w.batches[1]), ['https://tracker.example/assets/app-hash.js', 'https://tracker.example/assets/app-hash.css']);
});
test('a failed navigation preserves and serves the last working shell', async () => {
  const w = worker(async () => new Response('Down', { status: 503 }));
  w.files.set('/', new Response('Working shell'));
  let response;
  w.listeners.fetch({ request: { method: 'GET', url: 'https://tracker.example/', mode: 'navigate' }, respondWith: (value) => { response = value; }, waitUntil: () => {} });
  assert.equal(await (await response).text(), 'Working shell');
  assert.equal(await w.files.get('/').text(), 'Working shell');
});
test('authenticated API responses never enter the service-worker cache', () => {
  const w = worker(() => { throw new Error('Must not intercept API'); });
  w.listeners.fetch({ request: { method: 'GET', url: 'https://tracker.example/api/sessions/active' }, respondWith: () => assert.fail('API was intercepted') });
});
