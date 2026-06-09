// SCR-07 Journal Editor.
// Textured canvas pages, leather covers on pages 1 & N, page-flip animation, pinch zoom.
// No fixed right tool palette — a draggable floating "+" button opens a category drawer
// from the right edge with the user's collection. Pick an item, it inserts into the
// active page and the drawer minimises.

const MAX_PAGES = 30;

const PAGE_TEXTURES = {
  linen:    { label: 'Linen',     desc: 'Warm woven cream' },
  parchment:{ label: 'Parchment', desc: 'Aged cream paper' },
  ruled:    { label: 'Ruled',     desc: 'Faint sage ruled' },
  dotted:   { label: 'Dotted',    desc: 'Soft dot grid' },
  vintage:  { label: 'Vintage',   desc: 'Foxed botanical' },
};

const textureBackground = (id) => {
  switch (id) {
    case 'linen':
      return { background:
        'repeating-linear-gradient(0deg, rgba(168,140,116,0.06) 0 1px, transparent 1px 3px),' +
        'repeating-linear-gradient(90deg, rgba(168,140,116,0.06) 0 1px, transparent 1px 3px),' +
        'linear-gradient(180deg, #FFFDF6 0%, #F8F1E2 100%)' };
    case 'parchment':
      return { background:
        'radial-gradient(circle at 20% 30%, rgba(168,140,116,0.10), transparent 40%),' +
        'radial-gradient(circle at 80% 70%, rgba(168,140,116,0.08), transparent 35%),' +
        'radial-gradient(circle at 60% 20%, rgba(200,169,107,0.08), transparent 30%),' +
        'linear-gradient(180deg, #F4E9D2 0%, #E8D9BB 100%)' };
    case 'ruled':
      return { background:
        'repeating-linear-gradient(0deg, transparent 0 28px, rgba(135,147,124,0.18) 28px 29px),' +
        'linear-gradient(180deg, #FFFDF6 0%, #F6EFE0 100%)' };
    case 'dotted':
      return { background:
        'radial-gradient(circle, rgba(135,147,124,0.30) 1px, transparent 1.5px) 0 0 / 18px 18px,' +
        'linear-gradient(180deg, #FFFDF6 0%, #F6EFE0 100%)' };
    case 'vintage':
      return { background:
        'radial-gradient(circle at 12% 18%, rgba(196,123,99,0.18), transparent 28%),' +
        'radial-gradient(circle at 88% 82%, rgba(122,125,92,0.16), transparent 28%),' +
        'radial-gradient(circle at 50% 50%, rgba(200,169,107,0.10), transparent 60%),' +
        'linear-gradient(180deg, #ECE0C6 0%, #DCC9A7 100%)' };
    default: return { background: '#FFFDF6' };
  }
};

const leatherBackground = {
  background:
    'radial-gradient(circle at 30% 30%, #6F4F35 0%, #4B3320 70%),' +
    'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 5px)',
};

/* ─── Collection (drawer contents) ─────────────────────────────── */

// Mirrors SCR-06 Shop's SHOP_CATEGORIES exactly so the "add item" drawer and
// the store share one taxonomy. 'all' shows the whole owned collection.
const CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'collections', label: 'Collections' },
  { id: 'papers',      label: 'Papers & backgrounds' },
  { id: 'stickers',    label: 'Stickers' },
  { id: 'tape',        label: 'Tape & fasteners' },
  { id: 'ephemera',    label: 'Ephemera' },
  { id: 'florals',     label: 'Florals & botanicals' },
  { id: 'frames',      label: 'Frames & containers' },
  { id: 'type',        label: 'Writing & typography' },
  { id: 'paint',       label: 'Paint & artistic' },
  { id: 'fabric',      label: 'Sewing & fabric' },
  { id: 'photos',      label: 'Photos & memory keeping' },
  { id: 'details',     label: 'Decorative details' },
];

const FLOWER_ASSETS = [
  { src: '../../assets/flowers/01-cornflower-violet.png',     name: 'Cornflower violet' },
  { src: '../../assets/flowers/02-poppy-red.png',             name: 'Crimson poppy' },
  { src: '../../assets/flowers/03-cosmos-lavender.png',       name: 'Lavender cosmos' },
  { src: '../../assets/flowers/04-wildrose-pink.png',         name: 'Wild rose, pink' },
  { src: '../../assets/flowers/05-cherryblossom-cluster.png', name: 'Cherry blossom cluster' },
  { src: '../../assets/flowers/06-zinnia-crimson.png',        name: 'Crimson zinnia' },
];

// Per-category display names + a short descriptive blurb, surfaced in the
// single-click item details panel. Mirrors the Shop's voice (SCR-06).
const ITEM_DETAILS = {
  collections: { names: ['Spring Meadow', 'Old Romance', 'Coastal Almanac', 'Autumn Library', 'Winter Hearth', 'Garden Party', 'Seaside Holiday', 'Botanical Press'], blurb: 'A curated set of matching pieces — papers, stickers and ephemera that share one palette and mood.' },
  papers:      { names: ['Linen Sheet', 'Soft Grid Page', 'Foxed Page', 'Polka Page', 'Old Ledger', 'Watercolour Wash'], blurb: 'A full-bleed background sheet sized to the page. Layer everything else on top of it.' },
  stickers:    { names: ['Wax Seal', 'Hand-drawn Arrow', 'Inked Star', 'Tiny Heart', 'Checkmark', 'Pressed Bloom Sticker'], blurb: 'A die-cut sticker with a soft drop shadow. Place it, then nudge it into the perfect spot.' },
  tape:        { names: ['Sage Washi', 'Linen Tape', 'Gingham Strip', 'Gold Foil Tape', 'Lace Trim'], blurb: 'A strip of washi tape for anchoring photos and notes — semi-transparent, just like the real thing.' },
  ephemera:    { names: ['Library Card', 'Bus Ticket', 'Postage Receipt', 'Pressed Label', 'Ration Coupon'], blurb: 'Aged paper ephemera with authentic foxing and vintage type. Lovely for memory-keeping spreads.' },
  florals:     { names: ['Pressed Bloom', 'Wildflower Sprig', 'Single Stem', 'Petal Scatter'], blurb: 'A pressed flower scanned at high resolution, with naturally soft, translucent petals.' },
  frames:      { names: ['Postage Frame', 'Oval Mat', 'Deckle Edge', 'Ticket Border', 'Photo Corner'], blurb: 'A container to frame a photo or note. Drop a picture inside and it crops neatly to fit.' },
  type:        { names: ['Date Stamp', 'Monogram', 'Title Banner', 'Quote Mark', 'Numeral'], blurb: 'A typographic accent — dates, titles and numerals set in the Paper & Petals house faces.' },
  paint:       { names: ['Watercolour Dab', 'Ink Splatter', 'Gouache Bloom', 'Brush Sweep'], blurb: 'A loose, hand-painted mark to add colour and texture behind your layers.' },
  fabric:      { names: ['Linen Swatch', 'Gingham Patch', 'Velvet Square', 'Floral Cotton'], blurb: 'A scrap of fabric with woven texture and a softly frayed edge.' },
  photos:      { names: ['Polaroid Frame', 'Vintage Snapshot', 'Filmstrip', 'Memory Card'], blurb: 'A photo frame ready for your own picture. Tap the frame on the page to swap in an image.' },
  details:     { names: ['Brass Charm', 'Enamel Pin', 'Pearl Bead', 'Ribbon Bow', 'Pearl Button'], blurb: 'A small decorative detail — charms, pins and beads to finish off a corner.' },
};

// Generate sample collection. In production this is the user's saved items.
const seedCollection = () => {
  const items = [];
  // Real pressed-flower assets first so they appear at the top of the category
  FLOWER_ASSETS.forEach((f, i) => {
    items.push({
      id: `florals-real-${i}`,
      category: 'florals',
      type: 'flower-image',
      imageSrc: f.src,
      name: f.name,
      desc: ITEM_DETAILS.florals.blurb,
      // First two are "new"
      isNew: i < 2,
    });
  });

  // Owned pieces, organised under the SAME categories as the Shop (SCR-06).
  const recipe = {
    collections: { count: 8,  type: 'card',    palette: ['#FFFDF6', '#F8F1E2', '#EFE9E1', '#E5D8C8'] },
    papers:      { count: 12, type: 'card',    palette: ['#FFFDF6', '#F8F1E2', '#EFE9E1', '#E5D8C8'] },
    stickers:    { count: 13, type: 'seal',    palette: ['#4E6652', '#C47B63', '#A98C98', '#C8A96B'] },
    tape:        { count: 9,  type: 'ribbon',  palette: ['#D7B7B0', '#87937C', '#C8A96B', '#A98C98'] },
    ephemera:    { count: 9,  type: 'antique', palette: ['#9E7C5C', '#C8A96B', '#7A6B52'] },
    florals:     { count: 8,  type: 'flower',  palette: ['#A98C98', '#87937C', '#D7B7B0', '#C47B63'] },
    frames:      { count: 10, type: 'stamp',   palette: ['#C47B63', '#87937C', '#8FA3B8', '#A98C98'] },
    type:        { count: 8,  type: 'antique', palette: ['#7A6B52', '#4B4038', '#9E7C5C'] },
    paint:       { count: 11, type: 'button',  palette: ['#C8A96B', '#4E6652', '#A98C98', '#C47B63'] },
    fabric:      { count: 9,  type: 'fabric',  palette: ['#A98C98', '#87937C', '#D7B7B0', '#8FA3B8'] },
    photos:      { count: 7,  type: 'card',    palette: ['#E5D8C8', '#EFE9E1', '#F8F1E2'] },
    details:     { count: 12, type: 'craft',   palette: ['#7A7D5C', '#C47B63', '#8FA3B8'] },
  };
  for (const [catId, r] of Object.entries(recipe)) {
    const det = ITEM_DETAILS[catId] || { names: [], blurb: '' };
    for (let i = 0; i < r.count; i++) {
      const baseName = det.names[i % det.names.length] || 'Crafted piece';
      const name = i >= det.names.length
        ? `${baseName} ${Math.floor(i / det.names.length) + 1}`
        : baseName;
      items.push({
        id: `${catId}-${i}`,
        category: catId,
        type: r.type,
        color: r.palette[i % r.palette.length],
        name,
        desc: det.blurb,
        isNew: i < 2,
      });
    }
  }
  return items;
};

/* ─── Editor root ──────────────────────────────────────────────── */

