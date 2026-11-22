import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { handleWorkerRequest, type WorkerEnv } from '../../worker';

function createMockEnv(overrides: Partial<WorkerEnv> = {}): {
  env: WorkerEnv;
  assetRequests: Request[];
} {
  const assetRequests: Request[] = [];
  const env: WorkerEnv = {
    ASSETS: {
      async fetch(request: Request): Promise<Response> {
        assetRequests.push(request);
        return new Response('<html>OK</html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        });
      },
    },
    ...overrides,
  };
  return { env, assetRequests };
}

test('worker delegates non-API requests to Cloudflare Static Assets', async () => {
  const { env, assetRequests } = createMockEnv();
  const req = new Request('https://www.thegloballuxuryconsortium.com/services/transport-security/');
  const res = await handleWorkerRequest(req, env);

  assert.equal(res.status, 200);
  assert.equal(assetRequests.length, 1);
  assert.equal(assetRequests[0].url, req.url);
});

test('worker rejects non-POST methods on /api/send-email and /api/translate with 405', async () => {
  const { env } = createMockEnv();

  for (const endpoint of ['/api/send-email', '/api/send-email/', '/api/translate']) {
    const res = await handleWorkerRequest(
      new Request(`https://www.thegloballuxuryconsortium.com${endpoint}`, { method: 'GET' }),
      env
    );
    assert.equal(res.status, 405, `Expected 405 for GET ${endpoint}`);
    assert.equal(res.headers.get('Allow'), 'POST');
    assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  }
});

test('worker returns 404 JSON for unknown /api/* routes without hitting ASSETS', async () => {
  const { env, assetRequests } = createMockEnv();
  const res = await handleWorkerRequest(
    new Request('https://www.thegloballuxuryconsortium.com/api/does-not-exist'),
    env
  );

  assert.equal(res.status, 404);
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(assetRequests.length, 0);
});

test('POST /api/send-email fails safely when BREVO_API_KEY is missing', async () => {
  const { env } = createMockEnv({ BREVO_API_KEY: undefined });
  const res = await handleWorkerRequest(
    new Request('https://www.thegloballuxuryconsortium.com/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Test Client',
        senderEmail: 'client@example.com',
        subject: 'Mayfair Enquiry',
        textContent: 'Hello',
      }),
    }),
    env
  );

  assert.equal(res.status, 500);
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('POST /api/send-email validates senderEmail and required fields', async () => {
  const { env } = createMockEnv({ BREVO_API_KEY: 'dummy-test-key' });

  const invalidEmailRes = await handleWorkerRequest(
    new Request('https://www.thegloballuxuryconsortium.com/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Test Client',
        senderEmail: 'not-an-email',
        subject: 'Enquiry',
        textContent: 'Hello',
      }),
    }),
    env
  );

  assert.equal(invalidEmailRes.status, 400);
  assert.equal(invalidEmailRes.headers.get('X-Content-Type-Options'), 'nosniff');

  const missingNameRes = await handleWorkerRequest(
    new Request('https://www.thegloballuxuryconsortium.com/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: '   ',
        senderEmail: 'client@example.com',
        subject: 'Enquiry',
      }),
    }),
    env
  );

  assert.equal(missingNameRes.status, 400);
});

test('POST /api/translate rejects unsupported target language codes', async () => {
  const { env } = createMockEnv();
  const res = await handleWorkerRequest(
    new Request('https://www.thegloballuxuryconsortium.com/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'xx-invalid', texts: ['Hello'] }),
    }),
    env
  );

  assert.equal(res.status, 400);
});

