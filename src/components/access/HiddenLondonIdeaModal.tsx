import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { SmartImage } from '../common/SmartImage';
import { getHiddenLondonIdeaDetail } from '../../data/hiddenLondonDetails';
import { preloadImage } from '../../utils/routeImagePreloader';

export interface SelectedHiddenLondonIdea {
  sectionTitle: string;
  sectionKicker?: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
}

export interface HiddenLondonIdeaModalProps {
  idea: SelectedHiddenLondonIdea | null;
  onClose: () => void;
  onEnquire: (subject: string) => void;
}

export const HiddenLondonIdeaModal: React.FC<HiddenLondonIdeaModalProps> = ({
  idea,
  onClose,
  onEnquire,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const detail = idea
    ? getHiddenLondonIdeaDetail(idea.title, idea.image, idea.summary)
    : null;
  const gallery = detail?.gallery ?? [];

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [idea?.title]);

  useEffect(() => {
    if (!idea || gallery.length === 0) return;

    // Preload all gallery frames cleanly once modal opens
    gallery.forEach((photo) => {
      preloadImage(photo.image, { priority: 'low' });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && gallery.length > 1) {
        setActivePhotoIndex((prev) => (prev + 1) % gallery.length);
      } else if (e.key === 'ArrowLeft' && gallery.length > 1) {
        setActivePhotoIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [idea, gallery, onClose]);

  const currentPhoto = gallery[activePhotoIndex] ?? gallery[0];

  return (
    <AnimatePresence>
      {idea && detail && (
        <motion.div
          key="hidden-london-idea-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hidden-london-modal-title"
          data-hidden-london-modal="true"
          onClick={onClose}
          className="fixed inset-0 z-[95] bg-[#050608]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-[#0B0D12] border border-[#2B2E3D] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-[#1E212E] bg-[#080A0F] shrink-0">
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block truncate">
                  {[idea.sectionKicker, idea.sectionTitle].filter(Boolean).join(' · ')}
                </span>
                <h2
                  id="hidden-london-modal-title"
                  className="font-serif text-xl sm:text-2xl text-[#FAF7F0] leading-tight truncate"
                >
                  {idea.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close experience details"
                className="min-w-[44px] min-h-[44px] shrink-0 flex items-center justify-center border border-[#262938] hover:border-[#CFA85E] text-[#D4D8E2] hover:text-[#E2BA6B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Multi-Image Interactive Gallery */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#242736] bg-[#11141E]">
                    {currentPhoto && (
                      <SmartImage
                        key={currentPhoto.image}
                        src={currentPhoto.image}
                        alt={currentPhoto.caption}
                        sizes="(max-width: 1024px) 100vw, 600px"
                        priority
                        className="w-full h-full object-cover brightness-105 contrast-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/75 via-transparent to-transparent" />

                    {/* Photo counter & prev/next controls */}
                    {gallery.length > 1 && (
                      <>
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#07080B]/85 border border-[#CFA85E]/40 font-mono text-[10px] uppercase tracking-[0.2em] text-[#E2BA6B] tabular-nums">
                          {String(activePhotoIndex + 1).padStart(2, '0')} /{' '}
                          {String(gallery.length).padStart(2, '0')}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePhotoIndex(
                              (prev) => (prev - 1 + gallery.length) % gallery.length
                            )
                          }
                          aria-label="Previous experience image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#07080B]/85 hover:bg-[#CFA85E] text-[#E2BA6B] hover:text-[#07080B] border border-[#CFA85E]/40 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePhotoIndex((prev) => (prev + 1) % gallery.length)
                          }
                          aria-label="Next experience image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#07080B]/85 hover:bg-[#CFA85E] text-[#E2BA6B] hover:text-[#07080B] border border-[#CFA85E]/40 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {currentPhoto && (
                      <div className="absolute bottom-3 inset-x-3.5 text-xs text-[#F4F1EA] font-light">
                        {currentPhoto.caption}
                      </div>
                    )}
                  </div>

                  {/* Interactive Thumbnail Strip */}
                  {gallery.length > 1 && (
                    <div
                      className={`grid gap-2.5 ${
                        gallery.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'
                      }`}
                    >
                      {gallery.map((photo, idx) => (
                        <button
                          key={`${photo.image}-${idx}`}
                          type="button"
                          onClick={() => setActivePhotoIndex(idx)}
                          aria-label={`View gallery photo ${idx + 1}: ${photo.caption}`}
                          data-modal-thumb={idx}
                          className={`aspect-[16/10] overflow-hidden border transition-all cursor-pointer ${
                            idx === activePhotoIndex
                              ? 'border-[#E2BA6B] opacity-100 ring-1 ring-[#E2BA6B]/50'
                              : 'border-[#232634] opacity-60 hover:opacity-95'
                          }`}
                        >
                          <SmartImage
                            src={photo.image}
                            alt={photo.caption}
                            maxWidth={400}
                            sizes="140px"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Key Logistics Metadata Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 bg-[#0E1119] border border-[#1F2230] space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#CFA85E]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>Enclave</span>
                      </div>
                      <p className="text-xs text-[#E5E8F0] leading-snug">{detail.enclave}</p>
                    </div>
                    <div className="p-3.5 bg-[#0E1119] border border-[#1F2230] space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#CFA85E]">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Pacing</span>
                      </div>
                      <p className="text-xs text-[#E5E8F0] leading-snug">{detail.pacing}</p>
                    </div>
                    <div className="p-3.5 bg-[#0E1119] border border-[#1F2230] space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#CFA85E]">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>Party Size</span>
                      </div>
                      <p className="text-xs text-[#E5E8F0] leading-snug">{detail.guestProfile}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Editorial Overview & Arrangements */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block">
                        Curated Brief
                      </span>
                      <p className="text-sm text-[#D4D8E2] font-light leading-relaxed">
                        {detail.editorialOverview}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#1D202C] space-y-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#CFA85E] block">
                        What Our Mayfair Desk Arranges
                      </span>
                      <ul className="space-y-2.5">
                        {detail.arrangements.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#DCE0EA] font-light leading-relaxed"
                          >
                            <Check className="w-4 h-4 text-[#CFA85E] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-[#0E1119] border-l-2 border-[#CFA85E] flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#CFA85E] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#B4BCCB] font-light leading-relaxed">
                        {detail.discretionNote}
                      </p>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-4 border-t border-[#1D202C] flex flex-col sm:flex-row lg:flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const subject = idea.title;
                        onClose();
                        onEnquire(subject);
                      }}
                      className="btn-gold w-full px-5 py-3.5 text-xs inline-flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                    >
                      <span>Ask about {idea.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#08090C]" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-outline-gold w-full px-5 py-3 text-xs min-h-[44px] cursor-pointer"
                    >
                      Back to {idea.sectionTitle}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
