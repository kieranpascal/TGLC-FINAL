import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildConciergeInsightsPayload,
  DEFAULT_INSIGHT_CADENCE,
  DEFAULT_INSIGHT_TOPICS,
  LUXURY_TRAVEL_TOPICS,
  validateConciergeInsightsInput,
} from './conciergeInsights';
import { EMAIL_FAILURE_MESSAGE, escapeHtml, sendEmailViaBrevo } from './brevoEmail';
import {
  LUXURY_PAGE_EASE,
  PAGE_HAIRLINE_VARIANTS,
  PAGE_SLIDE_UP_DISTANCE_PX,
  PAGE_SLIDE_UP_DURATION_S,
  PAGE_SLIDE_UP_VARIANTS,
  PAGE_STAGGER_TIMING,
  PAGE_VARIANT_KEYS,
  PAGE_WRAPPER_VARIANTS,
} from './pageTransitions';

test('validateConciergeInsightsInput rejects empty, malformed, and overly long inputs', () => {
  assert.equal(validateConciergeInsightsInput({ email: '' }).valid, false);
  assert.equal(validateConciergeInsightsInput({ email: '   ' }).valid, false);
  assert.equal(validateConciergeInsightsInput({ email: 'not-an-email' }).valid, false);
  assert.equal(validateConciergeInsightsInput({ email: 'guest@domain' }).valid, false);
  assert.equal(
    validateConciergeInsightsInput({
      email: 'member@mayfair.co.uk',
      name: 'A'.repeat(121),
    }).valid,
    false
  );
});

test('validateConciergeInsightsInput accepts valid subscriber email with or without name', () => {
  assert.equal(
    validateConciergeInsightsInput({ email: 'eleanor@ashworthfamilyoffice.co.uk' }).valid,
    true
  );
  assert.equal(
    validateConciergeInsightsInput({
      name: 'Eleanor Ashworth',
      email: '  eleanor@ashworthfamilyoffice.co.uk  ',
    }).valid,
    true
  );
});

test('buildConciergeInsightsPayload formats Brevo payload with fallback subscriber name and filtered topics', () => {
  const payload = buildConciergeInsightsPayload({
    name: '   ',
    email: '  client@privateoffice.com ',
    topics: ['Private Aviation & Yachts', 'Unknown Injected Topic'],
    cadence: 'Seasonal Dispatch',
  });

  assert.equal(payload.senderName, 'Concierge Insights Subscriber');
  assert.equal(payload.senderEmail, 'client@privateoffice.com');
  assert.equal(payload.telephone, 'Not provided');
  assert.equal(payload.subject, 'Concierge Insights Subscription — Luxury Travel Updates');
  assert.equal(payload.inquiryType, 'Concierge Insights — Luxury Travel Updates');
  assert.equal(payload.preferredChannel, 'Email · Seasonal Dispatch');
  assert.match(payload.message || '', /Private Aviation & Yachts/);
  assert.doesNotMatch(payload.message || '', /Unknown Injected Topic/);
  assert.deepEqual(payload.additionalDetails?.topics, ['Private Aviation & Yachts']);
});

test('buildConciergeInsightsPayload defaults to all luxury travel briefings when no topics are selected', () => {
  const payload = buildConciergeInsightsPayload({
    name: 'Julian Sterling',
    email: 'julian@sterling.uk',
    topics: [],
    cadence: DEFAULT_INSIGHT_CADENCE,
  });

  assert.equal(payload.senderName, 'Julian Sterling');
  assert.match(payload.message || '', /All Luxury Travel Briefings/);
  assert.deepEqual(payload.additionalDetails?.topics, [...LUXURY_TRAVEL_TOPICS]);
  assert.ok(DEFAULT_INSIGHT_TOPICS.length >= 2);
});

test('escapeHtml neutralizes HTML special characters', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script> & \'quote\''),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quote&#39;'
  );
});

test('sendEmailViaBrevo posts escaped HTML payload to /api/send-email and handles success & failure', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedBody: Record<string, unknown> = {};

  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedBody = JSON.parse(String(init?.body || '{}'));
    return new Response(JSON.stringify({ success: true, messageId: 'brevo-123' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const payload = buildConciergeInsightsPayload({
      name: '<b>Lord Vance</b>',
      email: 'vance@mayfair.uk',
      topics: ['Hidden Mayfair & Dining'],
      cadence: 'Monthly Briefing',
    });

    const successResult = await sendEmailViaBrevo(payload);
    assert.equal(successResult.success, true);
    assert.equal(capturedUrl, '/api/send-email');
    assert.ok(successResult.recordId?.startsWith('TGLC-'));
    assert.match(String(capturedBody.htmlContent), /&lt;b&gt;Lord Vance&lt;\/b&gt;/);
    assert.doesNotMatch(String(capturedBody.htmlContent), /<b>Lord Vance<\/b>/);

    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ success: false }), { status: 500 })) as typeof fetch;

    const failureResult = await sendEmailViaBrevo(payload);
    assert.equal(failureResult.success, false);
    assert.equal(failureResult.message, EMAIL_FAILURE_MESSAGE);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('page transition variants define a luxury slide-up entrance with extended stagger timing and namespaced keys', () => {
  assert.notEqual(PAGE_VARIANT_KEYS.initial, 'hidden');
  assert.notEqual(PAGE_VARIANT_KEYS.animate, 'visible');
  assert.notEqual(PAGE_VARIANT_KEYS.exit, 'exit');

  const visibleWrapper = PAGE_WRAPPER_VARIANTS[PAGE_VARIANT_KEYS.animate] as {
    transition?: { delayChildren?: number; staggerChildren?: number };
  };
  const hiddenSlide = PAGE_SLIDE_UP_VARIANTS[PAGE_VARIANT_KEYS.initial] as {
    opacity?: number;
    y?: number;
  };
  const visibleSlide = PAGE_SLIDE_UP_VARIANTS[PAGE_VARIANT_KEYS.animate] as {
    opacity?: number;
    y?: number;
    transition?: { duration?: number; ease?: number[] };
  };
  const hiddenHairline = PAGE_HAIRLINE_VARIANTS[PAGE_VARIANT_KEYS.initial] as {
    scaleX?: number;
    opacity?: number;
  };

  assert.equal(visibleWrapper.transition?.delayChildren, PAGE_STAGGER_TIMING.delayChildren);
  assert.equal(visibleWrapper.transition?.staggerChildren, PAGE_STAGGER_TIMING.staggerChildren);
  assert.ok((visibleWrapper.transition?.staggerChildren ?? 0) >= 0.14);

  assert.equal(hiddenSlide.opacity, 0);
  assert.equal(hiddenSlide.y, PAGE_SLIDE_UP_DISTANCE_PX);
  assert.ok(PAGE_SLIDE_UP_DISTANCE_PX >= 24);
  assert.equal(visibleSlide.opacity, 1);
  assert.equal(visibleSlide.y, 0);
  assert.equal(visibleSlide.transition?.duration, PAGE_SLIDE_UP_DURATION_S);
  assert.ok(PAGE_SLIDE_UP_DURATION_S >= 0.6);
  assert.deepEqual(visibleSlide.transition?.ease, LUXURY_PAGE_EASE);

  assert.equal(hiddenHairline.opacity, 0);
  assert.ok((hiddenHairline.scaleX ?? 1) < 1);
});
