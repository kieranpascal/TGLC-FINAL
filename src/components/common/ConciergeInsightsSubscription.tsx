import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Loader2,
  Mail,
} from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { sendEmailViaBrevo } from '../../utils/brevoEmail';
import {
  buildConciergeInsightsPayload,
  DEFAULT_INSIGHT_CADENCE,
  DEFAULT_INSIGHT_TOPICS,
  INSIGHT_CADENCES,
  LUXURY_TRAVEL_TOPICS,
  validateConciergeInsightsInput,
  type InsightCadence,
} from '../../utils/conciergeInsights';
import { useNavigation } from '../../context/NavigationContext';

export interface ConciergeInsightsSubscriptionProps {
  variants?: Variants;
  className?: string;
}

interface ConfirmedSubscription {
  email: string;
  topics: string[];
  cadence: InsightCadence;
  recordId?: string;
}

export const ConciergeInsightsSubscription: React.FC<ConciergeInsightsSubscriptionProps> = ({
  variants,
  className = '',
}) => {
  const { t } = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([...DEFAULT_INSIGHT_TOPICS]);
  const [cadence, setCadence] = useState<InsightCadence>(DEFAULT_INSIGHT_CADENCE);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedSubscription | null>(null);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const validation = validateConciergeInsightsInput({ name, email });
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Please enter a valid email address.');
      return;
    }

    setErrorMessage(null);
    setSubmitting(true);

    const trimmedEmail = email.trim();
    const payload = buildConciergeInsightsPayload({
      name,
      email: trimmedEmail,
      topics: selectedTopics,
      cadence,
    });

    const result = await sendEmailViaBrevo(payload);
    setSubmitting(false);

    if (result.success) {
      setConfirmed({
        email: trimmedEmail,
        topics: selectedTopics.length > 0 ? [...selectedTopics] : ['All Luxury Travel Briefings'],
        cadence,
        recordId: result.recordId,
      });
      setEmail('');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <motion.section
      aria-labelledby="concierge-insights-heading"
      variants={variants}
      className={`relative bg-[#0E1018] border border-[#262936] p-6 sm:p-7 flex flex-col justify-between space-y-4 overflow-hidden ${className || 'lg:col-span-7'}`}
    >
      {/* Subtle Top Brass Hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#CFA85E]/80 to-transparent origin-left pointer-events-none"
      />

      {/* Editorial Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#CFA85E] inline-flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#E2BA6B]" aria-hidden="true" />
            <span>Private Travel Briefing</span>
          </span>
        </div>
        <h2
          id="concierge-insights-heading"
          className="font-serif text-xl sm:text-2xl text-[#F2D8A0] leading-snug text-balance"
        >
          Concierge Insights
        </h2>
        <p className="text-xs text-[#B4BCCB] leading-relaxed font-light">
          Discreet luxury travel updates from Mayfair — private aviation routes, seasonal villas, London invitations and hidden dining.
        </p>
      </div>

      {/* Luxury Travel Focus Selectors */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LUXURY_TRAVEL_TOPICS.map((topic) => {
            const active = selectedTopics.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                aria-pressed={active}
                className={`min-h-[40px] px-3 py-1.5 text-left text-xs border transition-colors flex items-center justify-between gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CFA85E] ${
                  active
                    ? 'bg-[#161923] border-[#CFA85E] text-[#FAF7F0]'
                    : 'bg-[#090B10] border-[#222532] text-[#9C968A] hover:border-[#8B672B] hover:text-[#D4D8E2]'
                }`}
              >
                <span className="truncate">{topic}</span>
                <span
                  aria-hidden="true"
                  className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? 'border-[#CFA85E] bg-[#CFA85E] text-[#07080B]'
                      : 'border-[#33384A]'
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cadence Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8F98AA]">
            Dispatch Cadence
          </span>
          <div
            role="group"
            aria-label="Concierge Insights delivery cadence"
            className="grid grid-cols-2 gap-1.5 bg-[#090B10] border border-[#222532] p-1"
          >
            {INSIGHT_CADENCES.map((option) => {
              const active = cadence === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCadence(option)}
                  aria-pressed={active}
                  className={`min-h-[36px] px-3 py-1.5 text-[11px] whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CFA85E] ${
                    active
                      ? 'bg-[#1A1D29] text-[#F2D8A0] border border-[#8B672B]'
                      : 'text-[#8F98AA] border border-transparent hover:text-[#D4D8E2]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form or Confirmation State */}
      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div
            key="insights-confirmed"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 bg-[#141722] border border-[#B98633] text-xs text-[#F4F1EA] space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#CFA85E] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1.5 min-w-0">
                <p className="font-medium text-[#FAF7F0]">
                  You’re subscribed to Concierge Insights.
                </p>
                <p className="text-[11px] text-[#B4BCCB] break-words">
                  Dispatches for <span className="text-[#FAF7F0]">{confirmed.email}</span> ·{' '}
                  <span className="text-[#E2BA6B]">{confirmed.cadence}</span>
                </p>
                <p className="text-[11px] text-[#9C968A]">
                  Focus: <span className="text-[#D4D8E2]">{confirmed.topics.join(' · ')}</span>
                </p>
                {confirmed.recordId && (
                  <p className="font-mono text-[10px] tracking-wider text-[#CFA85E] tabular-nums">
                    Reference: {confirmed.recordId}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmed(null);
                setErrorMessage(null);
              }}
              className="min-h-[36px] text-[11px] font-mono uppercase tracking-wider text-[#CFA85E] hover:text-white transition-colors cursor-pointer"
            >
              Update preferences →
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="insights-form"
            initial={{ opacity: 0.9, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-2.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4">
                <label htmlFor="concierge-insights-name" className="sr-only">
                  Your name (optional)
                </label>
                <input
                  id="concierge-insights-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  disabled={submitting}
                  className="w-full min-h-[44px] bg-[#08090D] border border-[#2C303E] focus:border-[#CFA85E] px-3.5 py-3 text-xs text-[#F4F1EA] placeholder-[#7B776F] focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-8 flex flex-col sm:flex-row gap-2.5">
                <label htmlFor="concierge-insights-email" className="sr-only">
                  Email address for Concierge Insights
                </label>
                <input
                  id="concierge-insights-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={t('footer.emailPlaceholder')}
                  aria-invalid={errorMessage ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'concierge-insights-error' : undefined}
                  disabled={submitting}
                  className="flex-1 min-w-0 min-h-[44px] bg-[#08090D] border border-[#2C303E] focus:border-[#CFA85E] px-3.5 py-3 text-xs text-[#F4F1EA] placeholder-[#7B776F] focus:outline-none transition-colors disabled:opacity-60"
                />

                <motion.button
                  whileHover={submitting ? undefined : { y: -1 }}
                  whileTap={submitting ? undefined : { scale: 0.985 }}
                  type="submit"
                  disabled={submitting}
                  className="btn-gold min-h-[44px] px-5 py-3 text-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-[#08090C] animate-spin" aria-hidden="true" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>{t('cta.subscribe')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#08090C]" aria-hidden="true" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {errorMessage && (
              <div
                id="concierge-insights-error"
                role="alert"
                className="flex items-start gap-2 p-3 bg-[#1A1214] border border-[#8C3D3D] text-[11px] text-[#F2C9C9] leading-relaxed"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#E58A8A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* Discretion Footer Line */}
      <div className="pt-3 border-t border-[#1D1F2A] flex flex-wrap items-center justify-between gap-4 text-xs text-[#9C968A]">
        <span>Sent strictly to subscribers. Never shared with third parties.</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CFA85E]">
          Luxury Travel Updates
        </span>
      </div>
    </motion.section>
  );
};
