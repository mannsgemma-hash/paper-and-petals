// Journal cover designs.
//
// A library of cover presets the user can pick from for the front and back
// of their journal. Each preset has an `id`, a human label, a category,
// and a `render()` that paints the cover with CSS — so it scales cleanly
// from the home-screen thumbnail (300×420) up to the editor cover surface
// (340×465 within the spread).
//
// Exports:
//   COVER_PRESETS           — the array of all presets, grouped by category.
//   COVER_BY_ID             — id → preset lookup map.
//   <CoverArt cover>        — renders a preset by id, fills its container.
//   <CoverPickerModal …>    — full picker UI (front/back tabs, category list,
//                             swatch grid) for the editor.

const COVER_CATEGORIES = [
  { id: 'leather',  label: 'Leather bound' },
  { id: 'linen',    label: 'Linen & cloth' },
  { id: 'floral',   label: 'Floral' },
  { id: 'pattern',  label: 'Patterned' },
  { id: 'solid',    label: 'Solid colours' },
  { id: 'vintage',  label: 'Vintage paper' },
];

// ── Pattern / texture helpers ────────────────────────────────────────────

// A reusable "paper grain" overlay used by most covers to keep them tactile.
const paperGrain = (opacity = 0.20) => ({
  position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay',
  pointerEvents: 'none',
  backgroundImage:
    'radial-gradient(circle at 20% 30%, rgba(255,253,246,0.25), transparent 35%),' +
    'radial-gradient(circle at 80% 70%, rgba(0,0,0,0.18), transparent 40%),' +
    'radial-gradient(circle at 65% 20%, rgba(255,253,246,0.15), transparent 30%)',
});

// Leather: deep radial + diagonal hairlines for grain.
const leatherFill = (base, top) => ({
  background:
    `radial-gradient(circle at 30% 30%, ${top} 0%, ${base} 70%),` +
    'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 5px)',
});

// Linen: two perpendicular hairline grids over a soft gradient.
const linenFill = (a, b) => ({
  background:
    `repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px),` +
    `repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px),` +
    `linear-gradient(180deg, ${a} 0%, ${b} 100%)`,
});

// SVG floral pattern — small ditsy flower repeat.
const ditsyFloralSVG = (petal, leaf, bg) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
      <rect width='80' height='80' fill='${bg}'/>
      <g fill='${petal}' opacity='0.85'>
        <circle cx='20' cy='20' r='3'/>
        <circle cx='16' cy='16' r='3'/>
        <circle cx='24' cy='16' r='3'/>
        <circle cx='16' cy='24' r='3'/>
        <circle cx='24' cy='24' r='3'/>
        <circle cx='60' cy='60' r='3'/>
        <circle cx='56' cy='56' r='3'/>
        <circle cx='64' cy='56' r='3'/>
        <circle cx='56' cy='64' r='3'/>
        <circle cx='64' cy='64' r='3'/>
      </g>
      <g fill='${leaf}' opacity='0.65'>
        <ellipse cx='40' cy='40' rx='3' ry='8' transform='rotate(30 40 40)'/>
        <ellipse cx='40' cy='40' rx='3' ry='8' transform='rotate(-30 40 40)'/>
      </g>
      <g fill='${petal}' opacity='0.55'>
        <circle cx='20' cy='60' r='2'/>
        <circle cx='60' cy='20' r='2'/>
      </g>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// Bigger botanical sprig pattern.
const botanicalSVG = (stem, accent, bg) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
      <rect width='120' height='120' fill='${bg}'/>
      <g stroke='${stem}' stroke-width='1.2' fill='none' opacity='0.65'>
        <path d='M30 110 Q 36 70, 30 30'/>
        <path d='M30 90 Q 18 80, 14 70' />
        <path d='M30 70 Q 42 60, 46 50' />
        <path d='M30 50 Q 18 42, 14 32' />
        <path d='M90 10 Q 84 50, 90 90'/>
        <path d='M90 30 Q 102 40, 106 50' />
        <path d='M90 50 Q 78 60, 74 70' />
        <path d='M90 70 Q 102 78, 106 88' />
      </g>
      <g fill='${accent}' opacity='0.5'>
        <ellipse cx='14' cy='70' rx='5' ry='2.4' transform='rotate(-30 14 70)'/>
        <ellipse cx='46' cy='50' rx='5' ry='2.4' transform='rotate(30 46 50)'/>
        <ellipse cx='106' cy='50' rx='5' ry='2.4' transform='rotate(30 106 50)'/>
        <ellipse cx='74' cy='70' rx='5' ry='2.4' transform='rotate(-30 74 70)'/>
      </g>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// Marbled paper — wavy curves over a tinted base.