const JournalEditor = ({ onBack, onSupportTap, journal, onSave, subscribed = false, onUpgrade, onShop }) => {
  const journalDefaults = journal || {};
  // Journal-level state — name flows back to Home via onSave. Covers are always
  // leather (cognac); cover selection was removed, so they're constants now.
  const [journalName, setJournalName] = React.useState(journalDefaults.name || 'Journal 1');
  const frontCover = DEFAULT_FRONT_COVER;
  const backCover  = DEFAULT_BACK_COVER;
  const [editingName, setEditingName] = React.useState(false);

  // Push every change back to the host (HomeScreen) so the carousel reflects
  // the latest cover & name without an explicit save action.
  const onSaveRef = React.useRef(onSave);
  React.useEffect(() => { onSaveRef.current = onSave; });
  React.useEffect(() => {
    onSaveRef.current?.({ name: journalName, frontCover, backCover });
  }, [journalName]);

  const [pages, setPages] = React.useState(8);
  const [activePage, setActivePage] = React.useState(2);
  const [texture, setTexture] = React.useState('parchment');
  const [zoom, setZoom] = React.useState(1);
  const [flip, setFlip] = React.useState(null);
  const [placedByPage, setPlacedByPage] = React.useState({
    2: [
      { id: 1001, type: 'washi', x: 8,   y: 12,  w: 78,  h: 28,  color: 'var(--pp-soft-rose)',  rotate: -4 },
      { id: 1002, type: 'card',  x: 18,  y: 42,  w: 140, h: 92,  rotate: -3, label: 'POSTCARD' },
      { id: 1003, type: 'flower',x: 200, y: 30,  w: 64,  h: 96,  color: 'var(--pp-muted-olive)', rotate: 8 },
    ],
    3: [
      { id: 1004, type: 'stamp', x: 200, y: 56,  w: 78,  h: 100, color: 'var(--pp-terracotta)', rotate: -6 },
      { id: 1005, type: 'seal',  x: 320, y: 220, w: 56,  h: 56,  color: 'var(--pp-forest)' },
      { id: 1006, type: 'tape',  x: 120, y: 320, w: 130, h: 24,  color: 'var(--pp-antique-gold)', rotate: 4 },
    ],
  });

  const [collection] = React.useState(seedCollection);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('all');

  // Selection: { page, index } picks one placed item on the spread.
  const [selection, setSelection] = React.useState(null);
  const [editingMove, setEditingMove] = React.useState(null); // { page, index, dx, dy }
  const [editingCrop, setEditingCrop] = React.useState(false);
  const nextIdRef = React.useRef(1);

  // Drag-and-drop state. When a tile is being dragged from the drawer
  // we float a ghost preview at pointer coords; on pointerup over the
  // canvas we insert the item at that location.
  const [drag, setDrag] = React.useState(null); // { item, x, y, overCanvas, side }
  const spreadRef = React.useRef(null);

  // Single-click opens this details panel; double-click / drag places instead.
  const [detailItem, setDetailItem] = React.useState(null);
  // Layers panel (lists the active page's placed items, front → back).
  const [layersOpen, setLayersOpen] = React.useState(false);

  // ── Undo / redo history for placed items ───────────────────────
  // pushHistory() is called at the START of each discrete edit (add, move,
  // resize, rotate, delete, reorder) so one gesture = one undo step.
  const histRef = React.useRef({ past: [], future: [] });
  const [, bumpHist] = React.useReducer(x => x + 1, 0);
  const pushHistory = () => {
    const h = histRef.current;
    h.past.push(placedByPage);
    if (h.past.length > 60) h.past.shift();
    h.future = [];
    bumpHist();
  };
  const undo = () => {
    const h = histRef.current;
    if (!h.past.length) return;
    h.future.unshift(placedByPage);
    setPlacedByPage(h.past.pop());
    setSelection(null);
    bumpHist();
  };
  const redo = () => {
    const h = histRef.current;
    if (!h.future.length) return;
    h.past.push(placedByPage);
    setPlacedByPage(h.future.shift());
    setSelection(null);
    bumpHist();
  };
  const canUndo = histRef.current.past.length > 0;
  const canRedo = histRef.current.future.length > 0;

  // Keyboard: ⌘/Ctrl+Z undo, ⌘/Ctrl+Shift+Z (or Ctrl+Y) redo.
  React.useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const k = e.key.toLowerCase();
      if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (k === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const goToPage = (target) => {
    if (target < 1 || target > pages || target === activePage || flip) return;
    const dir = target > activePage ? 'next' : 'prev';
    setFlip({ from: activePage, to: target, dir });
    window.setTimeout(() => { setActivePage(target); setFlip(null); }, 620);
  };
  const addPage = () => { if (pages < MAX_PAGES) setPages(p => p + 1); };

  const [confirmDeletePage, setConfirmDeletePage] = React.useState(false);
  const requestDeletePage = () => {
    if (pages <= 1) return; // can't delete the last page
    setConfirmDeletePage(true);
  };
  const deleteActivePage = () => {
    if (pages <= 1) { setConfirmDeletePage(false); return; }
    pushHistory();
    const target = activePage;
    // Shift placedByPage entries: keys > target decrement by 1, target removed
    setPlacedByPage(prev => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        const n = Number(k);
        if (n < target) next[n] = v;
        else if (n > target) next[n - 1] = v;
        // n === target → dropped
      }
      return next;
    });
    const newPages = pages - 1;
    setPages(newPages);
    // Move to neighbouring page
    setActivePage(Math.min(target, newPages));
    setSelection(null);
    setConfirmDeletePage(false);
  };

  /* ─── Item action handlers ──────────────────────────────────── */
  const mutateSelected = (fn) => {
    if (!selection) return;
    setPlacedByPage(prev => {
      const arr = [...(prev[selection.page] || [])];
      if (!arr[selection.index]) return prev;
      arr[selection.index] = fn(arr[selection.index]);
      return { ...prev, [selection.page]: arr };
    });
  };
  const rotateSelected = () => { pushHistory(); mutateSelected(it => ({ ...it, rotate: ((it.rotate || 0) + 15) })); };
  const scaleSelected  = (factor) => { pushHistory(); mutateSelected(it => ({ ...it, w: Math.max(24, it.w * factor), h: Math.max(24, it.h * factor) })); };
  const deleteSelected = () => {
    if (!selection) return;
    pushHistory();
    setPlacedByPage(prev => {
      const arr = (prev[selection.page] || []).filter((_, i) => i !== selection.index);
      return { ...prev, [selection.page]: arr };
    });
    setSelection(null);
  };
  const reorderSelected = (direction) => {
    if (!selection) return;
    pushHistory();
    setPlacedByPage(prev => {
      const arr = [...(prev[selection.page] || [])];
      const i = selection.index;
      const j = direction === 'forward' ? i + 1 : i - 1;
      if (j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setSelection({ page: selection.page, index: j });
      return { ...prev, [selection.page]: arr };
    });
  };

  /* ─── Drag a placed item around the page ────────────────────── */
  React.useEffect(() => {
    if (!editingMove) return;
    const onMove = (e) => {
      const pt = e;
      const spread = spreadRef.current;
      if (!spread) return;
      const r = spread.getBoundingClientRect();
      const sx = (pt.clientX - r.left) / r.width  * SPREAD_W;
      const sy = (pt.clientY - r.top)  / r.height * SPREAD_H;
      // Constrain x to the page side
      const side = editingMove.side;
      const localX = side === 'left' ? sx - 18 : sx - SPREAD_W / 2 - 6;
      const localY = sy - 18;
      setPlacedByPage(prev => {
        const arr = [...(prev[editingMove.page] || [])];
        const it = arr[editingMove.index];
        if (!it) return prev;
        // Allow the item to slide partly off any page edge — only a sliver
        // (MIN_VIS) must stay on-page. The page clips the overflow so it reads
        // as if the piece has been cut at the border. It can never vanish.
        const MIN_VIS = 30;
        arr[editingMove.index] = { ...it,
          x: Math.max(-(it.w - MIN_VIS), Math.min((SPREAD_W/2) - MIN_VIS, localX - editingMove.dx)),
          y: Math.max(-(it.h - MIN_VIS), Math.min(SPREAD_H - MIN_VIS,    localY - editingMove.dy)),
        };
        return { ...prev, [editingMove.page]: arr };
      });
    };
    const onUp = () => setEditingMove(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [editingMove]);

  const beginItemMove = (page, index, side, ev) => {
    setSelection({ page, index });
    pushHistory();
    const item = (placedByPage[page] || [])[index];
    if (!item) return;
    const spread = spreadRef.current;
    if (!spread) return;
    const r = spread.getBoundingClientRect();
    const sx = (ev.clientX - r.left) / r.width  * SPREAD_W;
    const sy = (ev.clientY - r.top)  / r.height * SPREAD_H;
    const localX = side === 'left' ? sx - 18 : sx - SPREAD_W / 2 - 6;
    const localY = sy - 18;
    setEditingMove({ page, index, side, dx: localX - item.x, dy: localY - item.y });
  };

  /* ─── Resize ────────────────────────────────────────────────── */
  const [editingResize, setEditingResize] = React.useState(null);
  // { page, index, side, handle, init: { w0, h0, x0, y0, rotate, anchorSpreadX, anchorSpreadY } }

  React.useEffect(() => {
    if (!editingResize) return;
    const onMove = (e) => {
      const spread = spreadRef.current;
      if (!spread) return;
      const r = spread.getBoundingClientRect();
      const sx = (e.clientX - r.left) / r.width  * SPREAD_W;
      const sy = (e.clientY - r.top)  / r.height * SPREAD_H;
      const { page, index, side, handle, init } = editingResize;
      // Pointer relative to anchor in spread coords:
      const dx = sx - init.anchorSpreadX;
      const dy = sy - init.anchorSpreadY;
      // Rotate into the item's local (unrotated) frame:
      const θ = ((init.rotate || 0) * Math.PI) / 180;
      const cosθ = Math.cos(θ), sinθ = Math.sin(θ);
      const localDx =  cosθ * dx + sinθ * dy;
      const localDy = -sinθ * dx + cosθ * dy;
      // Handle vector relative to anchor: handle is at (hx*newW, hy*newH).
      const hx = handle.hx, hy = handle.hy;
      let newW = init.w0;
      let newH = init.h0;
      if (hx !== 0) newW = Math.max(24, hx * localDx);
      if (hy !== 0) newH = Math.max(24, hy * localDy);
      // New center in spread coords. Center is at anchor + R(θ) · (hx*newW/2, hy*newH/2).
      const halfDx = hx * newW / 2;
      const halfDy = hy * newH / 2;
      const cx = init.anchorSpreadX + cosθ * halfDx - sinθ * halfDy;
      const cy = init.anchorSpreadY + sinθ * halfDx + cosθ * halfDy;
      // Convert center back to page-local x/y (top-left)
      const newCenterLocalX = side === 'left' ? cx - 18 : cx - SPREAD_W / 2 - 6;
      const newCenterLocalY = cy - 18;
      const newX = newCenterLocalX - newW / 2;
      const newY = newCenterLocalY - newH / 2;
      setPlacedByPage(prev => {
        const arr = [...(prev[page] || [])];
        if (!arr[index]) return prev;
        arr[index] = { ...arr[index], w: newW, h: newH, x: newX, y: newY };
        return { ...prev, [page]: arr };
      });
    };
    const onUp = () => setEditingResize(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [editingResize]);

  const beginItemResize = (page, index, side, handle, ev) => {
    const item = (placedByPage[page] || [])[index];
    if (!item) return;
    pushHistory();
    setSelection({ page, index });
    // Anchor = the opposite handle's spread position. For handle (hx, hy),
    // the anchor in the item's local frame is at (-hx*w/2, -hy*h/2) relative
    // to center; in spread coords that's: center + R(θ) · (-hx*w/2, -hy*h/2).
    const θ = ((item.rotate || 0) * Math.PI) / 180;
    const cosθ = Math.cos(θ), sinθ = Math.sin(θ);
    const cxLocal = item.x + item.w / 2;
    const cyLocal = item.y + item.h / 2;
    // Convert center to spread coords (account for which page side):
    const cxSpread = (side === 'left' ? 18 : (SPREAD_W / 2 + 6)) + cxLocal;
    const cySpread = 18 + cyLocal;
    const ax = -handle.hx * item.w / 2;
    const ay = -handle.hy * item.h / 2;
    const anchorSpreadX = cxSpread + cosθ * ax - sinθ * ay;
    const anchorSpreadY = cySpread + sinθ * ax + cosθ * ay;
    setEditingResize({
      page, index, side, handle,
      init: { w0: item.w, h0: item.h, rotate: item.rotate || 0,
              anchorSpreadX, anchorSpreadY },
    });
  };

  /* ─── Rotate ────────────────────────────────────────────────── */
  const [editingRotate, setEditingRotate] = React.useState(null);
  // { page, index, side, init: { centerSpreadX, centerSpreadY, rotate0, startAngle } }

  React.useEffect(() => {
    if (!editingRotate) return;
    const onMove = (e) => {
      const spread = spreadRef.current;
      if (!spread) return;
      const r = spread.getBoundingClientRect();
      const sx = (e.clientX - r.left) / r.width  * SPREAD_W;
      const sy = (e.clientY - r.top)  / r.height * SPREAD_H;
      const { page, index, init } = editingRotate;
      const angle = Math.atan2(sy - init.centerSpreadY, sx - init.centerSpreadX);
      let newRotate = init.rotate0 + ((angle - init.startAngle) * 180 / Math.PI);
      // Soft 15° snap when within ±3° of a multiple
      const snap = 15;
      const nearest = Math.round(newRotate / snap) * snap;
      if (Math.abs(newRotate - nearest) < 3) newRotate = nearest;
      setPlacedByPage(prev => {
        const arr = [...(prev[page] || [])];
        if (!arr[index]) return prev;
        arr[index] = { ...arr[index], rotate: newRotate };
        return { ...prev, [page]: arr };
      });
    };
    const onUp = () => setEditingRotate(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [editingRotate]);

  const beginItemRotate = (page, index, side, ev) => {
    const item = (placedByPage[page] || [])[index];
    if (!item) return;
    pushHistory();
    setSelection({ page, index });
    const cxLocal = item.x + item.w / 2;
    const cyLocal = item.y + item.h / 2;
    const cxSpread = (side === 'left' ? 18 : (SPREAD_W / 2 + 6)) + cxLocal;
    const cySpread = 18 + cyLocal;
    const spread = spreadRef.current;
    if (!spread) return;
    const r = spread.getBoundingClientRect();
    const sx = (ev.clientX - r.left) / r.width  * SPREAD_W;
    const sy = (ev.clientY - r.top)  / r.height * SPREAD_H;
    const startAngle = Math.atan2(sy - cySpread, sx - cxSpread);
    setEditingRotate({
      page, index, side,
      init: { centerSpreadX: cxSpread, centerSpreadY: cySpread,
              rotate0: item.rotate || 0, startAngle },
    });
  };

  /* ─── Align ─────────────────────────────────────────────────── */
  const alignSelected = (alignment) => {
    if (!selection) return;
    pushHistory();
    setPlacedByPage(prev => {
      const arr = [...(prev[selection.page] || [])];
      const it = arr[selection.index];
      if (!it) return prev;
      const pageW = SPREAD_W / 2 - 24;
      const pageH = SPREAD_H - 36;
      const next = { ...it };
      if (alignment === 'left')   next.x = 8;
      if (alignment === 'hcenter')next.x = (pageW - it.w) / 2;
      if (alignment === 'right')  next.x = pageW - it.w - 8;
      if (alignment === 'top')    next.y = 8;
      if (alignment === 'vcenter')next.y = (pageH - it.h) / 2;
      if (alignment === 'bottom') next.y = pageH - it.h - 8;
      arr[selection.index] = next;
      return { ...prev, [selection.page]: arr };
    });
  };

  /* Place an item straight onto the current page — used by double-click on a
     collection tile and by the "Add to page" button in the details panel. */
  const placeItemOnActivePage = (item) => {
    pushHistory();
    let targetPage = activePage;
    if (targetPage === 1) targetPage = Math.min(2, pages);
    else if (targetPage === pages) targetPage = Math.max(1, pages - 1);
    const w = defaultWidthFor(item.type);
    const h = defaultHeightFor(item.type);
    const pageW = SPREAD_W / 2 - 24;
    const pageH = SPREAD_H - 36;
    const jitter = () => (Math.random() * 40) - 20;
    const newPlaced = {
      id: nextIdRef.current++,
      type: itemTypeToCanvas(item.type),
      imageSrc: item.imageSrc,
      x: Math.max(8, Math.min(pageW - w - 8, (pageW - w) / 2 + jitter())),
      y: Math.max(8, Math.min(pageH - h - 8, (pageH - h) / 2 + jitter())),
      w, h,
      color: item.color,
      rotate: (Math.random() * 16) - 8,
      label: item.type === 'card' ? 'POSTCARD' : undefined,
    };
    if (activePage !== targetPage) setActivePage(targetPage);
    setPlacedByPage(prev => {
      const arr = [...(prev[targetPage] || []), newPlaced];
      setSelection({ page: targetPage, index: arr.length - 1 });
      return { ...prev, [targetPage]: arr };
    });
  };

  const quickAddItem = (item) => { placeItemOnActivePage(item); setDrawerOpen(false); setDetailItem(null); };
  const openItemDetails = (item) => setDetailItem(item);

  /* Reorder a placed item within its page — drives the Layers panel z-order. */
  const reorderPlaced = (page, from, to) => {
    pushHistory();
    setPlacedByPage(prev => {
      const arr = [...(prev[page] || [])];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length || from === to) return prev;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...prev, [page]: arr };
    });
    setSelection({ page, index: to });
  };

  /* Drag handlers — invoked from CollectionTile via pointerdown */
  const beginDrag = (item, ev) => {
    setDrag({ item, x: ev.clientX, y: ev.clientY, overCanvas: false, side: null });
    setDrawerOpen(false); // drawer minimises immediately so user can see the page
  };

  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      // Hit-test the spread
      let overCanvas = false, side = null, localX = 0, localY = 0;
      const spread = spreadRef.current;
      if (spread) {
        const r = spread.getBoundingClientRect();
        if (pt.clientX >= r.left && pt.clientX <= r.right &&
            pt.clientY >= r.top  && pt.clientY <= r.bottom) {
          overCanvas = true;
          // Spread is 720×500 design pixels; account for the current zoom
          // (the spread is scaled inside CanvasViewport).
          const sx = (pt.clientX - r.left) / r.width  * SPREAD_W;
          const sy = (pt.clientY - r.top)  / r.height * SPREAD_H;
          side = sx < SPREAD_W / 2 ? 'left' : 'right';
          // Convert to page-local coordinates (each page is ~340 wide post-padding)
          localX = side === 'left' ? sx - 18 : sx - SPREAD_W / 2 - 6;
          localY = sy - 18;
        }
      }
      setDrag(d => d ? { ...d, x: pt.clientX, y: pt.clientY, overCanvas, side, localX, localY } : d);
    };
    const onUp = (e) => {
      const d = drag;
      if (!d) return;
      if (d.overCanvas) {
        // Which page is on that side?
        const isFirst = activePage === 1;
        const isLast  = activePage === pages;
        let targetPage;
        if (isFirst)      targetPage = 1;
        else if (isLast)  targetPage = pages;
        else if (activePage % 2 === 0)
          targetPage = d.side === 'left' ? activePage : activePage + 1;
        else
          targetPage = d.side === 'left' ? activePage - 1 : activePage;
        // Skip insert if dropped on a leather cover
        const droppedOnCover = (isFirst && d.side === 'left') || (isLast && d.side === 'right');
        if (!droppedOnCover) {
          pushHistory();
          const newPlaced = {
            id: nextIdRef.current++,
            type: itemTypeToCanvas(d.item.type),
            imageSrc: d.item.imageSrc,
            x: Math.max(8, Math.min((SPREAD_W/2) - 60, (d.localX ?? 80) - defaultWidthFor(d.item.type) / 2)),
            y: Math.max(8, Math.min(SPREAD_H - 60, (d.localY ?? 80) - defaultHeightFor(d.item.type) / 2)),
            w: defaultWidthFor(d.item.type),
            h: defaultHeightFor(d.item.type),
            color: d.item.color,
            rotate: (Math.random() * 16) - 8,
            label: d.item.type === 'card' ? 'POSTCARD' : undefined,
          };
          setPlacedByPage(prev => {
            const arr = [...(prev[targetPage] || []), newPlaced];
            // Auto-select the just-dropped item
            setSelection({ page: targetPage, index: arr.length - 1 });
            return { ...prev, [targetPage]: arr };
          });
        }
      }
      setDrag(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, activePage, pages]);

  return (
    <div className="pp-stage" style={{ background: 'var(--bg-2)' }}>
      {/* Topbar */}
      <div className="pp-topbar" style={{ background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <button className="pp-icon-btn circle" onClick={onBack}><Icon name="back" size={20}/></button>
          <EditableJournalTitle
            name={journalName}
            onCommit={setJournalName}
            editing={editingName}
            setEditing={setEditingName}
          />
          <div className="eyebrow" style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
            pg {activePage}/{pages}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <UndoRedo canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo}/>
          <ZoomControl zoom={zoom} setZoom={setZoom}/>
          <TextureControl texture={texture} setTexture={setTexture}/>
          <LayersButton
            count={(placedByPage[activePage] || []).length}
            active={layersOpen}
            onClick={() => setLayersOpen(o => !o)}/>
          <button className="pp-btn pp-btn-secondary" style={{ minHeight: 44, padding: '8px 14px' }}>
            <Icon name="share" size={18}/> Export
          </button>
          <button className="pp-icon-btn" onClick={onSupportTap}><Icon name="mail" size={20}/></button>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, top: 60, bottom: 0,
        display: 'flex',
      }}>
        {/* Left page strip */}
        <PageStrip pages={pages} activePage={activePage} onGoTo={goToPage} onAdd={addPage}/>

        {/* Canvas */}
        <CanvasViewport
          activePage={activePage}
          pages={pages}
          texture={texture}
          frontCover={frontCover}
          backCover={backCover}
          placedByPage={placedByPage}
          zoom={zoom}
          setZoom={setZoom}
          flip={flip}
          onTurn={(dir) => goToPage(activePage + (dir === 'next' ? 1 : -1))}
          spreadRef={spreadRef}
          dragOverSide={drag && drag.overCanvas ? drag.side : null}
          selection={selection}
          setSelection={setSelection}
          onItemPointerDown={beginItemMove}
          onBeginResize={beginItemResize}
          onBeginRotate={beginItemRotate}
          onDeletePage={requestDeletePage}
          canDeletePage={pages > 1 && activePage !== 1 && activePage !== pages}
          onCanvasMouseDown={(target) => {
            if (target.closest('[data-placed-item]')) return;
            if (target.closest('[data-item-toolbar]')) return;
            setSelection(null);
          }}
        />
      </div>

      {/* Layers panel — lists the active page's items front → back; drag to reorder. */}
      <LayersPanel
        open={layersOpen}
        onClose={() => setLayersOpen(false)}
        page={activePage}
        items={placedByPage[activePage] || []}
        selection={selection}
        onSelect={(index) => setSelection({ page: activePage, index })}
        onReorder={(from, to) => reorderPlaced(activePage, from, to)}
      />

      {/* Draggable floating "+" button — hide while dragging an item */}
      {!drawerOpen && !drag && (
        <FloatingAddButton onOpen={() => setDrawerOpen(true)} />
      )}

      {/* Slide-in collection drawer */}
      <CollectionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        collection={collection}
        onBeginDrag={beginDrag}
        onOpenDetails={openItemDetails}
        onQuickAdd={quickAddItem}
        onShop={onShop}
      />

      {/* Item details panel — opened by a single click on a collection tile. */}
      <ItemDetailsModal
        item={detailItem}
        categoryLabel={detailItem ? (CATEGORIES.find(c => c.id === detailItem.category)?.label) : ''}
        onClose={() => setDetailItem(null)}
        onAdd={() => { if (detailItem) quickAddItem(detailItem); }}
      />

      {/* Drag ghost — follows the cursor while dragging from drawer */}
      {drag && (
        <div style={{
          position: 'fixed',
          left: drag.x, top: drag.y,
          width: 100, height: 130,
          marginLeft: -50, marginTop: -65,
          pointerEvents: 'none',
          zIndex: 100,
          transform: 'rotate(-3deg)',
          filter: 'drop-shadow(0 10px 18px rgba(75,64,56,0.35))',
          opacity: 0.95,
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'var(--pp-cream)',
            border: '1.5px solid var(--pp-hairline)',
            borderRadius: 6,
            position: 'relative', overflow: 'hidden',
          }}>
            <CollectionGlyph item={drag.item}/>
          </div>
        </div>
      )}

      {/* Item toolbar — floats above the currently-selected item */}
      {selection && !editingMove && !drag && (
        <ItemToolbar
          spreadRef={spreadRef}
          placedByPage={placedByPage}
          selection={selection}
          activePage={activePage}
          pages={pages}
          onRotate={rotateSelected}
          onScaleUp={() => scaleSelected(1.1)}
          onScaleDown={() => scaleSelected(1 / 1.1)}
          onCrop={() => setEditingCrop(true)}
          onForward={() => reorderSelected('forward')}
          onBack={() => reorderSelected('back')}
          onDelete={deleteSelected}
        />
      )}

      {/* Crop modal placeholder */}
      {editingCrop && selection && (
        <CropModal
          item={(placedByPage[selection.page] || [])[selection.index]}
          onClose={() => setEditingCrop(false)}
          onApply={() => setEditingCrop(false)}
        />
      )}

      {/* Confirm delete-page modal */}
      {confirmDeletePage && (
        <ConfirmDialog
          title="Delete this page?"
          body={`Page ${activePage} and anything you\u2019ve placed on it will be removed. Your collected items stay safe in your collection.`}
          confirmLabel="Delete this page"
          danger
          onCancel={() => setConfirmDeletePage(false)}
          onConfirm={deleteActivePage}
        />
      )}

      {/* Cover is always leather — selection removed. */}
    </div>
  );
};

/* ─── Item toolbar ─────────────────────────────────────────────── */

const ItemToolbar = ({ spreadRef, placedByPage, selection, activePage, pages, onRotate, onScaleUp, onScaleDown, onCrop, onForward, onBack, onDelete }) => {
  // Compute toolbar position. Re-measure each render via a layout effect.
  const [pos, setPos] = React.useState(null);

  React.useLayoutEffect(() => {
    if (!spreadRef.current) return;
    const item = (placedByPage[selection.page] || [])[selection.index];
    if (!item) { setPos(null); return; }
    const spreadRect = spreadRef.current.getBoundingClientRect();
    // Item is positioned inside a PageSide. Figure out which side (left vs right).
    const isFirst = activePage === 1;
    const isLast  = activePage === pages;
    let side;
    if (isFirst)      side = selection.page === 1 ? 'right' : 'left';
    else if (isLast)  side = selection.page === pages ? 'left' : 'right';
    else if (activePage % 2 === 0)
      side = selection.page === activePage ? 'left' : 'right';
    else
      side = selection.page === activePage ? 'right' : 'left';
    // Page-local coords → spread coords
    const sx = (side === 'left' ? 0 : SPREAD_W / 2) + (side === 'left' ? 18 : 6) + item.x;
    const sy = 18 + item.y;
    // Scale factor (spread is rendered at current zoom but we measure DOM rect, so it's already scaled)
    const scaleX = spreadRect.width / SPREAD_W;
    const scaleY = spreadRect.height / SPREAD_H;
    setPos({
      left: spreadRect.left + (sx + item.w / 2) * scaleX,
      top:  spreadRect.top  +  sy * scaleY - 12,
    });
  }, [selection, placedByPage, activePage, pages]);

  if (!pos) return null;

  const tools = [
    { id: 'crop',  icon: 'border',   label: 'Crop',            onClick: onCrop },
    { id: 'fwd',   icon: 'star',     label: 'Bring forward',   onClick: onForward },
    { id: 'back',  icon: 'star',     label: 'Send back',       onClick: onBack, flip: true },
    { id: 'del',   icon: 'trash',    label: 'Delete',          onClick: onDelete, danger: true, dividerBefore: true },
  ];

  return (
    <div data-item-toolbar=""
      style={{
        position: 'fixed',
        left: pos.left, top: pos.top,
        transform: 'translate(-50%, -100%)',
        background: 'var(--surface-card)',
        border: '1px solid var(--pp-hairline)',
        borderRadius: 999,
        boxShadow: 'var(--sh-card)',
        padding: 4,
        display: 'flex', gap: 2,
        zIndex: 60, pointerEvents: 'auto',
      }}
      onPointerDown={(e) => e.stopPropagation()}>
      {tools.map((t, i) => (
        <React.Fragment key={t.id}>
          {t.dividerBefore && (
            <div style={{ width: 1, alignSelf: 'stretch', margin: '4px 2px', background: 'var(--pp-hairline-soft)' }}/>
          )}
          <button
            title={t.label}
            aria-label={t.label}
            onClick={t.onClick}
            style={{
              width: 36, height: 36, borderRadius: 999,
              background: 'transparent', border: 'none',
              color: t.danger ? 'var(--pp-danger)' : 'var(--fg-2)',
              display: 'grid', placeItems: 'center',
              cursor: 'pointer',
              transition: 'background 160ms var(--ease-paper)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = t.danger ? 'rgba(178,106,90,0.10)' : 'var(--bg-2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <span style={t.flip ? { transform: 'scaleY(-1)', display: 'grid', placeItems: 'center' } : {}}>
              <Icon name={t.icon} size={18} />
            </span>
          </button>
        </React.Fragment>
      ))}
      {/* notch */}
      <div style={{
        position: 'absolute', left: '50%', bottom: -6, transform: 'translateX(-50%) rotate(45deg)',
        width: 10, height: 10,
        background: 'var(--surface-card)',
        borderRight: '1px solid var(--pp-hairline)',
        borderBottom: '1px solid var(--pp-hairline)',
      }}/>
    </div>
  );
};

const CropModal = ({ item, onClose, onApply }) => {
  if (!item) return null;
  return (
    <div onPointerDown={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(43,42,40,0.45)',
        display: 'grid', placeItems: 'center', zIndex: 80 }}>
      <div onPointerDown={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface-card)', borderRadius: 16,
          border: '1px solid var(--pp-hairline)',
          boxShadow: '0 30px 60px -20px rgba(75,64,56,0.45)',
          padding: 24, minWidth: 360, maxWidth: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22 }}>
            Crop this piece
          </h3>
          <button className="pp-icon-btn" onClick={onClose}><Icon name="close" size={20}/></button>
        </div>
        <div style={{
          margin: '4px 0 14px',
          height: 180, borderRadius: 8,
          border: '2px dashed var(--pp-hairline)',
          background: 'var(--pp-cream)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-script)', fontStyle: 'italic',
          fontSize: 16, color: 'var(--fg-3)',
        }}>
          Drag the corners to trim — placeholder
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-3)' }}>
          The crop tool will let you trim the edges or shape this piece without
          changing its placement on the page.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="pp-btn pp-btn-ghost" onClick={onClose}>Never mind</button>
          <button className="pp-btn pp-btn-primary" onClick={onApply}>Apply crop</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Small helpers ────────────────────────────────────────────── */

const itemTypeToCanvas = (t) => {
  if (t === 'flower-image') return 'flower-image';
  if (t === 'card')    return 'card';
  if (t === 'flower')  return 'flower';
  if (t === 'stamp')   return 'stamp';
  if (t === 'seal')    return 'seal';
  if (t === 'ribbon')  return 'tape';
  if (t === 'fabric')  return 'washi';
  if (t === 'button')  return 'button';
  if (t === 'craft')   return 'tape';
  if (t === 'antique') return 'card';
  return 'card';
};
const defaultWidthFor  = (t) => ({ 'flower-image':110, card:120, fabric:80, flower:60, button:40, stamp:64, ribbon:120, craft:90, seal:48, antique:110 }[t] || 90);
const defaultHeightFor = (t) => ({ 'flower-image':180, card:80,  fabric:80, flower:90, button:40, stamp:80, ribbon:24,  craft:60, seal:48, antique:140 }[t] || 90);

/* ─── Page strip (left) ────────────────────────────────────────── */

const VISIBLE_PAGES = 8;

const PageStrip = ({ pages, activePage, onGoTo, onAdd }) => {
  const [windowStart, setWindowStart] = React.useState(1);
  // Auto-scroll the window when active page leaves it
  React.useEffect(() => {
    if (activePage < windowStart) setWindowStart(activePage);
    else if (activePage >= windowStart + VISIBLE_PAGES) setWindowStart(activePage - VISIBLE_PAGES + 1);
  }, [activePage]); // eslint-disable-line

  const maxStart = Math.max(1, pages - VISIBLE_PAGES + 1);
  const start = Math.min(windowStart, maxStart);
  const end   = Math.min(pages, start + VISIBLE_PAGES - 1);
  const canUp   = start > 1;
  const canDown = end < pages;
  const needsArrows = pages > VISIBLE_PAGES;

  const stepUp   = () => setWindowStart(s => Math.max(1, s - VISIBLE_PAGES));
  const stepDown = () => setWindowStart(s => Math.min(maxStart, s + VISIBLE_PAGES));

  const arrowBtnStyle = (enabled) => ({
    height: 24, borderRadius: 4,
    background: 'transparent',
    border: '1.5px solid var(--pp-hairline)',
    color: enabled ? 'var(--fg-2)' : 'var(--fg-4)',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.5,
    display: 'grid', placeItems: 'center',
    padding: 0,
  });

  return (
    <div style={{
      width: 'var(--page-strip-w)',
      padding: '14px 8px',
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--pp-hairline-soft)',
      display: 'flex', flexDirection: 'column', gap: 8,
      overflow: 'hidden',
    }}>
      {needsArrows && (
        <button onClick={stepUp} disabled={!canUp}
          aria-label="Scroll pages up"
          title="Earlier pages"
          style={arrowBtnStyle(canUp)}>
          <Icon name="back" size={14} stroke={2} style={{ transform: 'rotate(90deg)' }}/>
        </button>
      )}

      {Array.from({ length: end - start + 1 }).map((_, i) => {
        const n = start + i;
        const isActive = n === activePage;
        const isCover = n === 1 || n === pages;
        return (
          <button key={n} onClick={() => onGoTo(n)}
            title={isCover ? (n === 1 ? 'Inside front cover' : 'Inside back cover') : `Page ${n}`}
            style={{
              height: 56, borderRadius: 4, position: 'relative',
              background: isActive ? 'var(--accent)' : 'var(--pp-cream)',
              border: isActive ? '2px solid var(--accent)' : '1.5px solid var(--pp-hairline)',
              color: isActive ? 'var(--surface-card)' : 'var(--fg-3)',
              fontFamily: 'var(--font-display)', fontSize: 14,
              cursor: 'pointer', boxShadow: 'var(--sh-paper)', padding: 0,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
            {n}
            {isCover && (
              <div style={{
                position: 'absolute', bottom: 4, left: 4, right: 4,
                fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: isActive ? 'rgba(255,253,246,0.85)' : 'var(--fg-4)',
                fontWeight: 600, lineHeight: 1,
              }}>{n === 1 ? 'first' : 'last'}</div>
            )}
          </button>
        );
      })}

      {needsArrows && (
        <button onClick={stepDown} disabled={!canDown}
          aria-label="Scroll pages down"
          title="Later pages"
          style={arrowBtnStyle(canDown)}>
          <Icon name="back" size={14} stroke={2} style={{ transform: 'rotate(-90deg)' }}/>
        </button>
      )}

      {/* Add new page button — only show when window includes the last page (so it stays
          tucked under the strip, not floating in the middle of scrolling) */}
      {(!needsArrows || end === pages) && (
        <button onClick={onAdd} disabled={pages >= MAX_PAGES}
          title={pages >= MAX_PAGES ? 'A journal holds 30 pages' : 'Add a page'}
          style={{
            height: 56, borderRadius: 4, background: 'transparent',
            border: '1.5px dashed var(--pp-hairline)',
            color: pages >= MAX_PAGES ? 'var(--fg-4)' : 'var(--fg-3)',
            cursor: pages >= MAX_PAGES ? 'not-allowed' : 'pointer',
            display: 'grid', placeItems: 'center',
            opacity: pages >= MAX_PAGES ? 0.5 : 1, flexShrink: 0,
          }}>
          <Icon name="add" size={18} />
        </button>
      )}

      <div style={{
        marginTop: 'auto', paddingTop: 6,
        fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--fg-4)', fontWeight: 600, textAlign: 'center',
      }}>
        {needsArrows ? `${start}–${end} / ${pages}` : `${pages}/${MAX_PAGES}`}
      </div>
    </div>
  );
};

/* ─── Draggable floating + button ──────────────────────────────── */

const FloatingAddButton = ({ onOpen }) => {
  const [pos, setPos] = React.useState({ x: 1024 - 76, y: 80 });
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef({ dragging: false, dx: 0, dy: 0, sx: 0, sy: 0, moved: 0 });

  const onDown = (e) => {
    const isTouch = e.type === 'touchstart';
    const pt = isTouch ? e.touches[0] : e;
    dragRef.current = {
      dragging: true,
      dx: pt.clientX, dy: pt.clientY,
      sx: pos.x, sy: pos.y, moved: 0,
    };
    setDragging(true);
    if (!isTouch) e.preventDefault();
  };

  React.useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      const isTouch = e.type === 'touchmove';
      const pt = isTouch ? e.touches[0] : e;
      const dx = pt.clientX - dragRef.current.dx;
      const dy = pt.clientY - dragRef.current.dy;
      dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx) + Math.abs(dy));
      // Find stage rect for live scaling
      const stage = document.querySelector('.pp-stage');
      const r = stage ? stage.getBoundingClientRect() : { width: 1024, height: 768 };
      const scaleX = r.width  / 1024;
      const scaleY = r.height / 768;
      setPos({
        x: Math.min(1024 - 60, Math.max(8,  dragRef.current.sx + dx / scaleX)),
        y: Math.min(768  - 60, Math.max(70, dragRef.current.sy + dy / scaleY)),
      });
    };
    const onUp = () => {
      if (!dragRef.current.dragging) return;
      const moved = dragRef.current.moved;
      dragRef.current.dragging = false;
      setDragging(false);
      if (moved < 6) onOpen();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onUp);
    };
  }, [onOpen]);

  return (
    <button
      onMouseDown={onDown}
      onTouchStart={onDown}
      onClick={(e) => {
        if (dragRef.current.moved < 6) onOpen();
      }}
      title="Add from your collection"
      aria-label="Add an item"
      style={{
        position: 'absolute', left: pos.x, top: pos.y,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--accent)', color: 'var(--surface-card)',
        border: 'none',
        boxShadow:
          '0 8px 18px -4px rgba(75,64,56,0.35),' +
          '0 2px 4px rgba(75,64,56,0.20),' +
          '0 0 0 4px rgba(78,102,82,0.10)',
        cursor: dragging ? 'grabbing' : 'grab',
        display: 'grid', placeItems: 'center',
        zIndex: 20, touchAction: 'none',
        transition: dragging ? 'none' : 'box-shadow 200ms var(--ease-paper)',
      }}>
      <Icon name="add" size={26} stroke={2.4}/>
    </button>
  );
};

