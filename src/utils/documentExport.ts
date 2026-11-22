import type { JournalArticle } from '../types';
import { TGLC_CONTACT } from '../data/tglcData';

export interface ReadingTimeResult {
  minutes: number;
  wordCount: number;
  label: string;
}

export interface ExportMetaRow {
  label: string;
  value: string;
}

export interface ExportSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ExportDocument {
  kicker: string;
  title: string;
  subtitle?: string;
  meta: ExportMetaRow[];
  sections: ExportSection[];
  footerLines: string[];
}

export type ExportFormat = 'txt' | 'pdf';

export interface BriefExportInput {
  briefRef: string;
  referenceLabel: string;
  planTitle: string;
  location: string;
  duration: string;
  estimatedHours: number;
  transportName: string;
  transportType: string;
  privacyName: string;
  privacyLevel: string;
  vehicleStyle: string;
  arrivalPoint: string;
  hospitalityStyle: string;
  supportLevel: string;
  enhancements: string[];
  departurePoint: string;
  guestCount: string;
  targetDate: string;
  notes: string;
}

const DEFAULT_WORDS_PER_MINUTE = 220;

export function countWords(text: string): number {
  const cleaned = text
    .replace(/[\u2014\u2013]/g, ' ')
    .replace(/[^\p{L}\p{N}'’-]+/gu, ' ')
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function calculateReadingTime(
  article: Pick<JournalArticle, 'title' | 'subtitle' | 'contentParagraphs' | 'subheadings'>,
  wordsPerMinute = DEFAULT_WORDS_PER_MINUTE
): ReadingTimeResult {
  const parts: string[] = [
    article.title,
    article.subtitle,
    ...(article.contentParagraphs || []),
  ];

  if (article.subheadings) {
    for (const section of article.subheadings) {
      parts.push(section.title);
      parts.push(...(section.paragraphs || []));
    }
  }

  const wordCount = countWords(parts.join(' '));
  const safeWpm = wordsPerMinute > 0 ? wordsPerMinute : DEFAULT_WORDS_PER_MINUTE;
  const minutes = Math.max(1, Math.ceil(wordCount / safeWpm));
  return {
    minutes,
    wordCount,
    label: `${minutes} min read`,
  };
}

export function sanitizeFilename(raw: string, fallback = 'TGLC-Document'): string {
  const clean = raw
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || fallback;
}

export function buildArticleExportDocument(
  article: JournalArticle,
  readingTimeLabel?: string
): ExportDocument {
  const reading = readingTimeLabel ?? calculateReadingTime(article).label;
  const sections: ExportSection[] = [];

  if (article.contentParagraphs.length > 0) {
    sections.push({
      paragraphs: [...article.contentParagraphs],
    });
  }

  if (article.subheadings && article.subheadings.length > 0) {
    for (const sub of article.subheadings) {
      sections.push({
        heading: sub.title,
        paragraphs: [...sub.paragraphs],
      });
    }
  }

  return {
    kicker: `The Global Luxury Consortium · Journal · ${article.category}`,
    title: article.title,
    subtitle: article.subtitle,
    meta: [
      { label: 'Category', value: article.category },
      { label: 'Author', value: article.author },
      { label: 'Reading Time', value: reading },
    ],
    sections,
    footerLines: [
      `${TGLC_CONTACT.houseName} · 3rd Floor, 45 Albemarle Street, Mayfair, London W1S 4JL`,
      `Telephone: ${TGLC_CONTACT.telephone} · Email: ${TGLC_CONTACT.email}`,
      'Published by The Global Luxury Consortium Ltd. All arrangements subject to availability.',
    ],
  };
}

export function buildBriefExportDocument(input: BriefExportInput): ExportDocument {
  const enhancements =
    input.enhancements.length > 0 ? input.enhancements : ['Standard planning only'];

  return {
    kicker: 'The Global Luxury Consortium · Private Brief',
    title: input.planTitle,
    subtitle: `Reference ${input.briefRef} · ${input.referenceLabel || 'LONDON-PLAN'}`,
    meta: [
      { label: 'Brief Reference', value: input.briefRef },
      { label: 'Label', value: input.referenceLabel },
      { label: 'Area', value: input.location },
      { label: 'Duration', value: `${input.duration} (approx. ${input.estimatedHours} hours)` },
      { label: 'Starting Point', value: input.departurePoint },
      { label: 'Party Size', value: input.guestCount },
      { label: 'Preferred Dates', value: input.targetDate },
    ],
    sections: [
      {
        heading: 'Travel & Privacy Preferences',
        bullets: [
          `Travel Preference: ${input.transportName} (${input.transportType})`,
          `Privacy Approach: ${input.privacyName} (${input.privacyLevel})`,
          `Vehicle Style: ${input.vehicleStyle}`,
          `Arrival & Transfer: ${input.arrivalPoint}`,
          `Dining & Drinks: ${input.hospitalityStyle}`,
          `Support Preference: ${input.supportLevel}`,
        ],
      },
      {
        heading: 'Optional Extras',
        bullets: enhancements,
      },
      {
        heading: 'Personal Notes',
        paragraphs: [input.notes || 'No additional notes provided.'],
      },
    ],
    footerLines: [
      'Availability: All arrangements are subject to availability.',
      `Mayfair Office: 3rd Floor, 45 Albemarle Street, Mayfair, London W1S 4JL`,
      `Telephone: ${TGLC_CONTACT.telephone} · Email: ${TGLC_CONTACT.email}`,
    ],
  };
}

export function formatExportDocumentAsText(doc: ExportDocument): string {
  const lines: string[] = [];
  const divider = '=====================================================';

  lines.push(`=== ${doc.kicker.toUpperCase()} ===`);
  lines.push('');
  lines.push(doc.title);
  if (doc.subtitle) {
    lines.push(doc.subtitle);
  }
  lines.push('');

  for (const row of doc.meta) {
    lines.push(`${row.label}: ${row.value}`);
  }

  for (const section of doc.sections) {
    lines.push('');
    if (section.heading) {
      lines.push(section.heading.toUpperCase());
      lines.push('-'.repeat(Math.min(section.heading.length, 48)));
    }
    if (section.paragraphs) {
      for (const p of section.paragraphs) {
        lines.push(p);
        lines.push('');
      }
    }
    if (section.bullets) {
      for (const b of section.bullets) {
        lines.push(`  - ${b}`);
      }
    }
  }

  lines.push('');
  lines.push(divider);
  for (const footerLine of doc.footerLines) {
    lines.push(footerLine);
  }
  lines.push(divider);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export function downloadExportAsText(filenameBase: string, doc: ExportDocument): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const content = formatExportDocumentAsText(doc);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(filenameBase)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

function normalizeForPdfFont(input: string): string {
  // jsPDF built-in Times/Helvetica supports WinAnsi; normalize typographic symbols cleanly
  return input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, ' -- ')
    .replace(/\u2013/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00B7/g, ' | ')
    .replace(/\u2022/g, '-');
}

export async function downloadExportAsPdf(
  filenameBase: string,
  doc: ExportDocument
): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 20;
    const contentWidth = pageWidth - marginX * 2;
    const bottomLimit = pageHeight - 24;
    let y = 20;

    const ensureSpace = (neededMm: number) => {
      if (y + neededMm > bottomLimit) {
        pdf.addPage();
        y = 22;
      }
    };

    // Brass top rule & Masthead
    pdf.setDrawColor(185, 134, 51);
    pdf.setLineWidth(0.7);
    pdf.line(marginX, 14, pageWidth - marginX, 14);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(156, 111, 41);
    pdf.text(normalizeForPdfFont(doc.kicker.toUpperCase()), marginX, y);
    y += 8;

    // Title
    pdf.setFont('times', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(20, 23, 31);
    const titleLines = pdf.splitTextToSize(normalizeForPdfFont(doc.title), contentWidth) as string[];
    pdf.text(titleLines, marginX, y);
    y += titleLines.length * 8.5 + 2;

    // Subtitle
    if (doc.subtitle) {
      pdf.setFont('times', 'italic');
      pdf.setFontSize(12.5);
      pdf.setTextColor(80, 86, 100);
      const subLines = pdf.splitTextToSize(normalizeForPdfFont(doc.subtitle), contentWidth) as string[];
      pdf.text(subLines, marginX, y);
      y += subLines.length * 6 + 3;
    }

    // Metadata box
    if (doc.meta.length > 0) {
      const metaHeight = Math.max(12, doc.meta.length * 5.6 + 6);
      ensureSpace(metaHeight + 4);
      pdf.setFillColor(248, 246, 241);
      pdf.setDrawColor(218, 205, 180);
      pdf.setLineWidth(0.3);
      pdf.rect(marginX, y, contentWidth, metaHeight, 'FD');

      let metaY = y + 6;
      for (const row of doc.meta) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(139, 103, 43);
        pdf.text(`${normalizeForPdfFont(row.label).toUpperCase()}:`, marginX + 4, metaY);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(32, 36, 46);
        const valueLines = pdf.splitTextToSize(
          normalizeForPdfFont(row.value),
          contentWidth - 46
        ) as string[];
        pdf.text(valueLines[0] || '', marginX + 42, metaY);
        metaY += 5.5;
      }
      y += metaHeight + 8;
    }

    // Body sections
    for (const section of doc.sections) {
      if (section.heading) {
        ensureSpace(14);
        pdf.setFont('times', 'bold');
        pdf.setFontSize(14.5);
        pdf.setTextColor(26, 30, 40);
        const hLines = pdf.splitTextToSize(normalizeForPdfFont(section.heading), contentWidth) as string[];
        pdf.text(hLines, marginX, y);
        y += hLines.length * 6.2 + 1.5;

        pdf.setDrawColor(207, 168, 94);
        pdf.setLineWidth(0.35);
        pdf.line(marginX, y, marginX + 26, y);
        y += 5;
      }

      if (section.paragraphs) {
        pdf.setFont('times', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(40, 44, 54);
        for (const p of section.paragraphs) {
          const pLines = pdf.splitTextToSize(normalizeForPdfFont(p), contentWidth) as string[];
          for (const line of pLines) {
            ensureSpace(6);
            pdf.text(line, marginX, y);
            y += 5.4;
          }
          y += 3.2;
        }
      }

      if (section.bullets) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(40, 44, 54);
        for (const b of section.bullets) {
          const bLines = pdf.splitTextToSize(
            `-  ${normalizeForPdfFont(b)}`,
            contentWidth - 4
          ) as string[];
          for (const line of bLines) {
            ensureSpace(6);
            pdf.text(line, marginX + 2, y);
            y += 5.2;
          }
          y += 1.4;
        }
        y += 3;
      }
    }

    // Footer block on last page
    ensureSpace(22);
    y += 4;
    pdf.setDrawColor(185, 134, 51);
    pdf.setLineWidth(0.4);
    pdf.line(marginX, y, pageWidth - marginX, y);
    y += 5.5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 106, 120);
    for (const line of doc.footerLines) {
      const fLines = pdf.splitTextToSize(normalizeForPdfFont(line), contentWidth) as string[];
      pdf.text(fLines, marginX, y);
      y += fLines.length * 4.4;
    }

    // Page numbers across every page
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(135, 140, 152);
      pdf.text(
        `The Global Luxury Consortium · Mayfair, London`,
        marginX,
        pageHeight - 10
      );
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - marginX,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    pdf.save(`${sanitizeFilename(filenameBase)}.pdf`);
    return true;
  } catch {
    return false;
  }
}
