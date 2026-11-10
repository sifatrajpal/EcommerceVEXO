import type { Theme } from "@/lib/data/settings";

export type ThemeImages = {
  hero: string;
  posterGroup: string;
  featureAthlete: string;
  cutoutHood: string;
  pickA: string;
  pickB: string;
};

const DEFAULT_IMAGES: ThemeImages = {
  hero: "/images/hero-model.png",
  posterGroup: "/images/poster-group.png",
  featureAthlete: "/images/feature-athlete.png",
  cutoutHood: "/images/cutout-hood.png",
  pickA: "/images/arrival-6.png",
  pickB: "/images/arrival-3.png",
};

/** Which marketing photo fills each recurring slot, per theme. Product-grid photos stay data-driven. */
export const THEME_IMAGES: Record<Theme, ThemeImages> = {
  default: DEFAULT_IMAGES,
  elanora: {
    hero: "/images/edit-look-2.png",
    posterGroup: "/images/edit-look-4.png",
    featureAthlete: "/images/arrival-9.png",
    cutoutHood: "/images/arrival-10.png",
    pickA: "/images/arrival-11.png",
    pickB: "/images/arrival-12.png",
  },
  noir: {
    hero: "/images/edit-hood.png",
    posterGroup: "/images/edit-shorts.png",
    featureAthlete: "/images/pick-winter.png",
    cutoutHood: "/images/edit-look-1.png",
    pickA: "/images/edit-look-3.png",
    pickB: "/images/arrival-4.png",
  },
  studio: {
    hero: "/images/pick-summer.png",
    posterGroup: "/images/arrival-8.png",
    featureAthlete: "/images/arrival-7.png",
    cutoutHood: "/images/arrival-1.png",
    pickA: "/images/arrival-5.png",
    pickB: "/images/arrival-2.png",
  },
};
