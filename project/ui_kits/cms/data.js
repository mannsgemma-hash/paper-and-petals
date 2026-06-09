// Paper & Petals — Studio CMS · mock data layer.
//
// In production every array below is a collection in your headless CMS
// (Sanity / Strapi / Contentful). One "Item" model powers BOTH the consumer
// Shop (SCR-06) and the journal-editor drawer (SCR-07); "Pack" references items
// by id for the daily delivery; "Feedback" is filled by the in-app Send-feedback
// form (SCR-23). Dates are ISO so the app can filter on `now`.

window.CMS = (function () {
  const TODAY = '2026-06-09';

  // The shared taxonomy — identical to SHOP_CATEGORIES in the app.
  const CATEGORIES = [
    { id: 'collections', label: 'Collections',            tone: '#A98C98' },
    { id: 'papers',      label: 'Papers & backgrounds',   tone: '#C8A96B' },
    { id: 'stickers',    label: 'Stickers',               tone: '#4E6652' },
    { id: 'tape',        label: 'Tape & fasteners',       tone: '#C47B63' },
    { id: 'ephemera',    label: 'Ephemera',               tone: '#9E7C5C' },
    { id: 'florals',     label: 'Florals & botanicals',   tone: '#87937C' },
    { id: 'frames',      label: 'Frames & containers',    tone: '#8FA3B8' },
    { id: 'type',        label: 'Writing & typography',   tone: '#7A6B52' },
    { id: 'paint',       label: 'Paint & artistic',       tone: '#B26A5A' },
    { id: 'fabric',      label: 'Sewing & fabric',        tone: '#A98C98' },
    { id: 'photos',      label: 'Photos & memory keeping', tone: '#8FA3B8' },
    { id: 'details',     label: 'Decorative details',     tone: '#C8A96B' },
  ];
  const CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
  const CAT_TONE  = Object.fromEntries(CATEGORIES.map(c => [c.id, c.tone]));

  // status is derived from tier + publishAt in real life; stored here for the mock.
  //   live      → publishAt <= today
  //   scheduled → publishAt  > today
  //   draft     → no publishAt yet
  const ITEMS = [
    { id: 'col-spring',  name: 'Spring Meadow collection', category: 'collections', tier: 'paid', price: 5.99, publishAt: '2026-05-02', glyph: 'collection' },
    { id: 'col-romance', name: 'Old Romance collection',   category: 'collections', tier: 'paid', price: 6.49, publishAt: '2026-05-20', glyph: 'collection' },
    { id: 'col-autumn',  name: 'Autumn Library collection', category: 'collections', tier: 'paid', price: 6.99, publishAt: '2026-08-15', glyph: 'collection' },

    { id: 'pap-linen',   name: 'Linen sheets',          category: 'papers',   tier: 'free', price: 0,    publishAt: '2026-04-12', glyph: 'paper' },
    { id: 'pap-foxed',   name: 'Foxed pages',           category: 'papers',   tier: 'paid', price: 2.49, publishAt: '2026-05-28', glyph: 'paper' },
    { id: 'pap-ledger',  name: 'Old ledger pages',      category: 'papers',   tier: 'paid', price: 2.99, publishAt: '2026-06-12', glyph: 'paper' },

    { id: 'stk-seals',   name: 'Wax seal stickers',     category: 'stickers', tier: 'paid', price: 2.49, publishAt: '2026-05-06', glyph: 'seal' },
    { id: 'stk-stars',   name: 'Hand-drawn stars',      category: 'stickers', tier: 'free', price: 0,    publishAt: '2026-04-30', glyph: 'star' },
    { id: 'stk-hearts',  name: 'Tiny heart stickers',   category: 'stickers', tier: 'free', price: 0,    publishAt: null,         glyph: 'heart' },

    { id: 'tap-sage',    name: 'Sage washi',            category: 'tape',     tier: 'free', price: 0,    publishAt: '2026-05-18', glyph: 'tape' },
    { id: 'tap-gold',    name: 'Gold foil tape',        category: 'tape',     tier: 'paid', price: 1.99, publishAt: '2026-06-15', glyph: 'tape' },

    { id: 'eph-library', name: 'Library cards',         category: 'ephemera', tier: 'paid', price: 2.29, publishAt: '2026-05-11', glyph: 'card' },
    { id: 'eph-ticket',  name: 'Vintage bus tickets',   category: 'ephemera', tier: 'free', price: 0,    publishAt: '2026-06-16', glyph: 'card' },

    { id: 'flo-rose',    name: 'Pressed wild roses',    category: 'florals',  tier: 'free', price: 0,    publishAt: '2026-05-01', glyph: 'flower' },
    { id: 'flo-poppy',   name: 'Crimson poppies',       category: 'florals',  tier: 'paid', price: 1.49, publishAt: '2026-06-10', glyph: 'flower' },
    { id: 'flo-cosmos',  name: 'Lavender cosmos',       category: 'florals',  tier: 'paid', price: 1.49, publishAt: null,         glyph: 'flower' },

    { id: 'frm-oval',    name: 'Oval photo mats',       category: 'frames',   tier: 'paid', price: 1.99, publishAt: '2026-05-22', glyph: 'frame' },
    { id: 'frm-deckle',  name: 'Deckle-edge frames',    category: 'frames',   tier: 'paid', price: 2.49, publishAt: '2026-06-13', glyph: 'frame' },

    { id: 'typ-date',    name: 'Date stamps',           category: 'type',     tier: 'free', price: 0,    publishAt: '2026-04-26', glyph: 'type' },
    { id: 'typ-banner',  name: 'Title banners',         category: 'type',     tier: 'paid', price: 1.29, publishAt: '2026-06-20', glyph: 'type' },

    { id: 'pnt-wash',    name: 'Watercolour washes',    category: 'paint',    tier: 'paid', price: 2.99, publishAt: '2026-05-30', glyph: 'paint' },
    { id: 'fab-gingham', name: 'Gingham patches',       category: 'fabric',   tier: 'paid', price: 1.79, publishAt: null,         glyph: 'fabric' },
    { id: 'pho-polaroid', name: 'Polaroid frames',      category: 'photos',   tier: 'free', price: 0,    publishAt: '2026-05-14', glyph: 'frame' },
    { id: 'det-charms',  name: 'Brass charms',          category: 'details',  tier: 'paid', price: 2.19, publishAt: '2026-06-18', glyph: 'charm' },
  ];

  // Daily delivery packs — each date ships a FREE parcel (every user) and a
  // SUBSCRIPTION parcel (premium members), each referencing items by id.
  const PACKS = [
    { date: '2026-06-09', title: 'Quiet Monday',  free: ['pap-linen', 'stk-stars'],   sub: ['pap-linen', 'stk-stars', 'flo-rose', 'eph-library', 'frm-oval'] },
    { date: '2026-06-10', title: 'Poppy Field',   free: ['tap-sage', 'typ-date'],     sub: ['tap-sage', 'typ-date', 'flo-poppy', 'pnt-wash', 'det-charms'] },
    { date: '2026-06-11', title: 'Letters Home',  free: ['pap-linen', 'eph-ticket'],  sub: ['pap-linen', 'eph-ticket', 'eph-library', 'stk-seals', 'col-romance'] },
    { date: '2026-06-12', title: 'Ledger & Ink',  free: ['typ-date'],                 sub: ['typ-date', 'pap-ledger', 'typ-banner', 'stk-seals'] },
    { date: '2026-06-13', title: 'Framed',        free: ['pho-polaroid'],             sub: ['pho-polaroid', 'frm-deckle', 'frm-oval', 'det-charms'] },
    { date: '2026-06-14', title: 'Sunday Garden', free: ['flo-rose'],                 sub: ['flo-rose', 'flo-poppy', 'flo-cosmos', 'col-spring'] },
    { date: '2026-06-15', title: 'Gilded',        free: ['stk-hearts'],               sub: ['stk-hearts', 'tap-gold', 'det-charms', 'pnt-wash'] },
  ];

  const FEEDBACK = [
    { id: 'fb1', type: 'idea', message: 'Could we get a "duplicate spread" button? I make a lot of similar weekly layouts.', email: 'marion@example.com', date: '2026-06-08', read: false },
    { id: 'fb2', type: 'love', message: 'The daily parcel is the highlight of my morning. Thank you for making something so calm.', email: '', date: '2026-06-08', read: false },
    { id: 'fb3', type: 'bug', message: 'Wax seal stickers sometimes paste behind the page when I place them near the spine.', email: 'devon@example.com', date: '2026-06-07', read: false },
    { id: 'fb4', type: 'idea', message: 'Please add a sepia paper pack for old photos!', email: 'lena@example.com', date: '2026-06-06', read: true },
    { id: 'fb5', type: 'love', message: 'Pinyon Script on the loading screen is gorgeous.', email: '', date: '2026-06-05', read: true },
    { id: 'fb6', type: 'bug', message: 'Export button did nothing on my older tablet (iPad 6th gen).', email: 'sam@example.com', date: '2026-06-04', read: true },
  ];

  function statusOf(item) {
    if (!item.publishAt) return 'draft';
    return item.publishAt > TODAY ? 'scheduled' : 'live';
  }

  return { TODAY, CATEGORIES, CAT_LABEL, CAT_TONE, ITEMS, PACKS, FEEDBACK, statusOf };
})();
