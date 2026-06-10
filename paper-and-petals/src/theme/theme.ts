/**
 * Paper & Petals — Design tokens (typed)
 * Translation of colors_and_type.css. Import this everywhere; never hard-code hex.
 *   import { theme } from '@/theme/theme';
 */

export const palette = {
  // Surfaces — warm paper backgrounds, layered light → dark
  warmWhite: '#F8F7F4',
  softLinen: '#EFE9E1',
  vintagePaper: '#E5D8C8',
  cream: '#FFFDF6',

  // Primary accents — muted, dusty, never saturated
  terracotta: '#C47B63',
  sage: '#87937C',
  dustyBlue: '#8FA3B8',
  mauve: '#A98C98',

  // Deep accents — CTAs / journal covers
  forest: '#4E6652',
  forestDeep: '#3B4E3F',

  // Text
  charcoal: '#2B2A28',
  espresso: '#4B4038',
  stone: '#9A8A72',
  stoneWarm: '#7A6B52',

  // Highlights
  antiqueGold: '#C8A96B',
  softRose: '#D7B7B0',
  mutedOlive: '#7A7D5C',

  // Borders / semantic
  hairline: '#C8BC9E',
  hairlineSoft: 'rgba(123,107,82,0.18)',
  stitch: 'rgba(75,64,56,0.35)',
  success: '#7A8F6E',
  warning: '#C8A96B',
  danger: '#B26A5A',
} as const;

export const color = {
  bg1: palette.warmWhite,        // canvas
  bg2: palette.softLinen,        // secondary surface
  bg3: palette.vintagePaper,     // tinted panel
  surface: palette.cream,        // lifted card / paper sheet

  fg1: palette.charcoal,         // primary text
  fg2: palette.espresso,         // secondary text
  fg3: palette.stoneWarm,        // tertiary / labels
  fg4: palette.stone,            // muted / disabled

  accent: palette.forest,
  accentHover: palette.forestDeep,
  accentSoft: palette.sage,
  highlight: palette.antiqueGold,
} as const;

export const font = {
  display: 'Spectral',          // headings, screen titles
  ui: 'NunitoSans',             // body & functional UI
  script: 'EBGaramond-Italic',  // pull-quotes, the &, soft lines
  flourish: 'PinyonScript',     // ornamental hero moments only
  paper: 'Spectral',            // small-caps labels
} as const;

export const fontSize = {
  h1: 42, h2: 32, h3: 24,
  bodyLg: 18, body: 16, caption: 13, micro: 11,
} as const;

export const lineHeight = { tight: 1.2, snug: 1.35, body: 1.55, loose: 1.65 } as const;

export const letterSpacing = {
  display: -0.005, ui: 0.005, label: 0.16, micro: 0.20, // em
} as const;

/** Spacing scale — multiples of 4. Use generously: calm > dense. */
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 48, 10: 64, 11: 80, 12: 96,
} as const;

export const radius = { xs: 4, sm: 6, md: 10, lg: 16, xl: 24, pill: 999 } as const;

export const border = { hair: 1, card: 1.5, cover: 3 } as const;

/** Shadows — soft, layered, paper-like. RN shadow props (iOS) + elevation (Android). */
export const shadow = {
  paper: { shadowColor: '#4B4038', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  card:  { shadowColor: '#4B4038', shadowOpacity: 0.22, shadowRadius: 28, shadowOffset: { width: 0, height: 14 }, elevation: 4 },
  lift:  { shadowColor: '#4B4038', shadowOpacity: 0.28, shadowRadius: 40, shadowOffset: { width: 0, height: 24 }, elevation: 8 },
  tape:  { shadowColor: '#4B4038', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
} as const;

/** Motion — easing as cubic-bezier control points + durations (ms). */
export const motion = {
  easePaper: [0.32, 0.72, 0.32, 1],   // slow settle (default for page transitions)
  easePetal: [0.22, 1, 0.36, 1],      // drift in
  easePress: [0.4, 0.0, 0.2, 1],
  durFast: 150, durBase: 240, durSlow: 480, durPage: 600,
} as const;

/** Layout — the prototype canvas + editor rails. */
export const layout = {
  tabletW: 1024, tabletH: 768,
  phoneBreakpoint: 700, // < this → phone reflow
  sidebarW: 110, toolPaletteW: 68, pageStripW: 68,
} as const;

export const theme = {
  palette, color, font, fontSize, lineHeight, letterSpacing,
  space, radius, border, shadow, motion, layout,
} as const;

export type Theme = typeof theme;
