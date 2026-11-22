import type { PageRoute, RouteState } from '../types';
import { JOURNAL_ARTICLES, SERVICES_DATA } from '../data/tglcData';
import { pathFor } from '../routing/routes';

export interface BreadcrumbHistoryEntry {
  path: string;
  page: PageRoute;
  label: string;
  parentLabel?: string;
  params?: Partial<Omit<RouteState, 'page'>>;
  visitedAt: number;
}

export const NAV_HISTORY_STORAGE_KEY = 'tglc_nav_history_v1';
export const DEFAULT_MAX_HISTORY = 7;

const STATIC_TRAIL_LABELS: Partial<
  Record<PageRoute, { label: string; parentLabel?: string }>
> = {
  home: { label: 'Home' },
  services: { label: 'Services' },
  consortium: { label: 'The Consortium' },
  'consortium-concierge': { label: '24/7 Concierge', parentLabel: 'The Consortium' },
  about: { label: 'About TGLC', parentLabel: 'The Consortium' },
  ethos: { label: 'Our Ethos', parentLabel: 'The Consortium' },
  approach: { label: 'Our Approach', parentLabel: 'The Consortium' },
  network: { label: 'Our Network', parentLabel: 'The Consortium' },
  'our-london': { label: 'Our London', parentLabel: 'The Consortium' },
  'privacy-discretion': { label: 'Privacy & Discretion', parentLabel: 'The Consortium' },
  'cultural-traditions': { label: 'Global Traditions', parentLabel: 'The Consortium' },
  membership: { label: 'Membership' },
  'member-portal': { label: 'Members' },
  'commission-studio': { label: 'Commission Studio' },
  'case-studies': { label: 'Signature Experiences' },
  calendar: { label: 'The Season' },
  journal: { label: 'The Journal' },
  contact: { label: 'Contact' },
  faq: { label: 'FAQ' },
  'hidden-london': { label: 'The Other Side of London' },
  'hidden-london-subterranean': { label: 'Underground Rooms', parentLabel: 'Hidden London' },
  'hidden-london-industrial': { label: 'Architecture & Design', parentLabel: 'Hidden London' },
  'hidden-london-combat': { label: 'Fight Nights', parentLabel: 'Hidden London' },
  'hidden-london-gaming': { label: 'Casino Nights', parentLabel: 'Hidden London' },
  'hidden-london-maritime': { label: 'Thames After Dark', parentLabel: 'Hidden London' },
  'hidden-london-gastronomy': { label: 'Supper Clubs', parentLabel: 'Hidden London' },
  'hidden-london-exploration': { label: 'Rooftops & Views', parentLabel: 'Hidden London' },
  'hidden-london-after-hours': { label: 'Jazz & Cocktail Bars', parentLabel: 'Hidden London' },
  'hidden-london-urban-clubs': { label: 'Club Nights', parentLabel: 'Hidden London' },
  'hidden-london-itinerary': { label: '24 Hours in London', parentLabel: 'Hidden London' },
  'privacy-policy': { label: 'Privacy Policy' },
  terms: { label: 'Terms & Conditions' },
  'cookie-policy': { label: 'Cookie Policy' },
  accessibility: { label: 'Accessibility' },
  'image-credits': { label: 'Image Credits' },
  sitemap: { label: 'Sitemap' },
};

export function getRouteTrailEntry(
  route: RouteState,
  visitedAt: number = Date.now()
): BreadcrumbHistoryEntry | null {
  if (route.page === 'not-found') return null;

  const params: Partial<Omit<RouteState, 'page'>> = {};
  if (route.serviceId) params.serviceId = route.serviceId;
  if (route.subServiceId) params.subServiceId = route.subServiceId;
  if (route.articleSlug) params.articleSlug = route.articleSlug;
  if (route.subSection) params.subSection = route.subSection;

  const path = pathFor(route.page, params);

  if (route.page === 'service-detail' && route.serviceId) {
    const service = SERVICES_DATA.find((s) => s.id === route.serviceId);
    if (!service) return null;
    return {
      path,
      page: route.page,
      label: service.title,
      parentLabel: 'Services',
      params,
      visitedAt,
    };
  }

  if (route.page === 'subservice-detail' && route.serviceId && route.subServiceId) {
    const service = SERVICES_DATA.find((s) => s.id === route.serviceId);
    const sub = service?.subServices.find((ss) => ss.id === route.subServiceId);
    if (!service || !sub) return null;
    return {
      path,
      page: route.page,
      label: sub.title,
      parentLabel: service.title,
      params,
      visitedAt,
    };
  }

  if (route.page === 'journal-article' && route.articleSlug) {
    const article = JOURNAL_ARTICLES.find((a) => a.slug === route.articleSlug);
    if (!article) return null;
    return {
      path,
      page: route.page,
      label: article.title.length > 38 ? `${article.title.slice(0, 35).trimEnd()}…` : article.title,
      parentLabel: 'Journal',
      params,
      visitedAt,
    };
  }

  const staticMeta = STATIC_TRAIL_LABELS[route.page];
  if (!staticMeta) return null;

  return {
    path,
    page: route.page,
    label: staticMeta.label,
    parentLabel: staticMeta.parentLabel,
    params: Object.keys(params).length > 0 ? params : undefined,
    visitedAt,
  };
}

/**
 * Pure reducer that appends a route visit to the persistent trail.
 * - Deduplicates by normalized path (if a user revisits an earlier step, moves it to the active end
 *   or truncates cleanly if jumping back in the trail? Keeping visited order with move-to-end ensures
 *   their chronological journey stays accurate and free of repeated loops).
 * - Caps the stored trail to `maxItems` most recent entries.
 */
export function recordRouteVisit(
  current: BreadcrumbHistoryEntry[],
  route: RouteState,
  options: { maxItems?: number; now?: number } = {}
): BreadcrumbHistoryEntry[] {
  const maxItems = options.maxItems ?? DEFAULT_MAX_HISTORY;
  const entry = getRouteTrailEntry(route, options.now ?? Date.now());
  if (!entry) return current;

  const last = current[current.length - 1];
  if (last && last.path === entry.path) {
    return current;
  }

  const withoutDuplicate = current.filter((item) => item.path !== entry.path);
  const next = [...withoutDuplicate, entry];
  return next.length > maxItems ? next.slice(next.length - maxItems) : next;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getDefaultStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readNavigationHistory(storage?: StorageLike | null): BreadcrumbHistoryEntry[] {
  const target = storage === undefined ? getDefaultStorage() : storage;
  if (!target) return [];
  try {
    const raw = target.getItem(NAV_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BreadcrumbHistoryEntry =>
        Boolean(
          item &&
            typeof item === 'object' &&
            typeof item.path === 'string' &&
            typeof item.page === 'string' &&
            typeof item.label === 'string'
        )
    );
  } catch {
    return [];
  }
}

export function writeNavigationHistory(
  entries: BreadcrumbHistoryEntry[],
  storage?: StorageLike | null
): void {
  const target = storage === undefined ? getDefaultStorage() : storage;
  if (!target) return;
  try {
    target.setItem(NAV_HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage quota or private-mode errors gracefully
  }
}

export function clearNavigationHistory(storage?: StorageLike | null): void {
  const target = storage === undefined ? getDefaultStorage() : storage;
  if (!target) return;
  try {
    target.removeItem(NAV_HISTORY_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
