// studio/scripts/seed.mjs
const PROJECT_ID = 'cv53e819'
const DATASET = 'production'
const TOKEN = 'skXRiSU5BuCfRmzApfZW85xDiLViqUQYviGIpqVV06DeOPd7rXe8Zp1GFrCgjXjVyFzELC8wcS5VHzygByzVNwJHYSSiSnPfr2P088NBSbgsQudB7R1e7ngAhOjeQ5Tk8gZyNO3o3SBAUX4WajSVCZ6nQs3ReTnXbjVcVM6eTmjt2wqlcfAu'

const SHOP_ITEMS = [
  // Curated collections
  { id: 'col-spring', category: 'collections', name: 'Spring meadow', price: 5.99, tone: 'sage', glyph: 'feather', desc: 'A 32-piece collection of pressed wildflowers, soft botanical papers, and hand-painted ribbon, made for cottagecore spreads.', items: 32 },
  { id: 'col-romance', category: 'collections', name: 'Old romance', price: 6.49, tone: 'rose', glyph: 'heart', desc: '24 pieces drawing from love letters, cherry blossoms, and lace handkerchiefs.', items: 24 },
  { id: 'col-coastal', category: 'collections', name: 'Coastal almanac', price: 5.99, tone: 'blue', glyph: 'anchor', desc: 'Tide charts, soft-tone driftwood, postage from sea-side towns. 28 pieces.', items: 28 },
  { id: 'col-autumn', category: 'collections', name: 'Autumn library', price: 6.99, tone: 'amber', glyph: 'book', desc: 'Acorns, library cards, foxed pages and dried oak leaves. 30 pieces.', items: 30 },

  // Papers & backgrounds
  { id: 'pap-linen', category: 'papers', name: 'Linen sheets', price: 1.99, tone: 'cream', glyph: 'file-text', desc: 'Eight cream linen weave backgrounds with subtle directional grain.', items: 8 },
  { id: 'pap-grid', category: 'papers', name: 'Soft grid pages', price: 1.49, tone: 'sage', glyph: 'grid', desc: 'Faint sage grid pages for journaling and notes.', items: 6 },
  { id: 'pap-foxed', category: 'papers', name: 'Foxed pages', price: 2.49, tone: 'amber', glyph: 'file', desc: 'Aged paper with botanical foxing marks. Great for layering.', items: 10 },
  { id: 'pap-dots', category: 'papers', name: 'Soft polka dots', price: 1.99, tone: 'rose', glyph: 'more-horizontal', desc: 'Six pastel dotted backgrounds in our most-loved palette.', items: 6 },
  { id: 'pap-ledger', category: 'papers', name: 'Old ledger pages', price: 2.99, tone: 'mauve', glyph: 'align-left', desc: 'Aged accounting paper. Perfect for memory keeping.', items: 8 },

  // Stickers
  { id: 'stk-seals', category: 'stickers', name: 'Wax seal stickers', price: 2.49, tone: 'oxblood', glyph: 'disc', desc: 'Twelve wax-impression seals in cottage palette.', items: 12 },
  { id: 'stk-arrows', category: 'stickers', name: 'Hand-drawn arrows', price: 1.49, tone: 'forest', glyph: 'arrow-right', desc: 'Soft ink-drawn arrows to point at the things that matter.', items: 18 },
  { id: 'stk-stars', category: 'stickers', name: 'Hand-drawn stars', price: 1.49, tone: 'amber', glyph: 'star', desc: 'A constellation of inked stars and tiny sparkles.', items: 14 },
  { id: 'stk-checks', category: 'stickers', name: 'Checkmarks & ticks', price: 0.99, tone: 'sage', glyph: 'check', desc: 'Twelve cosy ticks and check-marks for to-dos.', items: 12 },
  { id: 'stk-hearts', category: 'stickers', name: 'Tiny heart stickers', price: 1.49, tone: 'rose', glyph: 'heart', desc: 'Painted hearts in three sizes, all the right pinks.', items: 16 },

  // Tape & fasteners
  { id: 'tap-washi', category: 'tape', name: 'Sage washi', price: 1.99, tone: 'sage', glyph: 'minus', desc: 'Sage washi tape in three widths.', items: 6 },
  { id: 'tap-floral', category: 'tape', name: 'Floral washi roll', price: 2.49, tone: 'rose', glyph: 'minus', desc: 'Floral pattern washi with soft rose roses on cream.', items: 4 },
  { id: 'tap-stripes', category: 'tape', name: 'Vintage striped tape', price: 1.99, tone: 'amber', glyph: 'minus', desc: 'Striped washi in warm amber and ivory.', items: 4 },
  { id: 'tap-twine', category: 'tape', name: 'Garden twine', price: 1.49, tone: 'mauve', glyph: 'link', desc: 'Soft mauve twine and paper-clip fasteners.', items: 8 },
  { id: 'tap-pins', category: 'tape', name: 'Brass paperclips', price: 1.99, tone: 'gold', glyph: 'paperclip', desc: 'Antique brass paperclips and corner stays.', items: 10 },

  // Ephemera
  { id: 'eph-postage', category: 'ephemera', name: 'Vintage postage', price: 2.99, tone: 'oxblood', glyph: 'mail', desc: 'Twenty vintage postage stamps from old letters.', items: 20 },
  { id: 'eph-tickets', category: 'ephemera', name: 'Train tickets', price: 1.99, tone: 'mauve', glyph: 'credit-card', desc: 'Twelve printed train and tram tickets.', items: 12 },
  { id: 'eph-letters', category: 'ephemera', name: 'Old letters & notes', price: 3.49, tone: 'cream', glyph: 'mail', desc: 'Eight aged letters with cursive handwriting.', items: 8 },
  { id: 'eph-cards', category: 'ephemera', name: 'Library cards', price: 1.99, tone: 'amber', glyph: 'credit-card', desc: 'Eight checkout cards from old libraries.', items: 8 },

  // Florals & botanicals
  { id: 'flo-press', category: 'florals', name: 'Pressed wildflowers', price: 3.99, tone: 'sage', glyph: 'feather', desc: 'Six real pressed wildflowers, gently scanned.', items: 6 },
  { id: 'flo-blossom', category: 'florals', name: 'Cherry blossom', price: 2.99, tone: 'rose', glyph: 'feather', desc: 'Two cherry blossom clusters.', items: 2 },
  { id: 'flo-zinnia', category: 'florals', name: 'Garden zinnias', price: 2.49, tone: 'oxblood', glyph: 'feather', desc: 'A small bouquet of crimson zinnias.', items: 3 },
  { id: 'flo-cosmos', category: 'florals', name: 'Lavender cosmos', price: 2.49, tone: 'mauve', glyph: 'feather', desc: 'Lavender cosmos in two sizes.', items: 2 },

  // Frames & containers
  { id: 'frm-oval', category: 'frames', name: 'Oval portrait frames', price: 2.99, tone: 'gold', glyph: 'circle', desc: 'Six oval frames for photos and clippings.', items: 6 },
  { id: 'frm-corner', category: 'frames', name: 'Gilded corners', price: 1.99, tone: 'gold', glyph: 'corner-up-left', desc: 'Eight gilded corner pieces for layering.', items: 8 },
  { id: 'frm-tag', category: 'frames', name: 'Hang-tags & cards', price: 2.49, tone: 'cream', glyph: 'tag', desc: 'Twelve hang-tag shapes with eyelets.', items: 12 },

  // Writing & typography
  { id: 'typ-quotes', category: 'type', name: 'Hand-written quotes', price: 2.99, tone: 'forest', glyph: 'edit-3', desc: 'Twenty hand-written cottagecore quotes.', items: 20 },
  { id: 'typ-num', category: 'type', name: 'Numbers & dates', price: 1.99, tone: 'oxblood', glyph: 'hash', desc: 'Ink-pressed numbers, days of the week, and months.', items: 48 },
  { id: 'typ-labels', category: 'type', name: 'Type labels', price: 2.49, tone: 'cream', glyph: 'type', desc: 'Press-typed paper labels in nine layouts.', items: 9 },

  // Paint & artistic
  { id: 'pnt-splash', category: 'paint', name: 'Watercolour splashes', price: 2.49, tone: 'rose', glyph: 'droplet', desc: 'Soft rose watercolour splashes.', items: 8 },
  { id: 'pnt-strokes', category: 'paint', name: 'Brush strokes', price: 1.99, tone: 'sage', glyph: 'edit-2', desc: 'Hand-painted sage brush strokes.', items: 10 },
  { id: 'pnt-pencil', category: 'paint', name: 'Pencil scribbles', price: 1.49, tone: 'mauve', glyph: 'edit-2', desc: 'Casual pencil marks and doodles.', items: 12 },

  // Sewing & fabric
  { id: 'fab-linen', category: 'fabric', name: 'Linen swatches', price: 2.49, tone: 'sage', glyph: 'layers', desc: 'Six woven linen swatches with frayed edges.', items: 6 },
  { id: 'fab-lace', category: 'fabric', name: 'Antique lace', price: 2.99, tone: 'cream', glyph: 'layers', desc: 'Lace trim from an old wedding gown.', items: 5 },
  { id: 'fab-stitch', category: 'fabric', name: 'Cross-stitch motifs', price: 1.99, tone: 'rose', glyph: 'x', desc: 'Twelve small embroidered motifs.', items: 12 },

  // Photos & memory keeping
  { id: 'pho-polaroid', category: 'photos', name: 'Polaroid frames', price: 2.49, tone: 'cream', glyph: 'image', desc: 'Six polaroid frames you can fill with a photo.', items: 6 },
  { id: 'pho-vellum', category: 'photos', name: 'Vellum overlays', price: 1.99, tone: 'blue', glyph: 'copy', desc: 'Translucent vellum sheets for layering.', items: 5 },

  // Decorative details
  { id: 'dec-doily', category: 'details', name: 'Lace doilies', price: 1.99, tone: 'cream', glyph: 'sun', desc: 'Six paper doilies in cream and ivory.', items: 6 },
  { id: 'dec-ribbon', category: 'details', name: 'Velvet ribbons', price: 2.49, tone: 'oxblood', glyph: 'gift', desc: 'Eight velvet ribbon ends.', items: 8 },
  { id: 'dec-bow', category: 'details', name: 'Tiny paper bows', price: 1.49, tone: 'rose', glyph: 'gift', desc: 'Twelve tiny tied paper bows.', items: 12 },
]

const mutations = SHOP_ITEMS.map(item => ({
  createOrReplace: {
    _type: 'item',
    _id: `item-${item.id}`,
    name: item.name,
    category: item.category,
    tier: item.price > 0 ? 'paid' : 'free',
    price: item.price,
    publishAt: new Date().toISOString(),
    description: item.desc,
    glyphFallback: item.glyph,
    tone: item.tone,
    itemCount: item.items,
  }
}))

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${DATASET}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  }
)
const result = await res.json()
console.log('Seeded', result.results?.length ?? 0, 'items')
if (result.error) console.error(result.error)