const marbledSVG = (a, b, c) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <rect width='200' height='200' fill='${a}'/>
      <g fill='none' stroke-width='1.5' opacity='0.55'>
        <path stroke='${b}' d='M0 30 Q 50 10, 100 30 T 200 30'/>
        <path stroke='${b}' d='M0 60 Q 50 80, 100 60 T 200 60'/>
        <path stroke='${c}' d='M0 100 Q 50 80, 100 100 T 200 100'/>
        <path stroke='${b}' d='M0 140 Q 50 160, 100 140 T 200 140'/>
        <path stroke='${c}' d='M0 170 Q 50 150, 100 170 T 200 170'/>
      </g>
      <g fill='${c}' opacity='0.35'>
        <ellipse cx='30' cy='30' rx='25' ry='3' transform='rotate(-15 30 30)'/>
        <ellipse cx='160' cy='90' rx='25' ry='3' transform='rotate(10 160 90)'/>
        <ellipse cx='80' cy='170' rx='25' ry='3' transform='rotate(-10 80 170)'/>
      </g>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// ── Cover presets ────────────────────────────────────────────────────────

const COVER_PRESETS = [
  // ── Leather ─────────────────────────────────────────────────────────
  {
    id: 'leather-cognac', label: 'Cognac leather', category: 'leather',
    style: { ...leatherFill('#4B3320', '#6F4F35') },
    ink: 'light',
  },
  {
    id: 'leather-oxblood', label: 'Oxblood leather', category: 'leather',
    style: { ...leatherFill('#3B1818', '#5A2222') },
    ink: 'light',
  },
  {
    id: 'leather-forest', label: 'Forest leather', category: 'leather',
    style: { ...leatherFill('#243A2A', '#39553D') },
    ink: 'light',
  },
  {
    id: 'leather-ink', label: 'Ink leather', category: 'leather',
    style: { ...leatherFill('#191815', '#2E2C28') },
    ink: 'light',
  },

  // ── Linen ────────────────────────────────────────────────────────────
  {
    id: 'linen-cream', label: 'Cream linen', category: 'linen',
    style: { ...linenFill('#F4ECDC', '#E6DAC0') },
    ink: 'dark',
  },
  {
    id: 'linen-sage', label: 'Sage linen', category: 'linen',
    style: { ...linenFill('#B6BFA5', '#8FA088') },
    ink: 'dark',
  },
  {
    id: 'linen-mauve', label: 'Mauve linen', category: 'linen',
    style: { ...linenFill('#C9AEB5', '#A98C98') },
    ink: 'dark',
  },
  {
    id: 'linen-coastal', label: 'Coastal linen', category: 'linen',
    style: { ...linenFill('#B8C7D2', '#8FA3B8') },
    ink: 'dark',
  },

  // ── Floral ───────────────────────────────────────────────────────────
  {
    id: 'floral-wildrose', label: 'Wild rose', category: 'floral',
    style: {
      backgroundColor: '#F2E2DC',
      backgroundImage: ditsyFloralSVG('#C47B63', '#7C8E6B', '#F4E6DE'),
      backgroundSize: '110px 110px',
    },
    ink: 'dark',
  },
  {
    id: 'floral-meadow', label: 'Meadow flowers', category: 'floral',
    style: {
      backgroundColor: '#E5DECC',
      backgroundImage: ditsyFloralSVG('#7C8E6B', '#A98C98', '#EAE2CE'),
      backgroundSize: '110px 110px',
    },
    ink: 'dark',
  },
  {
    id: 'floral-botanical', label: 'Botanical study', category: 'floral',
    style: {
      backgroundColor: '#EDE3CB',
      backgroundImage: botanicalSVG('#4E6652', '#C47B63', '#EFE5CF'),
      backgroundSize: '140px 140px',
    },
    ink: 'dark',
  },

  // ── Patterned ────────────────────────────────────────────────────────
  {
    id: 'pattern-stripes-sage', label: 'Sage stripes', category: 'pattern',
    style: {
      background:
        'repeating-linear-gradient(90deg, #8FA088 0 12px, #B6BFA5 12px 24px)',
    },
    ink: 'dark',
  },
  {
    id: 'pattern-stripes-rose', label: 'Rose stripes', category: 'pattern',
    style: {
      background:
        'repeating-linear-gradient(90deg, #D7B7B0 0 12px, #E6CFC9 12px 24px)',
    },
    ink: 'dark',
  },
  {
    id: 'pattern-polka', label: 'Cream polka', category: 'pattern',
    style: {
      backgroundColor: '#5F758A',
      backgroundImage:
        'radial-gradient(circle, #F4ECDC 2.5px, transparent 3px)',
      backgroundSize: '18px 18px',
      backgroundPosition: '0 0',
    },
    ink: 'light',
  },
  {
    id: 'pattern-checker', label: 'Soft check', category: 'pattern',
    style: {
      backgroundColor: '#F4ECDC',
      backgroundImage:
        'linear-gradient(45deg, rgba(168,140,116,0.18) 25%, transparent 25%, transparent 75%, rgba(168,140,116,0.18) 75%),' +
        'linear-gradient(45deg, rgba(168,140,116,0.18) 25%, transparent 25%, transparent 75%, rgba(168,140,116,0.18) 75%)',
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
    },
    ink: 'dark',
  },

  // ── Solids ───────────────────────────────────────────────────────────
  {
    id: 'solid-terracotta', label: 'Terracotta', category: 'solid',
    style: { background: 'linear-gradient(170deg, #D08A72 0%, #B6624B 100%)' },
    ink: 'light',
  },
  {
    id: 'solid-sage', label: 'Sage', category: 'solid',
    style: { background: 'linear-gradient(170deg, #95A689 0%, #6E8270 100%)' },
    ink: 'light',
  },
  {
    id: 'solid-rose', label: 'Dusty rose', category: 'solid',
    style: { background: 'linear-gradient(170deg, #E5C6BF 0%, #BE8E89 100%)' },
    ink: 'dark',
  },
  {
    id: 'solid-mauve', label: 'Plum mauve', category: 'solid',
    style: { background: 'linear-gradient(170deg, #BFA1AC 0%, #8F6B7A 100%)' },
    ink: 'light',
  },
  {
    id: 'solid-blue', label: 'Slate blue', category: 'solid',
    style: { background: 'linear-gradient(170deg, #A2B5C5 0%, #6F8598 100%)' },
    ink: 'light',
  },
  {
    id: 'solid-charcoal', label: 'Charcoal', category: 'solid',
    style: { background: 'linear-gradient(170deg, #3D3A36 0%, #2A2724 100%)' },
    ink: 'light',
  },

  // ── Vintage ──────────────────────────────────────────────────────────
  {
    id: 'vintage-parchment', label: 'Aged parchment', category: 'vintage',
    style: {
      background:
        'radial-gradient(circle at 20% 30%, rgba(168,140,116,0.18), transparent 40%),' +
        'radial-gradient(circle at 80% 70%, rgba(168,140,116,0.16), transparent 35%),' +
        'radial-gradient(circle at 60% 20%, rgba(200,169,107,0.16), transparent 30%),' +
        'linear-gradient(180deg, #F0E2C3 0%, #E0CDA3 100%)',
    },
    ink: 'dark',
  },
  {
    id: 'vintage-marbled-rose', label: 'Marbled rose', category: 'vintage',
    style: {
      backgroundColor: '#E8C6BE',
      backgroundImage: marbledSVG('#E8C6BE', '#B07365', '#F4E0D9'),
      backgroundSize: '220px 220px',
    },
    ink: 'dark',
  },
  {
    id: 'vintage-marbled-blue', label: 'Marbled blue', category: 'vintage',
    style: {
      backgroundColor: '#C7D3DE',
      backgroundImage: marbledSVG('#C7D3DE', '#5E7286', '#E1E8EE'),
      backgroundSize: '220px 220px',
    },
    ink: 'dark',
  },
];

