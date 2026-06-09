// SCR-06 Shop.
//
// Inspired by a Canva-style home: a search bar at the top, a row of category
// shortcuts under it, and a scrollable grid of items below. Tapping an item
// opens a Toca-Boca-style detail panel with a large preview, description,
// related items, and either a price button or an "Owned" stamp.
//
// All items here are mock data — when a real catalogue lands, replace
// SHOP_CATALOGUE and the placeholder thumbnails. Categories ARE final.

const SHOP_CATEGORIES = [
  { id: 'all',         label: 'All',                       icon: 'sparkle'   },
  { id: 'collections', label: 'Collections',               icon: 'package'   },
  { id: 'papers',      label: 'Papers & backgrounds',      icon: 'doc'       },
  { id: 'stickers',    label: 'Stickers',                  icon: 'seal'      },
  { id: 'tape',        label: 'Tape & fasteners',          icon: 'ribbon'    },
  { id: 'ephemera',    label: 'Ephemera',                  icon: 'archive'   },
  { id: 'florals',     label: 'Florals & botanicals',      icon: 'flower'    },
  { id: 'frames',      label: 'Frames & containers',       icon: 'border'    },
  { id: 'type',        label: 'Writing & typography',      icon: 'edit'      },
  { id: 'paint',       label: 'Paint & artistic',          icon: 'palette'   },
  { id: 'fabric',      label: 'Sewing & fabric',           icon: 'scissors'  },
  { id: 'photos',      label: 'Photos & memory keeping',   icon: 'image'     },
  { id: 'details',     label: 'Decorative details',        icon: 'star'      },
];

// ── Catalogue ────────────────────────────────────────────────────────────

