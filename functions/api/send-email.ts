/**
 * Cloudflare Worker / Pages Function: /api/send-email
 *
 * Reads BREVO_API_KEY, TGLC_ADMISSIONS_EMAIL, and optional BREVO_LIST_ID
 * from Cloudflare Environment Variables / Secrets (never exposed to browser code).
 */

interface Env {
  BREVO_API_KEY?: string;
  TGLC_ADMISSIONS_EMAIL?: string;
  BREVO_LIST_ID?: string;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_SUBSCRIBER_FALLBACK = 'Concierge Insights Subscriber';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function parseBrevoListId(raw?: string): number | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim().replace(/^#/, '');
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function splitContactName(fullName: string): { firstName?: string; lastName?: string } {
  const clean = fullName.trim().replace(/\s+/g, ' ');
  if (!clean || clean.toLowerCase() === DEFAULT_SUBSCRIBER_FALLBACK.toLowerCase()) {
    return {};
  }
  const parts = clean.split(' ');
  const firstName = parts[0].slice(0, 60);
  const lastName = parts.length > 1 ? parts.slice(1).join(' ').slice(0, 60) : undefined;
  return lastName ? { firstName, lastName } : { firstName };
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const raw = await context.request.json();
    const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const brevoApiKey = context.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'BREVO_API_KEY is not configured in Cloudflare Environment Variables.',
        }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    const senderName = typeof data.senderName === 'string' ? data.senderName.trim().slice(0, 120) : '';
    const senderEmail = typeof data.senderEmail === 'string' ? data.senderEmail.trim().slice(0, 254) : '';
    const telephone = typeof data.telephone === 'string' ? data.telephone.trim().slice(0, 60) : '';
    const rawSubject = typeof data.subject === 'string' ? data.subject : 'Introduction';
    const subject = rawSubject.replace(/[\r\n]+/g, ' ').trim().slice(0, 180) || 'Introduction';

    if (!senderName || !EMAIL_REGEX.test(senderEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please provide a valid name and email address.',
        }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const admissionsEmail = context.env.TGLC_ADMISSIONS_EMAIL || 'info@thegloballuxuryconsortium.com';
    const htmlContent =
      typeof data.htmlContent === 'string' && data.htmlContent.trim().length > 0
        ? data.htmlContent.slice(0, 25000)
        : `<p>Inquiry received from ${escapeHtml(senderName)} (${escapeHtml(senderEmail)}${telephone ? `, ${escapeHtml(telephone)}` : ''})</p>`;

    const brevoPayload = {
      sender: {
        name: 'TGLC Albemarle Admissions Desk',
        email: admissionsEmail,
      },
      to: [
        {
          email: admissionsEmail,
          name: 'TGLC Admissions Committee',
        },
      ],
      replyTo: {
        email: senderEmail,
        name: senderName,
      },
      subject: `[TGLC Confidential] ${subject} — ${senderName}`,
      htmlContent,
    };

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    if (!brevoRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: 'Brevo API call failed' }),
        { status: brevoRes.status, headers: JSON_HEADERS }
      );
    }

    const brevoData = (await brevoRes.json()) as { messageId?: string };

    // Option B: If this is a Concierge Insights newsletter subscription and BREVO_LIST_ID is set,
    // automatically add/update the subscriber in the Brevo Contact List to trigger welcome automations.
    const additionalDetails =
      data.additionalDetails && typeof data.additionalDetails === 'object'
        ? (data.additionalDetails as Record<string, unknown>)
        : null;
    const isNewsletterSignup = additionalDetails?.subscriptionType === 'concierge-insights';
    const listId = parseBrevoListId(context.env.BREVO_LIST_ID);

    let listSynced = false;
    if (isNewsletterSignup && listId !== null) {
      const { firstName, lastName } = splitContactName(senderName);
      const attributes: Record<string, string> = {};
      if (firstName) attributes.FIRSTNAME = firstName;
      if (lastName) attributes.LASTNAME = lastName;

      const contactPayload: Record<string, unknown> = {
        email: senderEmail,
        listIds: [listId],
        updateEnabled: true,
      };
      if (Object.keys(attributes).length > 0) {
        contactPayload.attributes = attributes;
      }

      try {
        const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify(contactPayload),
        });
        listSynced = contactRes.ok || contactRes.status === 204;
      } catch {
        listSynced = false;
      }
    }

    return new Response(
      JSON.stringify({ success: true, messageId: brevoData.messageId, listSynced }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to process request' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }
};
