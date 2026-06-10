/**
 * SCR-06 Shop mock catalogue — mirrors ui_kits/app/Shop.jsx.
 * Categories ARE final; items are placeholders until the real
 * catalogue lands in Sanity (Phase 2).
 */

import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

type FeatherName = ComponentProps<typeof Feather>['name'];

export interface ShopCategory {
  id: string;
  label: string;
  icon: FeatherName;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'all', label: 'All', icon: 'star' },
  { id: 'collections', label: 'Collections', icon: 'package' },
  { id: 'papers', label: 'Papers & backgrounds', icon: 'file-text' },
  { id: 'stickers', label: 'Stickers', icon: 'circle' },
  { id: 'tape', label: 'Tape & fasteners', icon: 'paperclip' },
  { id: 'ephemera', label: 'Ephemera', icon: 'archive' },
  { id: 'florals', label: 'Florals & botanicals', icon: 'feather' },
  { id: 'frames', label: 'Frames & containers', icon: 'square' },
  { id: 'type', label: 'Writing & typography', icon: 'edit-3' },
  { id: 'paint', label: 'Paint & artistic', icon: 'droplet' },
  { id: 'fabric', label: 'Sewing & fabric', icon: 'scissors' },
  { id: 'photos', label: 'Photos & memory keeping', icon: 'image' },
  { id: 'details', label: 'Decorative details', icon: 'award' },
];

export const SHOP_TONES = {
  sage: { bg: '#B6BFA5', accent: '#5F6E55' },
  forest: { bg: '#4E6652', accent: '#33473A' },
  rose: { bg: '#D7B7B0', accent: '#9F6F6A' },
  mauve: { bg: '#A98C98', accent: '#7B5F6B' },
  blue: { bg: '#9EB1C2', accent: '#6E8598' },
  amber: { bg: '#D9B97A', accent: '#9B7B43' },
  cream: { bg: '#F1E6CC', accent: '#A98C68' },
  oxblood: { bg: '#8C3F3A', accent: '#5A2222' },
  gold: { bg: '#D6BD78', accent: '#A8893F' },
} as const;

export type ShopTone = keyof typeof SHOP_TONES;

export interface ShopItem {
  id: string;
  category: string;
  name: string;
  price: number;
  tone: ShopTone;
  glyph: FeatherName;
  /** Real pressed-flower art, when the item has it. */
  flowerAsset?: number;
  desc: string;
  items: number;
  owned: boolean;
  isNew: boolean;
}

const FLOWERS = {
  cornflower: require('../../assets/flowers/01-cornflower-violet.png'),
  poppy: require('../../assets/flowers/02-poppy-red.png'),
  cosmos: require('../../assets/flowers/03-cosmos-lavender.png'),
  wildrose: require('../../assets/flowers/04-wildrose-pink.png'),
  blossom: require('../../assets/flowers/05-cherryblossom-cluster.png'),
  zinnia: require('../../assets/flowers/06-zinnia-crimson.png'),
};

