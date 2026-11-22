import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { JOURNAL_ARTICLES, TGLC_CONTACT } from '../../data/tglcData';
import { GoldDivider } from '../common/GoldDivider';
import { Link } from '../common/Link';
import { SmartImage } from '../common/SmartImage';
import { Reveal } from '../common/Reveal';
import {
  buildArticleExportDocument,
  calculateReadingTime,
  downloadExportAsPdf,
  downloadExportAsText,
  type ExportFormat,
} from '../../utils/documentExport';
import {
  ArrowRight,
  ArrowUpRight,
  Share2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Printer,
  Clock,
  Download,
  FileText,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleDetailPageProps {
  articleSlug?: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ articleSlug }) => {
  const { openIntroductionModal } = useNavigation();
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const article =
    JOURNAL_ARTICLES.find((a) => a.slug === articleSlug) || JOURNAL_ARTICLES[0];
  const relatedArticles = JOURNAL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const readingTime = useMemo(() => calculateReadingTime(article), [article]);

  const galleryItems: { image: string; caption: string }[] = [
    { image: article.heroImage, caption: article.title },
    ...(article.editorialImages || []).map((img, i) => ({
      image: img,
      caption: article.editorialCaptions?.[i] || article.title,
    })),
  ];

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % galleryItems.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + galleryItems.length) % galleryItems.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, galleryItems.length]);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExport = async (format: ExportFormat = exportFormat) => {
    if (exporting) return;
    setExporting(true);
    const doc = buildArticleExportDocument(article, readingTime.label);
    const baseName = `TGLC-Journal-${article.slug}`;
    const ok =
      format === 'pdf'
        ? await downloadExportAsPdf(baseName, doc)
        : downloadExportAsText(baseName, doc);
    setExporting(false);
    if (ok) {
      setExportSuccess(format);
      setTimeout(() => setExportSuccess(null), 2600);
    }
  };

  return (
    <article className="print-article-root bg-[#07080B] text-[#FAF7F0] min-h-screen pb-16">
      {/* Dedicated Hard-Copy Print Masthead (hidden on screen, visible in print) */}
      <div className="print-only border-b border-[#B98633] pb-4 mb-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <span className="font-mono text-[9pt] uppercase tracking-[0.22em] text-[#8B672B] block">
              The Global Luxury Consortium · Journal
            </span>
            <span className="font-serif text-[13pt] text-[#14171F]">
              Mayfair Private Office Edition
            </span>
          </div>
          <div className="text-right font-mono text-[8.5pt] text-[#4A5060]">
            <div>45 Albemarle Street, Mayfair, London W1S 4JL</div>
            <div>{TGLC_CONTACT.telephone} · {TGLC_CONTACT.email}</div>
          </div>
        </div>
      </div>

      {/* 1. Full-Width Cinema Hero Header */}
      <section className="relative w-full min-h-[54vh] sm:min-h-[62vh] flex items-end overflow-hidden border-b border-[#202432] bg-[#0D1017] print-hero-image-wrap">
        <div className="print-hero-photo-layer absolute inset-0 z-0">
          <SmartImage
            src={article.heroImage}
            alt={article.title}
            sizes="100vw"
            priority
            className="w-full h-full object-cover object-center brightness-[1.12] contrast-[1.03]"
          />
          <div className="print-hero-overlay absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/35 to-transparent" />
          <div className="print-hero-overlay absolute inset-0 bg-gradient-to-r from-[#07080B]/68 via-[#07080B]/22 to-transparent" />
        </div>

        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="no-print absolute top-24 sm:top-28 right-5 sm:right-8 z-20 px-3 py-1.5 bg-[#07080B]/80 border border-[#8B672B]/60 text-[11px] font-mono text-[#E2BA6B] hover:bg-[#E2BA6B] hover:text-[#07080B] inline-flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Open full-size photograph"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>View photo</span>
        </button>

        <div className="print-hero-copy-layer relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32 pb-10 sm:pb-12 space-y-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase tracking-[0.2em]">
            <span className="text-[#E2BA6B] print-accent-text">{article.category}</span>
            <span aria-hidden="true" className="text-[#6E7485]">·</span>
            <span
              data-reading-time="true"
              className="inline-flex items-center gap-1.5 text-[#E5DFD3]"
            >
              <Clock className="w-3.5 h-3.5 text-[#E2BA6B]" aria-hidden="true" />
              <span>{readingTime.label}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF7F0] leading-[1.08] font-normal max-w-4xl">
            {article.title}
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-[#E5E8F0] leading-relaxed max-w-3xl">
            {article.subtitle}
          </p>

          {/* Meta & Reader Utility Bar (Author, Reading Time, Print, Text/PDF Export, Share) */}
          <div className="pt-3 border-t border-[#2A2E3D]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[#B8BECC]">
              <span>
                By <span className="text-[#FAF7F0]">{article.author}</span>
              </span>
              <span aria-hidden="true" className="text-[#6E7485]">·</span>
              <span className="inline-flex items-center gap-1.5 text-[#E2BA6B]">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{readingTime.label}</span>
              </span>
            </div>

            <div className="no-print flex flex-wrap items-center gap-2">
              {/* Print Button */}
              <button
                type="button"
                data-article-print="true"
                onClick={handlePrint}
                className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-mono text-[#E5E8F0] hover:text-[#E2BA6B] bg-[#0B0D14]/85 hover:bg-[#131722] border border-[#2A2E3D] hover:border-[#CFA85E] px-3 py-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#E2BA6B]" aria-hidden="true" />
                <span>Print Article</span>
              </button>

              {/* Dual-Format Export Chooser (Text .txt / PDF .pdf) */}
              <div
                role="group"
                aria-label="Export article format"
                className="inline-flex items-center bg-[#0B0D14]/85 border border-[#2A2E3D] p-0.5"
              >
                <button
                  type="button"
                  data-export-format="txt"
                  onClick={() => setExportFormat('txt')}
                  aria-pressed={exportFormat === 'txt'}
                  className={`min-h-[34px] px-2.5 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    exportFormat === 'txt'
                      ? 'bg-[#1B2030] text-[#E2BA6B]'
                      : 'text-[#8F98AA] hover:text-[#FAF7F0]'
                  }`}
                >
                  TXT
                </button>
                <button
                  type="button"
                  data-export-format="pdf"
                  onClick={() => setExportFormat('pdf')}
                  aria-pressed={exportFormat === 'pdf'}
                  className={`min-h-[34px] px-2.5 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    exportFormat === 'pdf'
                      ? 'bg-[#1B2030] text-[#E2BA6B]'
                      : 'text-[#8F98AA] hover:text-[#FAF7F0]'
                  }`}
                >
                  PDF
                </button>
                <button
                  type="button"
                  data-article-export="true"
                  disabled={exporting}
                  onClick={() => void handleExport(exportFormat)}
                  className="min-h-[34px] ml-0.5 px-3 inline-flex items-center gap-1.5 text-xs font-mono text-[#07080B] bg-[#E2BA6B] hover:bg-[#F0CC83] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {exporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  ) : exportSuccess ? (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : exportFormat === 'pdf' ? (
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {exportSuccess
                      ? `Saved .${exportSuccess.toUpperCase()}`
                      : exportFormat === 'pdf'
                        ? 'Download .PDF'
                        : 'Download .TXT'}
                  </span>
                </button>
              </div>

              {/* Share Link Button */}
              <button
                type="button"
                onClick={handleShare}
                className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-mono text-[#B8BECC] hover:text-[#E2BA6B] bg-[#0B0D14]/85 border border-[#2A2E3D] hover:border-[#CFA85E] px-3 py-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#E2BA6B]" />
                    <span>Link copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Article Body */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-12 space-y-10">
        <div className="space-y-5 text-base sm:text-lg text-[#D4D8E2] leading-[1.8]">
          {article.contentParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {article.subheadings &&
          article.subheadings.map((section, idx) => {
            const inlineImage = article.editorialImages?.[idx];
            const inlineCaption = article.editorialCaptions?.[idx];
            return (
              <section key={section.title} className="space-y-5 pt-2">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] font-normal leading-snug">
                  {section.title}
                </h2>

                <div className="space-y-4 text-base sm:text-lg text-[#D4D8E2] leading-[1.8]">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {inlineImage && (
                  <figure className="print-article-figure pt-2 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx + 1)}
                      className="block w-full aspect-[16/10] overflow-hidden bg-[#12151E] border border-[#232736] hover:border-[#E2BA6B] transition-colors cursor-pointer group"
                    >
                      <SmartImage
                        src={inlineImage}
                        alt={inlineCaption || section.title}
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="w-full h-full object-cover brightness-105 contrast-105 group-hover:scale-104 transition-transform duration-700"
                      />
                    </button>
                    {inlineCaption && (
                      <figcaption className="text-xs font-serif italic text-[#8F98AA]">
                        {inlineCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            );
          })}

        {/* Hard-Copy Print Attribution Footer */}
        <div className="print-only pt-6 mt-8 border-t border-[#B98633] text-[9pt] text-[#4A5060] space-y-1">
          <div className="font-serif text-[10.5pt] text-[#14171F]">
            The Global Luxury Consortium · {TGLC_CONTACT.houseName}
          </div>
          <div>
            3rd Floor, 45 Albemarle Street, Mayfair, London W1S 4JL · Tel {TGLC_CONTACT.telephone} · {TGLC_CONTACT.email}
          </div>
          <div>Published for private reading. All arrangements are subject to availability.</div>
        </div>

        {/* End-of-article one-line CTA linking to the most relevant service page */}
        <div className="no-print print-callout pt-6 border-t border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1017] p-6 border">
          <p className="text-sm sm:text-base text-[#FAF7F0]">
            Need help planning this in London or abroad? Explore our{' '}
            <Link
              page="service-detail"
              params={{ serviceId: article.relatedServiceId }}
              className="text-[#E2BA6B] hover:underline font-medium"
            >
              {article.relatedServiceLabel}
            </Link>{' '}
            service.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              page="service-detail"
              params={{ serviceId: article.relatedServiceId }}
              className="btn-gold px-5 py-2.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => openIntroductionModal(`Enquiry from article: ${article.title}`)}
              className="btn-outline-gold px-4 py-2.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Enquire</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Related Articles */}
      <div className="no-print mt-14">
        <GoldDivider />
      </div>
      <section className="no-print max-w-7xl mx-auto px-5 sm:px-8 pt-12 space-y-6">
        <Reveal className="flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0]">More from the Journal</h2>
          <Link
            page="journal"
            className="text-xs text-[#E2BA6B] hover:text-[#FAF7F0] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>All articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => {
            const relReading = calculateReadingTime(rel);
            return (
              <Link
                key={rel.slug}
                page="journal-article"
                params={{ articleSlug: rel.slug }}
                className="bg-[#0D1017] border border-[#232736] hover:border-[#8B672B] transition-colors overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#12151E]">
                    <SmartImage
                      src={rel.heroImage}
                      alt={rel.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover brightness-105 contrast-105 group-hover:scale-104 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className="text-[#E2BA6B]">{rel.category}</span>
                      <span className="text-[#8F98AA]">{relReading.label}</span>
                    </div>
                    <h3 className="font-serif text-lg text-[#FAF7F0] group-hover:text-[#E2BA6B] transition-colors leading-snug">
                      <span className="card-title-underline">{rel.title}</span>
                    </h3>
                    <p className="text-xs text-[#D4D8E2] line-clamp-2">{rel.excerpt}</p>
                  </div>
                </div>
                <div className="px-5 pb-4 pt-2 text-xs text-[#E2BA6B] inline-flex items-center gap-1">
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="no-print fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full space-y-4"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close photo viewer"
                className="absolute -top-11 right-0 p-2 text-[#D4D8E2] hover:text-[#E2BA6B] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-[16/10] bg-[#07080B] border border-[#232736] overflow-hidden">
                <SmartImage
                  src={galleryItems[lightboxIndex].image}
                  alt={galleryItems[lightboxIndex].caption}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="w-full h-full object-contain"
                />
                {galleryItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex(
                          (lightboxIndex - 1 + galleryItems.length) % galleryItems.length
                        )
                      }
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#07080B]/80 text-[#E2BA6B] border border-[#8B672B]/50 hover:bg-[#E2BA6B] hover:text-[#07080B] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((lightboxIndex + 1) % galleryItems.length)
                      }
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#07080B]/80 text-[#E2BA6B] border border-[#8B672B]/50 hover:bg-[#E2BA6B] hover:text-[#07080B] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <p className="text-center font-serif italic text-sm text-[#D4D8E2]">
                {galleryItems[lightboxIndex].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
