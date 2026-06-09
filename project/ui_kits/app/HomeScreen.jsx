// SCR-05 Home Screen. Toca-Boca-style journal carousel.
//
// Central featured journal with smaller neighbours peeking on either side.
// Arrow buttons + pointer swipe + keyboard ←/→ all advance the active index.
// Tapping the centred journal opens SCR-07 Journal Editor.
// Top-left: app logo + wordmark. Top-right: Shop and Settings icon buttons.
// Bottom: ad banner — replaced by a subscriber acknowledgement when subscribed.
// Background: the SCR-01 parchment texture.
//
// Each journal carries the cover-preset id (frontCover) chosen in the editor;
// the card thumbnail renders that preset via <CoverArt> so the home shelf
// always reflects the user’s most recent cover choice.

// Each journal is bound in leather (cognac) — cover selection was removed, so
// every journal on the shelf reads as a matching leather set.
const SEED_JOURNALS = [
  { id: 'j-spring',     name: 'Spring',         frontCover: 'leather-cognac', backCover: 'leather-cognac', items: 18, edited: '2 days ago' },
  { id: 'j-autumn',     name: 'Autumn Library', frontCover: 'leather-cognac', backCover: 'leather-cognac', items: 24, edited: 'yesterday' },
  { id: 'j-coastal',    name: 'Coastal',        frontCover: 'leather-cognac', backCover: 'leather-cognac', items: 12, edited: '5 days ago' },
  { id: 'j-romantic',   name: 'Romantic',       frontCover: 'leather-cognac', backCover: 'leather-cognac', items: 9,  edited: '1 week ago' },
  { id: 'j-cottage',    name: 'Cottagecore',    frontCover: 'leather-cognac', backCover: 'leather-cognac', items: 31, edited: '3 hours ago' },
  { id: 'j-fieldnotes', name: 'Field Notes',    frontCover: 'leather-cognac', backCover: 'leather-cognac', items: 7,  edited: 'today' },
  { isNew: true, id: 'j-new' },
];

// One journal cover card on the carousel. Front cover preset renders
// full-bleed inside a paper-bound card frame: rounded spine on the left,
// ribbon bookmark, brass label plate with the journal name + last edited.
// `isNew` renders the dashed empty slot.
const JournalCover = ({ journal, active }) => {
  if (journal.isNew) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background:
          'repeating-linear-gradient(0deg, transparent 0 5px, rgba(75,64,56,0.04) 5px 6px),' +
          'linear-gradient(180deg, #F4ECDC 0%, #E6DAC0 100%)',
        borderRadius: '4px 10px 10px 4px',
        border: '2px dashed rgba(75,64,56,0.32)',
        boxShadow: active
          ? '0 22px 40px -10px rgba(75,64,56,0.30), 0 4px 8px rgba(75,64,56,0.10)'
          : '0 10px 22px -8px rgba(75,64,56,0.22)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 14,
        color: 'var(--fg-2)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '2px solid rgba(75,64,56,0.30)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-display)', fontSize: 56,
          color: 'rgba(75,64,56,0.55)',
          background: 'rgba(255,253,246,0.4)',
        }}>＋</div>
        <div style={{
          fontFamily: 'var(--font-script)', fontStyle: 'italic',
          fontSize: 22, color: 'var(--fg-1)', textAlign: 'center',
          padding: '0 24px',
        }}>Start a new journal</div>
      </div>
    );
  }

  const preset = COVER_BY_ID[journal.frontCover] || COVER_BY_ID[DEFAULT_FRONT_COVER];
  // Pick a brass-on-cream label tint that works on every cover; the brass
  // plate is intentionally consistent so the user’s shelf reads as a set.
  const inkLight = preset?.ink === 'light';

  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: '4px 10px 10px 4px',
      boxShadow: active
        ? '0 24px 44px -10px rgba(45,38,30,0.50), 0 6px 10px rgba(45,38,30,0.22), inset 0 1px 0 rgba(255,253,246,0.18)'
        : '0 12px 26px -8px rgba(45,38,30,0.36), inset 0 1px 0 rgba(255,253,246,0.14)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Cover art — fills the whole card */}
      <CoverArt cover={journal.frontCover}/>

      {/* Spine darkening on the binding edge */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 18,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 70%, transparent 100%)',
        pointerEvents:'none',
      }}/>

      {/* Stitched inner border (only visible against darker covers) */}
      <div style={{
        position: 'absolute', top: 14, bottom: 14, left: 26, right: 14,
        border: `1.5px dashed ${inkLight ? 'rgba(255,253,246,0.50)' : 'rgba(75,64,56,0.28)'}`,
        borderRadius: 4,
        pointerEvents: 'none',
      }}/>

      {/* Brass label plate — always brass, regardless of cover */}
      <div style={{
        position: 'absolute', left: '54%', bottom: '14%',
        transform: 'translateX(-50%)',
        width: '74%', minHeight: 64,
        background:
          'linear-gradient(180deg, #F0DFA6 0%, #D6BD78 45%, #A8893F 100%)',
        borderRadius: 4,
        border: '1px solid #7E6322',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 2px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '8px 14px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17, lineHeight: 1.1,
          color: '#3A2C0F',
          letterSpacing: '0.005em',
          maxWidth: '100%',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{journal.name}</div>
        <div style={{
          fontFamily: 'var(--font-script)', fontStyle: 'italic',
          fontSize: 12, color: '#5A4A1F', marginTop: 2,
          letterSpacing: '0.02em',
        }}>{journal.items} items · {journal.edited}</div>
      </div>

      {/* Ribbon bookmark, tinted to the cover's ink direction */}
      <div style={{
        position: 'absolute', right: 36, top: -2, width: 16, height: 56,
        background: inkLight
          ? 'linear-gradient(180deg, #FFFDF6 0%, #E6DAC0 100%)'
          : 'linear-gradient(180deg, #C47B63 0%, #8C5440 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
        filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.25))',
        pointerEvents:'none',
      }}/>
    </div>
  );
};

