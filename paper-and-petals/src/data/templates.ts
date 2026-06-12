/**
 * Starter templates — pre-laid-out spreads so a blank page isn't intimidating.
 * Each template lays a handful of glyph/tape/text placeholders in spread
 * coordinates (720 × 500). The editor instantiates these as real PlacedItems
 * (assigning ids + z-order), so everything stays movable and editable.
 *
 * Items use Feather glyph names + tones only — no owned/shop assets — so a
 * template never depends on the buyer's collection.
 */

export interface TemplateItem {
  kind?: 'item' | 'text' | 'tape';
  glyph?: string;
  tone?: string;
  text?: string;
  fontKey?: string;
  color?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  shadow?: boolean;
}

export interface JournalTemplate {
  id: string;
  name: string;
  blurb: string;
  /** A representative glyph for the picker tile. */
  icon: string;
  tone: string;
  items: TemplateItem[];
}

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'travel',
    name: 'Travel page',
    blurb: 'A photo frame, a ticket, and a place to title the trip.',
    icon: 'map',
    tone: 'blue',
    items: [
      { kind: 'text', text: 'Our trip', fontKey: 'caveat', color: '#2B2A28', x: 200, y: 90, w: 260, h: 70, rotate: -3 },
      { kind: 'tape', tone: 'blue', x: 200, y: 150, w: 180, h: 30, rotate: -4 },
      { glyph: 'image', tone: 'cream', x: 210, y: 290, w: 190, h: 150, rotate: -2, shadow: true },
      { glyph: 'credit-card', tone: 'amber', x: 470, y: 180, w: 150, h: 90, rotate: 6, shadow: true },
      { glyph: 'map-pin', tone: 'oxblood', x: 540, y: 330, w: 70, h: 70, rotate: 0 },
      { glyph: 'mail', tone: 'rose', x: 430, y: 380, w: 90, h: 90, rotate: -8, shadow: true },
    ],
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    blurb: 'Three soft prompts with room to write what you’re thankful for.',
    icon: 'heart',
    tone: 'rose',
    items: [
      { kind: 'text', text: 'Grateful for…', fontKey: 'pinyon', color: '#9F6F6A', x: 360, y: 80, w: 320, h: 64, rotate: 0 },
      { glyph: 'heart', tone: 'rose', x: 150, y: 200, w: 56, h: 56, rotate: -6 },
      { kind: 'text', text: '1.', fontKey: 'patrick', color: '#2B2A28', x: 240, y: 200, w: 60, h: 44 },
      { glyph: 'heart', tone: 'rose', x: 150, y: 290, w: 56, h: 56, rotate: 4 },
      { kind: 'text', text: '2.', fontKey: 'patrick', color: '#2B2A28', x: 240, y: 290, w: 60, h: 44 },
      { glyph: 'heart', tone: 'rose', x: 150, y: 380, w: 56, h: 56, rotate: -3 },
      { kind: 'text', text: '3.', fontKey: 'patrick', color: '#2B2A28', x: 240, y: 380, w: 60, h: 44 },
      { glyph: 'feather', tone: 'sage', x: 560, y: 360, w: 110, h: 110, rotate: 10 },
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly spread',
    blurb: 'A title banner and a tidy two-column grid to plan the month.',
    icon: 'calendar',
    tone: 'sage',
    items: [
      { kind: 'tape', tone: 'sage', x: 360, y: 70, w: 300, h: 34, rotate: 0 },
      { kind: 'text', text: 'This month', fontKey: 'spectral', color: '#2B2A28', x: 360, y: 70, w: 280, h: 56 },
      { glyph: 'square', tone: 'cream', x: 210, y: 250, w: 200, h: 150, rotate: 0, shadow: true },
      { glyph: 'square', tone: 'cream', x: 510, y: 250, w: 200, h: 150, rotate: 0, shadow: true },
      { glyph: 'star', tone: 'amber', x: 360, y: 420, w: 50, h: 50, rotate: 0 },
    ],
  },
  {
    id: 'memory',
    name: 'Memory keeper',
    blurb: 'A big polaroid, a wax seal, and a caption line.',
    icon: 'camera',
    tone: 'amber',
    items: [
      { glyph: 'image', tone: 'cream', x: 250, y: 240, w: 240, h: 200, rotate: -3, shadow: true },
      { kind: 'tape', tone: 'amber', x: 250, y: 150, w: 150, h: 30, rotate: -10 },
      { kind: 'text', text: 'a day to remember', fontKey: 'caveat', color: '#4B4038', x: 500, y: 300, w: 240, h: 60, rotate: 4 },
      { glyph: 'disc', tone: 'oxblood', x: 540, y: 180, w: 80, h: 80, rotate: 0, shadow: true },
      { glyph: 'feather', tone: 'rose', x: 480, y: 410, w: 90, h: 90, rotate: -12 },
    ],
  },
];
