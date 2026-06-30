/**
 * SCR-06 Shop catalogue — collection-first (bundles-only) model.
 *
 * Items are single pieces. Monetisation lives on *collections* (bundles):
 * a collection is bought once (owned forever) or unlocked wholesale by a Studio
 * subscription. Individual items are never sold. The free tier is a fixed set of
 * items — standalone free pieces plus items inside "free" collections.
 *
 * Sanity is the live source of truth; the static data below is the offline
 * fallback rendered when the network is unreachable.
 */

import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

type FeatherName = ComponentProps<typeof Feather>['name'];

export interface ShopCategory {
  id: string;
  label: string;
  icon: FeatherName;
}

// "collections" is no longer a category — collections are their own browse axis.
export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'all', label: 'All', icon: 'star' },
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

/** A single piece. Whether it can be placed is governed by `isItemUnlocked`. */
export interface ShopItem {
  id: string;
  category: string;
  name: string;
  tone: ShopTone;
  glyph: FeatherName;
  /** Real artwork — local require() number or Sanity URL { uri: string }. */
  flowerAsset?: number | { uri: string };
  desc: string;
  /** In the free tier: standalone-free OR a member of a free collection. */
  free: boolean;
  /** Ids of every collection that contains this item (may be empty). */
  collectionIds: string[];
  isNew: boolean;
}

/** Lightweight reference to a member item, used to render a collection's gallery. */
export interface CollectionItemRef {
  id: string;
  name: string;
  category: string;
  tone: ShopTone;
  glyph: FeatherName;
  flowerAsset?: number | { uri: string };
  /** High-res print PNG URL — present for live Sanity items, used by outright owners. */
  printUrl?: string;
}

/** A bundle — the only thing the shop sells. */
export interface Collection {
  id: string;
  name: string;
  palette: ShopTone;
  /** Cover artwork — local require() number or Sanity URL { uri: string }. */
  cover?: number | { uri: string };
  whatYouGet: string;
  /** One-time price; ignored when `free`. */
  price: number;
  free: boolean;
  isNew: boolean;
  /** Derived from `items.length` — never stored manually. */
  pieceCount: number;
  items: CollectionItemRef[];
}

/**
 * The one place that decides whether an item can be placed in a journal.
 * - free items are always available;
 * - owning a collection that contains the item unlocks it forever;
 * - a Studio subscription unlocks every collection;
 * - `legacyOwnedItems` grandfathers pieces bought one-time under the old
 *   per-item model, so existing buyers never lose what they paid for.
 *
 * Note: items already placed in a saved spread snapshot their artwork, so they
 * keep rendering even if a subscription later lapses — this gate only governs
 * placing *new* items from the drawer/shop.
 */
export function isItemUnlocked(
  item: Pick<ShopItem, 'id' | 'free' | 'collectionIds'>,
  ownedCollections: Record<string, boolean>,
  hasStudio: boolean,
  legacyOwnedItems: Record<string, boolean> = {},
): boolean {
  if (item.free) return true;
  if (hasStudio) return true;
  if (item.collectionIds.some((id) => ownedCollections[id])) return true;
  return !!legacyOwnedItems[item.id];
}

const FLOWERS = {
  cornflower: require('../../assets/flowers/01-cornflower-violet.png'),
  poppy: require('../../assets/flowers/02-poppy-red.png'),
  cosmos: require('../../assets/flowers/03-cosmos-lavender.png'),
  wildrose: require('../../assets/flowers/04-wildrose-pink.png'),
  blossom: require('../../assets/flowers/05-cherryblossom-cluster.png'),
  zinnia: require('../../assets/flowers/06-zinnia-crimson.png'),
};

// ─── Static fallback data (offline only; Sanity drives the live catalogue) ──────

/** Fixed free-tier items (standalone). */
const FREE_ITEM_IDS = new Set([
  'pap-linen', 'pap-grid', 'pap-dots',
  'stk-checks', 'stk-hearts', 'stk-stars',
  'tap-washi', 'tap-twine',
  'eph-tickets', 'eph-cards',
  'flo-blossom', 'flo-cosmos',
  'frm-corner', 'typ-num',
  'pnt-strokes', 'pnt-pencil',
  'fab-stitch', 'pho-vellum',
  'dec-doily', 'dec-bow',
]);