/* ─── Collection drawer ────────────────────────────────────────── */

const CollectionDrawer = ({ open, onClose, categories, activeCategory, onSelectCategory, collection, onBeginDrag, onOpenDetails, onQuickAdd, onShop }) => {
  const items = activeCategory === 'all'
    ? collection
    : collection.filter(it => it.category === activeCategory);
  const newCount = items.filter(it => it.isNew).length;
  const activeLabel = categories.find(c => c.id === activeCategory)?.label;

  return (
    <>
      {/* Dim layer */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(43,42,40,0.18)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 240ms var(--ease-paper)',
          zIndex: 25,
        }}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Your collection"
        style={{
          position: 'absolute', top: 60, right: 0, bottom: 0,
          width: 420,
          background: 'var(--surface-card)',
          borderLeft: '1px solid var(--pp-hairline-soft)',
          boxShadow: '-18px 0 40px -16px rgba(75,64,56,0.30)',
          transform: open ? 'translateX(0)' : 'translateX(108%)',
          transition: 'transform 320ms var(--ease-paper)',
          zIndex: 26,
          display: 'flex',
        }}>
        {/* Items area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <div style={{
            padding: '16px 18px 12px',
            borderBottom: '1px solid var(--pp-hairline-soft)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="eyebrow">Your collection</div>
                <h3 style={{
                  margin: '4px 0 0', fontFamily: 'var(--font-display)', fontWeight: 400,
                  fontSize: 22, letterSpacing: '-0.005em', color: 'var(--fg-1)',
                }}>{activeLabel}</h3>
              </div>
              <button className="pp-icon-btn" onClick={onClose} aria-label="Close">
                <Icon name="close" size={20}/>
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-3)' }}>
              {items.length} pieces
              {newCount > 0 && (
                <> · <span style={{ color: 'var(--pp-terracotta)', fontWeight: 600 }}>{newCount} new</span></>
              )}
            </div>
          </div>

          {/* Prominent shop link — sends the user to SCR-06 Shop for more pieces. */}
          <button onClick={onShop}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              margin: '12px 14px 2px', padding: '12px 14px',
              border: 0, borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              background: 'linear-gradient(180deg, var(--pp-forest, #4E6652) 0%, var(--pp-forest-deep, #3B4E3F) 100%)',
              color: '#FFFDF6', boxShadow: 'var(--sh-paper)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.06)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}>
            <span style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'rgba(255,253,246,0.16)', display: 'grid', placeItems: 'center',
            }}>
              <Icon name="shop" size={19}/>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 14.5, fontWeight: 700, letterSpacing: '0.01em' }}>Browse the Shop</span>
              <span style={{ display: 'block', fontSize: 11.5, color: 'rgba(255,253,246,0.82)', marginTop: 1 }}>More papers, stickers &amp; seasonal packs</span>
            </span>
            <Icon name="chevron" size={18}/>
          </button>

          {/* Scrollable grid */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 14,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
            }}>
              {items.map(it => (
                <CollectionTile key={it.id} item={it}
                  onBeginDrag={onBeginDrag}
                  onOpenDetails={onOpenDetails}
                  onQuickAdd={onQuickAdd} />
              ))}
            </div>
            <div style={{
              marginTop: 18, padding: '12px 6px', textAlign: 'center',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--fg-4)', fontWeight: 600,
            }}>
              · end of {activeLabel.toLowerCase()} ·
            </div>
          </div>
        </div>

        {/* Right-edge category tabs */}
        <nav aria-label="Collection categories"
          style={{
            width: 132, flexShrink: 0,
            background: 'var(--bg-2)',
            borderLeft: '1px solid var(--pp-hairline-soft)',
            padding: '12px 0',
            display: 'flex', flexDirection: 'column', gap: 2,
            overflowY: 'auto',
          }}>
          {categories.map(c => {
            const isActive = c.id === activeCategory;
            return (
              <button key={c.id}
                onClick={() => onSelectCategory(c.id)}
                style={{
                  position: 'relative',
                  padding: '12px 12px 12px 14px',
                  border: 'none', background: 'transparent',
                  textAlign: 'left',
                  fontFamily: 'var(--font-ui)', fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--fg-2)',
                  cursor: 'pointer', minHeight: 44,
                  lineHeight: 1.2,
                  transition: 'all 160ms var(--ease-paper)',
                }}>
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
                    background: 'var(--accent)', borderRadius: 4,
                  }}/>
                )}
                {c.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

/* ─── Collection tile ─────────────────────────────────────────── */

const CollectionTile = ({ item, onBeginDrag, onOpenDetails, onQuickAdd }) => {
  const startRef = React.useRef(null);
  const draggingRef = React.useRef(false);
  const clickTimerRef = React.useRef(null);

  React.useEffect(() => () => { if (clickTimerRef.current) clearTimeout(clickTimerRef.current); }, []);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = false;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
  };
  const onPointerMove = (e) => {
    if (!startRef.current || draggingRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    // Past the threshold this becomes a drag-to-place gesture.
    if (Math.hypot(dx, dy) > 6) {
      draggingRef.current = true;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
      onBeginDrag?.(item, e);
    }
  };
  const onPointerUp = (e) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    startRef.current = null;
  };
  // Single click → details panel. Double click → place straight onto the page.
  const onClick = () => {
    if (draggingRef.current) { draggingRef.current = false; return; }
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onQuickAdd?.(item);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        onOpenDetails?.(item);
      }, 220);
    }
  };
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
      title={'Click for details · double-click or drag to place'}
      style={{
        position: 'relative',
        aspectRatio: '3/4',
        background: 'var(--pp-cream)',
        border: '1.5px solid var(--pp-hairline)',
        borderRadius: 6,
        padding: 0,
        cursor: 'grab',
        boxShadow: 'var(--sh-paper)',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        transition: 'transform 180ms var(--ease-paper), box-shadow 180ms var(--ease-paper)',
        animation: item.isNew ? 'newGlow 2.2s ease-in-out infinite' : 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--sh-card)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)';     e.currentTarget.style.boxShadow = 'var(--sh-paper)'; }}>
      <CollectionGlyph item={item}/>
      {item.isNew && (
        <div style={{
          position: 'absolute', top: 4, left: 4,
          fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
          background: 'var(--pp-terracotta)', color: 'var(--surface-card)',
          padding: '2px 6px', borderRadius: 999, fontWeight: 700,
        }}>new</div>
      )}
    </div>
  );
};