const HomeScreen = ({ journals: journalsProp, onJournalTap, onShop, onSettings, subscribed = false }) => {
  const journals = journalsProp || SEED_JOURNALS;
  const [active, setActive] = React.useState(0);
  const [dragDX, setDragDX] = React.useState(0);
  const dragRef = React.useRef({ startX: null, lastDX: 0 });

  const next = React.useCallback(() => {
    setActive(a => Math.min(a + 1, journals.length - 1));
  }, [journals.length]);
  const prev = React.useCallback(() => {
    setActive(a => Math.max(a - 1, 0));
  }, []);

  // Keyboard ←/→
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Pointer drag — swipe handler.
  // IMPORTANT: we do NOT capture the pointer on press. Capturing on pointerdown
  // redirects the follow-up `click` event to this container, which swallows the
  // arrow-button and journal-card clicks entirely. Instead we only capture once
  // the pointer has actually moved past the drag threshold — so a plain tap
  // still delivers its click, while a genuine swipe keeps tracking.
  const DRAG_THRESHOLD = 6;
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current.startX = e.clientX;
    dragRef.current.lastDX = 0;
    dragRef.current.captured = false;
  };
  const onPointerMove = (e) => {
    if (dragRef.current.startX === null) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.lastDX = dx;
    // Begin capturing only once this is unmistakably a drag.
    if (!dragRef.current.captured && Math.abs(dx) > DRAG_THRESHOLD) {
      dragRef.current.captured = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
    if (dragRef.current.captured) setDragDX(dx);
  };
  const endDrag = (e) => {
    if (dragRef.current.startX === null) return;
    const dx = dragRef.current.lastDX;
    const wasDrag = dragRef.current.captured;
    dragRef.current.startX = null;
    dragRef.current.captured = false;
    setDragDX(0);
    if (wasDrag && Math.abs(dx) > 50) { (dx < 0) ? next() : prev(); }
    // Reset travel on the next tick so the card's click handler (which checks
    // lastDX to distinguish tap from swipe) still sees the real drag distance.
    requestAnimationFrame(() => { dragRef.current.lastDX = 0; });
  };

  const stage = {
    width: '100%', height: '100%',
    position: 'relative', overflow: 'hidden',
    fontFamily: 'var(--font-ui)',
    background:
      'radial-gradient(900px 600px at 50% 35%, rgba(255,253,246,0.70), rgba(255,253,246,0) 60%),' +
      'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' +
      'var(--bg-1)',
  };

  // Per-journal placement relative to active index.
  // Step = horizontal offset between adjacent cards; sideScale shrinks neighbours.
  const STEP = 280;
  const placement = (offset) => {
    const a = Math.abs(offset);
    if (a > 2.4) return { hide: true };
    const sgn = Math.sign(offset);
    // Toca-Boca-style: neighbours sit a step out, scaled & tilted.
    const scale =
      a < 0.5 ? 1 :
      a < 1.5 ? 0.74 :
      0.52;
    const tx = offset * STEP * (a < 1.5 ? 1 : 1.05);
    const rot = a < 0.5 ? 0 : sgn * (a < 1.5 ? 5 : 9);
    const ty = a < 0.5 ? 0 : (a < 1.5 ? 14 : 26);
    const opacity = a < 0.5 ? 1 : a < 1.5 ? 0.95 : 0.40;
    const z = 10 - Math.round(a * 2);
    return { scale, tx, ty, rot, opacity, z };
  };

  return (
    <div className="pp-stage" style={stage}>

      {/* ── Top-left: logo + wordmark ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 22, left: 24, zIndex: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <img src="../../assets/logos/logo_sage.png" alt=""
          style={{ width: 64, height: 64, filter: 'drop-shadow(0 6px 12px rgba(75,64,56,.20))' }}/>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg-1)',
          lineHeight: 1, letterSpacing: '-0.005em',
        }}>
          Paper&nbsp;<em style={{
            fontFamily: 'var(--font-script)', fontStyle: 'italic',
            color: 'var(--pp-terracotta)', fontWeight: 500,
          }}>&amp;</em>&nbsp;Petals
        </div>
      </div>

      {/* ── Top-right: shop + settings ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 24, right: 24, zIndex: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onShop} title="Shop & packs"
          style={topBtnStyle('var(--pp-terracotta)')}>
          <Icon name="shop" size={26} />
          <span style={topBtnLabel}>Shop</span>
        </button>
        <button onClick={onSettings} title="Settings"
          style={topBtnStyle('var(--pp-sage)')}>
          <Icon name="settings" size={26} />
          <span style={topBtnLabel}>Settings</span>
        </button>
      </div>

      {/* ── Carousel area ───────────────────────────────────────────────── */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: 'absolute',
          left: 0, right: 0, top: 96, bottom: 110,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'pan-y',
          cursor: dragRef.current.startX !== null ? 'grabbing' : 'grab',
        }}>

        {/* Cards stage */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {journals.map((j, i) => {
            const offset = i - active;
            const p = placement(offset);
            if (p.hide) return null;
            const isCenter = Math.abs(offset) < 0.5;
            return (
              <div key={j.name}
                onClick={(e) => {
                  // Ignore the click that ends a swipe \u2014 the drag travelled
                  // far enough to be a swipe, not a tap.
                  if (Math.abs(dragRef.current.lastDX) > 5) return;
                  // Any tapped journal goes straight into the editor for that
                  // journal. Arrow buttons + swipe handle carousel navigation.
                  j.isNew ? onJournalTap?.({ ...j, _new: true }, i)
                          : onJournalTap?.(j, i);
                }}
                style={{
                  position: 'absolute',
                  left: '50%', top: '50%',
                  width: 300, height: 420,
                  marginLeft: -150, marginTop: -210,
                  transform: `translate3d(${p.tx + dragDX}px, ${p.ty}px, 0) scale(${p.scale}) rotate(${p.rot}deg)`,
                  transition: dragRef.current.startX !== null
                    ? 'none'
                    : 'transform 420ms var(--ease-paper), opacity 420ms var(--ease-paper)',
                  transformOrigin: '50% 60%',
                  opacity: p.opacity,
                  zIndex: p.z,
                  cursor: 'pointer',
                  willChange: 'transform',
                }}>
                <JournalCover journal={j} active={isCenter} />
              </div>
            );
          })}
        </div>

        {/* Left arrow */}
        <button onClick={(e) => { e.stopPropagation(); prev(); }}
          disabled={active === 0}
          aria-label="Previous journal"
          style={arrowStyle('left', active === 0)}>
          <Icon name="back" size={28}/>
        </button>
        {/* Right arrow — back icon flipped */}
        <button onClick={(e) => { e.stopPropagation(); next(); }}
          disabled={active === journals.length - 1}
          aria-label="Next journal"
          style={arrowStyle('right', active === journals.length - 1)}>
          <span style={{ display:'inline-flex', transform: 'scaleX(-1)' }}>
            <Icon name="back" size={28}/>
          </span>
        </button>
      </div>

      {/* ── Page indicators ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 96,
        display: 'flex', justifyContent: 'center', gap: 8, zIndex: 4,
      }}>
        {journals.map((j, i) => (
          <button key={i} onClick={() => setActive(i)}
            aria-label={`Go to ${j.name}`}
            style={{
              width: i === active ? 24 : 8, height: 8, padding: 0,
              borderRadius: 999, border: 0, cursor: 'pointer',
              background: i === active ? 'var(--pp-forest, #4E6652)' : 'rgba(75,64,56,0.22)',
              transition: 'all 240ms var(--ease-paper)',
            }}/>
        ))}
      </div>
    </div>
  );
};

// ── helpers ───────────────────────────────────────────────────────────────
const topBtnStyle = (color) => ({
  width: 78, height: 56, borderRadius: 999,
  background: color,
  color: '#FFFDF6',
  border: '2px solid rgba(255,253,246,0.85)',
  boxShadow: '0 6px 12px -3px rgba(75,64,56,0.35), 0 2px 4px rgba(75,64,56,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  cursor: 'pointer',
  fontFamily: 'var(--font-ui)',
  fontSize: 14, fontWeight: 600,
  letterSpacing: '0.02em',
  transition: 'transform 180ms var(--ease-paper), box-shadow 180ms var(--ease-paper)',
});
const topBtnLabel = { fontSize: 14, letterSpacing: '0.01em' };

const arrowStyle = (side, disabled) => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: 18,
  width: 60, height: 60, borderRadius: '50%',
  background: 'rgba(255,253,246,0.95)',
  border: '1.5px solid var(--pp-hairline)',
  boxShadow: '0 6px 14px -4px rgba(75,64,56,0.30), 0 2px 4px rgba(75,64,56,0.15)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--fg-1)',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.35 : 1,
  zIndex: 7,
  transition: 'all 180ms var(--ease-paper)',
});

// Ad banner — placeholder slot styled like a folded paper coupon with a small
// "Remove ads" upgrade link. Real ad creative drops in here at runtime.
const AdBanner = ({ onUpgrade }) => (
  <div style={{
    width: '100%', height: '100%',
    background:
      'linear-gradient(180deg, #FFFDF6 0%, #F4ECDC 100%)',
    border: '1px solid var(--pp-hairline)',
    borderRadius: 12,
    boxShadow: '0 -2px 10px rgba(75,64,56,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 16,
    padding: '0 18px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* corner tab */}
    <div style={{
      position: 'absolute', top: 0, left: 0,
      width: 0, height: 0,
      borderTop: '14px solid rgba(75,64,56,0.10)',
      borderRight: '14px solid transparent',
    }}/>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 8,
        background: 'repeating-linear-gradient(45deg, #E8DCC4 0 8px, #DDD0B6 8px 16px)',
        display: 'grid', placeItems: 'center',
        color: 'var(--fg-3)', fontFamily: 'var(--font-paper)',
        fontSize: 10, letterSpacing: '0.18em',
      }}>AD</div>
      <div>
        <div style={{
          fontFamily: 'var(--font-paper)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-3)',
        }}>Sponsored</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--fg-1)',
          marginTop: 2,
        }}>Your advertisement here</div>
      </div>
    </div>
    <div/>
    <button onClick={onUpgrade}
      style={{
        height: 40, padding: '0 18px', borderRadius: 999,
        background: 'transparent',
        border: '1.5px solid var(--pp-hairline)',
        color: 'var(--fg-1)',
        fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        whiteSpace: 'nowrap',
      }}>
      <Icon name="sparkle" size={16}/>
      Remove ads with subscription
    </button>
  </div>
);

const SubscribedRibbon = () => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    color: 'var(--fg-2)',
    fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 18,
  }}>
    <span style={{ color: 'var(--pp-forest, #4E6652)' }}>
      <Icon name="sparkle" size={16}/>
    </span>
    Thank you for being a Paper &amp; Petals subscriber.
  </div>
);

Object.assign(window, { HomeScreen, JournalCover, SEED_JOURNALS });
