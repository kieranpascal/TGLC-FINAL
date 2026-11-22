import { onRequestPost as handleSendEmail } from './functions/api/send-email';
import { onRequestPost as handleTranslate } from './functions/api/translate';

export interface WorkerEnv {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  BREVO_API_KEY?: string;
  TGLC_ADMISSIONS_EMAIL?: string;
  BREVO_LIST_ID?: string;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
};

function methodNotAllowed(): Response {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: {
      ...JSON_HEADERS,
      Allow: 'POST',
    },
  });
}

export async function handleWorkerRequest(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/api/send-email') {
    if (request.method !== 'POST') {
      return methodNotAllowed();
    }
    return handleSendEmail({ request, env });
  }

  if (pathname === '/api/translate') {
    if (request.method !== 'POST') {
      return methodNotAllowed();
    }
    return handleTranslate({ request });
  }

  if (pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleWorkerRequest(request, env);
  },
};