const SHOP_CATALOGUE = [
  // Curated collections
  { id: 'col-spring',   category: 'collections', name: 'Spring meadow',         price: 5.99, art: { kind: 'collection', tone: 'sage',    glyphs: ['flower','flower','leaf'] }, desc: 'A 32-piece collection of pressed wildflowers, soft botanical papers, and hand-painted ribbon, made for cottagecore spreads.', items: 32, owned: false, isNew: true },
  { id: 'col-romance',  category: 'collections', name: 'Old romance',           price: 6.49, art: { kind: 'collection', tone: 'rose',    glyphs: ['heart','flower','stamp'] }, desc: '24 pieces drawing from love letters, cherry blossoms, and lace handkerchiefs.', items: 24, owned: true,  isNew: false },
  { id: 'col-coastal',  category: 'collections', name: 'Coastal almanac',       price: 5.99, art: { kind: 'collection', tone: 'blue',    glyphs: ['shell','flag','leaf'] },    desc: 'Tide charts, soft-tone driftwood, postage from sea-side towns. 28 pieces.', items: 28, owned: false, isNew: false },
  { id: 'col-autumn',   category: 'collections', name: 'Autumn library',        price: 6.99, art: { kind: 'collection', tone: 'amber',   glyphs: ['leaf','book','stamp'] },    desc: 'Acorns, library cards, foxed pages and dried oak leaves. 30 pieces.', items: 30, owned: false, isNew: true },

  // Papers & backgrounds
  { id: 'pap-linen',    category: 'papers',      name: 'Linen sheets',          price: 1.99, art: { kind: 'paper', tone: 'cream',  pattern: 'linen' },     desc: 'Eight cream linen weave backgrounds with subtle directional grain.', items: 8,  owned: true,  isNew: false },
  { id: 'pap-grid',     category: 'papers',      name: 'Soft grid pages',       price: 1.49, art: { kind: 'paper', tone: 'sage',   pattern: 'grid' },      desc: 'Faint sage grid pages for journaling and notes.', items: 6, owned: false, isNew: false },
  { id: 'pap-foxed',    category: 'papers',      name: 'Foxed pages',           price: 2.49, art: { kind: 'paper', tone: 'amber',  pattern: 'foxed' },     desc: 'Aged paper with botanical foxing marks. Great for layering.', items: 10, owned: false, isNew: true },
  { id: 'pap-dots',     category: 'papers',      name: 'Soft polka dots',       price: 1.99, art: { kind: 'paper', tone: 'rose',   pattern: 'polka' },     desc: 'Six pastel dotted backgrounds in our most-loved palette.', items: 6, owned: false, isNew: false },
  { id: 'pap-ledger',   category: 'papers',      name: 'Old ledger pages',      price: 2.99, art: { kind: 'paper', tone: 'mauve',  pattern: 'lines' },     desc: 'Aged accounting paper. Perfect for memory keeping.', items: 8, owned: false, isNew: false },

  // Stickers
  { id: 'stk-seals',    category: 'stickers',    name: 'Wax seal stickers',     price: 2.49, art: { kind: 'sticker', tone: 'oxblood', shape: 'seal' },    desc: 'Twelve wax-impression seals in cottage palette.', items: 12, owned: true,  isNew: false },
  { id: 'stk-arrows',   category: 'stickers',    name: 'Hand-drawn arrows',     price: 1.49, art: { kind: 'sticker', tone: 'forest',  shape: 'arrow' },   desc: 'Soft ink-drawn arrows to point at the things that matter.', items: 18, owned: false, isNew: false },
  { id: 'stk-stars',    category: 'stickers',    name: 'Hand-drawn stars',      price: 1.49, art: { kind: 'sticker', tone: 'amber',   shape: 'star' },    desc: 'A constellation of inked stars and tiny sparkles.', items: 14, owned: false, isNew: true },
  { id: 'stk-checks',   category: 'stickers',    name: 'Checkmarks & ticks',    price: 0.99, art: { kind: 'sticker', tone: 'sage',    shape: 'check' },   desc: 'Twelve cosy ticks and check-marks for to-dos.', items: 12, owned: false, isNew: false },
  { id: 'stk-hearts',   category: 'stickers',    name: 'Tiny heart stickers',   price: 1.49, art: { kind: 'sticker', tone: 'rose',    shape: 'heart' },   desc: 'Painted hearts in three sizes, all the right pinks.', items: 16, owned: false, isNew: false },

  // Tape & fasteners
  { id: 'tap-washi',    category: 'tape',        name: 'Sage washi',            price: 1.99, art: { kind: 'tape', tone: 'sage' },                          desc: 'Sage washi tape in three widths.', items: 6,  owned: true,  isNew: false },
  { id: 'tap-floral',   category: 'tape',        name: 'Floral washi roll',     price: 2.49, art: { kind: 'tape', tone: 'rose'  },                         desc: 'Floral pattern washi with soft rose roses on cream.', items: 4, owned: false, isNew: true },
  { id: 'tap-stripes',  category: 'tape',        name: 'Vintage striped tape',  price: 1.99, art: { kind: 'tape', tone: 'amber' },                         desc: 'Striped washi in warm amber and ivory.', items: 4, owned: false, isNew: false },
  { id: 'tap-twine',    category: 'tape',        name: 'Garden twine',          price: 1.49, art: { kind: 'tape', tone: 'mauve' },                         desc: 'Soft mauve twine and paper-clip fasteners.', items: 8, owned: false, isNew: false },
  { id: 'tap-pins',     category: 'tape',        name: 'Brass paperclips',      price: 1.99, art: { kind: 'tape', tone: 'gold'  },                         desc: 'Antique brass paperclips and corner stays.', items: 10, owned: false, isNew: false },

  // Ephemera
  { id: 'eph-postage',  category: 'ephemera',    name: 'Vintage postage',       price: 2.99, art: { kind: 'ephemera', tone: 'oxblood', shape: 'stamp' },   desc: 'Twenty vintage postage stamps from old letters.', items: 20, owned: false, isNew: true },
  { id: 'eph-tickets',  category: 'ephemera',    name: 'Train tickets',         price: 1.99, art: { kind: 'ephemera', tone: 'mauve',   shape: 'ticket' },  desc: 'Twelve printed train and tram tickets.', items: 12, owned: false, isNew: false },
  { id: 'eph-letters',  category: 'ephemera',    name: 'Old letters & notes',   price: 3.49, art: { kind: 'ephemera', tone: 'cream',   shape: 'letter' },  desc: 'Eight aged letters with cursive handwriting.', items: 8, owned: false, isNew: false },
  { id: 'eph-cards',    category: 'ephemera',    name: 'Library cards',         price: 1.99, art: { kind: 'ephemera', tone: 'amber',   shape: 'card' },    desc: 'Eight checkout cards from old libraries.', items: 8, owned: false, isNew: false },

  // Florals & botanicals — real assets
  { id: 'flo-press',    category: 'florals',     name: 'Pressed wildflowers',   price: 3.99, art: { kind: 'florals', files: ['01-cornflower-violet.png','02-poppy-red.png','04-wildrose-pink.png'] }, desc: 'Six real pressed wildflowers, gently scanned.', items: 6, owned: true, isNew: false },
  { id: 'flo-blossom',  category: 'florals',     name: 'Cherry blossom',        price: 2.99, art: { kind: 'florals', files: ['05-cherryblossom-cluster.png'] }, desc: 'Two cherry blossom clusters.', items: 2, owned: false, isNew: true },
  { id: 'flo-zinnia',   category: 'florals',     name: 'Garden zinnias',        price: 2.49, art: { kind: 'florals', files: ['06-zinnia-crimson.png'] }, desc: 'A small bouquet of crimson zinnias.', items: 3, owned: false, isNew: false },
  { id: 'flo-cosmos',   category: 'florals',     name: 'Lavender cosmos',       price: 2.49, art: { kind: 'florals', files: ['03-cosmos-lavender.png'] }, desc: 'Lavender cosmos in two sizes.', items: 2, owned: false, isNew: false },

  // Frames & containers
  { id: 'frm-oval',     category: 'frames',      name: 'Oval portrait frames',  price: 2.99, art: { kind: 'frame', shape: 'oval' },                       desc: 'Six oval frames for photos and clippings.', items: 6, owned: false, isNew: false },
  { id: 'frm-corner',   category: 'frames',      name: 'Gilded corners',        price: 1.99, art: { kind: 'frame', shape: 'corner' },                     desc: 'Eight gilded corner pieces for layering.', items: 8, owned: false, isNew: true },
  { id: 'frm-tag',      category: 'frames',      name: 'Hang-tags & cards',     price: 2.49, art: { kind: 'frame', shape: 'tag' },                        desc: 'Twelve hang-tag shapes with eyelets.', items: 12, owned: false, isNew: false },

  // Writing & typography
  { id: 'typ-quotes',   category: 'type',        name: 'Hand-written quotes',   price: 2.99, art: { kind: 'type', tone: 'forest',  style: 'script' },     desc: 'Twenty hand-written cottagecore quotes.', items: 20, owned: false, isNew: false },
  { id: 'typ-num',      category: 'type',        name: 'Numbers & dates',       price: 1.99, art: { kind: 'type', tone: 'oxblood', style: 'numbers' },    desc: 'Ink-pressed numbers, days of the week, and months.', items: 48, owned: false, isNew: false },
  { id: 'typ-labels',   category: 'type',        name: 'Type labels',           price: 2.49, art: { kind: 'type', tone: 'cream',   style: 'labels' },     desc: 'Press-typed paper labels in nine layouts.', items: 9, owned: true, isNew: false },

  // Paint & artistic
  { id: 'pnt-splash',   category: 'paint',       name: 'Watercolour splashes',  price: 2.49, art: { kind: 'paint', tone: 'rose'   },                      desc: 'Soft rose watercolour splashes.', items: 8, owned: false, isNew: true },
  { id: 'pnt-strokes',  category: 'paint',       name: 'Brush strokes',         price: 1.99, art: { kind: 'paint', tone: 'sage'   },                      desc: 'Hand-painted sage brush strokes.', items: 10, owned: false, isNew: false },
  { id: 'pnt-pencil',   category: 'paint',       name: 'Pencil scribbles',      price: 1.49, art: { kind: 'paint', tone: 'mauve'  },                      desc: 'Casual pencil marks and doodles.', items: 12, owned: false, isNew: false },

  // Sewing & fabric
  { id: 'fab-linen',    category: 'fabric',      name: 'Linen swatches',        price: 2.49, art: { kind: 'fabric', tone: 'sage'  },                      desc: 'Six woven linen swatches with frayed edges.', items: 6, owned: false, isNew: false },
  { id: 'fab-lace',     category: 'fabric',      name: 'Antique lace',          price: 2.99, art: { kind: 'fabric', tone: 'cream' },                      desc: 'Lace trim from an old wedding gown.', items: 5, owned: false, isNew: true },
  { id: 'fab-stitch',   category: 'fabric',      name: 'Cross-stitch motifs',   price: 1.99, art: { kind: 'fabric', tone: 'rose'  },                      desc: 'Twelve small embroidered motifs.', items: 12, owned: false, isNew: false },

  // Photos & memory keeping
  { id: 'pho-polaroid', category: 'photos',      name: 'Polaroid frames',       price: 2.49, art: { kind: 'photo', shape: 'polaroid' },                   desc: 'Six polaroid frames you can fill with a photo.', items: 6, owned: false, isNew: false },
  { id: 'pho-vellum',   category: 'photos',      name: 'Vellum overlays',       price: 1.99, art: { kind: 'photo', shape: 'vellum' },                     desc: 'Translucent vellum sheets for layering.', items: 5, owned: false, isNew: false },

  // Decorative details
  { id: 'dec-doily',    category: 'details',     name: 'Lace doilies',          price: 1.99, art: { kind: 'detail', shape: 'doily'   },                   desc: 'Six paper doilies in cream and ivory.', items: 6, owned: false, isNew: false },
  { id: 'dec-ribbon',   category: 'details',     name: 'Velvet ribbons',        price: 2.49, art: { kind: 'detail', shape: 'ribbon'  },                   desc: 'Eight velvet ribbon ends.', items: 8, owned: false, isNew: false },
  { id: 'dec-bow',      category: 'details',     name: 'Tiny paper bows',       price: 1.49, art: { kind: 'detail', shape: 'bow'     },                   desc: 'Twelve tiny tied paper bows.', items: 12, owned: false, isNew: true },
];