const CollectionGlyph = ({ item }) => {
  const wrap = { position: 'absolute', inset: 6 };
  if (item.type === 'flower-image' && item.imageSrc) {
    return (
      <img src={item.imageSrc} alt=""
        draggable={false}
        style={{
          position: 'absolute', inset: 4,
          width: 'calc(100% - 8px)', height: 'calc(100% - 8px)',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none',
        }}/>
    );
  }
  switch (item.type) {
    case 'card':
      return <div style={{ ...wrap,
        background: 'repeating-linear-gradient(0deg, ' + item.color + ' 0 10px, rgba(0,0,0,0.04) 10px 11px)',
        borderRadius: 3 }}/>;
    case 'fabric':
      return <div style={{ ...wrap,
        background:
          'repeating-linear-gradient(45deg, ' + item.color + ' 0 4px, ' + item.color + 'cc 4px 8px),' +
          'repeating-linear-gradient(-45deg, transparent 0 4px, rgba(0,0,0,0.06) 4px 5px)',
        opacity: 0.92, borderRadius: 3 }}/>;
    case 'flower':
      return (
        <div style={wrap}>
          <div style={{ position: 'absolute', left: '46%', top: '34%', bottom: 8, width: 2, background: item.color }}/>
          {[0,1,2].map(i => (
            <div key={i} style={{
              position: 'absolute',
              left: i === 0 ? '14%' : i === 1 ? 'auto' : '52%',
              right: i === 1 ? '14%' : 'auto',
              top: `${34 + i * 14}%`,
              width: '40%', height: '16%',
              background: item.color, opacity: 0.55,
              borderRadius: '14px 2px 14px 2px',
              transform: `rotate(${i * 22 - 18}deg)`,
            }}/>
          ))}
          <div style={{
            position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)',
            width: '34%', height: '24%', borderRadius: '50%',
            background: 'var(--pp-soft-rose)',
            boxShadow: 'inset 0 0 0 2px rgba(75,64,56,0.18)',
          }}/>
        </div>
      );
    case 'button':
      return (
        <div style={{ ...wrap, display: 'grid', placeItems: 'center' }}>
          <div style={{
            width: '64%', height: '64%', borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${item.color}, ${item.color}aa)`,
            boxShadow: '0 2px 4px rgba(75,64,56,0.25), inset 0 0 0 2px rgba(255,255,255,0.18)',
            position: 'relative',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                position: 'absolute', width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)',
                left:  i % 2 === 0 ? '36%' : '54%',
                top:   i < 2     ? '36%' : '54%',
              }}/>
            ))}
          </div>
        </div>
      );
    case 'stamp':
      return (
        <div style={{ ...wrap, background: 'var(--pp-cream)',
          border: `2px dashed ${item.color}`, borderRadius: 2, padding: 4 }}>
          <div style={{ width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${item.color}88, ${item.color}33)`,
            borderRadius: 1 }}/>
        </div>
      );
    case 'ribbon':
      return (
        <div style={wrap}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '40%', height: '20%',
            background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}aa 100%)`,
            transform: 'rotate(-6deg)',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            borderBottom: '1px solid rgba(0,0,0,0.10)',
            boxShadow: '0 2px 4px rgba(75,64,56,0.18)',
          }}/>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '60%', height: '8%',
            background: `repeating-linear-gradient(90deg, ${item.color}55 0 4px, transparent 4px 6px)`,
            transform: 'rotate(-6deg)',
          }}/>
        </div>
      );
    case 'craft':
      return (
        <div style={wrap}>
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #C8A96B 0%, #4B4038 92%, #2B2A28 100%)',
            borderRadius: 1,
          }}/>
          <div style={{
            position: 'absolute', left: '50%', top: -2, width: 12, height: 12, borderRadius: '50%',
            background: item.color,
            transform: 'translateX(-50%)',
            boxShadow: '0 1px 2px rgba(75,64,56,0.3)',
          }}/>
        </div>
      );
    case 'seal':
      return (
        <div style={{ ...wrap, display: 'grid', placeItems: 'center' }}>
          <div style={{
            width: '70%', height: '70%', borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${item.color}, #2F4032)`,
            boxShadow: '0 4px 6px rgba(75,64,56,0.30)',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', inset: '14%',
              border: '1.5px solid rgba(255,253,246,0.30)', borderRadius: '50%' }}/>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14,
              color: 'rgba(255,253,246,0.85)' }}>P</div>
          </div>
        </div>
      );
    case 'antique':
      return (
        <div style={{ ...wrap,
          background: `linear-gradient(135deg, ${item.color}33 0%, ${item.color}11 100%), repeating-linear-gradient(0deg, #F4E9D2 0 12px, #ECDFC2 12px 13px)`,
          borderRadius: 2 }}>
          <div style={{ position: 'absolute', left: 6, top: 6, fontFamily: 'var(--font-display)',
            fontSize: 10, color: item.color, opacity: 0.7 }}>№</div>
          <div style={{ position: 'absolute', right: 6, bottom: 6, fontFamily: 'var(--font-script)',
            fontStyle: 'italic', fontSize: 9, color: item.color, opacity: 0.6 }}>1923</div>
        </div>
      );
    default:
      return <div style={wrap}/>;
  }
};

