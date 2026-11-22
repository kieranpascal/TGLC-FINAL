import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  LanguageCode,
  LANGUAGE_MAP,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  isValidLanguageCode,
  translate,
} from '../data/translations';
import {
  LanguagePack,
  compileLanguagePack,
  translateStringWithPack,
} from './pageTranslator';

function loadPackFromDisk(lang: Exclude<LanguageCode, 'en'>): LanguagePack {
  const filePath = path.resolve(process.cwd(), 'public', 'i18n', `${lang}.json`);
  assert.ok(fs.existsSync(filePath), `Expected language pack at ${filePath}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as LanguagePack;
}

describe('LanguageSwitcher & Multi-Language Pack Integrity', () => {
  it('provides all 20 supported languages with valid metadata and RTL flags', () => {
    assert.equal(SUPPORTED_LANGUAGES.length, 20);
    for (const meta of SUPPORTED_LANGUAGES) {
      assert.equal(isValidLanguageCode(meta.code), true);
      assert.ok(meta.nativeName.trim().length > 0);
      assert.ok(meta.shortCode.trim().length >= 2);
      assert.ok(meta.dir === 'ltr' || meta.dir === 'rtl');
    }
    assert.equal(LANGUAGE_MAP.ar.dir, 'rtl');
    assert.equal(LANGUAGE_MAP.he.dir, 'rtl');
    assert.equal(LANGUAGE_MAP.ur.dir, 'rtl');
    assert.equal(LANGUAGE_MAP.en.dir, 'ltr');
    assert.equal(LANGUAGE_MAP.es.dir, 'ltr');
    assert.equal(LANGUAGE_MAP.fr.dir, 'ltr');
  });

  it('ships a non-empty static JSON translation pack in public/i18n/ for all 19 non-English languages', () => {
    const nonEnglish = SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en');
    assert.equal(nonEnglish.length, 19);

    for (const lang of nonEnglish) {
      const pack = loadPackFromDisk(lang.code as Exclude<LanguageCode, 'en'>);
      assert.equal(pack.lang, lang.code);
      assert.ok(Object.keys(pack.exact).length >= 100, `${lang.code} exact entries too small`);
      assert.ok(Object.keys(pack.words).length >= 300, `${lang.code} word lexicon too small`);
    }
  });

  it('translates menu labels, page titles, and hero headings cleanly across consecutive es -> fr -> ar -> en switches', () => {
    const esPack = compileLanguagePack(loadPackFromDisk('es'));
    const frPack = compileLanguagePack(loadPackFromDisk('fr'));
    const arPack = compileLanguagePack(loadPackFromDisk('ar'));

    // Menu keys via translate()
    assert.notEqual(translate('es', 'nav.services'), translate('en', 'nav.services'));
    assert.notEqual(translate('fr', 'nav.consortium'), translate('en', 'nav.consortium'));
    assert.notEqual(translate('ar', 'nav.services'), translate('en', 'nav.services'));
    assert.equal(translate('en', 'nav.services'), TRANSLATIONS.en['nav.services']);

    // Hero heading & subtitle strings (regression check for Hidden London Architecture page)
    const heroHeading = 'Architecture & Design Spaces';
    const heroSubtitle = 'Modernist flats, gallery lofts and private studios across the city.';
    const pageTitle = 'Frequently Asked Questions — TGLC';

    const esHeading = translateStringWithPack(heroHeading, esPack);
    const frHeading = translateStringWithPack(heroHeading, frPack);
    const arHeading = translateStringWithPack(heroHeading, arPack);

    assert.notEqual(esHeading.text, heroHeading);
    assert.notEqual(frHeading.text, heroHeading);
    assert.notEqual(arHeading.text, heroHeading);
    assert.notEqual(esHeading.text, frHeading.text);

    // Ensure known target strings are idempotent (never double-translated or corrupted)
    assert.equal(translateStringWithPack(esHeading.text, esPack).text, esHeading.text);
    assert.equal(translateStringWithPack(frHeading.text, frPack).text, frHeading.text);
    assert.equal(translateStringWithPack(arHeading.text, arPack).text, arHeading.text);

    // Ensure full hero subtitle translates cleanly without English leakage
    const esSub = translateStringWithPack(heroSubtitle, esPack).text;
    const frSub = translateStringWithPack(heroSubtitle, frPack).text;
    assert.ok(!/\bModernist\b/i.test(esSub), `Expected Spanish translation for subtitle, got: ${esSub}`);
    assert.ok(!/\bstudios across the city\b/i.test(frSub), `Expected French translation for subtitle, got: ${frSub}`);

    // Page title translates cleanly in each target pack (including em-dash SEO titles)
    assert.notEqual(translateStringWithPack(pageTitle, esPack).text, pageTitle);
    assert.notEqual(translateStringWithPack(pageTitle, frPack).text, pageTitle);
    assert.notEqual(translateStringWithPack(pageTitle, arPack).text, pageTitle);
  });
});
