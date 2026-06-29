// studio/scripts/seed.mjs
// Seeds shop ITEMS (single pieces) and COLLECTIONS (bundles) into Sanity.
// Keep in sync with src/data/shop.ts (the offline fallback mirror).
//
// NOTE: the write token below should be rotated — committing it is a security
// risk. Prefer reading it from an env var (process.env.SANITY_WRITE_TOKEN).
const PROJECT_ID = 'cv53e819'
const DATASET = 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN || 'skXRiSU5BuCfRmzApfZW85xDiLViqUQYviGIpqVV06DeOPd7rXe8Zp1GFrCgjXjVyFzELC8wcS5VHzygByzVNwJHYSSiSnPfr2P088NBSbgsQudB7R1e7ngAhOjeQ5Tk8gZyNO3o3SBAUX4WajSVCZ6nQs3ReTnXbjVcVM6eTmjt2wqlcfAu'

// Fixed free-tier items (standalone). Everything else is paid-only (sold inside a collection).
const FREE_IDS = new Set([
  'pap-linen', 'pap-grid', 'pap-dots',
  'stk-checks', 'stk-hearts', 'stk-stars',
  'tap-washi', 'tap-twine',
  'eph-tickets', 'eph-cards',
  'flo-blossom', 'flo-cosmos',
  'frm-corner', 'typ-num',
  'pnt-strokes', 'pnt-pencil',
  'fab-stitch', 'pho-vellum',
  'dec-doily', 'dec-bow',
])