const COVER_BY_ID = Object.fromEntries(COVER_PRESETS.map((c) => [c.id, c]));

// Pick reasonable defaults if a cover id ever goes missing (e.g. legacy data).
const DEFAULT_FRONT_COVER = 'leather-cognac';
const DEFAULT_BACK_COVER  = 'leather-cognac';

// ── Renderer ─────────────────────────────────────────────────────────────

const CoverArt = ({ cover, children, style = {}, grain = true }) => {
  const preset = COVER_BY_ID[cover] || COVER_BY_ID[DEFAULT_FRONT_COVER];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      ...preset.style,
      ...style,
    }}>
      {grain && <div style={paperGrain(0.18)}/>}
      {children}
    </div>
  );
};

// ── Picker modal ─────────────────────────────────────────────────────────

const CoverPickerModal = ({
  open,
  initialSide = 'front',
  frontCover,
  backCover,
  onPickFront,
  onPickBack,
  unified = false,
  onPick,
  onClose,
}) => {
  const [side, setSide] = React.useState(initialSide);
  React.useEffect(() => { if (open) setSide(initialSide); }, [open, initialSide]);

  // Close on Esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const selected = unified ? frontCover : (side === 'front' ? frontCover : backCover);
  const pick = unified ? onPick : (side === 'front' ? onPickFront : onPickBack);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 70,
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
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateAreas: '"header header" "preview grid" "footer footer"',
          overflow: 'hidden',
          fontFamily: 'var(--font-ui)',
          animation: 'pp-modal-in 280ms var(--ease-paper) both',
        }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{
          gridArea: 'header',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'center', gap: 14,
          padding: '18px 22px',
          borderBottom: '1px solid var(--pp-hairline)',
          background:
            'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-paper)',
              fontSize: 11, letterSpacing: '0.22em',
              color: 'var(--fg-3)', textTransform: 'uppercase',
            }}>Journal cover</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22, color: 'var(--fg-1)',
              lineHeight: 1.1, marginTop: 2,
              letterSpacing: '-0.005em',
            }}>Choose a cover</div>
          </div>

          {/* Front / Back toggle — hidden in unified mode (one design covers all). */}
          {!unified ? (
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-2)',
            borderRadius: 999, padding: 3,
            border: '1px solid var(--pp-hairline)',
          }}>
            {['front', 'back'].map((s) => (
              <button key={s} onClick={() => setSide(s)}
                style={{
                  padding: '8px 16px', minHeight: 36,
                  borderRadius: 999, border: 0,
                  background: side === s ? 'var(--surface-card)' : 'transparent',
                  color: side === s ? 'var(--fg-1)' : 'var(--fg-3)',
                  fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
                  letterSpacing: '0.02em', cursor: 'pointer',
                  boxShadow: side === s ? '0 1px 3px rgba(75,64,56,0.18)' : 'none',
                  transition: 'all 160ms var(--ease-paper)',
                  textTransform: 'capitalize',
                }}>{s} cover</button>
            ))}
          </div>
          ) : (
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
              color: 'var(--fg-3)', letterSpacing: '0.02em',
              background: 'var(--bg-2)', border: '1px solid var(--pp-hairline)',
              borderRadius: 999, padding: '8px 16px',
            }}>Front, spine, back &amp; inside</div>
          )}

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

        {/* ── Preview ────────────────────────────────────────────── */}
        <div style={{
          gridArea: 'preview',
          padding: 20,
          borderRight: '1px solid var(--pp-hairline)',
          background:
            'radial-gradient(closest-side, rgba(255,253,246,0.85), rgba(247,242,232,0.85))',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 14,
        }}>
          <div style={{
            fontFamily: 'var(--font-paper)',
            fontSize: 10, letterSpacing: '0.22em',
            color: 'var(--fg-3)', textTransform: 'uppercase',
          }}>Preview · {unified ? 'your cover' : side + ' cover'}</div>
          <div style={{
            width: 200, height: 280,
            borderRadius: '4px 10px 10px 4px',
            position: 'relative',
            boxShadow:
              '0 22px 40px -10px rgba(45,38,30,0.30), 0 6px 10px rgba(45,38,30,0.18)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.10)',
          }}>
            <CoverArt cover={selected}/>
            {/* spine accent on the binding side */}
            <div style={{
              position: 'absolute',
              left: side === 'front' ? 0 : 'auto',
              right: side === 'back' ? 0 : 'auto',
              top: 0, bottom: 0, width: 12,
              background: 'rgba(0,0,0,0.18)',
              pointerEvents: 'none',
            }}/>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16, color: 'var(--fg-1)',
            textAlign: 'center',
          }}>{COVER_BY_ID[selected]?.label}</div>
          <div style={{
            fontFamily: 'var(--font-script)', fontStyle: 'italic',
            fontSize: 13, color: 'var(--fg-3)', textAlign: 'center',
            padding: '0 12px',
          }}>
            Tap a cover on the right to try it on.
            {unified
              ? ' It dresses the front, spine, back and inside endpapers together.'
              : ' You can place items on the cover after closing this picker.'}
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────── */}
        <div style={{
          gridArea: 'grid',
          overflowY: 'auto',
          padding: 18,
          background: 'var(--surface-card)',
        }}>
          {COVER_CATEGORIES.map((cat) => {
            const items = COVER_PRESETS.filter((p) => p.category === cat.id);
            if (!items.length) return null;
            return (
              <section key={cat.id} style={{ marginBottom: 22 }}>
                <div style={{
                  fontFamily: 'var(--font-paper)',
                  fontSize: 10, letterSpacing: '0.22em',
                  color: 'var(--fg-3)', textTransform: 'uppercase',
                  marginBottom: 10,
                }}>{cat.label}</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                  gap: 10,
                }}>
                  {items.map((p) => {
                    const isActive = p.id === selected;
                    return (
                      <button key={p.id} onClick={() => pick?.(p.id)}
                        title={p.label}
                        style={{
                          aspectRatio: '3 / 4',
                          position: 'relative',
                          padding: 0, border: 0,
                          borderRadius: '3px 7px 7px 3px',
                          background: 'transparent',
                          cursor: 'pointer',
                          outline: isActive
                            ? '3px solid var(--pp-forest, #4E6652)'
                            : '1px solid var(--pp-hairline)',
                          outlineOffset: isActive ? 2 : 0,
                          boxShadow: isActive
                            ? '0 8px 16px -4px rgba(78,102,82,0.35), 0 2px 4px rgba(75,64,56,0.18)'
                            : '0 4px 10px -4px rgba(75,64,56,0.22)',
                          overflow: 'hidden',
                          transition: 'all 160ms var(--ease-paper)',
                        }}>
                        <CoverArt cover={p.id}/>
                        {isActive && (
                          <div style={{
                            position: 'absolute', top: 5, right: 5,
                            width: 22, height: 22, borderRadius: '50%',
                            background: 'var(--pp-forest, #4E6652)',
                            color: '#FFFDF6',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(45,38,30,0.4)',
                          }}>
                            <Icon name="check" size={14} stroke={2.4}/>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div style={{
          gridArea: 'footer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 10,
          padding: '14px 22px',
          borderTop: '1px solid var(--pp-hairline)',
          background: 'rgba(247,242,232,0.7)',
        }}>
          <div style={{
            fontSize: 12, color: 'var(--fg-3)',
            fontFamily: 'var(--font-script)', fontStyle: 'italic',
          }}>
            Front cover is what shows on your shelf at home.
          </div>
          <button onClick={onClose}
            style={{
              height: 44, padding: '0 22px', borderRadius: 999,
              background: 'var(--pp-forest, #4E6652)',
              color: '#FFFDF6', border: 0,
              fontFamily: 'var(--font-ui)',
              fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
              cursor: 'pointer',
              boxShadow: '0 4px 10px -2px rgba(78,102,82,0.45)',
            }}>Done</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  COVER_PRESETS, COVER_CATEGORIES, COVER_BY_ID,
  DEFAULT_FRONT_COVER, DEFAULT_BACK_COVER,
  CoverArt, CoverPickerModal,
});