test('Cloudflare Workers deployment config avoids Wrangler autoconfig SSR breakage', () => {
  const wranglerPath = path.resolve(process.cwd(), 'wrangler.jsonc');
  assert.ok(fs.existsSync(wranglerPath), 'wrangler.jsonc must exist in project root');

  const wranglerRaw = fs.readFileSync(wranglerPath, 'utf8');
  assert.match(wranglerRaw, /"main"\s*:\s*"worker\.ts"/);
  assert.match(wranglerRaw, /"directory"\s*:\s*"\.\/dist"/);
  assert.match(wranglerRaw, /"binding"\s*:\s*"ASSETS"/);

  const viteConfigRaw = fs.readFileSync(path.resolve(process.cwd(), 'vite.config.ts'), 'utf8');
  assert.doesNotMatch(
    viteConfigRaw,
    /@cloudflare\/vite-plugin/,
    'vite.config.ts must not inject @cloudflare/vite-plugin because it breaks SSR prerender output'
  );
  assert.doesNotMatch(
    viteConfigRaw,
    /\b__dirname\b/,
    'vite.config.ts should use import.meta.dirname instead of deprecated __dirname'
  );
  assert.match(viteConfigRaw, /envPrefix:\s*'VITE_'/);
  assert.match(viteConfigRaw, /base:\s*'\/'/);

  const tsconfig = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'tsconfig.json'), 'utf8')
  ) as {
    compilerOptions: {
      types?: string[];
      moduleResolution?: string;
      resolveJsonModule?: boolean;
      forceConsistentCasingInFileNames?: boolean;
    };
    exclude?: string[];
  };
  assert.equal(tsconfig.compilerOptions.moduleResolution, 'bundler');
  assert.equal(tsconfig.compilerOptions.resolveJsonModule, true);
  assert.equal(tsconfig.compilerOptions.forceConsistentCasingInFileNames, true);
  assert.ok(tsconfig.compilerOptions.types?.includes('vite/client'));
  assert.ok(tsconfig.compilerOptions.types?.includes('node'));
  assert.ok(tsconfig.exclude?.includes('dist-ssr'));
  assert.ok(tsconfig.exclude?.includes('.wrangler'));
});

test('POST /api/send-email syncs Concierge Insights subscribers to Brevo list when BREVO_LIST_ID is configured', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; body: Record<string, unknown>; apiKey: string | null }> = [];

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const headers = new Headers(init?.headers);
    const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};
    calls.push({ url, body, apiKey: headers.get('api-key') });

    if (url === 'https://api.brevo.com/v3/smtp/email') {
      return new Response(JSON.stringify({ messageId: 'msg-insights-01' }), { status: 201 });
    }
    if (url === 'https://api.brevo.com/v3/contacts') {
      return new Response(null, { status: 204 });
    }
    return new Response('unexpected', { status: 500 });
  }) as typeof fetch;

  try {
    const { env } = createMockEnv({
      BREVO_API_KEY: 'test-key-only',
      TGLC_ADMISSIONS_EMAIL: 'desk@thegloballuxuryconsortium.com',
      BREVO_LIST_ID: '#7',
    });

    const res = await handleWorkerRequest(
      new Request('https://www.thegloballuxuryconsortium.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Eleanor Ashworth',
          senderEmail: 'eleanor@ashworthfamilyoffice.co.uk',
          subject: 'Concierge Insights Subscription — Luxury Travel Updates',
          additionalDetails: {
            subscriptionType: 'concierge-insights',
            cadence: 'Monthly Briefing',
            topics: ['Private Aviation & Yachts'],
          },
        }),
      }),
      env
    );

    assert.equal(res.status, 200);
    const json = (await res.json()) as { success: boolean; listSynced: boolean };
    assert.equal(json.success, true);
    assert.equal(json.listSynced, true);

    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, 'https://api.brevo.com/v3/smtp/email');
    assert.equal(calls[1].url, 'https://api.brevo.com/v3/contacts');
    assert.deepEqual(calls[1].body, {
      email: 'eleanor@ashworthfamilyoffice.co.uk',
      listIds: [7],
      updateEnabled: true,
      attributes: {
        FIRSTNAME: 'Eleanor',
        LASTNAME: 'Ashworth',
      },
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('POST /api/send-email does not add regular enquiries to the Brevo newsletter list', async () => {
  const originalFetch = globalThis.fetch;
  const calledUrls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    calledUrls.push(url);
    return new Response(JSON.stringify({ messageId: 'msg-enquiry-01' }), { status: 201 });
  }) as typeof fetch;

  try {
    const { env } = createMockEnv({
      BREVO_API_KEY: 'test-key-only',
      BREVO_LIST_ID: '7',
    });

    const res = await handleWorkerRequest(
      new Request('https://www.thegloballuxuryconsortium.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Marcus Vance',
          senderEmail: 'marcus@example.com',
          subject: 'Private Introduction',
        }),
      }),
      env
    );

    assert.equal(res.status, 200);
    const json = (await res.json()) as { success: boolean; listSynced: boolean };
    assert.equal(json.success, true);
    assert.equal(json.listSynced, false);
    assert.deepEqual(calledUrls, ['https://api.brevo.com/v3/smtp/email']);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