// ── Visual atom: paint a placeholder thumbnail for an item ──────────────
//
// Each item kind has its own visual; everything is CSS / SVG, so they scale
// from the grid tile (130×170) up to the detail preview (260×340).

const SHOP_TONES = {
  sage:    { bg: '#B6BFA5', accent: '#5F6E55', ink: 'light' },
  forest:  { bg: '#4E6652', accent: '#33473A', ink: 'light' },
  rose:    { bg: '#D7B7B0', accent: '#9F6F6A', ink: 'dark'  },
  mauve:   { bg: '#A98C98', accent: '#7B5F6B', ink: 'light' },
  blue:    { bg: '#9EB1C2', accent: '#6E8598', ink: 'light' },
  amber:   { bg: '#D9B97A', accent: '#9B7B43', ink: 'dark'  },
  cream:   { bg: '#F1E6CC', accent: '#A98C68', ink: 'dark'  },
  oxblood: { bg: '#8C3F3A', accent: '#5A2222', ink: 'light' },
  gold:    { bg: '#D6BD78', accent: '#A8893F', ink: 'dark'  },
};

const itemGlyph = (name, color, size = 40) => {
  // Tiny inline SVGs. Brand-friendly outlines, currentColor strokes.
  const c = color || 'currentColor';
  const stroke = { stroke: c, strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const fill   = { fill: c };
  switch (name) {
    case 'flower':
      return <svg width={size} height={size} viewBox="0 0 24 24"><g {...fill}><circle cx="12" cy="12" r="2.4"/><circle cx="12" cy="6"  r="2.8" opacity="0.85"/><circle cx="6"  cy="12" r="2.8" opacity="0.85"/><circle cx="18" cy="12" r="2.8" opacity="0.85"/><circle cx="12" cy="18" r="2.8" opacity="0.85"/></g></svg>;
    case 'leaf':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 19 C 9 6, 19 5, 19 5 C 19 5, 18 15, 5 19 Z" {...stroke}/><path d="M12 12 L 18 7" {...stroke}/></svg>;
    case 'heart':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-9 1.5-7 4-7 5 4 5 4 2.5-4 5-4 6 2 4 7-9 9-9 9z" {...fill}/></svg>;
    case 'star':
      return <svg width={size} height={size} viewBox="0 0 24 24"><polygon points="12,4 14.5,9.5 20.5,10 16,14.5 17.2,20.5 12,17.5 6.8,20.5 8,14.5 3.5,10 9.5,9.5" {...fill}/></svg>;
    case 'check':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 13 L 10 18 L 20 6" {...stroke} strokeWidth="2.2"/></svg>;
    case 'arrow':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 12 H 19 M14 7 L 19 12 L 14 17" {...stroke} strokeWidth="2"/></svg>;
    case 'seal':
      return <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" {...fill} opacity="0.92"/><circle cx="12" cy="12" r="5" stroke="#FFFDF6" strokeWidth="1.2" fill="none" opacity="0.6"/><path d="M12 8 v 8 M 8 12 h 8" stroke="#FFFDF6" strokeWidth="1.1" opacity="0.5"/></svg>;
    case 'stamp':
      return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="12" rx="1" {...stroke}/><circle cx="12" cy="12" r="2.4" {...fill}/></svg>;
    case 'ticket':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 8 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v2 a 1.5 1.5 0 0 0 0 4 v2 a2 2 0 0 1 -2 2 h -12 a 2 2 0 0 1 -2 -2 v -2 a 1.5 1.5 0 0 0 0 -4 z" {...stroke}/></svg>;
    case 'letter':
      return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="1" {...stroke}/><path d="M4 8 l 8 6 l 8 -6" {...stroke}/></svg>;
    case 'card':
      return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="1.5" {...stroke}/><path d="M7 9 h 10 M 7 13 h 10 M 7 17 h 6" {...stroke}/></svg>;
    case 'book':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 5 v14 a 2 2 0 0 1 2 -2 h 14 V 5 H 6 a 2 2 0 0 0 -2 2 z" {...stroke}/></svg>;
    case 'shell':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 4 C 18 4 21 12 19 18 H 5 C 3 12 6 4 12 4 z M 9 6 L 12 18 M 15 6 L 12 18 M 7 10 L 17 10 M 6 14 L 18 14" {...stroke}/></svg>;
    case 'flag':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 21 V 4" {...stroke}/><path d="M5 4 h 11 l -2 4 l 2 4 H 5" {...stroke}/></svg>;
    default:
      return null;
  }
};

const PaperGrain = ({ opacity = 0.16 }) => (
  <div style={{
    position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none',
    backgroundImage:
      'radial-gradient(circle at 20% 30%, rgba(255,253,246,0.25), transparent 35%),' +
      'radial-gradient(circle at 80% 70%, rgba(0,0,0,0.18), transparent 40%),' +
      'radial-gradient(circle at 65% 20%, rgba(255,253,246,0.15), transparent 30%)',
  }}/>
);

const ItemArt = ({ item, size = 'tile' }) => {
  const art = item.art;
  const tone = SHOP_TONES[art.tone] || SHOP_TONES.cream;
  const fg = tone.ink === 'light' ? '#FFFDF6' : '#3A2C1F';

  const wrapStyle = {
    width: '100%', height: '100%', position: 'relative',
    overflow: 'hidden',
    background: `linear-gradient(170deg, ${tone.bg} 0%, ${tone.accent} 100%)`,
    color: fg,
  };

  // Paper kinds: pattern fills with subtle colour wash
  if (art.kind === 'paper') {
    const patterns = {
      linen: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
      grid:  'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px) 0 0 / 14px 14px, linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px) 0 0 / 14px 14px',
      foxed: 'radial-gradient(circle at 25% 30%, rgba(168,140,116,0.30), transparent 25%), radial-gradient(circle at 75% 60%, rgba(168,140,116,0.25), transparent 30%)',
      polka: 'radial-gradient(circle, rgba(255,253,246,0.7) 2px, transparent 2.5px) 0 0 / 14px 14px',
      lines: 'repeating-linear-gradient(0deg, transparent 0 22px, rgba(0,0,0,0.08) 22px 23px)',
    };
    return (
      <div style={wrapStyle}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: patterns[art.pattern] || patterns.linen }}/>
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'tape') {
    return (
      <div style={wrapStyle}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute', left: -10, right: -10,
            top: 18 + i * 32, height: 22,
            background:
              `repeating-linear-gradient(${(i%2?-8:8)}deg, ${tone.accent} 0 12px, ${tone.bg} 12px 24px)`,
            transform: `rotate(${i%2?-4:4}deg)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            opacity: 0.95,
          }}/>
        ))}
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'sticker') {
    const positions = [
      [22, 28], [62, 22], [40, 50], [20, 70], [62, 64],
    ];
    return (
      <div style={wrapStyle}>
        {positions.map(([x,y], i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            transform: `translate(-50%,-50%) rotate(${(i*23)%30 - 15}deg)`,
            color: fg, opacity: 0.92,
          }}>{itemGlyph(art.shape, fg, 30)}</div>
        ))}
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'ephemera') {
    const sh = art.shape;
    return (
      <div style={wrapStyle}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + (i*22)}%`, top: `${30 + (i%2)*22}%`,
            transform: `rotate(${(i-1)*8}deg)`,
            color: fg,
          }}>
            {itemGlyph(sh, fg, 56)}
          </div>
        ))}
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'florals') {
    const files = art.files || [];
    return (
      <div style={{
        ...wrapStyle,
        background: 'linear-gradient(170deg, #F1E6CC 0%, #DCC9A7 100%)',
      }}>
        {files.slice(0, 3).map((f, i) => (
          <img key={i} src={`../../assets/flowers/${f}`} alt="" draggable={false}
            style={{
              position: 'absolute',
              left: i === 1 ? '50%' : (i === 0 ? '22%' : '78%'),
              top: i === 1 ? '50%' : (i === 0 ? '38%' : '60%'),
              transform: `translate(-50%, -50%) rotate(${(i-1)*10}deg)`,
              height: '60%', width: 'auto', objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
              pointerEvents: 'none', userSelect: 'none',
            }}/>
        ))}
        <PaperGrain opacity={0.10}/>
      </div>
    );
  }

  if (art.kind === 'frame') {
    return (
      <div style={{ ...wrapStyle, background: 'linear-gradient(170deg, #EFE5CF 0%, #DCC9A7 100%)' }}>
        {art.shape === 'oval' && (
          <div style={{
            position: 'absolute', inset: '20% 22%',
            border: '6px double rgba(58,44,15,0.65)',
            borderRadius: '50%',
            boxShadow: 'inset 0 0 8px rgba(58,44,15,0.18), 0 2px 4px rgba(0,0,0,0.15)',
          }}/>
        )}
        {art.shape === 'corner' && (
          <>
            {[[12,12,0],[12,'auto','rotate(90deg)'],['auto',12,'rotate(-90deg)'],['auto','auto','rotate(180deg)']].map(([t,l,tr],i) => (
              <div key={i} style={{
                position:'absolute', top: t===12?16:'auto', bottom: t==='auto'?16:'auto',
                left:  l===12?16:'auto', right:  l==='auto'?16:'auto',
                width: 28, height: 28,
                borderTop: '4px solid rgba(58,44,15,0.65)',
                borderLeft:'4px solid rgba(58,44,15,0.65)',
                transform: tr ? tr : 'none',
              }}/>
            ))}
          </>
        )}
        {art.shape === 'tag' && (
          <>
            {[[30,38,-8],[55,42,4]].map(([x,y,r],i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${x}%`, top: `${y}%`,
                width: '36%', height: '40%',
                background: i ? '#E5D8C8' : '#F8F1E2',
                border: '1.5px solid rgba(58,44,15,0.45)',
                borderRadius: 4,
                transform: `translate(-50%,-50%) rotate(${r}deg)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}>
                <div style={{
                  position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)',
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#A8893F', border: '1px solid #7E6322',
                }}/>
              </div>
            ))}
          </>
        )}
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'type') {
    return (
      <div style={wrapStyle}>
        <div style={{
          position: 'absolute', inset: 16, display: 'flex',
          flexDirection: 'column', justifyContent: 'center', gap: 6,
        }}>
          {art.style === 'script' && (
            <>
              <div style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 26, color: fg, transform: 'rotate(-3deg)' }}>love letters</div>
              <div style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 18, color: fg, opacity: 0.7, transform: 'rotate(2deg)' }}>memories &amp; little notes</div>
            </>
          )}
          {art.style === 'numbers' && (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: fg, textAlign: 'center', letterSpacing: '0.04em' }}>0 1 2<br/>3 4 5</div>
          )}
          {art.style === 'labels' && (
            <>
              <div style={{
                background: 'rgba(0,0,0,0.12)', color: fg,
                padding: '4px 10px', borderRadius: 2,
                fontFamily: 'var(--font-paper)', fontSize: 11,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                alignSelf: 'flex-start',
              }}>monday</div>
              <div style={{
                background: 'rgba(0,0,0,0.12)', color: fg,
                padding: '4px 10px', borderRadius: 2,
                fontFamily: 'var(--font-paper)', fontSize: 11,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                alignSelf: 'flex-end',
              }}>April · 2026</div>
            </>
          )}
        </div>
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'paint') {
    return (
      <div style={wrapStyle}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + i*22}%`, top: `${30 + (i%2)*30}%`,
            width: 48, height: 18,
            background: tone.accent,
            borderRadius: '50%',
            transform: `translate(-50%,-50%) rotate(${(i*30)%60 - 30}deg)`,
            opacity: 0.85,
            filter: `blur(${i%2?1:0.3}px)`,
          }}/>
        ))}
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'fabric') {
    return (
      <div style={wrapStyle}>
        <div style={{
          position: 'absolute', inset: 0,
          background:
            `repeating-linear-gradient(45deg, ${tone.accent} 0 4px, transparent 4px 8px),` +
            `repeating-linear-gradient(-45deg, rgba(0,0,0,0.10) 0 4px, transparent 4px 8px)`,
        }}/>
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'photo') {
    return (
      <div style={{ ...wrapStyle, background: 'linear-gradient(170deg, #EFE5CF 0%, #DCC9A7 100%)' }}>
        {art.shape === 'polaroid' && (
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%,-50%) rotate(-3deg)',
            width: '62%', height: '70%',
            background: '#FFFDF6',
            padding: '8px 8px 22px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.20)',
          }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(140deg, #C9D6DD 0%, #6F8598 100%)',
            }}/>
          </div>
        )}
        {art.shape === 'vellum' && (
          <div style={{
            position: 'absolute', inset: '15%',
            background: 'rgba(255,253,246,0.55)',
            border: '1.5px solid rgba(75,64,56,0.18)',
            borderRadius: 4,
            backdropFilter: 'blur(1px)',
          }}/>
        )}
        <PaperGrain/>
      </div>
    );
  }

  if (art.kind === 'detail') {
    return (
      <div style={{ ...wrapStyle, background: 'linear-gradient(170deg, #EFE5CF 0%, #DCC9A7 100%)' }}>
        {art.shape === 'doily' && (
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%,-50%)',
            width: '70%', aspectRatio: '1', borderRadius: '50%',
            background: '#FFFDF6',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            backgroundImage:
              'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.10) 31%, transparent 33%),' +
              'repeating-conic-gradient(rgba(0,0,0,0.08) 0deg 6deg, transparent 6deg 18deg)',
          }}/>
        )}
        {art.shape === 'ribbon' && (
          <>
            {[0,1].map(i => (
              <div key={i} style={{
                position:'absolute', left: '50%', top: `${30 + i*38}%`,
                transform: `translate(-50%, -50%) rotate(${i?6:-4}deg)`,
                width: '78%', height: 16,
                background: i ? '#A98C98' : '#7C8E6B',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
              }}/>
            ))}
          </>
        )}
        {art.shape === 'bow' && (
          <>
            {[[30,40,-6],[60,55,6]].map(([x,y,r],i) => (
              <div key={i} style={{
                position:'absolute', left: `${x}%`, top: `${y}%`,
                transform: `translate(-50%,-50%) rotate(${r}deg)`,
                width: 56, height: 24,
                background: i ? '#D7B7B0' : '#C8A96B',
                clipPath: 'polygon(0% 50%, 22% 0%, 35% 25%, 50% 50%, 35% 75%, 22% 100%, 22% 50%, 78% 50%, 78% 100%, 65% 75%, 50% 50%, 65% 25%, 78% 0%, 78% 50%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
              }}/>
            ))}
          </>
        )}
        <PaperGrain/>
      </div>
    );
  }

  // Collections — pile of glyphs over a wash
  if (art.kind === 'collection') {
    return (
      <div style={wrapStyle}>
        {(art.glyphs || []).slice(0, 5).map((g, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${18 + i*16}%`, top: `${28 + (i%3)*18}%`,
            transform: `translate(-50%,-50%) rotate(${(i*36)%60 - 30}deg)`,
            color: fg, opacity: 0.92,
          }}>{itemGlyph(g, fg, 56)}</div>
        ))}
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center',
          fontFamily: 'var(--font-paper)', fontSize: 9, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: fg, opacity: 0.85, fontWeight: 600,
        }}>collection</div>
        <PaperGrain/>
      </div>
    );
  }

  return <div style={wrapStyle}><PaperGrain/></div>;
};

