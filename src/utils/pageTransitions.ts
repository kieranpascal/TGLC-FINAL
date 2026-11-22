import type { Variants } from 'motion/react';

/**
 * Unhurried editorial deceleration curve tailored for TGLC route entrances.
 * Smooth fast-start with a long, poised settle into rest.
 */
export const LUXURY_PAGE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const LUXURY_PAGE_EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

/**
 * Namespaced variant keys prevent Motion variant propagation from colliding
 * with child components (e.g. Reveal, carousels, or nested grids) that use
 * generic "hidden" / "visible" / "exit" labels.
 */
export const PAGE_VARIANT_KEYS = {
  initial: 'tglcPageHidden',
  animate: 'tglcPageVisible',
  exit: 'tglcPageExit',
} as const;

export const PAGE_STAGGER_TIMING = {
  delayChildren: 0.12,
  staggerChildren: 0.16,
} as const;

export const PAGE_SLIDE_UP_DISTANCE_PX = 28;
export const PAGE_SLIDE_UP_DURATION_S = 0.72;

/**
 * Parent orchestrator for PageContentWrapper in App.tsx.
 * Coordinates a longer luxury stagger sequence across route arrival stages.
 */
export const PAGE_WRAPPER_VARIANTS: Variants = {
  [PAGE_VARIANT_KEYS.initial]: {
    opacity: 0,
  },
  [PAGE_VARIANT_KEYS.animate]: {
    opacity: 1,
    transition: {
      duration: 0.32,
      ease: LUXURY_PAGE_EASE,
      delayChildren: PAGE_STAGGER_TIMING.delayChildren,
      staggerChildren: PAGE_STAGGER_TIMING.staggerChildren,
    },
  },
  [PAGE_VARIANT_KEYS.exit]: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.24,
      ease: LUXURY_PAGE_EXIT_EASE,
    },
  },
};

/**
 * Stage 1 of the route stagger: subtle architectural brass hairline drawing across
 * the top edge of the page stage as a poised visual cue.
 */
export const PAGE_HAIRLINE_VARIANTS: Variants = {
  [PAGE_VARIANT_KEYS.initial]: {
    opacity: 0,
    scaleX: 0.2,
  },
  [PAGE_VARIANT_KEYS.animate]: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.56,
      ease: LUXURY_PAGE_EASE,
    },
  },
};

/**
 * Stage 2 of the route stagger: refined slide-up entrance for the active page canvas.
 * Animates compositor-only properties (opacity and transform translateY).
 */
export const PAGE_SLIDE_UP_VARIANTS: Variants = {
  [PAGE_VARIANT_KEYS.initial]: {
    opacity: 0,
    y: PAGE_SLIDE_UP_DISTANCE_PX,
  },
  [PAGE_VARIANT_KEYS.animate]: {
    opacity: 1,
    y: 0,
    transition: {
      duration: PAGE_SLIDE_UP_DURATION_S,
      ease: LUXURY_PAGE_EASE,
    },
  },
};
