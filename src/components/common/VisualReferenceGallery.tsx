import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { SmartImage } from './SmartImage';
import type { VisualReferenceItem } from '../../utils/visualReference';
import { preloadImage } from '../../utils/routeImagePreloader';

export interface VisualReferenceGalleryProps {
  items: VisualReferenceItem[];
  heading?: string;
  kicker?: string;
  subtitle?: string;
  sectionClassName?: string;
}

export const VisualReferenceGallery: React.FC<VisualReferenceGalleryProps> = ({
  items,
  heading = 'In pictures',
  kicker = 'Visual Reference',
  subtitle,
  sectionClassName = 'py-10 sm:py-14 px-5 sm:px-8 border-t border-[#1A1C24] bg-[#08090C]',
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle column-differentiated vertical drift on desktop scroll
  const col0Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [14, -14]);
  const col1Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [26, -22]);
  const col2Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [16, -16]);
  const columnTransforms = [col0Y, col1Y, col2Y];

  // Keyboard navigation & adjacent image preloading for the lightbox
  useEffect(() => {
    if (lightboxIndex === null || items.length === 0) return;

    const nextIdx = (lightboxIndex + 1) % items.length;
    const prevIdx = (lightboxIndex - 1 + items.length) % items.length;
    preloadImage(items[nextIdx].image, { priority: 'low' });
    preloadImage(items[prevIdx].image, { priority: 'low' });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % items.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + items.length) % items.length
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, items]);

  if (!items || items.length === 0) return null;

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section
      ref={sectionRef}
      data-visual-reference-gallery="true"
      className={`${sectionClassName} overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with subtle animated brass progress hairline */}
        <motion.div
          initial={{ opacity: 0.01, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1D1F28] pb-5"
        >
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CFA85E] block">
              {kicker}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F2D8A0]">{heading}</h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#B4BCCB] font-light max-w-2xl pt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[#A9B1C2]">
            <span className="tabular-nums text-[#CFA85E]">
              {String(items.length).padStart(2, '0')} Curated Frames
            </span>
            <span aria-hidden="true" className="text-[#2D3142]">
              ·
            </span>
            <span>Select any photograph to enlarge</span>
          </div>
        </motion.div>

        {/* Even 3x2 Desktop / 2x3 Tablet Editorial Grid with scroll-linked column drift */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, idx) => {
            const colIndex = idx % 3;
            const yOffset = columnTransforms[colIndex];

            return (
              <motion.figure
                key={`${item.image}-${idx}`}
                style={{ y: yOffset }}
                initial={{ opacity: 0.01, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: 0.6,
                  delay: (idx % 3) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                data-visual-reference-card={idx + 1}
                className="group relative bg-[#0D1017] border border-[#222532] hover:border-[#CFA85E]/75 transition-colors flex flex-col overflow-hidden shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View larger image ${idx + 1} of ${items.length}: ${item.caption}`}
                  className="text-left flex flex-col flex-1 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BA6B]"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#131722] relative">
                    <SmartImage
                      src={item.image}
                      alt={item.caption}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-cover brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/70 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#07080B]/80 border border-[#CFA85E]/35 text-[#E2BA6B] tabular-nums">
                      {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-[#07080B]/80 border border-[#2B2F3E] group-hover:border-[#CFA85E] text-[#D4D8E2] group-hover:text-[#E2BA6B] transition-colors">
                      <Expand className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <figcaption className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-2 border-t border-[#1D202C]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CFA85E]">
                      {item.tag}
                    </span>
                    <p className="text-xs sm:text-sm text-[#D4D8E2] font-light leading-relaxed group-hover:text-[#FAF7F0] transition-colors">
                      {item.caption}
                    </p>
                  </figcaption>
                </button>
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 inset-x-0 h-[2px] bg-[#E2BA6B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                />
              </motion.figure>
            );
          })}
        </div>
      </div>

      {/* Editorial Lightbox Modal */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            key="visual-reference-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Visual Reference frame ${lightboxIndex + 1} of ${items.length}`}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[100] bg-[#050608]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-[#0B0D12] border border-[#2C2F3E] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E212E] bg-[#08090D]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#CFA85E] tabular-nums">
                    {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                    {String(items.length).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#A9B1C2]">
                    {activeItem.tag}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close photograph viewer"
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#D4D8E2] hover:text-[#E2BA6B] border border-[#252836] hover:border-[#CFA85E] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Image Stage */}
              <div className="relative bg-[#07080B] aspect-[16/10] w-full max-h-[66vh] overflow-hidden flex items-center justify-center">
                <SmartImage
                  src={activeItem.image}
                  alt={activeItem.caption}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null ? 0 : (prev - 1 + items.length) % items.length
                    )
                  }
                  aria-label="Previous photograph"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-[#07080B]/85 hover:bg-[#CFA85E] text-[#E2BA6B] hover:text-[#07080B] border border-[#CFA85E]/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length))
                  }
                  aria-label="Next photograph"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-[#07080B]/85 hover:bg-[#CFA85E] text-[#E2BA6B] hover:text-[#07080B] border border-[#CFA85E]/40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Caption & Thumbnail Strip */}
              <div className="p-4 sm:p-5 bg-[#0B0D12] border-t border-[#1E212E] space-y-4">
                <p className="font-serif text-base sm:text-lg text-[#FAF7F0] leading-snug">
                  {activeItem.caption}
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {items.map((thumb, tIdx) => (
                    <button
                      key={`${thumb.image}-thumb-${tIdx}`}
                      type="button"
                      onClick={() => setLightboxIndex(tIdx)}
                      aria-label={`Select frame ${tIdx + 1}: ${thumb.caption}`}
                      className={`aspect-[16/10] overflow-hidden border transition-all cursor-pointer ${
                        tIdx === lightboxIndex
                          ? 'border-[#E2BA6B] ring-1 ring-[#E2BA6B]/60 opacity-100'
                          : 'border-[#252836] opacity-55 hover:opacity-90'
                      }`}
                    >
                      <SmartImage
                        src={thumb.image}
                        alt={thumb.caption}
                        maxWidth={400}
                        sizes="120px"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
