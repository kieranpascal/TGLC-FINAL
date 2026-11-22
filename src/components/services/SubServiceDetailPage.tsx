import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigation } from '../../context/NavigationContext';
import { SERVICES_DATA, TGLC_CONTACT } from '../../data/tglcData';
import { getSubServiceFaqs } from '../../utils/faqHelpers';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';
import { GoldDivider } from '../common/GoldDivider';
import { Link } from '../common/Link';
import { SmartImage } from '../common/SmartImage';
import { Reveal } from '../common/Reveal';
import { CollapsibleFaqSection } from '../common/CollapsibleFaqSection';
import { VisualReferenceGallery } from '../common/VisualReferenceGallery';
import { getSubServiceHeroSlides } from '../../utils/carouselSlides';
import { buildSubServiceVisualReferences } from '../../utils/visualReference';

interface SubServiceDetailPageProps {
  serviceId?: string;
  subServiceId?: string;
}

export const SubServiceDetailPage: React.FC<SubServiceDetailPageProps> = ({ serviceId, subServiceId }) => {
  const { openIntroductionModal } = useNavigation();

  const parentService = SERVICES_DATA.find((s) => s.id === serviceId) || SERVICES_DATA[0];
  const subService = parentService.subServices.find((sub) => sub.id === subServiceId) || parentService.subServices[0];
  const siblingSubServices = parentService.subServices.filter((sub) => sub.id !== subService.id);
  const visualReferenceItems = buildSubServiceVisualReferences(subService, parentService, 6);
  const effectiveRegulatoryNote = subService.regulatoryNote ?? parentService.regulatoryNote;
  const displayFaqs = getSubServiceFaqs(subService, parentService);

  const subServiceSlides = getSubServiceHeroSlides(subService, parentService);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
    setHasAdvanced(false);
  }, [subService.id]);

  useEffect(() => {
    if (isPaused || subServiceSlides.length <= 1) return;
    const interval = setInterval(() => {
      setHasAdvanced(true);
      setCurrentSlide((prev) => (prev + 1) % subServiceSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, subServiceSlides.length]);

  const nextSlideSrc =
    hasAdvanced && subServiceSlides.length > 1
      ? subServiceSlides[(currentSlide + 1) % subServiceSlides.length]
      : null;

  return (
    <div className="bg-[#08090C] text-[#F4F1EA] selection:bg-[#B98633]/30 selection:text-[#F4F1EA] overflow-x-clip pb-14">
      {/* 1. Hero */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative min-h-[48vh] sm:min-h-[56vh] flex items-center justify-center border-b border-[#20222B] pt-24 sm:pt-28 pb-20 overflow-hidden select-none"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={subServiceSlides[currentSlide] || subService.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <SmartImage
                src={subServiceSlides[currentSlide] || subService.image}
                alt={subService.title}
                sizes="100vw"
                priority={currentSlide === 0}
                className="w-full h-full object-cover object-center brightness-[1.12] contrast-[1.03]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C]/88 via-[#08090C]/28 to-[#08090C]/28" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090C]/45 via-transparent to-[#08090C]/35 hidden sm:block" />
          </motion.div>
        </AnimatePresence>
        {nextSlideSrc && (
          <div aria-hidden="true" className="hidden">
            <SmartImage src={nextSlideSrc} alt="" sizes="100vw" />
          </div>
        )}

        {/* Carousel Slide Controls */}
        {subServiceSlides.length > 1 && (
          <div className="absolute bottom-5 right-4 sm:right-6 z-20 flex items-center gap-3 bg-[#08090C]/85 backdrop-blur-md px-3.5 py-1.5 border border-[#8B672B]/45">
            <div className="flex items-center gap-1.5">
              {subServiceSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setHasAdvanced(true);
                    setCurrentSlide(idx);
                  }}
                  className={`h-[3px] transition-all duration-300 cursor-pointer ${
                    idx === currentSlide ? 'w-6 bg-[#CFA85E]' : 'w-2 bg-[#444] hover:bg-[#888]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-[#E2BA6B] tabular-nums pl-0.5">
              {String(currentSlide + 1).padStart(2, '0')} / {String(subServiceSlides.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1 ml-1 border-l border-[#2B2D3A] pl-2">
              <button
                type="button"
                onClick={() => {
                  setHasAdvanced(true);
                  setCurrentSlide((prev) => (prev - 1 + subServiceSlides.length) % subServiceSlides.length);
                }}
                className="p-1.5 text-[#9C968A] hover:text-[#CFA85E] transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasAdvanced(true);
                  setCurrentSlide((prev) => (prev + 1) % subServiceSlides.length);
                }}
                className="p-1.5 text-[#9C968A] hover:text-[#CFA85E] transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#E2BA6B]">
            <Link page="services" className="hover:text-[#F4F1EA] transition-colors">
              Services
            </Link>
            <span className="text-[#8B672B]" aria-hidden="true">/</span>
            <Link
              page="service-detail"
              params={{ serviceId: parentService.id }}
              className="hover:text-[#F4F1EA] transition-colors"
            >
              {parentService.title}
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0.9, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.06] text-[#F4F1EA] text-balance"
          >
            {subService.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-sm sm:text-base text-[#E8E4DC] max-w-2xl mx-auto leading-relaxed font-light"
          >
            {subService.shortDesc}
          </motion.p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openIntroductionModal(`${parentService.title}: ${subService.title}`)}
              className="btn-gold min-h-[44px] px-7 py-3 text-xs inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Enquire about this service</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Balanced 12-Column Editorial Overview + Mayfair Desk Sidebar */}
      <section className="py-12 sm:py-16 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Lead Paragraph, Structured Coverage Grid & Practical Example */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="tglc-kicker text-[11px] block">
                Overview
              </span>
              <motion.p
                initial={{ opacity: 0.9, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] leading-snug"
              >
                {subService.leadParagraph}
              </motion.p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#20232E] pb-3">
                <h2 className="font-serif text-2xl text-[#FAF7F0]">
                  What this covers
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CFA85E]">
                  Key Areas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subService.detailedPoints.map((point, idx) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0.9, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="p-5 bg-[#0D1017] border border-[#242630] hover:border-[#8B672B] transition-colors flex items-start gap-3.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#E2BA6B] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-[#8F98AA] tabular-nums block">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs sm:text-sm text-[#E8E4DC] leading-relaxed">{point}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {subService.example && (
              <div className="p-6 bg-[#0D1017] border border-[#242630] relative space-y-2">
                <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#CFA85E]/70 via-[#CFA85E]/25 to-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block">
                  In Practice
                </span>
                <p className="font-serif italic text-lg sm:text-xl text-[#F4F1EA] leading-relaxed">
                  {subService.example}
                </p>
              </div>
            )}
          </div>

          {/* Right: Direct Mayfair Desk Sidebar Card */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-[#0D1017] border border-[#262936] p-6 sm:p-8 space-y-6 relative shadow-2xl">
              <span aria-hidden="true" className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#CFA85E]" />
              <span aria-hidden="true" className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#CFA85E]" />

              <div className="space-y-2 pb-4 border-b border-[#1E222E]">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block">
                  Mayfair Concierge Desk
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] leading-snug">
                  Leave the arrangements with us
                </h2>
                <p className="text-xs sm:text-sm text-[#B8BECC] leading-relaxed font-light">
                  Share your dates, location and the feel you are after. We check live availability with trusted contacts, walk you through clear choices and confirm every cost upfront before booking.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#CFA85E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8F98AA] block">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${TGLC_CONTACT.internationalPhone.replace(/\s+/g, '')}`}
                      className="text-sm font-serif text-[#E2BA6B] hover:text-white transition-colors tabular-nums"
                    >
                      {TGLC_CONTACT.telephone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#CFA85E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8F98AA] block">
                      Office Hours
                    </span>
                    <p className="text-[#D4D8E2]">{TGLC_CONTACT.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#CFA85E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8F98AA] block">
                      Mayfair Office
                    </span>
                    <p className="text-[#D4D8E2]">{TGLC_CONTACT.address.toString()}</p>
                  </div>
                </div>
              </div>

              {effectiveRegulatoryNote && (
                <p className="text-[11px] text-[#9C968A] leading-relaxed pt-3 border-t border-[#1E222E] font-light">
                  {effectiveRegulatoryNote}
                </p>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => openIntroductionModal(`${parentService.title}: ${subService.title}`)}
                  className="btn-gold w-full min-h-[44px] px-6 py-3.5 text-xs inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enquire about {subService.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <Link
                  page="service-detail"
                  params={{ serviceId: parentService.id }}
                  className="min-h-[40px] w-full text-xs text-[#CFA85E] hover:text-white transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>Explore all {parentService.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 3. Visual Reference Gallery (6 curated photographs with scroll choreography + lightbox) */}
      {visualReferenceItems.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <GoldDivider />
          </div>
          <VisualReferenceGallery
            items={visualReferenceItems}
            kicker="Visual Reference"
            heading="In pictures"
            subtitle={`Six curated photographs illustrating ${subService.title.toLowerCase()} and related ${parentService.title.toLowerCase()} arrangements.`}
            sectionClassName="py-10 sm:py-14 px-5 sm:px-8 lg:px-12 bg-[#08090C]"
          />
        </>
      )}

      {/* 4. Compact Collapsible FAQs (10+ numbered questions) */}
      {displayFaqs.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <GoldDivider />
          </div>
          <CollapsibleFaqSection
            items={displayFaqs.map((f) => ({ question: f.q, answer: f.a }))}
            kicker="Questions & Answers"
            heading="Common questions"
            previewCount={3}
            resetKey={`${parentService.id}-${subService.id}`}
            maxWidthClass="max-w-7xl"
            sectionClassName="py-10 sm:py-12 px-5 sm:px-8 lg:px-12"
          />
        </>
      )}

      {/* 5. More in {parentService.title} links */}
      {siblingSubServices.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <GoldDivider />
          </div>
          <section className="py-12 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#20232E]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block mb-1">
                  Related Support
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#F4F1EA]">
                  More in {parentService.title}
                </h2>
              </div>
              <Link
                page="service-detail"
                params={{ serviceId: parentService.id }}
                className="text-xs text-[#E2BA6B] hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>Back to {parentService.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {siblingSubServices.map((sib) => (
                <motion.div
                  key={sib.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <Link
                    page="subservice-detail"
                    params={{ serviceId: parentService.id, subServiceId: sib.id }}
                    className="group cursor-pointer p-4 bg-[#12141A] border border-[#242630] hover:border-[#8B672B] transition-all duration-300 flex flex-col justify-between gap-4 h-full"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/10] w-full overflow-hidden bg-[#181A22]">
                        <SmartImage
                          src={sib.image}
                          alt={sib.title}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover brightness-105 contrast-105 group-hover:scale-104 transition-transform duration-700"
                        />
                      </div>
                      <h3 className="font-serif text-lg text-[#F4F1EA] group-hover:text-[#DDB872] transition-colors leading-snug">
                        <span className="card-title-underline">{sib.title}</span>
                      </h3>
                      <p className="text-xs text-[#A9B0C0] leading-relaxed font-light line-clamp-2">
                        {sib.shortDesc}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#1E222E] flex items-center justify-between text-[11px] text-[#CFA85E] font-medium">
                      <span>View details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Curated 6th card to maintain 3x2 symmetry and invite bespoke requests */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={() => openIntroductionModal(`Bespoke ${parentService.title} enquiry`)}
                  className="group text-left w-full h-full cursor-pointer p-5 bg-gradient-to-br from-[#13151E] via-[#0D1017] to-[#11131B] border border-[#322C22] hover:border-[#CFA85E] transition-all duration-300 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block">
                      Bespoke Desk · Mayfair
                    </span>
                    <h3 className="font-serif text-2xl text-[#F2D8A0] group-hover:text-[#FFE7B3] transition-colors leading-snug">
                      Something specific in {parentService.title}?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B4BCCB] leading-relaxed font-light">
                      Share your dates, preferences or household brief directly with our Albemarle Street team and we will build an arrangement around you.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#222533] flex items-center justify-between text-xs text-[#E2BA6B] font-medium">
                    <span>Speak with our desk</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