export const SHOP_CATALOGUE: ShopItem[] = [
  // Curated collections
  { id: 'col-spring', category: 'collections', name: 'Spring meadow', price: 5.99, tone: 'sage', glyph: 'feather', desc: 'A 32-piece collection of pressed wildflowers, soft botanical papers, and hand-painted ribbon, made for cottagecore spreads.', items: 32, owned: false, isNew: true },
  { id: 'col-romance', category: 'collections', name: 'Old romance', price: 6.49, tone: 'rose', glyph: 'heart', desc: '24 pieces drawing from love letters, cherry blossoms, and lace handkerchiefs.', items: 24, owned: true, isNew: false },
  { id: 'col-coastal', category: 'collections', name: 'Coastal almanac', price: 5.99, tone: 'blue', glyph: 'anchor', desc: 'Tide charts, soft-tone driftwood, postage from sea-side towns. 28 pieces.', items: 28, owned: false, isNew: false },
  { id: 'col-autumn', category: 'collections', name: 'Autumn library', price: 6.99, tone: 'amber', glyph: 'book', desc: 'Acorns, library cards, foxed pages and dried oak leaves. 30 pieces.', items: 30, owned: false, isNew: true },

  // Papers & backgrounds
  { id: 'pap-linen', category: 'papers', name: 'Linen sheets', price: 1.99, tone: 'cream', glyph: 'file-text', desc: 'Eight cream linen weave backgrounds with subtle directional grain.', items: 8, owned: true, isNew: false },
  { id: 'pap-grid', category: 'papers', name: 'Soft grid pages', price: 1.49, tone: 'sage', glyph: 'grid', desc: 'Faint sage grid pages for journaling and notes.', items: 6, owned: false, isNew: false },
  { id: 'pap-foxed', category: 'papers', name: 'Foxed pages', price: 2.49, tone: 'amber', glyph: 'file', desc: 'Aged paper with botanical foxing marks. Great for layering.', items: 10, owned: false, isNew: true },
  { id: 'pap-dots', category: 'papers', name: 'Soft polka dots', price: 1.99, tone: 'rose', glyph: 'more-horizontal', desc: 'Six pastel dotted backgrounds in our most-loved palette.', items: 6, owned: false, isNew: false },
  { id: 'pap-ledger', category: 'papers', name: 'Old ledger pages', price: 2.99, tone: 'mauve', glyph: 'align-left', desc: 'Aged accounting paper. Perfect for memory keeping.', items: 8, owned: false, isNew: false },

  // Stickers
  { id: 'stk-seals', category: 'stickers', name: 'Wax seal stickers', price: 2.49, tone: 'oxblood', glyph: 'disc', desc: 'Twelve wax-impression seals in cottage palette.', items: 12, owned: true, isNew: false },
  { id: 'stk-arrows', category: 'stickers', name: 'Hand-drawn arrows', price: 1.49, tone: 'forest', glyph: 'arrow-right', desc: 'Soft ink-drawn arrows to point at the things that matter.', items: 18, owned: false, isNew: false },
  { id: 'stk-stars', category: 'stickers', name: 'Hand-drawn stars', price: 1.49, tone: 'amber', glyph: 'star', desc: 'A constellation of inked stars and tiny sparkles.', items: 14, owned: false, isNew: true },
  { id: 'stk-checks', category: 'stickers', name: 'Checkmarks & ticks', price: 0.99, tone: 'sage', glyph: 'check', desc: 'Twelve cosy ticks and check-marks for to-dos.', items: 12, owned: false, isNew: false },
  { id: 'stk-hearts', category: 'stickers', name: 'Tiny heart stickers', price: 1.49, tone: 'rose', glyph: 'heart', desc: 'Painted hearts in three sizes, all the right pinks.', items: 16, owned: false, isNew: false },

  // Tape & fasteners
  { id: 'tap-washi', category: 'tape', name: 'Sage washi', price: 1.99, tone: 'sage', glyph: 'minus', desc: 'Sage washi tape in three widths.', items: 6, owned: true, isNew: false },
  { id: 'tap-floral', category: 'tape', name: 'Floral washi roll', price: 2.49, tone: 'rose', glyph: 'minus', desc: 'Floral pattern washi with soft rose roses on cream.', items: 4, owned: false, isNew: true },
  { id: 'tap-stripes', category: 'tape', name: 'Vintage striped tape', price: 1.99, tone: 'amber', glyph: 'minus', desc: 'Striped washi in warm amber and ivory.', items: 4, owned: false, isNew: false },
  { id: 'tap-twine', category: 'tape', name: 'Garden twine', price: 1.49, tone: 'mauve', glyph: 'link', desc: 'Soft mauve twine and paper-clip fasteners.', items: 8, owned: false, isNew: false },
  { id: 'tap-pins', category: 'tape', name: 'Brass paperclips', price: 1.99, tone: 'gold', glyph: 'paperclip', desc: 'Antique brass paperclips and corner stays.', items: 10, owned: false, isNew: false },

  // Ephemera
  { id: 'eph-postage', category: 'ephemera', name: 'Vintage postage', price: 2.99, tone: 'oxblood', glyph: 'mail', desc: 'Twenty vintage postage stamps from old letters.', items: 20, owned: false, isNew: true },
  { id: 'eph-tickets', category: 'ephemera', name: 'Train tickets', price: 1.99, tone: 'mauve', glyph: 'credit-card', desc: 'Twelve printed train and tram tickets.', items: 12, owned: false, isNew: false },
  { id: 'eph-letters', category: 'ephemera', name: 'Old letters & notes', price: 3.49, tone: 'cream', glyph: 'mail', desc: 'Eight aged letters with cursive handwriting.', items: 8, owned: false, isNew: false },
  { id: 'eph-cards', category: 'ephemera', name: 'Library cards', price: 1.99, tone: 'amber', glyph: 'credit-card', desc: 'Eight checkout cards from old libraries.', items: 8, owned: false, isNew: false },

  // Florals & botanicals — real assets
  { id: 'flo-press', category: 'florals', name: 'Pressed wildflowers', price: 3.99, tone: 'sage', glyph: 'feather', flowerAsset: FLOWERS.cornflower, desc: 'Six real pressed wildflowers, gently scanned.', items: 6, owned: true, isNew: false },
  { id: 'flo-blossom', category: 'florals', name: 'Cherry blossom', price: 2.99, tone: 'rose', glyph: 'feather', flowerAsset: FLOWERS.blossom, desc: 'Two cherry blossom clusters.', items: 2, owned: false, isNew: true },
  { id: 'flo-zinnia', category: 'florals', name: 'Garden zinnias', price: 2.49, tone: 'oxblood', glyph: 'feather', flowerAsset: FLOWERS.zinnia, desc: 'A small bouquet of crimson zinnias.', items: 3, owned: false, isNew: false },
  { id: 'flo-cosmos', category: 'florals', name: 'Lavender cosmos', price: 2.49, tone: 'mauve', glyph: 'feather', flowerAsset: FLOWERS.cosmos, desc: 'Lavender cosmos in two sizes.', items: 2, owned: false, isNew: false },

  // Frames & containers
  { id: 'frm-oval', category: 'frames', name: 'Oval portrait frames', price: 2.99, tone: 'gold', glyph: 'circle', desc: 'Six oval frames for photos and clippings.', items: 6, owned: false, isNew: false },
  { id: 'frm-corner', category: 'frames', name: 'Gilded corners', price: 1.99, tone: 'gold', glyph: 'corner-up-left', desc: 'Eight gilded corner pieces for layering.', items: 8, owned: false, isNew: true },
  { id: 'frm-tag', category: 'frames', name: 'Hang-tags & cards', price: 2.49, tone: 'cream', glyph: 'tag', desc: 'Twelve hang-tag shapes with eyelets.', items: 12, owned: false, isNew: false },

  // Writing & typography
  { id: 'typ-quotes', category: 'type', name: 'Hand-written quotes', price: 2.99, tone: 'forest', glyph: 'edit-3', desc: 'Twenty hand-written cottagecore quotes.', items: 20, owned: false, isNew: false },
  { id: 'typ-num', category: 'type', name: 'Numbers & dates', price: 1.99, tone: 'oxblood', glyph: 'hash', desc: 'Ink-pressed numbers, days of the week, and months.', items: 48, owned: false, isNew: false },
  { id: 'typ-labels', category: 'type', name: 'Type labels', price: 2.49, tone: 'cream', glyph: 'type', desc: 'Press-typed paper labels in nine layouts.', items: 9, owned: true, isNew: false },

  // Paint & artistic
  { id: 'pnt-splash', category: 'paint', name: 'Watercolour splashes', price: 2.49, tone: 'rose', glyph: 'droplet', desc: 'Soft rose watercolour splashes.', items: 8, owned: false, isNew: true },
  { id: 'pnt-strokes', category: 'paint', name: 'Brush strokes', price: 1.99, tone: 'sage', glyph: 'edit-2', desc: 'Hand-painted sage brush strokes.', items: 10, owned: false, isNew: false },
  { id: 'pnt-pencil', category: 'paint', name: 'Pencil scribbles', price: 1.49, tone: 'mauve', glyph: 'edit-2', desc: 'Casual pencil marks and doodles.', items: 12, owned: false, isNew: false },

  // Sewing & fabric
  { id: 'fab-linen', category: 'fabric', name: 'Linen swatches', price: 2.49, tone: 'sage', glyph: 'layers', desc: 'Six woven linen swatches with frayed edges.', items: 6, owned: false, isNew: false },
  { id: 'fab-lace', category: 'fabric', name: 'Antique lace', price: 2.99, tone: 'cream', glyph: 'layers', desc: 'Lace trim from an old wedding gown.', items: 5, owned: false, isNew: true },
  { id: 'fab-stitch', category: 'fabric', name: 'Cross-stitch motifs', price: 1.99, tone: 'rose', glyph: 'x', desc: 'Twelve small embroidered motifs.', items: 12, owned: false, isNew: false },

  // Photos & memory keeping
  { id: 'pho-polaroid', category: 'photos', name: 'Polaroid frames', price: 2.49, tone: 'cream', glyph: 'image', desc: 'Six polaroid frames you can fill with a photo.', items: 6, owned: false, isNew: false },
  { id: 'pho-vellum', category: 'photos', name: 'Vellum overlays', price: 1.99, tone: 'blue', glyph: 'copy', desc: 'Translucent vellum sheets for layering.', items: 5, owned: false, isNew: false },

  // Decorative details
  { id: 'dec-doily', category: 'details', name: 'Lace doilies', price: 1.99, tone: 'cream', glyph: 'sun', desc: 'Six paper doilies in cream and ivory.', items: 6, owned: false, isNew: false },
  { id: 'dec-ribbon', category: 'details', name: 'Velvet ribbons', price: 2.49, tone: 'oxblood', glyph: 'gift', desc: 'Eight velvet ribbon ends.', items: 8, owned: false, isNew: false },
  { id: 'dec-bow', category: 'details', name: 'Tiny paper bows', price: 1.49, tone: 'rose', glyph: 'gift', desc: 'Twelve tiny tied paper bows.', items: 12, owned: false, isNew: true },
];

/** Editor drawer categories — match the store taxonomy (minus "all"). */
export const DRAWER_CATEGORIES = SHOP_CATEGORIES.filter((c) => c.id !== 'all');
