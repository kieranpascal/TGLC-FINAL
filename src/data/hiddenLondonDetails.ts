export interface HiddenLondonGalleryPhoto {
  image: string;
  caption: string;
}

export interface HiddenLondonIdeaDetail {
  enclave: string;
  pacing: string;
  guestProfile: string;
  editorialOverview: string;
  arrangements: string[];
  discretionNote: string;
  gallery: HiddenLondonGalleryPhoto[];
}

/**
 * Expanded editorial dossiers and multi-image galleries for all 30 curated ideas
 * across "The Other Side of London" (HiddenLondonPage).
 */
export const HIDDEN_LONDON_IDEA_DETAILS: Record<string, HiddenLondonIdeaDetail> = {
  // 1. Underground Rooms
  'Historic Vault Private Dinner': {
    enclave: 'City of London & Clerkenwell',
    pacing: 'Evening · 3 to 4 hours',
    guestProfile: 'Private tables for 6 to 24 guests',
    editorialOverview:
      'Set beneath centuries-old brick arches away from London’s busy avenues, these licensed historic vaults pair hushed architectural drama with unhurried fine dining. We coordinate the menu, candlelit table styling, vintage wine pairings and discreet street-level reception so guests step seamlessly from Mayfair into an unforgettable private dining room.',
    arrangements: [
      'Exclusive room hire with bespoke seasonal or dietary-tailored tasting menu',
      'Sommelier-selected vintages or artisanal zero-proof botanical pairings',
      'Acoustic string duo or quiet playlist tailored to conversation',
      'Synchronized chauffeur arrivals and late-evening departures',
    ],
    discretionNote:
      'All bookings are arranged directly with licensed heritage venues under private host names, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/subrosa_catacomb_dinner.jpg', caption: 'Candlelit masonry vault set for a private multi-course supper' },
      { image: '/assets/aistudio/dining_bespoke_cellar.jpg', caption: 'Intimate cellar table arranged with bespoke floral and linen styling' },
      { image: '/assets/aistudio/hidden_subterranean_vault_1794295323175.jpg', caption: 'Secluded lower-level stone chamber reserved exclusively for your party' },
    ],
  },
  'Private Cellar Wine Tasting': {
    enclave: 'St James’s & Pall Mall',
    pacing: 'Late Afternoon or Evening · 2 to 3 hours',
    guestProfile: '2 to 14 guests',
    editorialOverview:
      'Beneath St James’s lie some of London’s oldest merchant cellars, home to rare back-vintage Bordeaux, Burgundy and Champagne. Your tasting is led privately by a senior sommelier or Master of Wine, paired with artisanal cheeses and small plates in complete calm.',
    arrangements: [
      'Private access to historic merchant tasting rooms in St James’s',
      'Curated flight of rare back-vintage bottles selected around your palate',
      'Artisanal charcuterie, cheeses and bespoke pairing plates',
      'Optional onward dinner reservation within a five-minute walk',
    ],
    discretionNote:
      'Hosted strictly by private appointment with established London wine merchants, subject to cellar availability.',
    gallery: [
      { image: '/assets/aistudio/rare_cellar_vault.jpg', caption: 'Historic racking and private tasting table beneath St James’s' },
      { image: '/assets/aistudio/dining_bespoke_cellar.jpg', caption: 'Guided pouring and cellar pairing in warm candlelit calm' },
      { image: '/assets/aistudio/tglc_st_james_salon.jpg', caption: 'Adjacent sitting room for unhurried conversation before or after tasting' },
    ],
  },
  'Chamber Music Below Ground': {
    enclave: 'Holborn & Central London',
    pacing: 'Evening · 2.5 to 3 hours',
    guestProfile: '10 to 40 guests',
    editorialOverview:
      'Stone vaults possess a natural warmth and acoustic intimacy that modern concert halls rarely replicate. We pair licensed architectural rooms with conservatory-trained string quartets or soloists, accompanied by champagne reception or late supper.',
    arrangements: [
      'Private booking of an acoustically rich vaulted London room',
      'Repertoire curated alongside conservatory-trained chamber musicians',
      'Pre-performance champagne reception or post-recital seated supper',
      'Dedicated host greeting and return chauffeur coordination',
    ],
    discretionNote:
      'Arranged exclusively in licensed heritage venues with full acoustic and hospitality staffing, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/hidden_subterranean_vault_1794295323175.jpg', caption: 'Vaulted masonry space prized for warm acoustic resonance' },
      { image: '/assets/aistudio/royal_opera_gallery.jpg', caption: 'Classical performance ambience shaped around a private guest list' },
      { image: '/assets/aistudio/subrosa_catacomb_dinner.jpg', caption: 'Optional seated candlelit supper following the recital' },
    ],
  },

  // 2. Architecture & Design Spaces
  'Barbican Private Architecture Walk': {
    enclave: 'Barbican & City of London',
    pacing: 'Late Afternoon · 2.5 to 3 hours',
    guestProfile: '1 to 8 guests',
    editorialOverview:
      'Discover London’s landmark post-war architectural masterpiece far beyond the public walkways. Accompanied by a practising architectural historian, explore elevated podium gardens, bush-hammered concrete terraces, the conservatory and—where private hosts welcome guests—a glimpse inside a restored modernist residence, finishing with supper nearby.',
    arrangements: [
      'Private architectural historian tailored to modernist design and urban history',
      'Curated route across podium gardens, lakeside terraces and conservatory spaces',
      'Optional introduction to a private design collector or modernist apartment host',
      'Chauffeur collection and nearby Clerkenwell or City supper table afterwards',
    ],
    discretionNote:
      'Every residential or studio visit is arranged strictly by prior invitation and owner consent, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/hidden_brutalist_penthouse_1794295322915.jpg', caption: 'Restored modernist interior celebrating architectural light and proportion' },
      { image: '/assets/aistudio/01-Neo-Bankside-Luxury-Penthouse-London-England-UK-640x360_c8f27abb.jpg', caption: 'Contemporary London architectural glazing and skyline geometry' },
      { image: '/assets/aistudio/frieze_gallery_pavilion_1794391697548.jpg', caption: 'Collectible design and curatorial dialogue along the route' },
      { image: '/assets/aistudio/mayfair_fine_dining.jpg', caption: 'Unhurried evening supper reserved to conclude the walk' },
    ],
  },
  'Southwark Craft Studio Visit': {
    enclave: 'Southwark, Bermondsey & Bankside',
    pacing: 'Afternoon · 2 to 3 hours',
    guestProfile: '1 to 6 guests',
    editorialOverview:
      'Step behind closed doors into working Southwark and Bankside ateliers where contemporary sculptors, furniture makers and ceramicists shape bespoke commissions. Meet makers directly at the bench with zero retail rush, followed by riverside drinks.',
    arrangements: [
      'Private studio introductions arranged directly with independent artists and makers',
      'Guided conversation on materials, patina and bespoke commission timelines',
      'Optional independent art or interiors adviser accompanying your visit',
      'Seamless chauffeur transfers and riverside dining reservation nearby',
    ],
    discretionNote:
      'All atelier visits are scheduled strictly around studio calendars by private appointment, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/silvertown_silo_art.jpg', caption: 'Large-scale sculptural and contemporary studio installation space' },
      { image: '/assets/aistudio/leather_saddlery_bench_1794391695162.jpg', caption: 'Close-up bench craftsmanship and tactile material samples' },
      { image: '/assets/aistudio/frieze_gallery_pavilion_1794391697548.jpg', caption: 'Private viewing of finished collector editions' },
    ],
  },
  'Independent Watchmaker Studio Visit': {
    enclave: 'Clerkenwell & Mayfair',
    pacing: 'Morning or Afternoon · 1.5 to 2.5 hours',
    guestProfile: '1 to 4 guests',
    editorialOverview:
      'Enter the quiet cleanroom of an independent British horologist to observe hand-finishing, movement assembly and bespoke dial craft up close. Ideal for seasoned collectors or anyone contemplating a personal timepiece commission.',
    arrangements: [
      'Private bench-side sitting with an independent London watchmaker',
      'Loupe inspection of hand-finished movements and rare collector pieces',
      'Discussion of bespoke dial, case or strap commissioning possibilities',
      'Private car transfers and St James’s or Mayfair lunch arranged afterwards',
    ],
    discretionNote:
      'Workshop appointments are held privately in small numbers to preserve bench focus, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/private_horology_cleanroom.jpg', caption: 'Precision watchmaking bench inside an independent London studio' },
      { image: '/assets/aistudio/About-Luxury-Watches_77cb4520.jpg', caption: 'Close examination of mechanical calibres and collector pieces' },
      { image: '/assets/aistudio/high_jewellery_vault.jpg', caption: 'Discreet private viewing table for bespoke commission discussions' },
    ],
  },

  // 3. Fight Nights
  'Arena Fight Night Ringside': {
    enclave: 'The O2, Wembley & Royal Albert Hall',
    pacing: 'Evening · 4 to 5 hours',
    guestProfile: '2 to 12 guests',
    editorialOverview:
      'Experience championship boxing and MMA cards from premier ringside seats or official hospitality suites without arena friction. We coordinate official tickets, pre-fight dining, VIP entrance routes and a chauffeur waiting at the final bell.',
    arrangements: [
      'Official ringside seating or private arena hospitality box sourcing',
      'Pre-fight dinner reserved at a top Mayfair or riverside restaurant',
      'Fast-track arena entry guidance and dedicated timing brief',
      'Standby chauffeur or private Thames river launch back to central London',
    ],
    discretionNote:
      'All tickets and hospitality suites are sourced through official arena and promoter channels, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/ufc_arena_ringside.jpg', caption: 'Prime ringside sightlines for flagship championship fight nights' },
      { image: '/assets/aistudio/wembley_vip_hospitality.jpg', caption: 'Private stadium hospitality lounge prior to the main card' },
      { image: '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp', caption: 'Standby chauffeur positioned for calm post-fight departure' },
    ],
  },
  'Private Boxing Coaching Session': {
    enclave: 'Bermondsey, Soho & Mayfair',
    pacing: 'Morning or Afternoon · 1.5 to 2 hours',
    guestProfile: '1 to 4 guests',
    editorialOverview:
      'Train one-to-one with a former professional boxer or elite pad coach inside a private London boxing gym booked exclusively for your session. Tailored to every ability level—from technical footwork and pad rounds to sharp conditioning.',
    arrangements: [
      'Exclusive private gym booking away from public peak hours',
      'Qualified former pro or championship-level boxing coach',
      'Fresh wraps, gloves, chilled towels and post-session recovery drinks',
      'Optional sports massage therapist or chauffeur transfer back to your hotel',
    ],
    discretionNote:
      'Sessions are led exclusively by insured, qualified coaches in licensed training studios, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/bermondsey_boxing_vault.jpg', caption: 'Private heritage boxing ring prepared for a closed-door session' },
      { image: '/assets/aistudio/harley_medical_suite_1794391696088.jpg', caption: 'Optional recovery and wellness consultation following training' },
      { image: '/assets/aistudio/luxury_sprinter_jetvan.jpg', caption: 'Door-to-door chauffeur transport to and from the gym' },
    ],
  },
  'Pre-Fight Dining & Transfers': {
    enclave: 'Mayfair to Arena Corridors',
    pacing: 'Full Evening · 5 to 6 hours',
    guestProfile: '2 to 10 guests',
    editorialOverview:
      'A great fight night flows effortlessly from first aperitif to final bell. We pair an unhurried early dinner in Mayfair with calibrated departure timing, avoiding arena gridlock via chauffeur or Thames river launch, plus a late nightcap afterwards.',
    arrangements: [
      'Early-evening table or private dining room timed to the undercard',
      'Synchronized chauffeur convoy or fast Thames launch to Greenwich Pier',
      'Late-night table held in Mayfair or Soho for post-fight drinks',
      'Single point of contact monitoring fight timings in real time',
    ],
    discretionNote:
      'Every restaurant, vehicle and river transfer is confirmed in advance under your preferred privacy settings.',
    gallery: [
      { image: '/assets/aistudio/mayfair_fine_dining.jpg', caption: 'Relaxed pre-fight supper timed cleanly ahead of ring walks' },
      { image: '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg', caption: 'Optional direct Thames launch bypassing arena road traffic' },
      { image: '/assets/aistudio/wembley_vip_hospitality.jpg', caption: 'Seamless transition from dining room to arena hospitality' },
    ],
  },

  // 4. Casino Nights
  'Licensed Mayfair Private Salon': {
    enclave: 'Mayfair & Park Lane',
    pacing: 'Evening · 3 to 5 hours',
    guestProfile: '2 to 10 guests (18+)',
    editorialOverview:
      'London’s historic Mayfair casinos are renowned worldwide for old-world architecture, Georgian dining rooms and hushed private gaming salons. We introduce you cleanly to UK-licensed houses, assisting with membership registration, dinner and private table arrangements.',
    arrangements: [
      'Advance introduction and guest registration with UKGC-licensed Mayfair houses',
      'Private salon or quiet table coordination within each club’s house rules',
      'Late-evening fine dining served tableside or in the house restaurant',
      'Discreet side-street chauffeur waiting until you are ready to depart',
    ],
    discretionNote:
      'Strictly 18+ at UK Gambling Commission-licensed venues; all entry remains subject to house membership rules and ID verification.',
    gallery: [
      { image: '/assets/aistudio/meard_poker_sanctum.jpg', caption: 'Hushed Mayfair private salon reserved away from the main floor' },
      { image: '/assets/aistudio/tglc_st_james_salon.jpg', caption: 'Classic wood-panelled hospitality lounge for unhurried conversation' },
      { image: '/assets/aistudio/mayfair_alley_arrival_1794391693142.jpg', caption: 'Low-profile Mayfair arrival and late-night chauffeur standby' },
    ],
  },
  'Evening Backgammon & Spirits': {
    enclave: 'St James’s & Mayfair',
    pacing: 'Evening · 2.5 to 4 hours',
    guestProfile: '2 to 8 guests',
    editorialOverview:
      'Unwind over handcrafted leather backgammon boards, rare single malts, cognacs or bespoke zero-proof infusions inside a serene St James’s drawing room. Ideal for catching up with close friends or entertaining visiting principals without club noise.',
    arrangements: [
      'Private lounge reservation in St James’s or Mayfair',
      'Artisanal backgammon boards and dedicated table service throughout the evening',
      'Guided rare whisky, cognac or zero-proof tea & botanical flights',
      'Light supper plates served at your pace with chauffeur standby outside',
    ],
    discretionNote:
      'Arranged strictly within private hospitality lounges and licensed venues, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/tglc_st_james_salon.jpg', caption: 'Intimate St James’s room ideal for unhurried games and conversation' },
      { image: '/assets/aistudio/consortium_ethos_sanctuary.jpg', caption: 'Warm library atmosphere with rare spirits and attentive table service' },
      { image: '/assets/aistudio/rare_cellar_vault.jpg', caption: 'Curated vintage pours selected to accompany the evening' },
    ],
  },
  'Dinner & Discreet Chauffeur': {
    enclave: 'Mayfair & Knightsbridge',
    pacing: 'Evening · 4 to 6 hours',
    guestProfile: '2 to 6 guests',
    editorialOverview:
      'Pair a sought-after Mayfair dinner with seamless late-evening movement across private clubs or licensed gaming houses. Your dedicated chauffeur tracks your pace quietly from side streets so every transition feels effortless.',
    arrangements: [
      'Curated dinner reservation matched to your party’s atmosphere',
      'Dedicated flagship saloon or luxury SUV on continuous evening standby',
      'Pre-arranged quiet drop-off points coordinated with venue doormen',
      'Flexible late-night routing back to your London residence or hotel',
    ],
    discretionNote:
      'Full itinerary and driver contact details are shared solely with you or your personal assistant.',
    gallery: [
      { image: '/assets/aistudio/mayfair_alley_arrival_1794391693142.jpg', caption: 'Discreet side-street arrival planned away from main Mayfair traffic' },
      { image: '/assets/aistudio/mayfair_fine_dining.jpg', caption: 'Unhurried Mayfair dinner anchoring the start of the evening' },
      { image: '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp', caption: 'Flagship chauffeur vehicle waiting on standby throughout the night' },
    ],
  },

  // 5. Thames After Dark
  'Private Evening River Cruise': {
    enclave: 'Chelsea Harbour to Greenwich',
    pacing: 'Dusk to Night · 2 to 3.5 hours',
    guestProfile: '2 to 18 guests',
    editorialOverview:
      'Glide silently past Westminster, St Paul’s and illuminated Tower Bridge aboard a sleek private motor yacht chartered exclusively for your guests. With licensed Thames skippers, champagne service and tailored catering, London from the water feels newly discovered.',
    arrangements: [
      'Private charter of a heated luxury river yacht with licensed captain and crew',
      'Curated champagne, artisanal canapés or private chef supper onboard',
      'Custom embarkation from Chelsea, Embankment or Greenwich piers',
      'Coordinated chauffeur waiting at your disembarkation pier',
    ],
    discretionNote:
      'Operated exclusively by PLA-licensed skippers and inspected vessels, subject to tide and weather conditions.',
    gallery: [
      { image: '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg', caption: 'Sleek private launch cruising the Thames at twilight' },
      { image: '/assets/aistudio/MAIN-IMAGE-Shangri-La-The-Shard-London-Illuminate-Yacht-_571087f0.jpg', caption: 'Illuminated London skyline viewed from a private river deck' },
      { image: '/assets/aistudio/mediterranean_superyacht_deck.jpg', caption: 'Refined outdoor seating arranged for warm-weather evening cruises' },
    ],
  },
  'Riverside Supper & Launch': {
    enclave: 'Wapping, Rotherhithe & South Bank',
    pacing: 'Evening · 3.5 to 4.5 hours',
    guestProfile: '2 to 14 guests',
    editorialOverview:
      'Combine an intimate waterside supper in one of London’s historic riverfront rooms with a private launch waiting steps from the terrace. Ideal for anniversaries, visiting international friends or quiet summer celebrations.',
    arrangements: [
      'Private riverside dining room or terrace table booked ahead of sunset',
      'Private river launch timed to collect you directly after dessert',
      'Chilled digestifs or herbal teas served onboard as the skyline lights up',
      'Seamless door-to-door chauffeur transfers at both ends',
    ],
    discretionNote:
      'Pier timings are synchronized closely with tides and venue schedules, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/thames_drydock_supper.jpg', caption: 'Historic riverside supper setting overlooking the evening Thames' },
      { image: '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg', caption: 'Private vessel waiting steps from the dining room' },
      { image: '/assets/aistudio/dining_bespoke_cellar.jpg', caption: 'Seasonal tasting supper crafted for unhurried evening hosting' },
    ],
  },
  'Direct River Evening Transfer': {
    enclave: 'Westminster, Bankside & Greenwich',
    pacing: '25 to 50 minutes point-to-point',
    guestProfile: '1 to 12 guests',
    editorialOverview:
      'Turn a cross-London journey to The O2, Canary Wharf or City dinner into the calmest half-hour of your week. Bypass evening road congestion altogether aboard a private heated launch with refreshments ready onboard.',
    arrangements: [
      'Direct private launch timed precisely to your concert or dinner schedule',
      'Chauffeur connection from your Mayfair residence to the nearest pier',
      'Refreshments and climate-controlled cabin prepared ahead of boarding',
      'Return river transfer waiting at the pier the moment your evening concludes',
    ],
    discretionNote:
      'All pier slots and licensed vessels are pre-cleared ahead of departure, subject to river conditions.',
    gallery: [
      { image: '/assets/aistudio/MAIN-IMAGE-Shangri-La-The-Shard-London-Illuminate-Yacht-_571087f0.jpg', caption: 'Effortless evening passage along London’s illuminated waterfront' },
      { image: '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg', caption: 'Fast, quiet transfer bypassing central London traffic' },
      { image: '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp', caption: 'Chauffeur waiting pier-side for immediate onward connection' },
    ],
  },

  // 6. Supper Clubs & Late-Night Dining
  'Intimate Counter Omakase Night': {
    enclave: 'Mayfair, Marylebone & Soho',
    pacing: 'Evening · 2 to 2.5 hours',
    guestProfile: '2 to 8 guests (or full counter buyout)',
    editorialOverview:
      'Reserve seats—or buy out the entire hinoki counter—at London’s most coveted tiny omakase rooms where master chefs serve seasonal fish and rare sake course by course just inches away.',
    arrangements: [
      'Priority counter seating or private full-counter buyout coordination',
      'Advance briefing on allergies, shellfish notes or alcohol-free tea pairings',
      'Curated rare sake, Burgundy or ceremonial Japanese tea flight',
      'Quiet late-evening bar table or chauffeur ready outside',
    ],
    discretionNote:
      'Counter capacity is strictly limited (often 6–10 seats); advance notice is strongly recommended, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/ginza_hinoki_omakase_1794391697612.jpg', caption: 'Minimalist hinoki counter seating for an unhurried omakase progression' },
      { image: '/assets/aistudio/hidden_secret_gastronomy_1794295323821.jpg', caption: 'Course-by-course chef precision in an intimate central London room' },
      { image: '/assets/aistudio/cultural_global_tea_salon.jpg', caption: 'Artisanal rare tea pairings available alongside fine sake' },
    ],
  },
  'Hidden Soho Cocktail Room': {
    enclave: 'Soho & Fitzrovia',
    pacing: 'Late Evening · 2 to 3 hours',
    guestProfile: '2 to 8 guests',
    editorialOverview:
      'Slip behind unmarked timber doors into low-lit Soho and Fitzrovia cocktail rooms where bartenders craft bespoke drinks around rare vintage spirits, house infusions and calm acoustic conversation.',
    arrangements: [
      'Reserved booth or corner table secured ahead of your arrival',
      'Quiet door greeting with zero kerbside waiting',
      'Custom cocktail or zero-proof tasting menu tailored to your preferences',
      'Chauffeur collection timed discreetly to your departure',
    ],
    discretionNote:
      'Every venue is licensed and vetted for service standards, acoustic comfort and guest privacy, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg', caption: 'Candlelit late-evening cocktail salon tucked off Fitzrovia and Soho' },
      { image: '/assets/aistudio/soho_jazz_cellar_1794391689109.jpg', caption: 'Warm brass-accented ambience after dinner' },
      { image: '/assets/aistudio/spitalfields_crypt_exchange_1794391691802.jpg', caption: 'Intimate back-room pours away from crowded main bars' },
    ],
  },
  'Private Chef Supper Club': {
    enclave: 'Mayfair, Belgravia & East London',
    pacing: 'Evening · 3.5 to 4.5 hours',
    guestProfile: '6 to 18 guests',
    editorialOverview:
      'Gather your own hand-picked table around a celebrated guest chef cooking an original seasonal menu in a private Georgian townhouse or loft dining room. All the electricity of London’s best dining rooms—exclusively for your guests.',
    arrangements: [
      'Acclaimed independent chef designing a one-night tasting menu from scratch',
      'Private townhouse dining salon or architectural loft venue hire',
      'Sommelier wine selection, floral styling and discreet butler service',
      'Full dietary accommodation including certified halal, kosher or plant-based menus',
    ],
    discretionNote:
      'Every menu, guest list and billing detail is arranged privately ahead of the evening, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/hidden_secret_gastronomy_1794295323821.jpg', caption: 'Bespoke tasting course plated live for an intimate private guest list' },
      { image: '/assets/aistudio/cultural_halal_gastronomy.jpg', caption: 'Tailored culinary craft honouring every dietary standard' },
      { image: '/assets/aistudio/dining_bespoke_cellar.jpg', caption: 'Long candlelit private table dressed exclusively for your gathering' },
    ],
  },

  // 7. Rooftops & Rare Views
  'Private Skyline Terrace Drinks': {
    enclave: 'City of London, Bankside & Mayfair',
    pacing: 'Sunset into Evening · 2 to 3 hours',
    guestProfile: '2 to 20 guests',
    editorialOverview:
      'Watch golden hour sweep across St Paul’s, the Thames and Mayfair’s rooftops from a private elevated terrace reserved exclusively for your guests—complete with chilled champagne, heaters, throws and attentive private service.',
    arrangements: [
      'Private high-floor terrace or penthouse balcony booking at golden hour',
      'Champagne, bespoke cocktails and artisanal canapé service',
      'Dedicated lift access and discreet host reception on arrival',
      'Optional transition to a private indoor dining room as evening cools',
    ],
    discretionNote:
      'Arranged strictly at licensed hotels, residences and private clubs, subject to weather and availability.',
    gallery: [
      { image: '/assets/aistudio/01-Neo-Bankside-Luxury-Penthouse-London-England-UK-640x360_c8f27abb.jpg', caption: 'Elevated contemporary London terrace framing panoramic twilight views' },
      { image: '/assets/aistudio/five_star_mayfair_suite.jpg', caption: 'Adjacent penthouse drawing room ready as dusk settles' },
      { image: '/assets/aistudio/MAIN-IMAGE-Shangri-La-The-Shard-London-Illuminate-Yacht-_571087f0.jpg', caption: 'Sweeping evening views over London’s iconic illuminated landmarks' },
    ],
  },
  'Tower Bridge Private Hire': {
    enclave: 'Tower Bridge & The Pool of London',
    pacing: 'Evening · 3 to 4 hours',
    guestProfile: '12 to 60 guests',
    editorialOverview:
      'Host a milestone reception or private candlelit dinner high above the Thames inside Tower Bridge’s iconic glass-floored Walkways or historic Engine Rooms—through official landmark venue hire managed end-to-end by our desk.',
    arrangements: [
      'Official private evening venue hire through Tower Bridge’s events team',
      'Approved fine-dining caterers, sommelier service and refined lighting design',
      'Private curator talk on the Victorian engineering heritage of the bridge',
      'Coordinated guest arrivals by chauffeur or private Thames launch',
    ],
    discretionNote:
      'Booked exclusively via Tower Bridge’s official private hire channels with advance lead time, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/MAIN-IMAGE-Shangri-La-The-Shard-London-Illuminate-Yacht-_571087f0.jpg', caption: 'Iconic Thames views anchoring a rare London landmark evening' },
      { image: '/assets/aistudio/royal_opera_gallery.jpg', caption: 'Grand architectural hospitality styled for milestone celebrations' },
      { image: '/assets/aistudio/subrosa_catacomb_dinner.jpg', caption: 'Candlelit seated dining curated with official heritage caterers' },
    ],
  },
  'Licensed Underground Heritage Tour': {
    enclave: 'Central London & Historic Landmarks',
    pacing: 'Late Afternoon or Evening · 2 hours',
    guestProfile: '2 to 10 guests',
    editorialOverview:
      'Explore London’s official hidden heritage—from wartime bunkers and disused Underground passages run by the London Transport Museum to private after-hours museum galleries—guided by specialist historians before dinner.',
    arrangements: [
      'Private booking on official London Transport Museum or landmark heritage tours',
      'Dedicated specialist historian sharing archival stories and blueprints',
      'Private pre- or post-tour supper reserved within a short drive',
      'Chauffeur collection arranged directly outside the exit point',
    ],
    discretionNote:
      'All access is strictly official and fully licensed through London’s heritage custodians, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/hero_luxury_london_residence_1794298893032.jpg', caption: 'Historic central London architecture layered with centuries of stories' },
      { image: '/assets/aistudio/hidden_subterranean_vault_1794295323175.jpg', caption: 'Atmospheric below-ground heritage rooms explored with a private guide' },
      { image: '/assets/aistudio/tglc_st_james_salon.jpg', caption: 'Warm St James’s hospitality awaiting directly after your tour' },
    ],
  },

  // 8. Jazz & Cocktail Bars
  'Late Soho Jazz Table': {
    enclave: 'Soho',
    pacing: 'Late Evening · 2 to 3.5 hours',
    guestProfile: '2 to 8 guests',
    editorialOverview:
      'Settle into a prime stage-side booth at London’s legendary Soho jazz cellars where world-class quartets play late into the night. We coordinate dinner beforehand, priority seating and your waiting car outside.',
    arrangements: [
      'Prime acoustic booth reserved ahead of the late set',
      'Pre-jazz supper arranged nearby in Soho or Mayfair',
      'Bottle, cocktail or zero-proof table service confirmed in advance',
      'Standby chauffeur waiting on a quiet side street when the music ends',
    ],
    discretionNote:
      'Table allocations at intimate Soho music rooms are limited; early requests help secure optimal sightlines.',
    gallery: [
      { image: '/assets/aistudio/soho_jazz_cellar_1794391689109.jpg', caption: 'Intimate live jazz performance viewed from a prime Soho table' },
      { image: '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg', caption: 'Crafted late-evening pours accompanying the live set' },
      { image: '/assets/aistudio/mayfair_fine_dining.jpg', caption: 'Seamless transition from early Mayfair supper to Soho jazz' },
    ],
  },
  'Fitzrovia Quiet Cocktail Salon': {
    enclave: 'Fitzrovia & Marylebone',
    pacing: 'Evening · 2 to 3 hours',
    guestProfile: '2 to 6 guests',
    editorialOverview:
      'Designed for guests who prize conversation over volume: velvet banquettes, crystal glassware, botanical distillations and unhurried table service in Fitzrovia’s most refined late-evening cocktail salons.',
    arrangements: [
      'Quiet banquette reserved in an intimate Fitzrovia cocktail room',
      'Bespoke drinks crafted around your preferred spirit or zero-proof profile',
      'Light late-evening plates served discreetly at your table',
      'Seamless chauffeur return across central London',
    ],
    discretionNote:
      'Every salon is hand-selected for acoustic warmth, privacy and attentive hospitality, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg', caption: 'Warm amber light and unhurried cocktail craft in Fitzrovia' },
      { image: '/assets/aistudio/tglc_st_james_salon.jpg', caption: 'Intimate seating tailored to private evening conversation' },
      { image: '/assets/aistudio/mayfair_alley_arrival_1794391693142.jpg', caption: 'Quiet kerbside departure once the evening winds down' },
    ],
  },
  'Spitalfields Evening Tasting Room': {
    enclave: 'Spitalfields & East London',
    pacing: 'Evening · 2 to 3 hours',
    guestProfile: '2 to 10 guests',
    editorialOverview:
      'Step into historic Georgian townhouse cellars in Spitalfields for private tastings of small-batch spirits, natural wines or artisanal vermouths—bridging East London’s creative energy with 18th-century craftsmanship.',
    arrangements: [
      'Private guided tasting inside an atmospheric Spitalfields cellar room',
      'Artisanal small-plate pairings sourced from independent London producers',
      'Optional walking stop at an East London gallery or late supper spot',
      'Private car transfers between Mayfair and Spitalfields',
    ],
    discretionNote:
      'Hosted by appointment in licensed historic spaces, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/spitalfields_crypt_exchange_1794391691802.jpg', caption: 'Georgian brick tasting room tucked behind Spitalfields' },
      { image: '/assets/aistudio/rare_cellar_vault.jpg', caption: 'Curated small-batch pours presented by an independent specialist' },
      { image: '/assets/aistudio/shoreditch_dj_loft_1794391691810.jpg', caption: 'Optional onward stop at an East London listening space' },
    ],
  },

  // 9. Club Nights
  'Late-Night Sound Room Booth': {
    enclave: 'Soho, Mayfair & East London',
    pacing: 'Late Evening · 23:00 onwards',
    guestProfile: '2 to 10 guests',
    editorialOverview:
      'Experience London’s finest custom-built audiophile sound systems and underground vinyl selectors from a reserved booth with clean door entry and attentive table service—never fighting crowds at the rope.',
    arrangements: [
      'Priority booth booking at vetted licensed sound rooms and music clubs',
      'Coordinated guest-list arrival with seamless venue greeting',
      'Preferred spirits, champagne or zero-proof table setup arranged beforehand',
      'Dedicated chauffeur on standby outside for an effortless journey home',
    ],
    discretionNote:
      'All bookings follow venue dress codes, guest-list policies and licensing rules, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/urban_vinyl_booth_deep.jpg', caption: 'Custom audiophile vinyl booth tuned for deep late-night sets' },
      { image: '/assets/aistudio/urban_hiphop_club_1794391691841.jpg', caption: 'Electric London dancefloor viewed from a private reserved booth' },
      { image: '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp', caption: 'Standby chauffeur waiting for a calm late-night return' },
    ],
  },
  'Private Shoreditch Loft Party': {
    enclave: 'Shoreditch & Clerkenwell',
    pacing: 'Evening to Late Night · 4 to 6 hours',
    guestProfile: '20 to 80 guests',
    editorialOverview:
      'Take over a licensed East London architectural loft with timber beams, gallery lighting and custom sound for a private birthday, launch or gathering. We bring in your favourite vinyl selector, mixologists and late-night food.',
    arrangements: [
      'Exclusive private hire of a licensed Shoreditch architectural loft',
      'Bespoke sound system and hand-picked London DJ or vinyl selector',
      'Private cocktail bartenders, champagne bar and late-night chef station',
      'Discrete guest-list door host and coordinated guest car departures',
    ],
    discretionNote:
      'Fully licensed private venues with dedicated production and guest-privacy management, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/shoreditch_dj_loft_1794391691810.jpg', caption: 'Architectural Shoreditch loft styled for a private music gathering' },
      { image: '/assets/aistudio/urban_vinyl_booth_deep.jpg', caption: 'Bespoke vinyl deck and acoustic setup curated for your guests' },
      { image: '/assets/aistudio/hidden_secret_gastronomy_1794295323821.jpg', caption: 'Late-evening small plates served seamlessly throughout the night' },
    ],
  },
  'Mayfair Late Listening Bar': {
    enclave: 'Mayfair & St James’s',
    pacing: 'Late Evening · 22:30 onwards',
    guestProfile: '2 to 8 guests',
    editorialOverview:
      'Inspired by Tokyo’s intimate kissaten listening rooms and Mayfair’s finest hotel bars, spend the small hours enjoying rare records on custom horn speakers alongside Japanese whisky, vintage champagne or artisanal teas.',
    arrangements: [
      'Reserved lounge seating inside a sought-after Mayfair listening room',
      'Rare whisky, champagne or non-alcoholic botanical flights',
      'Quiet dinner pairing within a five-minute walk beforehand',
      'Discreet kerbside chauffeur waiting whenever you are ready',
    ],
    discretionNote:
      'All venues operate strictly by reservation and house etiquette, subject to availability.',
    gallery: [
      { image: '/assets/aistudio/urban_hiphop_club_1794391691841.jpg', caption: 'Warm late-night Mayfair room built around music and hospitality' },
      { image: '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg', caption: 'Intimate low-lit table service into the small hours' },
      { image: '/assets/aistudio/urban_vinyl_booth_deep.jpg', caption: 'Curated analogue vinyl selections throughout the evening' },
    ],
  },

  // 10. 24 Hours in London
  'Morning Tailoring & Galleries': {
    enclave: 'Savile Row, Cork Street & Mayfair',
    pacing: '09:30 to 13:30',
    guestProfile: '1 to 4 guests',
    editorialOverview:
      'Begin your London day with quiet precision: a private morning fitting on Savile Row before the street awakens, espresso in a hidden courtyard, and an unhurried walk through Cork Street and Albemarle Street galleries with a curator.',
    arrangements: [
      'Private early fitting or cloth selection on Savile Row or Bond Street',
      'Closed-door viewing at two leading Mayfair contemporary art galleries',
      'Unhurried lunch reservation at a classic Mayfair dining room',
      'Dedicated chauffeur on standby to deliver purchases directly to your suite',
    ],
    discretionNote:
      'Tailored around your morning rhythm with every boutique and gallery briefed in advance.',
    gallery: [
      { image: '/assets/aistudio/savile_row_bespoke.jpg', caption: 'Unhurried morning bespoke tailoring consultation on Savile Row' },
      { image: '/assets/aistudio/frieze_gallery_pavilion_1794391697548.jpg', caption: 'Private Mayfair gallery viewing ahead of lunch' },
      { image: '/assets/aistudio/bond_street_jewellery.jpg', caption: 'Optional closed-door viewing room stop on Bond Street' },
    ],
  },
  'Evening River & Supper': {
    enclave: 'Chelsea, Thames & Central London',
    pacing: '18:00 to 22:30',
    guestProfile: '2 to 8 guests',
    editorialOverview:
      'Transition smoothly from afternoon calm to evening theatre: step aboard a private Thames launch at dusk with chilled champagne, glide past Westminster and St Paul’s, and disembark minutes from your reserved private dining room.',
    arrangements: [
      'Dusk river cruise aboard a private heated vessel with licensed crew',
      'Sunset refreshments tailored to your household preferences',
      'Prime supper reservation in Mayfair, Bankside or St James’s',
      'Seamless pier-to-table chauffeur connection',
    ],
    discretionNote:
      'Every boat slot, car and dining table is synchronized under one Mayfair point of contact.',
    gallery: [
      { image: '/assets/aistudio/hidden_nocturne_stealth_boat_1794295325076.jpg', caption: 'Twilight river passage gliding smoothly past illuminated landmarks' },
      { image: '/assets/aistudio/thames_drydock_supper.jpg', caption: 'Waterside evening dining prepared ahead of your arrival' },
      { image: '/assets/aistudio/dining_bespoke_cellar.jpg', caption: 'Candlelit private supper anchoring the heart of your night' },
    ],
  },
  'Late Music & Nightcap': {
    enclave: 'Soho & Mayfair',
    pacing: '22:30 to Late',
    guestProfile: '2 to 6 guests',
    editorialOverview:
      'Close a full 24 hours in London on a memorable note: slip into a late Soho jazz set or a hushed Mayfair listening room for one last crafted nightcap before your chauffeur brings you quietly home.',
    arrangements: [
      'Reserved late-set table at an intimate Soho jazz cellar or listening bar',
      'Bespoke digestifs, vintage pours or artisanal zero-proof nightcaps',
      'Zero queueing with direct host greeting at the door',
      'Flagship chauffeur waiting to return you calmly to your residence or hotel',
    ],
    discretionNote:
      'Flexible late-evening timings adjusted live by your Mayfair desk if your plans evolve.',
    gallery: [
      { image: '/assets/aistudio/soho_jazz_cellar_1794391689109.jpg', caption: 'Live late-night jazz closing your London itinerary in style' },
      { image: '/assets/aistudio/fitzrovia_absinthe_salon_1794391690208.jpg', caption: 'Unhurried nightcap in a quiet central London salon' },
      { image: '/assets/aistudio/rolls-cullian-featured_a41abfa9.webp', caption: 'Door-to-door chauffeur waiting calmly for the journey home' },
    ],
  },
};

export function getHiddenLondonIdeaDetail(
  title: string,
  fallbackImage: string,
  fallbackSummary: string
): HiddenLondonIdeaDetail {
  const matched = HIDDEN_LONDON_IDEA_DETAILS[title];
  if (matched) return matched;
  return {
    enclave: 'Central London',
    pacing: 'Bespoke timing · 2 to 4 hours',
    guestProfile: 'Private arrangements tailored to your party',
    editorialOverview: fallbackSummary,
    arrangements: [
      'Private venue or specialist introduction arranged through our Mayfair desk',
      'Tailored hospitality and dietary preferences briefed in advance',
      'Coordinated chauffeur arrivals and departures',
    ],
    discretionNote: 'All arrangements are made strictly through licensed partners, subject to availability.',
    gallery: [{ image: fallbackImage, caption: title }],
  };
}