const SHOP_ITEMS = [
  // Papers & backgrounds
  { id: 'pap-linen', category: 'papers', name: 'Linen sheets', tone: 'cream', glyph: 'file-text', desc: 'Eight cream linen weave backgrounds with subtle directional grain.' },
  { id: 'pap-grid', category: 'papers', name: 'Soft grid pages', tone: 'sage', glyph: 'grid', desc: 'Faint sage grid pages for journaling and notes.' },
  { id: 'pap-foxed', category: 'papers', name: 'Foxed pages', tone: 'amber', glyph: 'file', desc: 'Aged paper with botanical foxing marks. Great for layering.' },
  { id: 'pap-dots', category: 'papers', name: 'Soft polka dots', tone: 'rose', glyph: 'more-horizontal', desc: 'Six pastel dotted backgrounds in our most-loved palette.' },
  { id: 'pap-ledger', category: 'papers', name: 'Old ledger pages', tone: 'mauve', glyph: 'align-left', desc: 'Aged accounting paper. Perfect for memory keeping.' },

  // Stickers
  { id: 'stk-seals', category: 'stickers', name: 'Wax seal stickers', tone: 'oxblood', glyph: 'disc', desc: 'Twelve wax-impression seals in cottage palette.' },
  { id: 'stk-arrows', category: 'stickers', name: 'Hand-drawn arrows', tone: 'forest', glyph: 'arrow-right', desc: 'Soft ink-drawn arrows to point at the things that matter.' },
  { id: 'stk-stars', category: 'stickers', name: 'Hand-drawn stars', tone: 'amber', glyph: 'star', desc: 'A constellation of inked stars and tiny sparkles.' },
  { id: 'stk-checks', category: 'stickers', name: 'Checkmarks & ticks', tone: 'sage', glyph: 'check', desc: 'Twelve cosy ticks and check-marks for to-dos.' },
  { id: 'stk-hearts', category: 'stickers', name: 'Tiny heart stickers', tone: 'rose', glyph: 'heart', desc: 'Painted hearts in three sizes, all the right pinks.' },

  // Tape & fasteners
  { id: 'tap-washi', category: 'tape', name: 'Sage washi', tone: 'sage', glyph: 'minus', desc: 'Sage washi tape in three widths.' },
  { id: 'tap-floral', category: 'tape', name: 'Floral washi roll', tone: 'rose', glyph: 'minus', desc: 'Floral pattern washi with soft rose roses on cream.' },
  { id: 'tap-stripes', category: 'tape', name: 'Vintage striped tape', tone: 'amber', glyph: 'minus', desc: 'Striped washi in warm amber and ivory.' },
  { id: 'tap-twine', category: 'tape', name: 'Garden twine', tone: 'mauve', glyph: 'link', desc: 'Soft mauve twine and paper-clip fasteners.' },
  { id: 'tap-pins', category: 'tape', name: 'Brass paperclips', tone: 'gold', glyph: 'paperclip', desc: 'Antique brass paperclips and corner stays.' },

  // Ephemera
  { id: 'eph-postage', category: 'ephemera', name: 'Vintage postage', tone: 'oxblood', glyph: 'mail', desc: 'Twenty vintage postage stamps from old letters.' },
  { id: 'eph-tickets', category: 'ephemera', name: 'Train tickets', tone: 'mauve', glyph: 'credit-card', desc: 'Twelve printed train and tram tickets.' },
  { id: 'eph-letters', category: 'ephemera', name: 'Old letters & notes', tone: 'cream', glyph: 'mail', desc: 'Eight aged letters with cursive handwriting.' },
  { id: 'eph-cards', category: 'ephemera', name: 'Library cards', tone: 'amber', glyph: 'credit-card', desc: 'Eight checkout cards from old libraries.' },

  // Florals & botanicals
  { id: 'flo-press', category: 'florals', name: 'Pressed wildflowers', tone: 'sage', glyph: 'feather', desc: 'Six real pressed wildflowers, gently scanned.' },
  { id: 'flo-blossom', category: 'florals', name: 'Cherry blossom', tone: 'rose', glyph: 'feather', desc: 'Two cherry blossom clusters.' },
  { id: 'flo-zinnia', category: 'florals', name: 'Garden zinnias', tone: 'oxblood', glyph: 'feather', desc: 'A small bouquet of crimson zinnias.' },
  { id: 'flo-cosmos', category: 'florals', name: 'Lavender cosmos', tone: 'mauve', glyph: 'feather', desc: 'Lavender cosmos in two sizes.' },

  // Frames & containers
  { id: 'frm-oval', category: 'frames', name: 'Oval portrait frames', tone: 'gold', glyph: 'circle', desc: 'Six oval frames for photos and clippings.' },
  { id: 'frm-corner', category: 'frames', name: 'Gilded corners', tone: 'gold', glyph: 'corner-up-left', desc: 'Eight gilded corner pieces for layering.' },
  { id: 'frm-tag', category: 'frames', name: 'Hang-tags & cards', tone: 'cream', glyph: 'tag', desc: 'Twelve hang-tag shapes with eyelets.' },

  // Writing & typography
  { id: 'typ-quotes', category: 'type', name: 'Hand-written quotes', tone: 'forest', glyph: 'edit-3', desc: 'Twenty hand-written cottagecore quotes.' },
  { id: 'typ-num', category: 'type', name: 'Numbers & dates', tone: 'oxblood', glyph: 'hash', desc: 'Ink-pressed numbers, days of the week, and months.' },
  { id: 'typ-labels', category: 'type', name: 'Type labels', tone: 'cream', glyph: 'type', desc: 'Press-typed paper labels in nine layouts.' },

  // Paint & artistic
  { id: 'pnt-splash', category: 'paint', name: 'Watercolour splashes', tone: 'rose', glyph: 'droplet', desc: 'Soft rose watercolour splashes.' },
  { id: 'pnt-strokes', category: 'paint', name: 'Brush strokes', tone: 'sage', glyph: 'edit-2', desc: 'Hand-painted sage brush strokes.' },
  { id: 'pnt-pencil', category: 'paint', name: 'Pencil scribbles', tone: 'mauve', glyph: 'edit-2', desc: 'Casual pencil marks and doodles.' },

  // Sewing & fabric
  { id: 'fab-linen', category: 'fabric', name: 'Linen swatches', tone: 'sage', glyph: 'layers', desc: 'Six woven linen swatches with frayed edges.' },
  { id: 'fab-lace', category: 'fabric', name: 'Antique lace', tone: 'cream', glyph: 'layers', desc: 'Lace trim from an old wedding gown.' },
  { id: 'fab-stitch', category: 'fabric', name: 'Cross-stitch motifs', tone: 'rose', glyph: 'x', desc: 'Twelve small embroidered motifs.' },

  // Photos & memory keeping
  { id: 'pho-polaroid', category: 'photos', name: 'Polaroid frames', tone: 'cream', glyph: 'image', desc: 'Six polaroid frames you can fill with a photo.' },
  { id: 'pho-vellum', category: 'photos', name: 'Vellum overlays', tone: 'blue', glyph: 'copy', desc: 'Translucent vellum sheets for layering.' },

  // Decorative details
  { id: 'dec-doily', category: 'details', name: 'Lace doilies', tone: 'cream', glyph: 'sun', desc: 'Six paper doilies in cream and ivory.' },
  { id: 'dec-ribbon', category: 'details', name: 'Velvet ribbons', tone: 'oxblood', glyph: 'gift', desc: 'Eight velvet ribbon ends.' },
  { id: 'dec-bow', category: 'details', name: 'Tiny paper bows', tone: 'rose', glyph: 'gift', desc: 'Twelve tiny tied paper bows.' },
]