/** Which items each fallback collection contains. Every non-free item lives in one. */
const COLLECTION_MEMBERS: Record<string, string[]> = {
  'col-spring': ['pap-foxed', 'flo-press', 'flo-zinnia', 'fab-linen', 'dec-ribbon'],
  'col-romance': ['eph-letters', 'fab-lace', 'pap-ledger', 'frm-oval', 'pnt-splash'],
  'col-coastal': ['eph-postage', 'tap-stripes', 'pho-polaroid', 'frm-tag', 'tap-pins'],
  'col-autumn': ['typ-quotes', 'typ-labels', 'stk-seals', 'stk-arrows', 'tap-floral'],
};

// Invert COLLECTION_MEMBERS → itemId → collectionIds.
const ITEM_TO_COLLECTIONS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const [colId, itemIds] of Object.entries(COLLECTION_MEMBERS)) {
    for (const itemId of itemIds) (map[itemId] ??= []).push(colId);
  }
  return map;
})();

type RawItem = Omit<ShopItem, 'free' | 'collectionIds'>;

const RAW_ITEMS: RawItem[] = [
  // Papers & backgrounds
  { id: 'pap-linen', category: 'papers', name: 'Linen sheets', tone: 'cream', glyph: 'file-text', desc: 'Eight cream linen weave backgrounds with subtle directional grain.', isNew: false },
  { id: 'pap-grid', category: 'papers', name: 'Soft grid pages', tone: 'sage', glyph: 'grid', desc: 'Faint sage grid pages for journaling and notes.', isNew: false },
  { id: 'pap-foxed', category: 'papers', name: 'Foxed pages', tone: 'amber', glyph: 'file', desc: 'Aged paper with botanical foxing marks. Great for layering.', isNew: true },
  { id: 'pap-dots', category: 'papers', name: 'Soft polka dots', tone: 'rose', glyph: 'more-horizontal', desc: 'Six pastel dotted backgrounds in our most-loved palette.', isNew: false },
  { id: 'pap-ledger', category: 'papers', name: 'Old ledger pages', tone: 'mauve', glyph: 'align-left', desc: 'Aged accounting paper. Perfect for memory keeping.', isNew: false },

  // Stickers
  { id: 'stk-seals', category: 'stickers', name: 'Wax seal stickers', tone: 'oxblood', glyph: 'disc', desc: 'Twelve wax-impression seals in cottage palette.', isNew: false },
  { id: 'stk-arrows', category: 'stickers', name: 'Hand-drawn arrows', tone: 'forest', glyph: 'arrow-right', desc: 'Soft ink-drawn arrows to point at the things that matter.', isNew: false },
  { id: 'stk-stars', category: 'stickers', name: 'Hand-drawn stars', tone: 'amber', glyph: 'star', desc: 'A constellation of inked stars and tiny sparkles.', isNew: true },
  { id: 'stk-checks', category: 'stickers', name: 'Checkmarks & ticks', tone: 'sage', glyph: 'check', desc: 'Twelve cosy ticks and check-marks for to-dos.', isNew: false },
  { id: 'stk-hearts', category: 'stickers', name: 'Tiny heart stickers', tone: 'rose', glyph: 'heart', desc: 'Painted hearts in three sizes, all the right pinks.', isNew: false },

  // Tape & fasteners
  { id: 'tap-washi', category: 'tape', name: 'Sage washi', tone: 'sage', glyph: 'minus', desc: 'Sage washi tape in three widths.', isNew: false },
  { id: 'tap-floral', category: 'tape', name: 'Floral washi roll', tone: 'rose', glyph: 'minus', desc: 'Floral pattern washi with soft rose roses on cream.', isNew: true },
  { id: 'tap-stripes', category: 'tape', name: 'Vintage striped tape', tone: 'amber', glyph: 'minus', desc: 'Striped washi in warm amber and ivory.', isNew: false },
  { id: 'tap-twine', category: 'tape', name: 'Garden twine', tone: 'mauve', glyph: 'link', desc: 'Soft mauve twine and paper-clip fasteners.', isNew: false },
  { id: 'tap-pins', category: 'tape', name: 'Brass paperclips', tone: 'gold', glyph: 'paperclip', desc: 'Antique brass paperclips and corner stays.', isNew: false },

  // Ephemera
  { id: 'eph-postage', category: 'ephemera', name: 'Vintage postage', tone: 'oxblood', glyph: 'mail', desc: 'Twenty vintage postage stamps from old letters.', isNew: true },
  { id: 'eph-tickets', category: 'ephemera', name: 'Train tickets', tone: 'mauve', glyph: 'credit-card', desc: 'Twelve printed train and tram tickets.', isNew: false },
  { id: 'eph-letters', category: 'ephemera', name: 'Old letters & notes', tone: 'cream', glyph: 'mail', desc: 'Eight aged letters with cursive handwriting.', isNew: false },
  { id: 'eph-cards', category: 'ephemera', name: 'Library cards', tone: 'amber', glyph: 'credit-card', desc: 'Eight checkout cards from old libraries.', isNew: false },

  // Florals & botanicals — real assets
  { id: 'flo-press', category: 'florals', name: 'Pressed wildflowers', tone: 'sage', glyph: 'feather', flowerAsset: FLOWERS.cornflower, desc: 'Six real pressed wildflowers, gently scanned.', isNew: false },
  { id: 'flo-blossom', category: 'florals', name: 'Cherry blossom', tone: 'rose', glyph: 'feather', flowerAsset: FLOWERS.blossom, desc: 'Two cherry blossom clusters.', isNew: true },
  { id: 'flo-zinnia', category: 'florals', name: 'Garden zinnias', tone: 'oxblood', glyph: 'feather', flowerAsset: FLOWERS.zinnia, desc: 'A small bouquet of crimson zinnias.', isNew: false },
  { id: 'flo-cosmos', category: 'florals', name: 'Lavender cosmos', tone: 'mauve', glyph: 'feather', flowerAsset: FLOWERS.cosmos, desc: 'Lavender cosmos in two sizes.', isNew: false },

  // Frames & containers
  { id: 'frm-oval', category: 'frames', name: 'Oval portrait frames', tone: 'gold', glyph: 'circle', desc: 'Six oval frames for photos and clippings.', isNew: false },
  { id: 'frm-corner', category: 'frames', name: 'Gilded corners', tone: 'gold', glyph: 'corner-up-left', desc: 'Eight gilded corner pieces for layering.', isNew: true },
  { id: 'frm-tag', category: 'frames', name: 'Hang-tags & cards', tone: 'cream', glyph: 'tag', desc: 'Twelve hang-tag shapes with eyelets.', isNew: false },

  // Writing & typography
  { id: 'typ-quotes', category: 'type', name: 'Hand-written quotes', tone: 'forest', glyph: 'edit-3', desc: 'Twenty hand-written cottagecore quotes.', isNew: false },
  { id: 'typ-num', category: 'type', name: 'Numbers & dates', tone: 'oxblood', glyph: 'hash', desc: 'Ink-pressed numbers, days of the week, and months.', isNew: false },
  { id: 'typ-labels', category: 'type', name: 'Type labels', tone: 'cream', glyph: 'type', desc: 'Press-typed paper labels in nine layouts.', isNew: false },

  // Paint & artistic
  { id: 'pnt-splash', category: 'paint', name: 'Watercolour splashes', tone: 'rose', glyph: 'droplet', desc: 'Soft rose watercolour splashes.', isNew: true },
  { id: 'pnt-strokes', category: 'paint', name: 'Brush strokes', tone: 'sage', glyph: 'edit-2', desc: 'Hand-painted sage brush strokes.', isNew: false },
  { id: 'pnt-pencil', category: 'paint', name: 'Pencil scribbles', tone: 'mauve', glyph: 'edit-2', desc: 'Casual pencil marks and doodles.', isNew: false },

  // Sewing & fabric
  { id: 'fab-linen', category: 'fabric', name: 'Linen swatches', tone: 'sage', glyph: 'layers', desc: 'Six woven linen swatches with frayed edges.', isNew: false },
  { id: 'fab-lace', category: 'fabric', name: 'Antique lace', tone: 'cream', glyph: 'layers', desc: 'Lace trim from an old wedding gown.', isNew: true },
  { id: 'fab-stitch', category: 'fabric', name: 'Cross-stitch motifs', tone: 'rose', glyph: 'x', desc: 'Twelve small embroidered motifs.', isNew: false },

  // Photos & memory keeping
  { id: 'pho-polaroid', category: 'photos', name: 'Polaroid frames', tone: 'cream', glyph: 'image', desc: 'Six polaroid frames you can fill with a photo.', isNew: false },
  { id: 'pho-vellum', category: 'photos', name: 'Vellum overlays', tone: 'blue', glyph: 'copy', desc: 'Translucent vellum sheets for layering.', isNew: false },

  // Decorative details
  { id: 'dec-doily', category: 'details', name: 'Lace doilies', tone: 'cream', glyph: 'sun', desc: 'Six paper doilies in cream and ivory.', isNew: false },
  { id: 'dec-ribbon', category: 'details', name: 'Velvet ribbons', tone: 'oxblood', glyph: 'gift', desc: 'Eight velvet ribbon ends.', isNew: false },
  { id: 'dec-bow', category: 'details', name: 'Tiny paper bows', tone: 'rose', glyph: 'gift', desc: 'Twelve tiny tied paper bows.', isNew: true },
];

