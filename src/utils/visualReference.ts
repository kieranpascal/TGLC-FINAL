import type { ServiceCategory, SubService } from '../types';
import {
  SERVICE_CATEGORY_EXTRA_IMAGES,
  SUB_SERVICE_COMPANION_IMAGES,
} from './carouselSlides';

export interface VisualReferenceItem {
  image: string;
  caption: string;
  tag: string;
}

const CURATED_IMAGE_CAPTIONS: Record<string, { caption: string; tag: string }> = {
  '/assets/aistudio/private_jet_interior_suite.jpg': {
    caption: 'Long-range private aircraft cabin prepared for European or intercontinental departure',
    tag: 'Private Aviation',
  },
  '/assets/aistudio/698157105b08bd0b828e954b_file_k95qb05z_c7bc7f74.png': {
    caption: 'Charter jet positioned on a quiet apron with ground team standing by',
    tag: 'Flight Operations',
  },
  '/assets/aistudio/6a194620490b49214619b628_file_8wpx83o3_8d7f9f53.png': {
    caption: 'Bespoke cabin interior arranged for quiet, unhurried passage',
    tag: 'In-Flight Comfort',
  },
  '/assets/aistudio/6a5e4f29ca98c820c85071cd_file_l7dpoy6z_91be91a5.png': {
    caption: 'Private terminal ramp clearance ahead of an early departure',
    tag: 'Tarmac Access',
  },
  '/assets/aistudio/swiss_alpine_chalet.jpg': {
    caption: 'Catered alpine chalet prepared ahead of a winter mountain stay',
    tag: 'Alpine Retreats',
  },
  '/assets/aistudio/mediterranean_superyacht_deck.jpg': {
    caption: 'Sunlit superyacht deck overlooking calm coastal waters',
    tag: 'Yachting',
  },
  '/assets/aistudio/monaco_harbor_twilight_1794391696625.jpg': {
    caption: 'Twilight harbour mooring along the Mediterranean coast',
    tag: 'Coastal Escapes',
  },
  '/assets/aistudio/florence_palazzo_courtyard.jpg': {
    caption: 'Historic European palazzo courtyard reserved for private stays and dining',
    tag: 'European Travel',
  },
  '/assets/aistudio/highland_stone_estate_1794391698042.jpg': {
    caption: 'Secluded British stone country house set within private grounds',
    tag: 'Country Estates',
  },
  '/assets/aistudio/cotswolds_manor_estate.jpg': {
    caption: 'Georgian Cotswolds manor warmed and stocked ahead of a weekend retreat',
    tag: 'Countryside',
  },
  '/assets/aistudio/five_star_mayfair_suite.jpg': {
    caption: 'Signature Mayfair suite inspected and prepared prior to arrival',
    tag: 'London Suites',
  },
  '/assets/aistudio/hero_luxury_london_residence_1794298893032.jpg': {
    caption: 'Quiet Georgian drawing room in Mayfair and Belgravia',
    tag: 'London Residences',
  },
  '/assets/aistudio/dining_bespoke_cellar.jpg': {
    caption: 'Candlelit cellar dining room reserved for unhurried private hosting',
    tag: 'Private Dining',
  },
  '/assets/aistudio/rare_cellar_vault.jpg': {
    caption: 'Private wine vault curated for vintage tastings and intimate dinners',
    tag: 'Fine Cellars',
  },
  '/assets/aistudio/mayfair_fine_dining.jpg': {
    caption: 'Sought-after Mayfair dining room arranged with discreet table placement',
    tag: 'Mayfair Dining',
  },
  '/assets/aistudio/cultural_halal_gastronomy.jpg': {
    caption: 'Refined bespoke gastronomy tailored to household culinary standards',
    tag: 'Bespoke Menus',
  },
  '/assets/aistudio/cultural_iftar_mayfair_salon.jpg': {
    caption: 'Warm Georgian salon dressed for evening family hospitality',
    tag: 'Private Hosting',
  },
  '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg': {
    caption: 'Low-lit central London cocktail salon for late-evening conversation',
    tag: 'After Dark',
  },
  '/assets/aistudio/subrosa_catacomb_dinner.jpg': {
    caption: 'Historic vaulted room dressed with candlelight for a milestone dinner',
    tag: 'Private Rooms',
  },
  '/assets/aistudio/ginza_hinoki_omakase_1794391697612.jpg': {
    caption: 'Intimate chef counter experience arranged in London and abroad',
    tag: 'Chef Counters',
  },
  '/assets/aistudio/hidden_secret_gastronomy_1794295323821.jpg': {
    caption: 'Private tasting course served in a closed-door London dining room',
    tag: 'Culinary Access',
  },
  '/assets/aistudio/hidden_subterranean_vault_1794295323175.jpg': {
    caption: 'Secluded stone vault reserved away from public footfall',
    tag: 'Private Spaces',
  },
  '/assets/aistudio/tglc_st_james_salon.jpg': {
    caption: 'Quiet St James’s drawing room suited to confidential conversation',
    tag: 'St James’s',
  },
  '/assets/aistudio/meard_poker_sanctum.jpg': {
    caption: 'Private central London club salon arranged within house rules',
    tag: 'Members’ Salons',
  },
  '/assets/aistudio/soho_jazz_cellar_1794391689109.jpg': {
    caption: 'Intimate live jazz table in the heart of Soho',
    tag: 'Live Music',
  },
  '/assets/aistudio/urban_hiphop_club_1794391691841.jpg': {
    caption: 'Late-night London music venue with reserved table and car waiting',
    tag: 'Nightlife',
  },
  '/assets/aistudio/urban_vinyl_booth_deep.jpg': {
    caption: 'Audiophile vinyl listening booth booked for an after-hours evening',
    tag: 'Listening Rooms',
  },
  '/assets/aistudio/shoreditch_dj_loft_1794391691810.jpg': {
    caption: 'Private East London architectural loft hosted for music and gatherings',
    tag: 'East London',
  },
  '/assets/aistudio/royal_opera_box_1794391694654.jpg': {
    caption: 'Private theatre box overlooking a classic London auditorium',
    tag: 'Opera & Theatre',
  },
  '/assets/aistudio/royal_opera_gallery.jpg': {
    caption: 'Grand cultural hall ahead of a private evening performance',
    tag: 'Performing Arts',
  },
  '/assets/aistudio/frieze_gallery_pavilion_1794391697548.jpg': {
    caption: 'Unhurried gallery viewing during London’s contemporary art calendar',
    tag: 'Art & Design',
  },
  '/assets/aistudio/silvertown_silo_art.jpg': {
    caption: 'Curated contemporary installation viewed inside a private studio space',
    tag: 'Private Viewings',
  },
  '/assets/aistudio/hidden_brutalist_penthouse_1794295322915.jpg': {
    caption: 'Modernist London penthouse showcasing collectible interior architecture',
    tag: 'Architecture',
  },
  '/assets/aistudio/wimbledon_centre_court_1794391696846.jpg': {
    caption: 'Official hospitality and prime seating during the British summer season',
    tag: 'The Season',
  },
  '/assets/aistudio/calendar_ascot_lawn.jpg': {
    caption: 'Flagship British racing hospitality with chauffeur transfers',
    tag: 'Sporting Calendar',
  },
  '/assets/aistudio/wembley_vip_hospitality.jpg': {
    caption: 'Private hospitality suite for flagship London fixtures and concerts',
    tag: 'Arena Suites',
  },
  '/assets/aistudio/ufc_arena_ringside.jpg': {
    caption: 'Prime arena seating coordinated with pre-event dining and transfers',
    tag: 'Live Sport',
  },
  '/assets/aistudio/savile_row_bespoke.jpg': {
    caption: 'Unhurried morning bespoke tailoring appointment on Savile Row',
    tag: 'Savile Row',
  },
  '/assets/aistudio/savile_row_shears.jpg': {
    caption: 'Traditional British tailoring craft prepared by private appointment',
    tag: 'Craftsmanship',
  },
  '/assets/aistudio/bond_street_jewellery.jpg': {
    caption: 'Closed-door viewing room on Bond Street for fine jewellery and stones',
    tag: 'Bond Street',
  },
  '/assets/aistudio/high_jewellery_vault.jpg': {
    caption: 'Private high-jewellery presentation curated with trusted houses',
    tag: 'High Jewellery',
  },
  '/assets/aistudio/About-Luxury-Watches_77cb4520.jpg': {
    caption: 'Collector timepieces sourced through vetted independent horologists',
    tag: 'Fine Horology',
  },
  '/assets/aistudio/private_horology_cleanroom.jpg': {
    caption: 'Master watchmaker workshop visit arranged privately in London',
    tag: 'Independent Makers',
  },
  '/assets/aistudio/leather_saddlery_bench_1794391695162.jpg': {
    caption: 'Hand-stitched bespoke leather commission at a heritage London bench',
    tag: 'Commissions',
  },
  '/assets/aistudio/luxury_streetwear_salon_1794391693258.jpg': {
    caption: 'Private styling showroom prepared ahead of an appointment',
    tag: 'Private Styling',
  },
  '/assets/aistudio/shoreditch_street_couture.jpg': {
    caption: 'Curated contemporary fashion sourcing across central and east London',
    tag: 'Fashion Sourcing',
  },
  '/assets/aistudio/liberty-department-store-640x360_44860915.jpg': {
    caption: 'Iconic central London shopping landmarks navigated without queues',
    tag: 'Shopping Access',
  },
  '/assets/aistudio/01-Lethbridge-House-20-Cornwall-Terrace-Marylebone-London-UK-640x360_b59e806c.jpg': {
    caption: 'Regency terraced residence overlooking Regent’s Park',
    tag: 'Regent’s Park',
  },
  '/assets/aistudio/01-Neo-Bankside-Luxury-Penthouse-London-England-UK-640x360_c8f27abb.jpg': {
    caption: 'Contemporary riverside penthouse with sweeping skyline views',
    tag: 'Skyline Living',
  },
  '/assets/aistudio/property-category-highlight-82_3dc00e71.jpg': {
    caption: 'Prime London property introductions via regulated buying specialists',
    tag: 'Prime Property',
  },
  '/assets/aistudio/luxury_sprinter_jetvan.jpg': {
    caption: 'Executive cabin vehicle prepared for families and multi-stop schedules',
    tag: 'Executive Fleet',
  },
  '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp': {
    caption: 'Flagship chauffeur-driven motorcar awaiting discreet London departure',
    tag: 'Chauffeur Service',
  },
  '/assets/aistudio/mayfair_security_convoy.jpg': {
    caption: 'Coordinated multi-vehicle arrivals moving smoothly through Mayfair',
    tag: 'Arrival Logistics',
  },
  '/assets/aistudio/mayfair_alley_arrival_1794391693142.jpg': {
    caption: 'Quiet side-street drop-off planned away from busy main thoroughfares',
    tag: 'Quiet Arrivals',
  },
  '/assets/aistudio/close_protection_security.jpg': {
    caption: 'Calm, low-profile support through SIA-licensed independent specialists',
    tag: 'Licensed Protection',
  },
  '/assets/aistudio/01_BUGATTI-SOC2022_6775a49f.jpg': {
    caption: 'Rare collector supercar sourced and delivered via vetted specialists',
    tag: 'Collector Cars',
  },
  '/assets/aistudio/best-luxury-cars-2024_ab87bb7b.webp': {
    caption: 'Prestige touring vehicles prepared for London and country drives',
    tag: 'Prestige Motoring',
  },
  '/assets/aistudio/calendar_concours_blenheim.jpg': {
    caption: 'Concours-grade heritage motoring and private collector viewings',
    tag: 'Concours & Touring',
  },
  '/assets/aistudio/membership_sovereign_desk.jpg': {
    caption: 'Dedicated Mayfair lifestyle desk managing daily and seasonal requests',
    tag: 'Private Desk',
  },
  '/assets/aistudio/membership_sanctum_suite.jpg': {
    caption: 'Calm architectural interior prepared for private household meetings',
    tag: 'Private Sanctum',
  },
  '/assets/aistudio/corporate_ea_boardroom.jpg': {
    caption: 'Executive liaison supporting personal assistants and family offices',
    tag: 'Family Office',
  },
  '/assets/aistudio/consortium_overview_head.jpg': {
    caption: 'Our Albemarle Street office in the heart of Mayfair, London',
    tag: 'Albemarle Street',
  },
  '/assets/aistudio/consortium_ethos_sanctuary.jpg': {
    caption: 'Wood-panelled study reflecting calm judgement and personal discretion',
    tag: 'Quiet Discretion',
  },
  '/assets/aistudio/consortium_approach_board.jpg': {
    caption: 'Every detail mapped calmly in advance from one point of contact',
    tag: 'Bespoke Planning',
  },
  '/assets/aistudio/consortium_privacy_vault.jpg': {
    caption: 'Confidential consultation room dedicated to private member briefs',
    tag: 'Confidentiality',
  },
  '/assets/aistudio/consortium_network_global.jpg': {
    caption: 'Trusted partner relationships spanning London, Europe and beyond',
    tag: 'Global Network',
  },
  '/assets/aistudio/harley_medical_suite_1794391696088.jpg': {
    caption: 'Private Harley Street wellness and clinical introductions',
    tag: 'Private Wellness',
  },
  '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg': {
    caption: 'Private evening river vessel gliding calmly along the Thames',
    tag: 'Thames Private Hire',
  },
  '/assets/aistudio/MAIN-IMAGE-Shangri-La-The-Shard-London-Illuminate-Yacht-_571087f0.jpg': {
    caption: 'Evening river hospitality against London’s illuminated skyline',
    tag: 'London Skyline',
  },
  '/assets/aistudio/U2xzhqR8NqpZGDRNVta6Gk_fe26a8c6.jpg': {
    caption: 'Historic British academic architecture for family education visits',
    tag: 'Education Visits',
  },
};