/* ─── Canvas + spread (unchanged from prior revision) ──────────── */

const CanvasViewport = ({ activePage, pages, texture, frontCover, backCover, placedByPage, zoom, setZoom, flip, onTurn, spreadRef, dragOverSide, selection, setSelection, onItemPointerDown, onCanvasMouseDown, onDeletePage, canDeletePage, onBeginResize, onBeginRotate }) => {
  const lastPinchDist = React.useRef(null);
  const onWheel = (e) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault();
      setZoom(z => Math.min(1.6, Math.max(0.6, z - e.deltaY * 0.002))); }
  };
  const onTouchMove = (e) => {
    if (e.touches.length !== 2) return;
    const [a, b] = e.touches;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (lastPinchDist.current != null) {
      const delta = (dist - lastPinchDist.current) * 0.005;
      setZoom(z => Math.min(1.6, Math.max(0.6, z + delta)));
    }
    lastPinchDist.current = dist;
  };
  const onTouchEnd = () => { lastPinchDist.current = null; };

  const isFirst = activePage === 1;
  const isLast  = activePage === pages;
  const isCover = isFirst || isLast;

  return (
    <div
      onPointerDown={(e) => onCanvasMouseDown?.(e.target)}
      onWheel={onWheel} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{
        flex: 1, position: 'relative',
        background:
          'radial-gradient(700px 500px at 50% 40%, rgba(255,253,246,0.7), transparent 70%),' +
          'var(--bg-3)',
        display: 'grid', placeItems: 'center',
        padding: 30, overflow: 'hidden', touchAction: 'none',
      }}>
      <div style={{
        transform: `scale(${zoom})`,
        transition: 'transform 220ms var(--ease-paper)',
        transformOrigin: 'center center',
        position: 'relative',
      }}>
        <Spread activePage={activePage} pages={pages} texture={texture}
          frontCover={frontCover} backCover={backCover}
          placedByPage={placedByPage} flip={flip}
          spreadRef={spreadRef} dragOverSide={dragOverSide}
          selection={selection} onItemPointerDown={onItemPointerDown}
          setSelection={setSelection}
          onBeginResize={onBeginResize}
          onBeginRotate={onBeginRotate}/>
      </div>

      {activePage > 1 && !flip && (
        <button onClick={() => onTurn('prev')} title="Previous page"
          style={{
            position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 56, borderRadius: '999px 4px 4px 999px',
            background: 'rgba(255,253,246,0.85)',
            border: '1px solid var(--pp-hairline)',
            color: 'var(--fg-2)', cursor: 'pointer',
            display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-paper)',
          }}><Icon name="back" size={22}/></button>
      )}
      {activePage < pages && !flip && (
        <button onClick={() => onTurn('next')} title="Next page"
          style={{
            position: 'absolute', right: 18, top: '50%',
            transform: 'translateY(-50%) scaleX(-1)',
            width: 44, height: 56, borderRadius: '999px 4px 4px 999px',
            background: 'rgba(255,253,246,0.85)',
            border: '1px solid var(--pp-hairline)',
            color: 'var(--fg-2)', cursor: 'pointer',
            display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-paper)',
          }}><Icon name="back" size={22}/></button>
      )}

      <div style={{
        position: 'absolute', bottom: 18, left: 22,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.06em',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pp-success)' }}/>
        Saved a moment ago
      </div>
      <div style={{
        position: 'absolute', bottom: 18, right: 22,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <button
          onClick={onDeletePage}
          disabled={!canDeletePage}
          title={canDeletePage ? `Delete page ${activePage}` : 'You can\u2019t delete a cover page'}
          aria-label={`Delete page ${activePage}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', minHeight: 32,
            borderRadius: 999,
            background: 'rgba(255,253,246,0.85)',
            border: '1px solid var(--pp-hairline)',
            color: canDeletePage ? 'var(--pp-danger)' : 'var(--fg-4)',
            fontFamily: 'var(--font-ui)', fontSize: 11,
            fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: canDeletePage ? 'pointer' : 'not-allowed',
            opacity: canDeletePage ? 1 : 0.55,
            transition: 'background 160ms var(--ease-paper)',
          }}>
          <Icon name="trash" size={14}/> Delete page
        </button>
        <div style={{
          fontSize: 11, color: 'var(--fg-4)', letterSpacing: '0.16em',
          textTransform: 'uppercase', fontWeight: 600,
        }}>
          Pinch · ⌘scroll to zoom · {Math.round(zoom * 100)}%
        </div>
      </div>
      {isCover && (
        <div style={{
          position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-script)', fontStyle: 'italic',
          fontSize: 16, color: 'var(--fg-3)',
          background: 'rgba(255,253,246,0.85)',
          padding: '4px 14px', borderRadius: 999,
          border: '1px solid var(--pp-hairline-soft)',
        }}>{isFirst ? 'Front cover' : 'Back cover'}</div>
      )}
    </div>
  );
};

const SPREAD_W = 720;
const SPREAD_H = 500;

const Spread = ({ activePage, pages, texture, frontCover, backCover, placedByPage, flip, spreadRef, dragOverSide, selection, onItemPointerDown, setSelection, onBeginResize, onBeginRotate }) => {
  const isFirst = activePage === 1;
  const isLast  = activePage === pages;

  let leftIs, rightIs;
  if (isFirst)        { leftIs = 'cover-front'; rightIs = 1; }
  else if (isLast)    { leftIs = pages;          rightIs = 'cover-back'; }
  else if (activePage % 2 === 0) { leftIs = activePage; rightIs = activePage + 1 <= pages ? activePage + 1 : 'cover-back'; }
  else                { leftIs = activePage - 1 >= 1 ? activePage - 1 : 'cover-front'; rightIs = activePage; }

  return (
    <div ref={spreadRef} style={{
      width: SPREAD_W, height: SPREAD_H, position: 'relative',
      background: '#7E5E3F', border: '3px solid #6B4F33', borderRadius: 6,
      boxShadow: '0 30px 50px -20px rgba(75,64,56,.40), 0 8px 16px -8px rgba(75,64,56,.25)',
      padding: 18,
    }}>
      <div style={{
        position: 'absolute', left: '50%', top: 18, bottom: 18,
        width: 12, transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #5C4129, #3D2A1A)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.2), inset 1px 0 0 rgba(255,255,255,0.06)',
        zIndex: 2,
      }}/>
      <div style={{ position: 'absolute', inset: 18, display: 'flex' }}>
        <PageSide side="left"  pageOrCover={leftIs}  texture={texture}
          frontCover={frontCover} backCover={backCover}
          endpaper={leftIs === 1 ? frontCover : (leftIs === pages ? backCover : null)}
          placed={typeof leftIs === 'number' ? (placedByPage[leftIs] || []) : []}
          highlight={dragOverSide === 'left'}
          pageNumber={typeof leftIs === 'number' ? leftIs : null}
          selection={selection}
          onItemPointerDown={onItemPointerDown}
          setSelection={setSelection}
          onBeginResize={onBeginResize}
          onBeginRotate={onBeginRotate}/>
        <PageSide side="right" pageOrCover={rightIs} texture={texture}
          frontCover={frontCover} backCover={backCover}
          endpaper={rightIs === 1 ? frontCover : (rightIs === pages ? backCover : null)}
          placed={typeof rightIs === 'number' ? (placedByPage[rightIs] || []) : []}
          highlight={dragOverSide === 'right'}
          pageNumber={typeof rightIs === 'number' ? rightIs : null}
          selection={selection}
          onItemPointerDown={onItemPointerDown}
          setSelection={setSelection}
          onBeginResize={onBeginResize}
          onBeginRotate={onBeginRotate}/>
      </div>
      {flip && (
        <div style={{
          position: 'absolute',
          top: 18, bottom: 18,
          left:  flip.dir === 'next' ? '50%' : 18,
          right: flip.dir === 'next' ? 18    : '50%',
          transformStyle: 'preserve-3d', perspective: 1600,
          pointerEvents: 'none', zIndex: 5,
        }}>
          <div style={{
            width: '100%', height: '100%',
            transformOrigin: flip.dir === 'next' ? 'left center' : 'right center',
            animation: `flip-${flip.dir} 620ms cubic-bezier(0.32, 0.72, 0.32, 1) forwards`,
            ...textureBackground(texture),
            border: '1px solid rgba(75,64,56,0.10)',
            boxShadow: '0 18px 30px -10px rgba(75,64,56,0.30)',
          }}/>
        </div>
      )}
      <style>{`
        @keyframes flip-next {
          0%   { transform: rotateY(0); box-shadow: 0 18px 30px -10px rgba(75,64,56,0.30); }
          100% { transform: rotateY(-178deg); box-shadow: -18px 18px 30px -10px rgba(75,64,56,0.30); }
        }
        @keyframes flip-prev {
          0%   { transform: rotateY(0); box-shadow: 0 18px 30px -10px rgba(75,64,56,0.30); }
          100% { transform: rotateY(178deg); box-shadow: 18px 18px 30px -10px rgba(75,64,56,0.30); }
        }
        @keyframes newGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196, 123, 99, 0), var(--sh-paper); }
          50%      { box-shadow: 0 0 12px 2px rgba(196, 123, 99, 0.50), var(--sh-paper); }
        }
      `}</style>
    </div>
  );
};

const PageSide = ({ side, pageOrCover, texture, frontCover, backCover, endpaper, placed, highlight, pageNumber, selection, onItemPointerDown, setSelection, onBeginResize, onBeginRotate }) => {
  const isCover = pageOrCover === 'cover-front' || pageOrCover === 'cover-back';
  if (isCover) {
    const coverId = pageOrCover === 'cover-front' ? frontCover : backCover;
    return (
      <div style={{
        flex: 1, position: 'relative',
        boxShadow: side === 'left'
          ? 'inset -8px 0 16px rgba(0,0,0,0.30), inset 1px 0 0 rgba(0,0,0,0.15)'
          : 'inset  8px 0 16px rgba(0,0,0,0.30), inset -1px 0 0 rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}>
        <CoverArt cover={coverId}/>
        {/* Subtle binding shadow on the spine edge */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          [side === 'left' ? 'right' : 'left']: 0,
          width: 14,
          background: side === 'left'
            ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.22))'
            : 'linear-gradient(-90deg, transparent, rgba(0,0,0,0.22))',
          pointerEvents: 'none',
        }}/>
      </div>
    );
  }
  return (
    <div style={{
      flex: 1, position: 'relative',
      ...textureBackground(texture),
      borderRight: side === 'left' ? '1px solid rgba(75,64,56,0.08)' : 'none',
      boxShadow: side === 'left'
        ? 'inset -8px 0 14px -8px rgba(75,64,56,0.18)'
        : 'inset  8px 0 14px -8px rgba(75,64,56,0.18)',
      overflow: 'hidden',
      outline: highlight ? '3px solid var(--accent)' : 'none',
      outlineOffset: highlight ? '-3px' : '0',
      transition: 'outline 140ms var(--ease-paper)',
    }}>
      {/* Inside-cover endpaper — pages bonded to the covers pick up a softened
          version of the chosen cover design, so changing the cover also dresses
          the inside. Kept light so placed items stay legible. */}
      {endpaper && (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <CoverArt cover={endpaper}/>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,253,246,0.64)' }}/>
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            [side === 'left' ? 'right' : 'left']: 0, width: 18,
            background: side === 'left'
              ? 'linear-gradient(90deg, transparent, rgba(75,64,56,0.16))'
              : 'linear-gradient(-90deg, transparent, rgba(75,64,56,0.16))',
          }}/>
        </div>
      )}
      {highlight && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(78,102,82,0.08)',
        }}/>
      )}
      {placed.map((p, i) => {
        const isSelected = selection && selection.page === pageNumber && selection.index === i;
        return (
          <React.Fragment key={p.id ?? i}>
            <PlacedItem
              item={p}
              isSelected={isSelected}
              onPointerDown={(ev) => {
                ev.stopPropagation();
                onItemPointerDown?.(pageNumber, i, side, ev);
              }}
            />
            {isSelected && (
              <SelectionFrame
                item={p}
                onBeginResize={(handle, ev) => onBeginResize?.(pageNumber, i, side, handle, ev)}
                onBeginRotate={(ev) => onBeginRotate?.(pageNumber, i, side, ev)}
              />
            )}
          </React.Fragment>
        );
      })}
      <div style={{
        position: 'absolute', bottom: 10,
        [side === 'left' ? 'left' : 'right']: 16,
        fontFamily: 'var(--font-script)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--fg-4)',
      }}>{pageOrCover}</div>
    </div>
  );
};

const ZoomControl = ({ zoom, setZoom }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-2)',
    borderRadius: 999, padding: 2, height: 36 }}>
    <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} aria-label="Zoom out"
      style={{ width: 30, height: 30, border: 'none', background: 'transparent',
        cursor: 'pointer', color: 'var(--fg-2)', borderRadius: 999, fontSize: 18, lineHeight: 1 }}>−</button>
    <div style={{ minWidth: 44, textAlign: 'center', fontSize: 12, color: 'var(--fg-2)', fontWeight: 600 }}>
      {Math.round(zoom * 100)}%
    </div>
    <button onClick={() => setZoom(z => Math.min(1.6, z + 0.1))} aria-label="Zoom in"
      style={{ width: 30, height: 30, border: 'none', background: 'transparent',
        cursor: 'pointer', color: 'var(--fg-2)', borderRadius: 999, fontSize: 18, lineHeight: 1 }}>+</button>
  </div>
);

const TextureControl = ({ texture, setTexture }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', minHeight: 36, borderRadius: 999,
          background: 'var(--bg-2)', border: 'none',
          fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-2)',
          letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>
        <Icon name="paper" size={16}/> {PAGE_TEXTURES[texture].label}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 30,
          background: 'var(--surface-card)', border: '1px solid var(--pp-hairline)',
          borderRadius: 10, padding: 6, boxShadow: 'var(--sh-card)', minWidth: 180 }}>
          {Object.entries(PAGE_TEXTURES).map(([id, info]) => (
            <button key={id} onClick={() => { setTexture(id); setOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 8px', borderRadius: 6,
                background: id === texture ? 'var(--bg-2)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 28, height: 28, borderRadius: 4,
                border: '1px solid var(--pp-hairline)', ...textureBackground(id) }}/>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 600 }}>{info.label}</span>
                <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{info.desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PlacedItem = ({ item, isSelected, onPointerDown }) => {
  // The selection frame is now drawn as a separate sibling so this just renders the artwork.
  const wrap = (children) => (
    <div
      data-placed-item=""
      onPointerDown={onPointerDown}
      style={{
        position: 'absolute',
        left: item.x, top: item.y, width: item.w, height: item.h,
        transform: item.rotate ? `rotate(${item.rotate}deg)` : 'none',
        cursor: 'grab',
        touchAction: 'none',
      }}>
      {children}
    </div>
  );

  if (item.type === 'washi' || item.type === 'tape')
    return wrap(<div style={{ width: '100%', height: '100%', background: item.color, opacity: 0.85,
      borderTop: '1px dashed rgba(0,0,0,0.10)', borderBottom: '1px dashed rgba(0,0,0,0.10)', boxShadow: 'var(--sh-tape)' }}/>);
  if (item.type === 'flower-image' && item.imageSrc)
    return wrap(
      <img src={item.imageSrc} alt="" draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain',
          filter: 'drop-shadow(0 4px 8px rgba(75,64,56,0.25))',
          pointerEvents: 'none', userSelect: 'none' }}/>
    );
  if (item.type === 'card')
    return wrap(
      <div style={{ width: '100%', height: '100%',
        background: 'repeating-linear-gradient(0deg, #FFFDF6 0 14px, #F8F1E2 14px 15px)',
        border: '1px solid var(--pp-hairline)', borderRadius: 3, padding: 8, boxShadow: 'var(--sh-tape)' }}>
        <div className="eyebrow" style={{ fontSize: 9, letterSpacing: '0.18em' }}>{item.label || 'POSTCARD'}</div>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 12, color: 'var(--fg-3)' }}>
          Greetings from the coast — </div>
      </div>
    );
  if (item.type === 'flower')
    return wrap(
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '46%', top: 18, bottom: 0, width: 2, background: item.color }}/>
        {[0,1,2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            left: i === 0 ? 8 : i === 1 ? 'auto' : 24,
            right: i === 1 ? 8 : 'auto',
            top: 18 + i * 18, width: 22, height: 12,
            background: item.color, opacity: 0.55,
            borderRadius: '12px 2px 12px 2px',
            transform: `rotate(${i * 22 - 18}deg)`,
          }}/>
        ))}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--pp-soft-rose)',
          boxShadow: 'inset 0 0 0 2px rgba(75,64,56,0.18)' }}/>
      </div>
    );
  if (item.type === 'stamp')
    return wrap(
      <div style={{ width: '100%', height: '100%', background: '#FFFDF6',
        border: `2px dashed ${item.color}`, borderRadius: 2,
        boxShadow: '0 4px 6px rgba(75,64,56,0.18)' }}>
        <div style={{ margin: 8, height: 'calc(100% - 16px)',
          background: `linear-gradient(135deg, ${item.color}55, ${item.color}22)`, borderRadius: 1 }}/>
      </div>
    );
  if (item.type === 'seal')
    return wrap(
      <div style={{ width: '100%', height: '100%',
        background: `radial-gradient(circle at 35% 30%, ${item.color}, #2F4032)`,
        borderRadius: '50%', boxShadow: '0 4px 8px rgba(75,64,56,0.35)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 8, border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '50%' }}/>
      </div>
    );
  if (item.type === 'button')
    return wrap(
      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${item.color}, ${item.color}aa)`,
          boxShadow: '0 2px 4px rgba(75,64,56,0.25), inset 0 0 0 2px rgba(255,255,255,0.18)',
          position: 'relative',
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position: 'absolute', width: 4, height: 4, borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              left:  i % 2 === 0 ? '36%' : '54%',
              top:   i < 2     ? '36%' : '54%',
            }}/>
          ))}
        </div>
      </div>
    );
  return null;
};

/* ─── Selection frame (Canva-style outline + handles) ──────────── */

const HANDLES = [
  { id: 'nw', hx: -1, hy: -1, cursor: 'nwse-resize' },
  { id: 'n',  hx:  0, hy: -1, cursor: 'ns-resize'   },
  { id: 'ne', hx:  1, hy: -1, cursor: 'nesw-resize' },
  { id: 'e',  hx:  1, hy:  0, cursor: 'ew-resize'   },
  { id: 'se', hx:  1, hy:  1, cursor: 'nwse-resize' },
  { id: 's',  hx:  0, hy:  1, cursor: 'ns-resize'   },
  { id: 'sw', hx: -1, hy:  1, cursor: 'nesw-resize' },
  { id: 'w',  hx: -1, hy:  0, cursor: 'ew-resize'   },
];

const SelectionFrame = ({ item, onBeginResize, onBeginRotate }) => {
  // Rendered as a sibling of PlacedItem inside the same PageSide, so
  // positioning matches: left/top/width/height in page-local coords,
  // rotated about the center.
  return (
    <div style={{
      position: 'absolute',
      left: item.x, top: item.y, width: item.w, height: item.h,
      transform: item.rotate ? `rotate(${item.rotate}deg)` : 'none',
      pointerEvents: 'none',
      zIndex: 5,
    }}>
      {/* Outline */}
      <div style={{
        position: 'absolute', inset: -1,
        border: '1.5px solid var(--accent)',
        borderRadius: 2,
      }}/>

      {/* 8 resize handles */}
      {HANDLES.map(h => {
        const isEdge = h.hx === 0 || h.hy === 0;
        const sz = 12;
        return (
          <div
            key={h.id}
            data-handle={h.id}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBeginResize(h, e);
            }}
            style={{
              position: 'absolute',
              left:  h.hx < 0 ? -sz/2 : h.hx > 0 ? `calc(100% - ${sz/2}px)` : `calc(50% - ${sz/2}px)`,
              top:   h.hy < 0 ? -sz/2 : h.hy > 0 ? `calc(100% - ${sz/2}px)` : `calc(50% - ${sz/2}px)`,
              width: sz, height: sz,
              borderRadius: isEdge ? 2 : '50%',
              background: 'var(--surface-card)',
              border: '1.5px solid var(--accent)',
              boxShadow: '0 1px 3px rgba(75,64,56,0.30)',
              cursor: h.cursor,
              pointerEvents: 'auto',
              touchAction: 'none',
            }}
          />
        );
      })}

      {/* Rotate handle — sits just below the bottom-center, connected by a hairline */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '100%',
        transform: 'translate(-50%, 14px)',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 1.5, height: 14,
          background: 'var(--accent)',
          margin: '-14px auto 0',
        }}/>
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBeginRotate(e);
          }}
          aria-label="Rotate"
          title="Rotate"
          style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--surface-card)',
            border: '1.5px solid var(--accent)',
            boxShadow: 'var(--sh-paper)',
            color: 'var(--accent)',
            cursor: 'grab', display: 'grid', placeItems: 'center',
            pointerEvents: 'auto', touchAction: 'none',
            padding: 0,
          }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.8"/>
            <polyline points="21 4 21 9 16 9"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ title, body, confirmLabel = 'Confirm', danger = false, onCancel, onConfirm }) => (
  <div onPointerDown={onCancel}
    style={{ position: 'fixed', inset: 0, background: 'rgba(43,42,40,0.45)',
      display: 'grid', placeItems: 'center', zIndex: 90 }}>
    <div onPointerDown={(e) => e.stopPropagation()}
      style={{ background: 'var(--surface-card)', borderRadius: 16,
        border: '1px solid var(--pp-hairline)',
        boxShadow: '0 30px 60px -20px rgba(75,64,56,0.45)',
        padding: '24px 26px 20px', maxWidth: 420, width: '90%' }}>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5 }}>
        {body}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="pp-btn pp-btn-ghost" onClick={onCancel}>Never mind</button>
        <button
          onClick={onConfirm}
          className="pp-btn"
          style={danger ? {
            background: 'transparent', color: 'var(--pp-danger)',
            border: '1.5px solid var(--pp-danger)',
          } : { background: 'var(--accent)', color: 'var(--surface-card)' }}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

Object.assign(window, { JournalEditor });

// ── Editable journal title ────────────────────────────────────────────────
// Click to edit. Commits on Enter or blur, cancels on Esc.
const EditableJournalTitle = ({ name, onCommit, editing, setEditing }) => {
  const [draft, setDraft] = React.useState(name);
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (!editing) setDraft(name); }, [name, editing]);
  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = (draft || '').trim();
    if (trimmed && trimmed !== name) onCommit?.(trimmed);
    else setDraft(name);
    setEditing(false);
  };
  const cancel = () => { setDraft(name); setEditing(false); };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter')  { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        }}
        maxLength={40}
        aria-label="Journal name"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, color: 'var(--fg-1)',
          background: 'var(--bg-2)',
          border: '1px solid var(--pp-hairline)',
          borderRadius: 8,
          padding: '4px 10px',
          width: 'min(360px, 36vw)',
          outline: 'none',
          letterSpacing: '-0.005em',
        }}
      />
    );
  }
  return (
    <button
      onClick={() => setEditing(true)}
      title="Rename this journal"
      aria-label={`Rename journal, currently ${name}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'transparent', border: 0, padding: '4px 8px',
        borderRadius: 8, cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontSize: 22, color: 'var(--fg-1)',
        letterSpacing: '-0.005em',
        maxWidth: 'min(360px, 36vw)',
        overflow: 'hidden',
        transition: 'background 160ms var(--ease-paper)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ color: 'var(--fg-4)', display: 'inline-flex' }}>
        <Icon name="edit" size={14}/>
      </span>
    </button>
  );
};

