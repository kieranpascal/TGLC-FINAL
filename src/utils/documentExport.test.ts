import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  countWords,
  calculateReadingTime,
  sanitizeFilename,
  buildArticleExportDocument,
  buildBriefExportDocument,
  formatExportDocumentAsText,
} from './documentExport';
import { JOURNAL_ARTICLES } from '../data/tglcData';
import {
  compileLanguagePack,
  translateStringWithPack,
  type LanguagePack,
} from './pageTranslator';

describe('documentExport — reading time & pure formatting', () => {
  it('counts words accurately across whitespace and empty inputs', () => {
    assert.equal(countWords(''), 0);
    assert.equal(countWords('   \n\t  '), 0);
    assert.equal(countWords('Mayfair private concierge desk in London'), 6);
  });

  it('calculates reading time with minimum 1 min read and 220 WPM ceiling', () => {
    const shortResult = calculateReadingTime({
      title: 'Brief Note',
      subtitle: 'Short summary.',
      contentParagraphs: ['Just a few words here.'],
    });
    assert.equal(shortResult.minutes, 1);
    assert.equal(shortResult.label, '1 min read');
    assert.ok(shortResult.wordCount > 0);

    const longParagraph = Array.from({ length: 450 }, () => 'luxury').join(' ');
    const longResult = calculateReadingTime({
      title: 'Extended Editorial',
      subtitle: 'Overview',
      contentParagraphs: [longParagraph],
      subheadings: [{ title: 'Section Two', paragraphs: ['Additional quiet luxury note.'] }],
    });
    assert.equal(longResult.minutes, 3);
    assert.equal(longResult.label, '3 min read');
  });

  it('produces valid reading times for every article in JOURNAL_ARTICLES', () => {
    assert.ok(JOURNAL_ARTICLES.length >= 6);
    for (const article of JOURNAL_ARTICLES) {
      const rt = calculateReadingTime(article);
      assert.ok(rt.minutes >= 1 && rt.minutes <= 15, `${article.slug} reading time out of range: ${rt.minutes}`);
      assert.equal(rt.label, `${rt.minutes} min read`);
      assert.ok(rt.wordCount >= 40, `${article.slug} should have meaningful word count`);
    }
  });

  it('sanitizes filenames cleanly for TXT and PDF exports', () => {
    assert.equal(
      sanitizeFilename('The Global Luxury Consortium: Mayfair!'),
      'The-Global-Luxury-Consortium-Mayfair'
    );
    assert.equal(sanitizeFilename('   '), 'TGLC-Document');
  });

  it('builds structured article export documents and formats plain text cleanly', () => {
    const article = JOURNAL_ARTICLES[0];
    const doc = buildArticleExportDocument(article);
    assert.equal(doc.title, article.title);
    assert.ok(doc.kicker.includes('The Global Luxury Consortium'));
    assert.ok(doc.meta.some((m) => m.label === 'Reading Time' && /\d+ min read/.test(m.value)));
    assert.ok(doc.sections.length >= 1);

    const txt = formatExportDocumentAsText(doc);
    assert.ok(txt.includes('THE GLOBAL LUXURY CONSORTIUM'));
    assert.ok(txt.includes(article.title));
    assert.ok(txt.includes('45 Albemarle Street, Mayfair, London W1S 4JL'));
    assert.ok(txt.includes('Reading Time:'));
  });

  it('builds structured Commission Studio brief export documents', () => {
    const doc = buildBriefExportDocument({
      briefRef: 'TGLC-2026-8841',
      referenceLabel: 'MAYFAIR-WEEKEND',
      planTitle: 'Mayfair Weekend & Private Aviation',
      location: 'Mayfair & Cotswolds',
      duration: '48 Hours',
      estimatedHours: 48,
      transportName: 'Private Jet Charter',
      transportType: 'Heavy Jet',
      privacyName: 'Quiet Discretion',
      privacyLevel: 'High',
      vehicleStyle: 'Rolls-Royce Phantom',
      arrivalPoint: 'Farnborough Private Terminal',
      hospitalityStyle: 'Fine Dining & Halal Options',
      supportLevel: 'Dedicated Liaison',
      enhancements: ['Private Museum Tour', 'Savile Row Fitting'],
      departurePoint: 'London Mayfair',
      guestCount: '4 Guests',
      targetDate: 'June',
      notes: 'Unrushed family schedule.',
    });
    assert.equal(doc.title, 'Mayfair Weekend & Private Aviation');
    assert.equal(doc.meta.length, 7);
    const txt = formatExportDocumentAsText(doc);
    assert.ok(txt.includes('Mayfair Weekend & Private Aviation'));
    assert.ok(txt.includes('Brief Reference: TGLC-2026-8841'));
    assert.ok(txt.includes('Private Museum Tour'));
  });
});

