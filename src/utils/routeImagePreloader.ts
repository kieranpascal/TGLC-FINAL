import type { PageRoute, RouteState } from '../types';
import { JOURNAL_ARTICLES, SERVICES_DATA } from '../data/tglcData';
import { resolveSmartImage } from './smartImage';
import { getImageManifest } from './imageManifest';
import {
  CONSORTIUM_SUBPAGE_SLIDES,
  getServiceCategoryHeroSlides,
  getSubServiceHeroSlides,
} from './carouselSlides';

const MAX_CACHE_ENTRIES = 180;
const DEFAULT_CONCURRENCY = 4;

const preloadedUrls = new Set<string>();
const inFlightLoads = new Map<string, Promise<boolean>>();

const STATIC_ROUTE_CRITICAL_IMAGES: Partial<Record<PageRoute, string[]>> = {
  home: [
    '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp',
    '/assets/aistudio/hero_luxury_london_residence_1794298893032.jpg',
    '/assets/aistudio/private_jet_interior_suite.jpg',
    '/assets/aistudio/five_star_mayfair_suite.jpg',
  ],
  services: [
    '/assets/aistudio/private_jet_interior_suite.jpg',
    '/assets/aistudio/dining_bespoke_cellar.jpg',
    '/assets/aistudio/royal_opera_box_1794391694654.jpg',
    '/assets/aistudio/hero_luxury_london_residence_1794298893032.jpg',
    '/assets/aistudio/luxury_sprinter_jetvan.jpg',
  ],
  consortium: CONSORTIUM_SUBPAGE_SLIDES.overview.slice(0, 3).map((s) => s.image),
  'consortium-concierge': CONSORTIUM_SUBPAGE_SLIDES.concierge.slice(0, 3).map((s) => s.image),
  about: CONSORTIUM_SUBPAGE_SLIDES.about.slice(0, 3).map((s) => s.image),
  ethos: CONSORTIUM_SUBPAGE_SLIDES.ethos.slice(0, 3).map((s) => s.image),
  approach: CONSORTIUM_SUBPAGE_SLIDES.approach.slice(0, 3).map((s) => s.image),
  network: CONSORTIUM_SUBPAGE_SLIDES.network.slice(0, 3).map((s) => s.image),
  'our-london': CONSORTIUM_SUBPAGE_SLIDES['our-london'].slice(0, 3).map((s) => s.image),
  'privacy-discretion': CONSORTIUM_SUBPAGE_SLIDES.privacy.slice(0, 3).map((s) => s.image),
  'cultural-traditions': [
    '/assets/aistudio/cultural_iftar_mayfair_salon.jpg',
    '/assets/aistudio/cultural_halal_gastronomy.jpg',
    '/assets/aistudio/cultural_belgravia_family_suite.jpg',
    '/assets/aistudio/cultural_global_tea_salon.jpg',
  ],
  membership: [
    '/assets/aistudio/membership_sovereign_desk.jpg',
    '/assets/aistudio/membership_sanctum_suite.jpg',
    '/assets/aistudio/five_star_mayfair_suite.jpg',
  ],
  calendar: [
    '/assets/aistudio/calendar_ascot_lawn.jpg',
    '/assets/aistudio/wimbledon_centre_court_1794391696846.jpg',
    '/assets/aistudio/calendar_concours_blenheim.jpg',
    '/assets/aistudio/monaco_harbor_twilight_1794391696625.jpg',
  ],
  journal: [
    '/assets/aistudio/journal_editorial_brief.jpg',
    '/assets/aistudio/savile_row_bespoke.jpg',
    '/assets/aistudio/mayfair_fine_dining.jpg',
  ],
  'case-studies': [
    '/assets/aistudio/casestudies_hero_header.jpg',
    '/assets/aistudio/highland_stone_estate_1794391698042.jpg',
    '/assets/aistudio/mediterranean_superyacht_deck.jpg',
  ],
  'commission-studio': [
    '/assets/aistudio/corporate_ea_boardroom.jpg',
    '/assets/aistudio/tglc_st_james_salon.jpg',
  ],
  contact: ['/assets/aistudio/tglc_st_james_salon.jpg'],
  faq: ['/assets/aistudio/savile_row_bespoke.jpg'],
  'hidden-london': [
    '/assets/aistudio/urban_hiphop_club_1794391691841.jpg',
    '/assets/aistudio/subrosa_catacomb_dinner.jpg',
    '/assets/aistudio/hidden_brutalist_penthouse_1794295322915.jpg',
    '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg',
  ],
  'hidden-london-subterranean': [
    '/assets/aistudio/subrosa_catacomb_dinner.jpg',
    '/assets/aistudio/rare_cellar_vault.jpg',
    '/assets/aistudio/hidden_subterranean_vault_1794295323175.jpg',
  ],
  'hidden-london-industrial': [
    '/assets/aistudio/hidden_brutalist_penthouse_1794295322915.jpg',
    '/assets/aistudio/silvertown_silo_art.jpg',
    '/assets/aistudio/private_horology_cleanroom.jpg',
  ],
  'hidden-london-combat': [
    '/assets/aistudio/ufc_arena_ringside.jpg',
    '/assets/aistudio/bermondsey_boxing_vault.jpg',
    '/assets/aistudio/wembley_vip_hospitality.jpg',
  ],
  'hidden-london-gaming': [
    '/assets/aistudio/meard_poker_sanctum.jpg',
    '/assets/aistudio/tglc_st_james_salon.jpg',
    '/assets/aistudio/mayfair_alley_arrival_1794391693142.jpg',
  ],
  'hidden-london-maritime': [
    '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg',
    '/assets/aistudio/thames_drydock_supper.jpg',
    '/assets/aistudio/MAIN-IMAGE-Shangri-La-The-Shard-London-Illuminate-Yacht-_571087f0.jpg',
  ],
  'hidden-london-gastronomy': [
    '/assets/aistudio/ginza_hinoki_omakase_1794391697612.jpg',
    '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg',
    '/assets/aistudio/hidden_secret_gastronomy_1794295323821.jpg',
  ],
  'hidden-london-exploration': [
    '/assets/aistudio/five_star_mayfair_suite.jpg',
    '/assets/aistudio/01-Neo-Bankside-Luxury-Penthouse-London-England-UK-640x360_c8f27abb.jpg',
    '/assets/aistudio/hero_luxury_london_residence_1794298893032.jpg',
  ],
  'hidden-london-after-hours': [
    '/assets/aistudio/soho_jazz_cellar_1794391689109.jpg',
    '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg',
    '/assets/aistudio/spitalfields_crypt_exchange_1794391691802.jpg',
  ],
  'hidden-london-urban-clubs': [
    '/assets/aistudio/urban_vinyl_booth_deep.jpg',
    '/assets/aistudio/shoreditch_dj_loft_1794391691810.jpg',
    '/assets/aistudio/urban_hiphop_club_1794391691841.jpg',
  ],
  'hidden-london-itinerary': [
    '/assets/aistudio/savile_row_bespoke.jpg',
    '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg',
    '/assets/aistudio/soho_jazz_cellar_1794391689109.jpg',
  ],
};

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    const clean = url?.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out;
}

