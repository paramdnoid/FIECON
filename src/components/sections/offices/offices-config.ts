import type { DepthConfig } from "@/components/animations/EllipseCarousel";
import { EASE_OUT_EXPO } from "@/lib/constants";

/* ── Layout constants ──────────────────────────────────────────────── */

export const RADII = {
  xs: { x: 140, y: 22 },
  sm: { x: 210, y: 28 },
  md: { x: 320, y: 45 },
  lg: { x: 420, y: 55 },
  xl: { x: 480, y: 65 },
};

export const CARD = {
  xs: { w: 240, h: 185 },
  sm: { w: 290, h: 200 },
  md: { w: 290, h: 200 },
  lg: { w: 340, h: 210 },
  xl: { w: 380, h: 220 },
};

export const HEIGHT = { xs: 305, sm: 320, md: 340, lg: 380, xl: 420 };

export const DRAG_SENSITIVITY = 0.004;

export const MOBILE_DEPTH: DepthConfig = {
  scaleRange: [0.5, 1.0],
  blurMax: 4,
  brightnessRange: [0.45, 1.0],
  opacityRange: [0.25, 1.0],
  shadowSpreadMax: 24,
  shadowAlphaMax: 0.3,
};

/* ── Background map cross-fade animation ───────────────────────────── */

export const BG_MAP_TRANSITION = {
  duration: 1.0,
  ease: EASE_OUT_EXPO,
};

/* ── Photo map config ──────────────────────────────────────────────── */

const PHOTO_MAP_DEFAULTS = {
  maskSize: "auto 100%",
  webkitMaskSize: "auto 100%",
  opacity: "0.55",
  saturate: "0.4",
  sepia: "0.12",
};

export const PHOTO_MAP_CONFIG: Record<string, {
  src: string;
  maskSize: string;
  webkitMaskSize: string;
  opacity: string;
  saturate: string;
  sepia: string;
}> = {
  DE: { ...PHOTO_MAP_DEFAULTS, src: "/offices/hamburg.webp", webkitMaskSize: "auto 90%" },
  US: { ...PHOTO_MAP_DEFAULTS, src: "/offices/austin.webp" },
  RS: { ...PHOTO_MAP_DEFAULTS, src: "/offices/belgrad.webp" },
  ME: { ...PHOTO_MAP_DEFAULTS, src: "/offices/montenegro.webp" },
};