describe('pageTranslator — 19-language menu, heading, and reading-time completeness', () => {
  const loadCompiled = (lang: string) => {
    const p = path.resolve(process.cwd(), 'public', 'i18n', `${lang}.json`);
    const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as LanguagePack;
    return compileLanguagePack(raw);
  };

  it('translates Architecture & Design Spaces and its subtitle cleanly into Spanish with zero English leftovers', () => {
    const es = loadCompiled('es');

    const h1 = translateStringWithPack('Architecture & Design Spaces', es);
    assert.equal(h1.isExact, true);
    assert.equal(h1.text, 'Espacios de Arquitectura y Diseño');

    const subtitle = translateStringWithPack(
      'Modernist flats, gallery lofts and private studios across the city.',
      es
    );
    assert.equal(subtitle.isExact, true);
    assert.equal(
      subtitle.text,
      'Apartamentos modernistas, lofts de galería y estudios privados por toda la ciudad.'
    );
    assert.ok(!subtitle.text.includes('Modernist flats'), 'Should not retain English "Modernist flats"');
  });

  it('translates numbered mobile menu items (e.g. "2. Architecture & Design Spaces") as exact matches', () => {
    const es = loadCompiled('es');
    const fr = loadCompiled('fr');

    const esItem = translateStringWithPack('2. Architecture & Design Spaces', es);
    assert.equal(esItem.isExact, true);
    assert.equal(esItem.text, '2. Espacios de Arquitectura y Diseño');

    const frItem = translateStringWithPack('1. Subterranean Sanctums', fr);
    assert.equal(frItem.isExact, true);
    assert.equal(frItem.text, '1. Sanctuaires Souterrains');
  });

  it('translates all key menu titles, Print/Export labels, and dynamic reading-time strings across es, fr, de, ar, zh', () => {
    const requiredStrings = [
      'Consortium Overview',
      'Bespoke Concierge',
      'About TGLC',
      'Our Ethos',
      'Our Approach',
      'Our Network',
      'Our London',
      'Privacy & Discretion',
      'Cultural & Islamic Hospitality',
      'The Other Side of London',
      'Experiences & Culture',
      'Residences & Relocation',
      'Transport & Security',
      'Personal & Private Office',
      'Luxury Sourcing',
      'Print Article',
      'Download .TXT',
      'Download .PDF',
      'Visual Reference',
      'In pictures',
    ];

    for (const lang of ['es', 'fr', 'de', 'ar', 'zh']) {
      const compiled = loadCompiled(lang);
      for (const s of requiredStrings) {
        const res = translateStringWithPack(s, compiled);
        assert.equal(res.isExact, true, `[${lang}] expected exact translation for "${s}", got "${res.text}"`);
        assert.notEqual(res.text, s, `[${lang}] "${s}" remained untranslated`);
      }
      const rt = translateStringWithPack('4 min read', compiled);
      assert.equal(rt.isExact, true, `[${lang}] expected exact translation for "4 min read"`);
      assert.ok(rt.text.includes('4'), `[${lang}] reading time should preserve number 4: "${rt.text}"`);
      assert.notEqual(rt.text, '4 min read');
    }
  });
});