function resolveVisualMeta(
  image: string,
  fallbackCaption: string,
  fallbackTag: string
): VisualReferenceItem {
  const known = CURATED_IMAGE_CAPTIONS[image];
  return {
    image,
    caption: fallbackCaption || known?.caption || `${fallbackTag} arranged through our Mayfair desk`,
    tag: known?.tag || fallbackTag,
  };
}

/**
 * Guarantees `targetCount` (default 6) distinct, contextually matched visual references
 * for a ServiceCategory's "Visual Reference / In pictures" showcase.
 */
export function buildServiceVisualReferences(
  service: ServiceCategory,
  targetCount = 6
): VisualReferenceItem[] {
  const seen = new Set<string>();
  const items: VisualReferenceItem[] = [];

  const pushUnique = (image: string, explicitCaption?: string, explicitTag?: string) => {
    const clean = image?.trim();
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    const known = CURATED_IMAGE_CAPTIONS[clean];
    items.push({
      image: clean,
      caption:
        explicitCaption ||
        known?.caption ||
        `${service.title} arranged discreetly from our Mayfair desk`,
      tag: explicitTag || known?.tag || service.title,
    });
  };

  // 1. Primary curated galleryImages defined on the service category
  (service.galleryImages || []).forEach((img, idx) => {
    pushUnique(img, service.galleryCaptions?.[idx]);
  });

  // 2. Sub-service hero photography (strictly relevant to this exact pillar)
  for (const sub of service.subServices) {
    if (items.length >= targetCount) break;
    pushUnique(sub.image, CURATED_IMAGE_CAPTIONS[sub.image]?.caption || sub.shortDesc, sub.title);
  }

  // 3. Curated pillar companion images
  for (const img of SERVICE_CATEGORY_EXTRA_IMAGES[service.id] || []) {
    if (items.length >= targetCount) break;
    pushUnique(img);
  }

  // 4. Category hero image if still needed
  if (items.length < targetCount && service.heroImage) {
    pushUnique(service.heroImage);
  }

  // 5. Sub-service secondary gallery images
  for (const sub of service.subServices) {
    if (items.length >= targetCount) break;
    for (const g of sub.galleryImages || []) {
      if (items.length >= targetCount) break;
      pushUnique(g.image, g.caption, sub.title);
    }
  }

  return items.slice(0, targetCount);
}

