import type { EmailDispatchPayload } from './brevoEmail';

export const LUXURY_TRAVEL_TOPICS = [
  'Private Aviation & Yachts',
  'Seasonal Estates & Villas',
  'London & European Calendar',
  'Hidden Mayfair & Dining',
] as const;

export type LuxuryTravelTopic = (typeof LUXURY_TRAVEL_TOPICS)[number];

export const INSIGHT_CADENCES = [
  'Monthly Briefing',
  'Seasonal Dispatch',
] as const;

export type InsightCadence = (typeof INSIGHT_CADENCES)[number];

export const DEFAULT_INSIGHT_TOPICS: LuxuryTravelTopic[] = [
  'Private Aviation & Yachts',
  'Seasonal Estates & Villas',
];

export const DEFAULT_INSIGHT_CADENCE: InsightCadence = 'Monthly Briefing';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 120;

export interface ConciergeInsightsInput {
  name?: string;
  email: string;
  topics: string[];
  cadence: InsightCadence;
}

export interface ConciergeInsightsValidation {
  valid: boolean;
  error?: string;
}

export function validateConciergeInsightsInput(
  input: Pick<ConciergeInsightsInput, 'name' | 'email'>
): ConciergeInsightsValidation {
  const email = (input.email || '').trim();
  const name = (input.name || '').trim();

  if (!email) {
    return { valid: false, error: 'Please enter your email address to subscribe.' };
  }

  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: 'Please keep your name under 120 characters.' };
  }

  return { valid: true };
}

export function buildConciergeInsightsPayload(
  input: ConciergeInsightsInput
): EmailDispatchPayload {
  const cleanEmail = input.email.trim().slice(0, MAX_EMAIL_LENGTH);
  const cleanName = (input.name || '').trim().slice(0, MAX_NAME_LENGTH);
  const subscriberName = cleanName || 'Concierge Insights Subscriber';

  const allowedSet = new Set<string>(LUXURY_TRAVEL_TOPICS);
  const effectiveTopics = input.topics.filter((topic) => allowedSet.has(topic));
  const topicSummary =
    effectiveTopics.length > 0
      ? effectiveTopics.join(', ')
      : 'All Luxury Travel Briefings';

  const cadence = INSIGHT_CADENCES.includes(input.cadence)
    ? input.cadence
    : DEFAULT_INSIGHT_CADENCE;

  return {
    senderName: subscriberName,
    senderEmail: cleanEmail,
    telephone: 'Not provided',
    location: 'Concierge Insights Subscription (Footer)',
    preferredChannel: `Email · ${cadence}`,
    subject: 'Concierge Insights Subscription — Luxury Travel Updates',
    inquiryType: 'Concierge Insights — Luxury Travel Updates',
    message: [
      'New Concierge Insights subscription request:',
      `Subscriber: ${subscriberName}`,
      `Email: ${cleanEmail}`,
      `Delivery Cadence: ${cadence}`,
      `Luxury Travel Focus: ${topicSummary}`,
    ].join('\n'),
    additionalDetails: {
      subscriptionType: 'concierge-insights',
      cadence,
      topics: effectiveTopics.length > 0 ? effectiveTopics : [...LUXURY_TRAVEL_TOPICS],
    },
  };
}