const COLLECTIONS = [
  { id: 'col-spring', name: 'Spring meadow', palette: 'sage', price: 5.99, free: false, whatYouGet: 'Pressed wildflowers, soft botanical papers, and hand-painted ribbon, made for cottagecore spreads.', items: ['pap-foxed', 'flo-press', 'flo-zinnia', 'fab-linen', 'dec-ribbon'] },
  { id: 'col-romance', name: 'Old romance', palette: 'rose', price: 6.49, free: false, whatYouGet: 'Love letters, lace, aged ledgers and oval frames for tender, romantic pages.', items: ['eph-letters', 'fab-lace', 'pap-ledger', 'frm-oval', 'pnt-splash'] },
  { id: 'col-coastal', name: 'Coastal almanac', palette: 'blue', price: 5.99, free: false, whatYouGet: 'Vintage postage, striped tape, polaroids and hang-tags from sea-side towns.', items: ['eph-postage', 'tap-stripes', 'pho-polaroid', 'frm-tag', 'tap-pins'] },
  { id: 'col-autumn', name: 'Autumn library', palette: 'amber', price: 6.99, free: false, whatYouGet: 'Hand-written quotes, type labels, wax seals and ink arrows for cosy archives.', items: ['typ-quotes', 'typ-labels', 'stk-seals', 'stk-arrows', 'tap-floral'] },
]

const now = new Date().toISOString()

const itemMutations = SHOP_ITEMS.map(item => ({
  createOrReplace: {
    _type: 'item',
    _id: `item-${item.id}`,
    name: item.name,
    category: item.category,
    free: FREE_IDS.has(item.id),
    publishAt: now,
    description: item.desc,
    glyphFallback: item.glyph,
    tone: item.tone,
  },
}))

const collectionMutations = COLLECTIONS.map(col => ({
  createOrReplace: {
    _type: 'collection',
    _id: `collection-${col.id}`,
    name: col.name,
    palette: col.palette,
    free: col.free,
    price: col.price,
    whatYouGet: col.whatYouGet,
    publishAt: now,
    items: col.items.map(itemId => ({
      _type: 'reference',
      _key: itemId,
      _ref: `item-${itemId}`,
    })),
  },
}))

const mutations = [...itemMutations, ...collectionMutations]

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${DATASET}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  }
)
const result = await res.json()
console.log('Seeded', itemMutations.length, 'items +', collectionMutations.length, 'collections')
if (result.error) console.error(result.error)