/**
 * Resolves the prioritized list of critical image assets to preload for a given route.
 * Returns raw source asset paths (which are automatically mapped through imageManifest.json
 * by `resolvePreloadUrl` prior to fetching).
 */
export function getCriticalImagesForRoute(route: RouteState): string[] {
  if (route.page === 'service-detail' && route.serviceId) {
    const service = SERVICES_DATA.find((s) => s.id === route.serviceId);
    if (!service) return [];
    const heroSlides = getServiceCategoryHeroSlides(service).slice(0, 3);
    const subThumbs = service.subServices.slice(0, 3).map((s) => s.image);
    return dedupeUrls([service.heroImage, ...heroSlides, ...subThumbs]).slice(0, 6);
  }

  if (route.page === 'subservice-detail' && route.serviceId && route.subServiceId) {
    const parent = SERVICES_DATA.find((s) => s.id === route.serviceId);
    const sub = parent?.subServices.find((ss) => ss.id === route.subServiceId);
    if (!parent || !sub) return [];
    const heroSlides = getSubServiceHeroSlides(sub, parent).slice(0, 4);
    const gallery = (sub.galleryImages || []).map((g) => g.image);
    return dedupeUrls([sub.image, ...heroSlides, ...gallery]).slice(0, 6);
  }

  if (route.page === 'journal-article' && route.articleSlug) {
    const article = JOURNAL_ARTICLES.find((a) => a.slug === route.articleSlug);
    if (!article) return [];
    return dedupeUrls([article.heroImage]).slice(0, 3);
  }

  return dedupeUrls(STATIC_ROUTE_CRITICAL_IMAGES[route.page] ?? []);
}

