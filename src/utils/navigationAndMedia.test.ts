import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SERVICES_DATA } from '../data/tglcData';
import { HIDDEN_LONDON_SECTIONS } from '../components/access/HiddenLondonPage';
import { HIDDEN_LONDON_IDEA_DETAILS, getHiddenLondonIdeaDetail } from '../data/hiddenLondonDetails';
import {
  clearNavigationHistory,
  getRouteTrailEntry,
  NAV_HISTORY_STORAGE_KEY,
  readNavigationHistory,
  recordRouteVisit,
  StorageLike,
  writeNavigationHistory,
} from './breadcrumbHistory';
import { getBreadcrumbsForRoute } from './breadcrumb';
import {
  clearPreloadCache,
  getCriticalImagesForRoute,
  getPreloadedImageCount,
  resolvePreloadUrl,
} from './routeImagePreloader';
import {
  buildServiceVisualReferences,
  buildSubServiceVisualReferences,
} from './visualReference';

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
  };
}

test('all 7 service categories have an even count of 6 sub-services (42 total)', () => {
  assert.equal(SERVICES_DATA.length, 7);
  for (const service of SERVICES_DATA) {
    assert.equal(
      service.subServices.length,
      6,
      `Expected ${service.id} to have exactly 6 sub-services for balanced 2x3 / 3x2 grids, got ${service.subServices.length}`
    );
  }
  const total = SERVICES_DATA.reduce((sum, s) => sum + s.subServices.length, 0);
  assert.equal(total, 42);
});

