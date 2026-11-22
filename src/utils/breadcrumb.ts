import { PageRoute, RouteState } from '../types';
import { JOURNAL_ARTICLES, SERVICES_DATA } from '../data/tglcData';

export interface BreadcrumbItem {
  label: string;
  route?: PageRoute;
  params?: Partial<Omit<RouteState, 'page'>>;
  isCurrent?: boolean;
}

export interface BackLinkItem {
  label: string;
  route: PageRoute;
  params?: Partial<Omit<RouteState, 'page'>>;
}

const CONSORTIUM_SUBPAGE_LABELS: Partial<Record<PageRoute, string>> = {
  'consortium-concierge': '24/7 Bespoke Concierge',
  about: 'About TGLC',
  ethos: 'Our Ethos',
  approach: 'Our Approach',
  network: 'Our Network',
  'our-london': 'Our London',
  'privacy-discretion': 'Privacy & Discretion',
  'cultural-traditions': 'Islamic, Muslim & Global Traditions',
};

const HIDDEN_LONDON_SUBPAGE_LABELS: Partial<Record<PageRoute, string>> = {
  'hidden-london-subterranean': 'Underground Rooms',
  'hidden-london-industrial': 'Architecture & Design Spaces',
  'hidden-london-combat': 'Fight Nights',
  'hidden-london-gaming': 'Casino Nights',
  'hidden-london-maritime': 'Thames After Dark',
  'hidden-london-gastronomy': 'Supper Clubs & Late-Night Dining',
  'hidden-london-exploration': 'Rooftops & Rare Views',
  'hidden-london-after-hours': 'Jazz & Cocktail Bars',
  'hidden-london-urban-clubs': 'Club Nights',
  'hidden-london-itinerary': '24 Hours in London',
};

const STANDALONE_PAGE_LABELS: Partial<Record<PageRoute, string>> = {
  consortium: 'The Consortium',
  membership: 'Membership',
  'member-portal': 'Members',
  'commission-studio': 'Commission Studio',
  'case-studies': 'Signature Experiences',
  calendar: 'The Season',
  contact: 'Contact',
  faq: 'FAQ',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  'cookie-policy': 'Cookie Policy',
  accessibility: 'Accessibility',
  'image-credits': 'Image Credits',
  sitemap: 'Sitemap',
};

/**
 * Computes canonical hierarchical breadcrumb items for every route (except home).
 * Returns null on home so the hero remains uncluttered.
 */
export function getBreadcrumbsForRoute(route: RouteState): BreadcrumbItem[] | null {
  if (route.page === 'home' || route.page === 'not-found') return null;

  if (route.page === 'services') {
    return [
      { label: 'Home', route: 'home' },
      { label: 'Services', isCurrent: true },
    ];
  }

  if (route.page === 'service-detail' && route.serviceId) {
    const service = SERVICES_DATA.find((s) => s.id === route.serviceId);
    if (!service) return null;
    return [
      { label: 'Home', route: 'home' },
      { label: 'Services', route: 'services' },
      { label: service.title, isCurrent: true },
    ];
  }

  if (route.page === 'subservice-detail' && route.serviceId && route.subServiceId) {
    const service = SERVICES_DATA.find((s) => s.id === route.serviceId);
    const sub = service?.subServices.find((ss) => ss.id === route.subServiceId);
    if (!service || !sub) return null;
    return [
      { label: 'Home', route: 'home' },
      { label: 'Services', route: 'services' },
      { label: service.title, route: 'service-detail', params: { serviceId: service.id } },
      { label: sub.title, isCurrent: true },
    ];
  }

  if (route.page === 'journal') {
    return [
      { label: 'Home', route: 'home' },
      { label: 'Journal', isCurrent: true },
    ];
  }

  if (route.page === 'journal-article' && route.articleSlug) {
    const article = JOURNAL_ARTICLES.find((a) => a.slug === route.articleSlug);
    if (!article) return null;
    return [
      { label: 'Home', route: 'home' },
      { label: 'Journal', route: 'journal' },
      { label: article.category, route: 'journal' },
      { label: article.title, isCurrent: true },
    ];
  }

  if (route.page === 'hidden-london') {
    return [
      { label: 'Home', route: 'home' },
      { label: 'The Other Side of London', isCurrent: true },
    ];
  }

  const hiddenLabel = HIDDEN_LONDON_SUBPAGE_LABELS[route.page];
  if (hiddenLabel) {
    return [
      { label: 'Home', route: 'home' },
      { label: 'The Other Side of London', route: 'hidden-london' },
      { label: hiddenLabel, isCurrent: true },
    ];
  }

  const consortiumSubLabel = CONSORTIUM_SUBPAGE_LABELS[route.page];
  if (consortiumSubLabel) {
    return [
      { label: 'Home', route: 'home' },
      { label: 'The Consortium', route: 'consortium' },
      { label: consortiumSubLabel, isCurrent: true },
    ];
  }

  const standaloneLabel = STANDALONE_PAGE_LABELS[route.page];
  if (standaloneLabel) {
    return [
      { label: 'Home', route: 'home' },
      { label: standaloneLabel, isCurrent: true },
    ];
  }

  return null;
}

/**
 * Resolves the contextual back-link action for the right side of BreadcrumbNav.
 */
export function getBackLinkForRoute(route: RouteState): BackLinkItem | null {
  if (route.page === 'home' || route.page === 'not-found') return null;

  if (route.page === 'service-detail') {
    return { label: 'All Services', route: 'services' };
  }

  if (route.page === 'subservice-detail' && route.serviceId) {
    const service = SERVICES_DATA.find((s) => s.id === route.serviceId);
    if (service) {
      return {
        label: `Back to ${service.title}`,
        route: 'service-detail',
        params: { serviceId: service.id },
      };
    }
    return { label: 'All Services', route: 'services' };
  }

  if (route.page === 'journal-article') {
    return { label: 'Return to Journal', route: 'journal' };
  }

  if (HIDDEN_LONDON_SUBPAGE_LABELS[route.page]) {
    return { label: 'All Hidden London', route: 'hidden-london' };
  }

  if (CONSORTIUM_SUBPAGE_LABELS[route.page]) {
    return { label: 'Back to The Consortium', route: 'consortium' };
  }

  return { label: 'Back to Home', route: 'home' };
}