export function resolvePreloadUrl(src: string, maxWidth?: number): string {
  const manifest = getImageManifest();
  return resolveSmartImage(src, manifest, maxWidth).src;
}

function recordCachedUrl(url: string): void {
  if (preloadedUrls.size >= MAX_CACHE_ENTRIES) {
    const oldest = preloadedUrls.values().next().value;
    if (oldest) preloadedUrls.delete(oldest);
  }
  preloadedUrls.add(url);
}

export function isImagePreloaded(src: string, maxWidth?: number): boolean {
  const resolved = resolvePreloadUrl(src, maxWidth);
  return preloadedUrls.has(resolved) || preloadedUrls.has(src);
}

export function getPreloadedImageCount(): number {
  return preloadedUrls.size;
}

export function clearPreloadCache(): void {
  preloadedUrls.clear();
  inFlightLoads.clear();
}

export function preloadImage(
  src: string,
  options: { maxWidth?: number; priority?: 'high' | 'low' } = {}
): Promise<boolean> {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve(false);
  }

  const resolvedUrl = resolvePreloadUrl(src, options.maxWidth);
  if (!resolvedUrl) return Promise.resolve(false);

  if (preloadedUrls.has(resolvedUrl)) {
    return Promise.resolve(true);
  }

  const existing = inFlightLoads.get(resolvedUrl);
  if (existing) {
    return existing;
  }

  const promise = new Promise<boolean>((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    if (options.priority && 'fetchPriority' in img) {
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = options.priority;
    }

    const settle = (ok: boolean) => {
      inFlightLoads.delete(resolvedUrl);
      if (ok) {
        recordCachedUrl(resolvedUrl);
        recordCachedUrl(src);
      }
      resolve(ok);
    };

    img.onload = () => {
      if (typeof img.decode === 'function') {
        img
          .decode()
          .then(() => settle(true))
          .catch(() => settle(true));
      } else {
        settle(true);
      }
    };

    img.onerror = () => settle(false);
    img.src = resolvedUrl;
  });

  inFlightLoads.set(resolvedUrl, promise);
  return promise;
}

export async function preloadImages(
  sources: string[],
  options: { concurrency?: number; maxWidth?: number; priority?: 'high' | 'low' } = {}
): Promise<number> {
  const unique = dedupeUrls(sources);
  if (unique.length === 0) return 0;

  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY);
  let loaded = 0;
  let cursor = 0;

  const worker = async () => {
    while (cursor < unique.length) {
      const idx = cursor++;
      const ok = await preloadImage(unique[idx], {
        maxWidth: options.maxWidth,
        priority: options.priority,
      });
      if (ok) loaded += 1;
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, unique.length) }, worker));
  return loaded;
}

export function preloadRouteImages(
  route: RouteState,
  options: { maxWidth?: number; priority?: 'high' | 'low' } = {}
): Promise<number> {
  const images = getCriticalImagesForRoute(route);
  return preloadImages(images, options);
}
