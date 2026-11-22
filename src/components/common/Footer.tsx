import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { TGLC_CONTACT } from '../../data/tglcData';
import { Link } from './Link';
import { SmartImage } from './SmartImage';
import { FooterSocialMedia } from './FooterSocialMedia';
import { ConciergeInsightsSubscription } from './ConciergeInsightsSubscription';
import { ArrowUp, ArrowUpRight, Compass, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const dispatchStaggerVariants = {
  hidden: { opacity: 0.92 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const dispatchChildVariants = {
  hidden: { opacity: 0.9, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const Footer: React.FC = () => {
  const { openIntroductionModal, t } = useNavigation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#08090C] border-t border-[#1D1F28] text-[#9C968A] pt-12 pb-8 overflow-hidden">
      {/* Subtle Brass Crown Hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#CFA85E] to-transparent origin-center pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-9">
        {/* Tier 1: Streamlined House Lockup + Concierge Insights Subscription */}
        <motion.div
          variants={dispatchStaggerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-9 border-b border-[#1D1F28] items-stretch"
        >
          {/* Left: Concise Mayfair Brand Block */}
          <motion.div
            variants={dispatchChildVariants}
            className="lg:col-span-5 bg-[#0C0E14] border border-[#222532] p-6 sm:p-7 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 sm:w-28 shrink-0 bg-black border border-[#8B672B]/50 p-2.5">
                  <SmartImage
                    src="/assets/aistudio/tglc_lockup_transparent.png"
                    alt="The Global Luxury Consortium crest lockup"
                    sizes="112px"
                    className="w-full h-auto object-contain block"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#CFA85E] block">
                    {t('hero.tag1')}
                  </span>
                  <p className="font-serif text-lg sm:text-xl italic text-[#F4F1EA] leading-snug">
                    “{t('hero.headline1')}”
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#B4BCCB] leading-relaxed font-light">
                Private concierge and lifestyle management from Mayfair, London. One discreet point of contact for travel, dining, homes, culture and rare requests — in London and abroad.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1D1F2A] flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openIntroductionModal('General enquiry')}
                className="btn-gold min-h-[42px] px-5 py-2.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>{t('cta.requestIntroduction')}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#08090C]" />
              </button>

              <Link
                page="commission-studio"
                className="min-h-[42px] px-4 py-2.5 border border-[#262936] hover:border-[#8B672B] bg-[#090B10] text-xs text-[#D4D8E2] hover:text-[#E2BA6B] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-[#CFA85E]" />
                <span>{t('nav.commissionStudio')}</span>
              </Link>
            </div>
          </motion.div>

          {/* Right: Concierge Insights Subscription (Brevo Integration) */}
          <ConciergeInsightsSubscription
            variants={dispatchChildVariants}
            className="lg:col-span-7"
          />
        </motion.div>

        {/* Tier 2: Clean, Uncluttered 4-Column Directory (Zero Duplication) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#1D1F28]">
          {/* Col 1: The Consortium */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#CFA85E]">
              {t('nav.consortium')}
            </h4>
            <ul className="space-y-2 text-xs text-[#B5AFA3]">
              <li>
                <Link page="consortium" className="hover:text-[#F2D8A0] transition-colors">
                  Consortium Overview
                </Link>
              </li>
              <li>
                <Link page="consortium-concierge" className="hover:text-[#F2D8A0] transition-colors">
                  Bespoke Concierge
                </Link>
              </li>
              <li>
                <Link page="about" className="hover:text-[#F2D8A0] transition-colors">
                  About TGLC
                </Link>
              </li>
              <li>
                <Link page="ethos" className="hover:text-[#F2D8A0] transition-colors">
                  Our Ethos
                </Link>
              </li>
              <li>
                <Link page="approach" className="hover:text-[#F2D8A0] transition-colors">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link page="network" className="hover:text-[#F2D8A0] transition-colors">
                  Our Network
                </Link>
              </li>
              <li>
                <Link page="our-london" className="hover:text-[#F2D8A0] transition-colors">
                  Our London
                </Link>
              </li>
              <li>
                <Link page="cultural-traditions" className="hover:text-[#F2D8A0] transition-colors">
                  Cultural &amp; Islamic Hospitality
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#CFA85E]">
              {t('nav.services')}
            </h4>
            <ul className="space-y-2 text-xs text-[#B5AFA3]">
              <li>
                <Link page="services" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.allServices')}
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'travel-aviation' }} className="hover:text-[#F2D8A0] transition-colors">
                  Travel &amp; Aviation
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'dining-nightlife' }} className="hover:text-[#F2D8A0] transition-colors">
                  Dining &amp; Nightlife
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'experiences-culture' }} className="hover:text-[#F2D8A0] transition-colors">
                  Experiences &amp; Culture
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'residences-relocation' }} className="hover:text-[#F2D8A0] transition-colors">
                  Residences &amp; Relocation
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'transport-security' }} className="hover:text-[#F2D8A0] transition-colors">
                  Transport &amp; Security
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'personal-private-office' }} className="hover:text-[#F2D8A0] transition-colors">
                  Personal &amp; Private Office
                </Link>
              </li>
              <li>
                <Link page="service-detail" params={{ serviceId: 'luxury-sourcing' }} className="hover:text-[#F2D8A0] transition-colors">
                  Luxury Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Explore */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#CFA85E]">
              {t('footer.exploreCol')}
            </h4>
            <ul className="space-y-2 text-xs text-[#B5AFA3]">
              <li>
                <Link page="hidden-london" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.hiddenLondon')}
                </Link>
              </li>
              <li>
                <Link page="case-studies" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.signatureExperiences')}
                </Link>
              </li>
              <li>
                <Link page="membership" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.join')}
                </Link>
              </li>
              <li>
                <Link page="calendar" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.londonCalendar')}
                </Link>
              </li>
              <li>
                <Link page="journal" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.journal')}
                </Link>
              </li>
              <li>
                <Link page="faq" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link page="contact" className="hover:text-[#F2D8A0] transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link
                  page="member-portal"
                  className="hover:text-[#F2D8A0] transition-colors inline-flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#C4933F]" />
                  <span>{t('nav.members')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Single Authoritative Mayfair Office & Direct Line */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#CFA85E]">
              {t('footer.mayfairOffice')}
            </h4>
            <div className="space-y-3 text-xs text-[#B5AFA3] leading-relaxed">
              <p className="text-[#F4F1EA]">
                3rd Floor, 45 Albemarle Street
                <br />
                Mayfair, London W1S 4JL
              </p>

              <div className="space-y-1">
                <a
                  href={`tel:${TGLC_CONTACT.internationalPhone.replace(/\s+/g, '')}`}
                  className="text-sm text-[#F4F1EA] hover:text-[#E2BA6B] transition-colors tabular-nums block font-medium"
                >
                  {TGLC_CONTACT.telephone}
                </a>
                <a
                  href={`mailto:${TGLC_CONTACT.email}`}
                  className="text-[#CFA85E] hover:text-[#F2D8A0] transition-colors break-all block"
                >
                  {TGLC_CONTACT.email}
                </a>
              </div>

              <p className="text-[11px] text-[#8F98AA]">{TGLC_CONTACT.hours}</p>

              <Link
                page="privacy-discretion"
                className="text-[11px] text-[#B5AFA3] hover:text-[#E2BA6B] transition-colors inline-block pt-1"
              >
                Privacy &amp; Discretion →
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 3: Compact Social Channels + Legal & Copyright Row */}
        <FooterSocialMedia />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-[11px] text-[#8E8A83]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              © {new Date().getFullYear()} The Global Luxury Consortium Ltd
            </span>
            <Link page="privacy-policy" className="hover:text-[#F4F1EA] transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link page="terms" className="hover:text-[#F4F1EA] transition-colors">
              {t('footer.terms')}
            </Link>
            <Link page="cookie-policy" className="hover:text-[#F4F1EA] transition-colors">
              {t('footer.cookiePolicy')}
            </Link>
            <Link page="accessibility" className="hover:text-[#F4F1EA] transition-colors">
              {t('footer.accessibility')}
            </Link>
            <Link page="image-credits" className="hover:text-[#F4F1EA] transition-colors">
              {t('footer.imageCredits')}
            </Link>
            <Link page="sitemap" className="hover:text-[#F4F1EA] transition-colors">
              {t('footer.sitemap')}
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="min-h-[36px] inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#CFA85E] hover:text-[#FAF7F0] border border-[#242632] hover:border-[#8B672B] px-3 py-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>{t('cta.top')}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