// ── Undo / redo control for the topbar ───────────────────────────────────
const UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => {
  const btn = (enabled) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 40, borderRadius: 999, border: 'none',
    background: 'var(--bg-2)', color: enabled ? 'var(--fg-1)' : 'var(--fg-4)',
    cursor: enabled ? 'pointer' : 'default', opacity: enabled ? 1 : 0.45,
    transition: 'background 140ms var(--ease-paper)',
  });
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      <button style={btn(canUndo)} disabled={!canUndo} onClick={onUndo}
        title="Undo (⌘Z)" aria-label="Undo"><Icon name="undo" size={18}/></button>
      <button style={btn(canRedo)} disabled={!canRedo} onClick={onRedo}
        title="Redo (⌘⇧Z)" aria-label="Redo"><Icon name="redo" size={18}/></button>
    </div>
  );
};

// ── Layers button for the topbar ─────────────────────────────────────────
const LayersButton = ({ count = 0, active, onClick }) => (
  <button onClick={onClick}
    title="Layers — reorder items on this page"
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '7px 14px', minHeight: 36, borderRadius: 999,
      background: active ? 'rgba(78,102,82,0.12)' : 'var(--bg-2)',
      border: active ? '1px solid var(--pp-forest, #4E6652)' : '1px solid transparent',
      fontFamily: 'var(--font-ui)', fontSize: 12,
      color: active ? 'var(--pp-forest, #4E6652)' : 'var(--fg-2)',
      letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
      cursor: 'pointer',
    }}>
    <Icon name="layers" size={15}/> Layers
    {count > 0 && (
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700,
        background: active ? 'var(--pp-forest, #4E6652)' : 'var(--pp-stone-warm, #7A6B52)',
        color: '#FFFDF6', borderRadius: 999, minWidth: 18, height: 18,
        display: 'inline-grid', placeItems: 'center', padding: '0 5px',
        letterSpacing: 0,
      }}>{count}</span>
    )}
  </button>
);