// ── Pricing pill / Owned stamp ──────────────────────────────────────────

const PriceTag = ({ price, owned }) => {
  if (owned) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 10px',
        background: 'rgba(78,102,82,0.12)',
        border: '1px solid rgba(78,102,82,0.42)',
        color: 'var(--pp-forest, #4E6652)',
        borderRadius: 999,
        fontFamily: 'var(--font-paper)',
        fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'uppercase', fontWeight: 700,
      }}>
        <Icon name="check" size={12} stroke={2.4}/> Owned
      </div>
    );
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '5px 12px',
      background: 'linear-gradient(180deg, #F0DFA6 0%, #D6BD78 55%, #A8893F 100%)',
      border: '1px solid #7E6322',
      color: '#3A2C0F',
      borderRadius: 999,
      fontFamily: 'var(--font-ui)',
      fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 3px rgba(0,0,0,0.22)',
    }}>${price.toFixed(2)}</div>
  );
};

// ── Card ────────────────────────────────────────────────────────────────

const ShopItemCard = ({ item, onOpen }) => (
  <button onClick={() => onOpen(item)}
    style={{
      background: 'var(--surface-card, #FFFDF6)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 12,
      padding: 0,
      cursor: 'pointer',
      textAlign: 'left',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 2px 4px rgba(75,64,56,0.05), 0 12px 24px -16px rgba(75,64,56,0.10)',
      transition: 'transform 180ms var(--ease-paper), box-shadow 180ms var(--ease-paper)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 14px -6px rgba(75,64,56,0.18), 0 18px 28px -16px rgba(75,64,56,0.18)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)';     e.currentTarget.style.boxShadow = '0 2px 4px rgba(75,64,56,0.05), 0 12px 24px -16px rgba(75,64,56,0.10)'; }}>
    <div style={{
      position: 'relative',
      aspectRatio: '4 / 5',
      borderBottom: '1px solid var(--pp-hairline-soft)',
      overflow: 'hidden',
    }}>
      <ItemArt item={item}/>
      {item.isNew && (
        <div style={{
          position: 'absolute', top: 8, left: 8,
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          background: 'var(--pp-terracotta)', color: '#FFFDF6',
          padding: '3px 8px', borderRadius: 999, fontWeight: 700,
        }}>New</div>
      )}
    </div>
    <div style={{
      padding: '10px 12px 12px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
        color: 'var(--fg-1)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{item.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PriceTag price={item.price} owned={item.owned}/>
        <span style={{
          fontFamily: 'var(--font-paper)', fontSize: 9,
          letterSpacing: '0.18em', color: 'var(--fg-3)',
          textTransform: 'uppercase', fontWeight: 600,
        }}>{item.items} pcs</span>
      </div>
    </div>
  </button>
);

// ── Item detail modal ──────────────────────────────────────────────────

const ShopItemDetail = ({ item, related, onClose, onPurchase, onOpenRelated }) => {
  if (!item) return null;
  return (
    <div onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 60,
        background: 'rgba(45,38,30,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'grid', placeItems: 'center',
        padding: 16,
        animation: 'pp-scrim-in 200ms var(--ease-paper) both',
      }}>
      <style>{`
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 820, maxHeight: '100%',
          background: 'var(--surface-card, #FFFDF6)',
          borderRadius: 18,
          border: '1px solid var(--pp-hairline)',
          boxShadow:
            '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
          overflow: 'hidden',
          fontFamily: 'var(--font-ui)',
          animation: 'pp-modal-in 280ms var(--ease-paper) both',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
        }}>

        {/* Preview side */}
        <div style={{
          position: 'relative',
          background:
            'radial-gradient(closest-side, rgba(255,253,246,0.85), rgba(247,242,232,0.85))',
          padding: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRight: '1px solid var(--pp-hairline)',
        }}>
          <div style={{
            position: 'relative',
            width: '100%', aspectRatio: '4 / 5',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 22px 40px -10px rgba(45,38,30,0.30), 0 6px 10px rgba(45,38,30,0.18)',
            border: '1px solid rgba(0,0,0,0.10)',
          }}>
            <ItemArt item={item}/>
          </div>
        </div>

        {/* Details side */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          maxHeight: 540,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 44px',
            alignItems: 'flex-start', gap: 14,
            padding: '20px 24px',
            borderBottom: '1px solid var(--pp-hairline)',
            background:
              'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-paper)', fontSize: 10, letterSpacing: '0.22em',
                color: 'var(--fg-3)', textTransform: 'uppercase',
              }}>
                {SHOP_CATEGORIES.find(c => c.id === item.category)?.label || 'Item'}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--fg-1)',
                lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.005em',
              }}>{item.name}</div>
              <div style={{
                marginTop: 6, fontFamily: 'var(--font-script)', fontStyle: 'italic',
                fontSize: 14, color: 'var(--fg-3)',
              }}>{item.items} pieces · digital pack</div>
            </div>
            <button onClick={onClose} aria-label="Close"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--surface-card)',
                border: '1px solid var(--pp-hairline)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--fg-1)',
                boxShadow: '0 2px 4px rgba(75,64,56,0.10)',
              }}>
              <Icon name="close" size={18}/>
            </button>
          </div>

          {/* Description + related — scrolling region */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '18px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <p style={{ margin: 0, color: 'var(--fg-2)', lineHeight: 1.55, fontSize: 14 }}>
              {item.desc}
            </p>

            <div style={{
              padding: 14, borderRadius: 12,
              background: 'var(--bg-2)',
              border: '1px solid var(--pp-hairline)',
              display: 'flex', flexDirection: 'column', gap: 6,
              fontSize: 13, color: 'var(--fg-2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={14}/> Drag onto any journal page
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={14}/> Yours to keep — works offline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={14}/> Restored on every device you sign in to
              </div>
            </div>

            {related && related.length > 0 && (
              <div>
                <div style={{
                  fontFamily: 'var(--font-paper)', fontSize: 10, letterSpacing: '0.22em',
                  color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8,
                }}>You may also like</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                }}>
                  {related.map(r => (
                    <button key={r.id} onClick={() => onOpenRelated(r)}
                      style={{
                        padding: 0, border: 0, background: 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                      }}>
                      <div style={{
                        aspectRatio: '4/5',
                        borderRadius: 8, overflow: 'hidden',
                        border: '1px solid var(--pp-hairline)',
                        boxShadow: '0 4px 10px -4px rgba(75,64,56,0.18)',
                      }}>
                        <ItemArt item={r}/>
                      </div>
                      <div style={{
                        fontSize: 12, color: 'var(--fg-2)', marginTop: 6,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{r.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 14,
            padding: '14px 22px',
            borderTop: '1px solid var(--pp-hairline)',
            background: 'rgba(247,242,232,0.7)',
          }}>
            <div>
              <PriceTag price={item.price} owned={item.owned}/>
            </div>
            {item.owned ? (
              <button onClick={onClose}
                style={{
                  height: 44, padding: '0 22px', borderRadius: 999,
                  background: 'var(--surface-card)',
                  color: 'var(--fg-1)',
                  border: '1px solid var(--pp-hairline)',
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
                  letterSpacing: '0.02em', cursor: 'pointer',
                }}>Use in editor</button>
            ) : (
              <button onClick={() => onPurchase(item)}
                style={{
                  height: 44, padding: '0 22px', borderRadius: 999,
                  background: 'var(--pp-terracotta)',
                  color: '#FFFDF6', border: 0,
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
                  letterSpacing: '0.02em', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 10px -2px rgba(196,123,99,0.45)',
                }}>
                <Icon name="sparkle" size={14}/> Add to your collection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Shop screen ────────────────────────────────────────────────────────

const Shop = ({ onBack, onSettings }) => {
  const [catalogue, setCatalogue] = React.useState(SHOP_CATALOGUE);
  const [category, setCategory] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [openItem, setOpenItem] = React.useState(null);

  const filtered = catalogue.filter(it =>
    (category === 'all' || it.category === category) &&
    (!query || it.name.toLowerCase().includes(query.toLowerCase()))
  );

  // Find a few related items in the same category (excluding the open one)
  const related = openItem
    ? catalogue.filter(c => c.category === openItem.category && c.id !== openItem.id).slice(0, 3)
    : [];

  const handlePurchase = (item) => {
    // Mock purchase — flip owned, then close.
    setCatalogue(cs => cs.map(c => c.id === item.id ? { ...c, owned: true } : c));
    setOpenItem(prev => prev ? { ...prev, owned: true } : prev);
  };

  return (
    <div className="pp-stage" style={{
      width: '100%', height: '100%', position: 'relative',
      background:
        'radial-gradient(900px 600px at 50% 25%, rgba(255,253,246,0.55), rgba(255,253,246,0) 60%),' +
        'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' +
        'var(--bg-1)',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
    }}>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
        height: 76,
        display: 'grid',
        gridTemplateColumns: '76px 1fr 76px',
        alignItems: 'center',
        padding: '0 20px',
        background:
          'linear-gradient(180deg, rgba(255,253,246,0.78) 0%, rgba(255,253,246,0) 100%)',
      }}>
        <button onClick={onBack}
          aria-label="Back"
          className="pp-icon-btn"
          style={{ background: 'var(--surface-card)' }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 22, color: 'var(--fg-1)',
          letterSpacing: '-0.005em',
        }}>
          The&nbsp;<em style={{
            fontFamily: 'var(--font-script)', fontStyle: 'italic',
            color: 'var(--pp-terracotta)', fontWeight: 500,
          }}>shop</em>
        </div>
        <div/>
      </div>

      {/* Scrolling content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '76px 0 16px',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '20px 24px' }}>

          {/* Hero / search */}
          <div style={{ textAlign: 'center', margin: '4px 0 18px' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30, color: 'var(--fg-1)',
              lineHeight: 1.1, letterSpacing: '-0.01em',
            }}>
              What will you craft today?
            </div>
            <div style={{
              marginTop: 6,
              fontFamily: 'var(--font-script)', fontStyle: 'italic',
              fontSize: 16, color: 'var(--fg-3)',
            }}>
              A little library of papers, stickers, and treasures.
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '6px 8px 6px 18px',
            background: 'var(--surface-card)',
            border: '1px solid var(--pp-hairline)',
            borderRadius: 999,
            boxShadow: '0 4px 12px -4px rgba(75,64,56,0.15)',
            margin: '0 auto', maxWidth: 560,
          }}>
            <Icon name="back" size={18} stroke={2}
              style={{ color: 'var(--fg-3)', transform: 'scaleX(-1) rotate(0deg)', display: 'none' }}/>
            <span style={{ color: 'var(--fg-3)', display: 'inline-flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/>
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers, stickers, ephemera…"
              style={{
                flex: 1, border: 0, outline: 0, background: 'transparent',
                fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-1)',
                padding: '12px 0',
              }}/>
            {query && (
              <button onClick={() => setQuery('')}
                aria-label="Clear"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'transparent', border: 0, cursor: 'pointer',
                  color: 'var(--fg-3)',
                }}>
                <Icon name="close" size={16}/>
              </button>
            )}
          </div>

          {/* Categories — wrap onto multiple centred rows when they don't fit. */}
          <div style={{
            margin: '22px 0 18px',
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '14px 18px',
          }}>
            {SHOP_CATEGORIES.map((c) => {
              const isActive = c.id === category;
              return (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  title={c.label}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 8,
                    padding: 0, border: 0, background: 'transparent',
                    cursor: 'pointer', width: 88,
                  }}>
                  <div style={{
                    width: 58, height: 58, borderRadius: '50%',
                    background: isActive ? 'var(--pp-forest, #4E6652)' : 'var(--surface-card)',
                    color: isActive ? '#FFFDF6' : 'var(--fg-1)',
                    border: isActive ? '2px solid transparent' : '1px solid var(--pp-hairline)',
                    display: 'grid', placeItems: 'center',
                    boxShadow: isActive
                      ? '0 6px 14px -4px rgba(78,102,82,0.45)'
                      : '0 2px 6px -2px rgba(75,64,56,0.15)',
                    transition: 'all 180ms var(--ease-paper)',
                  }}>
                    <Icon name={c.icon} size={22}/>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11, fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--fg-1)' : 'var(--fg-3)',
                    letterSpacing: '0.01em',
                    textAlign: 'center',
                    lineHeight: 1.25,
                  }}>{c.label}</div>
                </button>
              );
            })}
          </div>

          {/* Section label */}
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            margin: '8px 4px 12px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20, color: 'var(--fg-1)',
              letterSpacing: '-0.005em',
            }}>
              {category === 'all'
                ? (query ? `Results for “${query}”` : 'Featured today')
                : SHOP_CATEGORIES.find(c => c.id === category)?.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-paper)', fontSize: 11,
              letterSpacing: '0.18em', color: 'var(--fg-3)',
              textTransform: 'uppercase', fontWeight: 600,
            }}>{filtered.length} items</div>
          </div>

          {filtered.length === 0 ? (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              fontFamily: 'var(--font-script)', fontStyle: 'italic',
              fontSize: 18, color: 'var(--fg-3)',
            }}>
              We couldn’t find anything matching that yet.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 14,
              paddingBottom: 28,
            }}>
              {filtered.map(it => (
                <ShopItemCard key={it.id} item={it} onOpen={setOpenItem}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {openItem && (
        <ShopItemDetail
          item={openItem}
          related={related}
          onClose={() => setOpenItem(null)}
          onPurchase={handlePurchase}
          onOpenRelated={(r) => setOpenItem(r)}
        />
      )}
    </div>
  );
};

Object.assign(window, { Shop, SHOP_CATALOGUE, SHOP_CATEGORIES });