export const SHOP_CATALOGUE: ShopItem[] = RAW_ITEMS.map((it) => ({
  ...it,
  free: FREE_ITEM_IDS.has(it.id),
  collectionIds: ITEM_TO_COLLECTIONS[it.id] ?? [],
}));

const COLLECTION_META: Omit<Collection, 'pieceCount' | 'items'>[] = [
  { id: 'col-spring', name: 'Spring meadow', palette: 'sage', price: 5.99, free: false, isNew: true, whatYouGet: 'Pressed wildflowers, soft botanical papers, and hand-painted ribbon, made for cottagecore spreads.' },
  { id: 'col-romance', name: 'Old romance', palette: 'rose', price: 6.49, free: false, isNew: false, whatYouGet: 'Love letters, lace, aged ledgers and oval frames for tender, romantic pages.' },
  { id: 'col-coastal', name: 'Coastal almanac', palette: 'blue', price: 5.99, free: false, isNew: false, whatYouGet: 'Vintage postage, striped tape, polaroids and hang-tags from sea-side towns.' },
  { id: 'col-autumn', name: 'Autumn library', palette: 'amber', price: 6.99, free: false, isNew: true, whatYouGet: 'Hand-written quotes, type labels, wax seals and ink arrows for cosy archives.' },
];

export const FALLBACK_COLLECTIONS: Collection[] = COLLECTION_META.map((meta) => {
  const items: CollectionItemRef[] = (COLLECTION_MEMBERS[meta.id] ?? [])
    .map((id) => SHOP_CATALOGUE.find((s) => s.id === id))
    .filter((s): s is ShopItem => !!s)
    .map((s) => ({ id: s.id, name: s.name, category: s.category, tone: s.tone, glyph: s.glyph, flowerAsset: s.flowerAsset }));
  return { ...meta, pieceCount: items.length, items };
});

/**
 * Display pricing for Studio. These must match the prices you configure in
 * App Store Connect / Google Play (RevenueCat charges the store price, this is
 * only what we render). Annual works out at $3.33/mo — a 44% saving.
 */
export const STUDIO_PRICING = {
  monthly: { price: '$5.99', period: 'month' },
  annual: { price: '$39.99', period: 'year', perMonth: '$3.33', saving: '44%' },
} as const;

/** Editor drawer categories — match the store taxonomy (minus "all"). */
export const DRAWER_CATEGORIES = SHOP_CATEGORIES.filter((c) => c.id !== 'all');