/**
 * Guarantees `targetCount` (default 6) distinct, contextually matched visual references
 * for a SubService's "Visual Reference / In pictures" showcase.
 */
export function buildSubServiceVisualReferences(
  subService: SubService,
  parentService: ServiceCategory,
  targetCount = 6
): VisualReferenceItem[] {
  const seen = new Set<string>();
  const items: VisualReferenceItem[] = [];

  const pushUnique = (image: string, explicitCaption?: string, explicitTag?: string) => {
    const clean = image?.trim();
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    const meta = resolveVisualMeta(clean, explicitCaption || '', explicitTag || subService.title);
    items.push(meta);
  };

  // 1. Sub-service dedicated gallery images first
  for (const g of subService.galleryImages || []) {
    pushUnique(g.image, g.caption, subService.title);
  }

  // 2. Sub-service companion curated images
  for (const img of SUB_SERVICE_COMPANION_IMAGES[subService.id] || []) {
    if (items.length >= targetCount) break;
    pushUnique(img);
  }

  // 3. Sub-service lead image
  if (items.length < targetCount && subService.image) {
    pushUnique(subService.image, CURATED_IMAGE_CAPTIONS[subService.image]?.caption || subService.shortDesc);
  }

  // 4. Parent category gallery + extra curated images
  (parentService.galleryImages || []).forEach((img, idx) => {
    if (items.length >= targetCount) return;
    pushUnique(img, parentService.galleryCaptions?.[idx], parentService.title);
  });

  for (const img of SERVICE_CATEGORY_EXTRA_IMAGES[parentService.id] || []) {
    if (items.length >= targetCount) break;
    pushUnique(img, undefined, parentService.title);
  }

  // 5. Sibling sub-service photography as final strictly-in-category fallback
  for (const sibling of parentService.subServices) {
    if (items.length >= targetCount) break;
    pushUnique(sibling.image, sibling.shortDesc, sibling.title);
  }

  return items.slice(0, targetCount);
}