// Friendly label for a placed item shown in the Layers list.
const placedLabel = (it) => {
  if (it.label) return it.label.charAt(0) + it.label.slice(1).toLowerCase();
  const map = {
    washi: 'Washi tape', tape: 'Tape', card: 'Postcard', flower: 'Pressed flower',
    'flower-image': 'Pressed flower', stamp: 'Stamp', seal: 'Wax seal',
    button: 'Button', antique: 'Ephemera', craft: 'Charm', fabric: 'Fabric',
  };
  return map[it.type] || 'Item';
};

// ── Layers panel ─────────────────────────────────────────────────────────
// Lists the active page's placed items front → back. Drag a row up to bring a
// piece forward, down to send it back. Tapping a row selects it on the canvas.
const LayersPanel = ({ open, onClose, page, items, selection, onSelect, onReorder }) => {
  const ROW_H = 52; // row height incl. the 6px gap
  const n = items.length;
  // Display order is front-most first → reverse of the z-order array.
  const display = items.map((it, idx) => ({ it, idx })).reverse();

  const [drag, setDrag] = React.useState(null); // { from(display), dy, target(display) }
  const startRef = React.useRef(null);

  const onGripDown = (displayIndex, e) => {
    e.stopPropagation();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    startRef.current = { y: e.clientY, from: displayIndex };
    setDrag({ from: displayIndex, dy: 0, target: displayIndex });
  };
  const onGripMove = (e) => {
    if (!startRef.current) return;
    const dy = e.clientY - startRef.current.y;
    const target = Math.max(0, Math.min(n - 1, Math.round((startRef.current.from * ROW_H + dy) / ROW_H)));
    setDrag({ from: startRef.current.from, dy, target });
  };
  const onGripUp = (e) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    if (startRef.current && drag) {
      const fromArr = (n - 1) - drag.from;
      const toArr   = (n - 1) - drag.target;
      if (fromArr !== toArr) onReorder?.(fromArr, toArr);
    }
    startRef.current = null;
    setDrag(null);
  };

  if (!open) return null;

  return (
    <aside
      role="dialog" aria-label="Layers"
      style={{
        position: 'absolute', top: 68, right: 16, zIndex: 30,
        width: 296, maxHeight: 'calc(100% - 150px)',
        background: 'var(--surface-card)',
        border: '1px solid var(--pp-hairline)',
        borderRadius: 14,
        boxShadow: 'var(--sh-card)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: 'var(--font-ui)',
        animation: 'pp-fb-in 220ms var(--ease-paper) both',
      }}>
      <style>{`@keyframes pp-fb-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--pp-hairline-soft)',
      }}>
        <div>
          <div className="eyebrow">Layers</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--fg-1)', marginTop: 2 }}>
            Page {page}
          </div>
        </div>
        <button className="pp-icon-btn" onClick={onClose} aria-label="Close layers">
          <Icon name="close" size={18}/>
        </button>
      </div>

      {/* List */}
      {n === 0 ? (
        <div style={{ padding: '28px 18px', textAlign: 'center', color: 'var(--fg-3)', fontSize: 13.5, lineHeight: 1.5 }}>
          No items on this page yet.<br/>Add some from your collection to stack them here.
        </div>
      ) : (
        <div style={{ padding: 10, overflowY: 'auto' }}>
          <div style={{ position: 'relative' }}>
            {display.map((row, di) => {
              const isSel = selection && selection.page === page && selection.index === row.idx;
              const isDragging = drag && drag.from === di;
              const lifted = isDragging ? drag.dy : 0;
              return (
                <div key={row.it.id ?? row.idx}
                  onClick={() => onSelect?.(row.idx)}
                  style={{
                    display: 'grid', gridTemplateColumns: '26px 36px 1fr auto',
                    alignItems: 'center', gap: 10,
                    height: ROW_H - 6, marginBottom: 6, padding: '0 8px',
                    borderRadius: 10, cursor: 'pointer',
                    background: isSel ? 'rgba(78,102,82,0.10)' : 'var(--bg-2)',
                    border: isSel ? '1.5px solid var(--pp-forest, #4E6652)' : '1.5px solid var(--pp-hairline)',
                    transform: isDragging ? `translateY(${lifted}px) scale(1.02)` : 'none',
                    boxShadow: isDragging ? 'var(--sh-lift)' : 'none',
                    transition: isDragging ? 'none' : 'background 140ms, border-color 140ms',
                    position: 'relative', zIndex: isDragging ? 5 : 1, touchAction: 'none',
                  }}>
                  {/* Grip */}
                  <div
                    onPointerDown={(e) => onGripDown(di, e)}
                    onPointerMove={onGripMove}
                    onPointerUp={onGripUp}
                    onPointerCancel={onGripUp}
                    title="Drag to reorder"
                    style={{
                      display: 'grid', placeItems: 'center', height: '100%',
                      cursor: 'grab', color: 'var(--fg-4)', touchAction: 'none',
                    }}>
                    <Icon name="grip" size={16}/>
                  </div>
                  {/* Swatch */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 6, position: 'relative', overflow: 'hidden',
                    background: 'var(--pp-cream)', border: '1px solid var(--pp-hairline)',
                  }}>
                    {row.it.imageSrc
                      ? <img src={row.it.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                      : <div style={{ position: 'absolute', inset: 4, borderRadius: 3, background: row.it.color || 'var(--pp-sage)' }}/>}
                  </div>
                  {/* Label */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {placedLabel(row.it)}
                    </div>
                    <div style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-4)' }}>
                      {di === 0 ? 'Front' : di === n - 1 ? 'Back' : `Layer ${n - di}`}
                    </div>
                  </div>
                  <div/>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '6px 8px 2px', fontSize: 11, color: 'var(--fg-4)', lineHeight: 1.4 }}>
            Top of the list sits in front. Drag a row up or down to restack.
          </div>
        </div>
      )}
    </aside>
  );
};

// ── Item details panel (single click on a collection tile) ───────────────
const ItemDetailsModal = ({ item, categoryLabel, onClose, onAdd }) => {
  React.useEffect(() => {
    if (!item) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(43,42,40,0.32)', backdropFilter: 'blur(3px)',
        display: 'grid', placeItems: 'center', padding: 24,
        animation: 'pp-scrim-in 200ms var(--ease-paper) both', fontFamily: 'var(--font-ui)',
      }}>
      <style>{`@keyframes pp-scrim-in{from{opacity:0}to{opacity:1}}@keyframes pp-det-in{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}`}</style>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 540,
          background: 'var(--surface-card)', borderRadius: 18,
          border: '1px solid var(--pp-hairline)',
          boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45)',
          overflow: 'hidden', animation: 'pp-det-in 280ms var(--ease-paper) both',
          display: 'grid', gridTemplateColumns: '200px 1fr',
        }}>
        {/* Preview */}
        <div style={{
          background: 'radial-gradient(420px 320px at 40% 30%, rgba(255,253,246,0.9), transparent 70%), var(--bg-3)',
          display: 'grid', placeItems: 'center', padding: 22,
          borderRight: '1px solid var(--pp-hairline-soft)',
        }}>
          <div style={{
            width: 150, height: 196, position: 'relative', overflow: 'hidden',
            background: 'var(--pp-cream)', border: '1.5px solid var(--pp-hairline)',
            borderRadius: 8, boxShadow: 'var(--sh-card)',
          }}>
            <CollectionGlyph item={item}/>
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: '22px 22px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div className="eyebrow">{categoryLabel || 'Collection'}</div>
            <button className="pp-icon-btn" onClick={onClose} aria-label="Close" style={{ margin: -6 }}>
              <Icon name="close" size={18}/>
            </button>
          </div>
          <h2 style={{
            margin: '6px 0 0', fontFamily: 'var(--font-display)', fontWeight: 400,
            fontSize: 26, letterSpacing: '-0.005em', color: 'var(--fg-1)', lineHeight: 1.1,
          }}>{item.name || placedLabel(item)}</h2>
          {item.isNew && (
            <div style={{
              marginTop: 8, alignSelf: 'flex-start',
              fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
              background: 'var(--pp-terracotta)', color: 'var(--surface-card)',
              padding: '3px 9px', borderRadius: 999, fontWeight: 700,
            }}>New this week</div>
          )}
          <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.55, color: 'var(--fg-2)' }}>
            {item.desc || 'A piece from your collection, ready to place on the page.'}
          </p>
          <div style={{ flex: 1 }}/>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginTop: 18,
          }}>
            <button onClick={onAdd}
              style={{
                height: 46, padding: '0 22px', borderRadius: 999, border: 0,
                background: 'var(--pp-forest, #4E6652)', color: '#FFFDF6',
                fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: 'var(--sh-paper)',
              }}>
              <Icon name="add" size={18}/> Add to page
            </button>
            <span style={{ fontSize: 11.5, color: 'var(--fg-4)', lineHeight: 1.4, maxWidth: 150 }}>
              Tip: double-click or drag the tile to place it instantly.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Editor ad banner (removed by subscription) ───────────────────────────
const EditorAdBanner = ({ onUpgrade }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, zIndex: 6,
    background: 'linear-gradient(180deg, #FFFDF6 0%, #F4ECDC 100%)',
    borderTop: '1px solid var(--pp-hairline)',
    boxShadow: '0 -2px 10px rgba(75,64,56,0.07)',
    display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center',
    gap: 14, padding: '0 16px', fontFamily: 'var(--font-ui)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 6, flexShrink: 0,
        background: 'repeating-linear-gradient(45deg, #E8DCC4 0 8px, #DDD0B6 8px 16px)',
        display: 'grid', placeItems: 'center',
        color: 'var(--fg-3)', fontFamily: 'var(--font-paper)', fontSize: 9, letterSpacing: '0.18em',
      }}>AD</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-paper)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Sponsored</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--fg-1)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your advertisement here</div>
      </div>
    </div>
    <div/>
    <button onClick={onUpgrade}
      style={{
        height: 38, padding: '0 16px', borderRadius: 999,
        background: 'var(--pp-forest, #4E6652)', border: 0, color: '#FFFDF6',
        fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        boxShadow: 'var(--sh-paper)',
      }}>
      <Icon name="sparkle" size={15}/> Remove ads with subscription
    </button>
  </div>
);