test('every ServiceDetailPage and SubServiceDetailPage Visual Reference gallery has 6 unique valid photographs', () => {
  const publicRoot = path.resolve(process.cwd(), 'public');

  for (const service of SERVICES_DATA) {
    const categoryRefs = buildServiceVisualReferences(service, 6);
    assert.equal(
      categoryRefs.length,
      6,
      `${service.id} visual reference must have exactly 6 photographs`
    );
    assert.equal(
      new Set(categoryRefs.map((r) => r.image)).size,
      6,
      `${service.id} visual reference photographs must be unique`
    );
    for (const ref of categoryRefs) {
      assert.ok(ref.caption.length > 8, `Missing caption for ${service.id} -> ${ref.image}`);
      assert.ok(
        fs.existsSync(path.join(publicRoot, ref.image.replace(/^\//, ''))),
        `Missing image on disk: ${ref.image}`
      );
    }

    for (const sub of service.subServices) {
      const subRefs = buildSubServiceVisualReferences(sub, service, 6);
      assert.equal(
        subRefs.length,
        6,
        `${service.id}/${sub.id} visual reference must have exactly 6 photographs`
      );
      assert.equal(
        new Set(subRefs.map((r) => r.image)).size,
        6,
        `${service.id}/${sub.id} visual reference photographs must be unique`
      );
      for (const ref of subRefs) {
        assert.ok(
          fs.existsSync(path.join(publicRoot, ref.image.replace(/^\//, ''))),
          `Missing image on disk: ${ref.image}`
        );
      }
    }
  }
});

test('every Hidden London idea (all 30 across 10 sections) has a rich multi-image detail dossier', () => {
  const publicRoot = path.resolve(process.cwd(), 'public');
  let totalIdeas = 0;

  for (const section of HIDDEN_LONDON_SECTIONS) {
    assert.equal(section.ideas.length, 3, `Section ${section.id} should have 3 balanced cards`);
    for (const idea of section.ideas) {
      totalIdeas += 1;
      assert.ok(
        HIDDEN_LONDON_IDEA_DETAILS[idea.title],
        `Missing dedicated Hidden London dossier for "${idea.title}"`
      );
      const detail = getHiddenLondonIdeaDetail(idea.title, idea.image, idea.summary);
      assert.ok(
        detail.gallery.length >= 3,
        `"${idea.title}" modal gallery must have at least 3 curated photographs`
      );
      assert.ok(detail.arrangements.length >= 3, `"${idea.title}" must list >= 3 arrangements`);
      assert.ok(detail.editorialOverview.length >= 120, `"${idea.title}" editorial overview too short`);
      for (const photo of detail.gallery) {
        assert.ok(
          fs.existsSync(path.join(publicRoot, photo.image.replace(/^\//, ''))),
          `Missing Hidden London modal image on disk: ${photo.image}`
        );
      }
    }
  }

  assert.equal(totalIdeas, 30);
});

test('persistent breadcrumb history records nested service journeys, deduplicates revisits, persists, and clears cleanly', () => {
  const storage = createMemoryStorage();
  let trail = readNavigationHistory(storage);
  assert.deepEqual(trail, []);

  trail = recordRouteVisit(trail, { page: 'home' }, { now: 100 });
  trail = recordRouteVisit(trail, { page: 'services' }, { now: 200 });
  trail = recordRouteVisit(
    trail,
    { page: 'service-detail', serviceId: 'travel-aviation' },
    { now: 300 }
  );
  trail = recordRouteVisit(
    trail,
    { page: 'subservice-detail', serviceId: 'travel-aviation', subServiceId: 'private-aviation' },
    { now: 400 }
  );

  // Duplicate consecutive visit should be a no-op
  const afterSame = recordRouteVisit(
    trail,
    { page: 'subservice-detail', serviceId: 'travel-aviation', subServiceId: 'private-aviation' },
    { now: 500 }
  );
  assert.equal(afterSame.length, 4);
  assert.equal(afterSame[3].parentLabel, 'Travel & Aviation');
  assert.equal(afterSame[3].label, 'Private Aviation');

  // Revisiting Services moves it to the active end cleanly without duplicating
  const revisited = recordRouteVisit(afterSame, { page: 'services' }, { now: 600 });
  assert.equal(revisited.length, 4);
  assert.equal(revisited[revisited.length - 1].page, 'services');

  writeNavigationHistory(revisited, storage);
  assert.ok(storage.getItem(NAV_HISTORY_STORAGE_KEY));

  const reloaded = readNavigationHistory(storage);
  assert.equal(reloaded.length, 4);
  assert.equal(reloaded[0].page, 'home');
  assert.equal(reloaded[3].page, 'services');

  // Capping works
  let capped = reloaded;
  capped = recordRouteVisit(capped, { page: 'calendar' }, { maxItems: 3, now: 700 });
  assert.equal(capped.length, 3);
  assert.equal(capped[2].page, 'calendar');

  clearNavigationHistory(storage);
  assert.deepEqual(readNavigationHistory(storage), []);

  // Canonical breadcrumbs cover nested Hidden London & Consortium hierarchies while home stays null
  assert.equal(getBreadcrumbsForRoute({ page: 'home' }), null);
  const archCrumbs = getBreadcrumbsForRoute({ page: 'hidden-london-industrial' });
  assert.equal(archCrumbs?.length, 3);
  assert.equal(archCrumbs?.[2].label, 'Architecture & Design Spaces');

  const entry = getRouteTrailEntry({
    page: 'subservice-detail',
    serviceId: 'dining-nightlife',
    subServiceId: 'private-chefs-sommeliers',
  });
  assert.equal(entry?.label, 'Private Chefs & Cellars');
  assert.equal(entry?.parentLabel, 'Dining, Nightlife & Social Access');
});

test('routeImagePreloader resolves critical images across routes and maps them through imageManifest', () => {
  clearPreloadCache();
  assert.equal(getPreloadedImageCount(), 0);

  const routesToCheck = [
    { page: 'home' as const },
    { page: 'services' as const },
    { page: 'service-detail' as const, serviceId: 'travel-aviation' },
    {
      page: 'subservice-detail' as const,
      serviceId: 'transport-security',
      subServiceId: 'aviation-tarmac-transfers',
    },
    { page: 'hidden-london-industrial' as const },
    { page: 'cultural-traditions' as const },
  ];

  for (const r of routesToCheck) {
    const imgs = getCriticalImagesForRoute(r);
    assert.ok(imgs.length >= 3, `Expected >= 3 critical images for route ${r.page}`);
    assert.equal(imgs.length, new Set(imgs).size, `Critical images must be unique for ${r.page}`);
    for (const img of imgs) {
      const resolved = resolvePreloadUrl(img);
      assert.ok(resolved.length > 0, `Expected non-empty resolved URL for ${img}`);
    }
  }
});

test('HomePage contains exactly one Islamic, Muslim & Global Traditions section (no duplication)', () => {
  const homeSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/home/HomePage.tsx'),
    'utf8'
  );
  const sectionMatches = homeSource.match(/id="section-traditions"/g) || [];
  assert.equal(
    sectionMatches.length,
    1,
    `Expected exactly 1 section-traditions in HomePage.tsx, found ${sectionMatches.length}`
  );
});
