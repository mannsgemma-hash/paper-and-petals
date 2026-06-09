// SCR-03 Package Opening. First-open-of-the-day ritual:
// 1) wiggling postage box on parchment background
// 2) user taps → box "opens" (lid lifts, contents drift up)
// 3) soft cross-fade to the pack contents reveal
// 4) another tap → transitions to the craft room
//
// Three internal phases: 'closed' | 'opening' | 'reveal'
// `onContinue` fires on the final tap from the reveal phase.

const PackageOpening = ({ onContinue }) => {
  const [phase, setPhase] = React.useState('closed');

  const handleTap = () => {
    if (phase === 'closed') {
      setPhase('opening');
      window.setTimeout(() => setPhase('reveal'), 700);
    } else if (phase === 'reveal') {
      onContinue?.();
    }
  };

  return (
    <div
      onClick={handleTap}
      style={{
        width: '100%', height: '100%', position: 'relative',
        background:
          'radial-gradient(900px 600px at 50% 40%, rgba(255,253,246,0.7), transparent 70%),' +
          'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' +
          'var(--bg-2)',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
      }}>

      {/* Date eyebrow */}
      <div style={{
        position: 'absolute', top: 24, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-script)', fontStyle: 'italic',
        fontSize: 20, color: 'var(--fg-2)',
      }}>
        Thursday, 4 April
      </div>
      <div style={{
        position: 'absolute', top: 58, left: 0, right: 0,
        textAlign: 'center',
        fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
        color: 'var(--fg-3)', fontWeight: 600,
      }}>
        A small parcel has arrived
      </div>

      {/* Stage: closed box */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center',
        opacity: phase === 'reveal' ? 0 : 1,
        transition: 'opacity 480ms var(--ease-paper)',
        pointerEvents: phase === 'reveal' ? 'none' : 'auto',
      }}>
        <PostageBox phase={phase} />
      </div>

      {/* Stage: pack reveal */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center',
        opacity: phase === 'reveal' ? 1 : 0,
        transition: 'opacity 600ms var(--ease-paper)',
        pointerEvents: phase === 'reveal' ? 'auto' : 'none',
      }}>
        <PackReveal />
      </div>

      {/* Tap hint */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 38,
        textAlign: 'center',
        fontFamily: 'var(--font-ui)', fontSize: 12,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--fg-4)', fontWeight: 600,
        animation: 'tapHint 2.4s var(--ease-paper) infinite',
      }}>
        {phase === 'closed'  && 'Tap the parcel when you\u2019re ready'}
        {phase === 'opening' && '\u00A0'}
        {phase === 'reveal'  && 'Tap anywhere to step into your craft room'}
      </div>

      <style>{`
        @keyframes tapHint   { 0%, 100% { opacity: 0.55 } 50% { opacity: 1 } }
        @keyframes boxWiggle {
          0%, 100% { transform: rotate(-1.6deg) translateY(0); }
          25%      { transform: rotate(1.6deg)  translateY(-3px); }
          50%      { transform: rotate(-1.2deg) translateY(0); }
          75%      { transform: rotate(1.2deg)  translateY(-2px); }
        }
        @keyframes itemDrift {
          0%   { transform: translateY(40px) rotate(0); opacity: 0; }
          100% { transform: translateY(0)    rotate(var(--rot, 0deg)); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/* ─── The parcel itself ─────────────────────────────────────────── */
const PostageBox = ({ phase }) => {
  const opening = phase === 'opening';

  return (
    <div style={{
      position: 'relative', width: 320, height: 270,
      animation: phase === 'closed' ? 'boxWiggle 1.6s var(--ease-paper) infinite' : 'none',
      transition: 'transform 600ms var(--ease-paper)',
      transformOrigin: 'center bottom',
    }}>
      {/* Body */}
      <div style={{
        position: 'absolute', left: 20, right: 20, top: 70, bottom: 0,
        background: 'linear-gradient(180deg, #D2B58B 0%, #B89163 100%)',
        borderRadius: 6,
        boxShadow:
          '0 18px 24px -10px rgba(75,64,56,0.40),' +
          'inset 0 1px 0 rgba(255,255,255,0.3),' +
          'inset 0 -8px 14px rgba(75,64,56,0.18)',
      }}>
        {/* postage stamp */}
        <div style={{
          position: 'absolute', left: 22, top: 22, width: 60, height: 76,
          background: 'var(--pp-cream)',
          border: '2px dashed var(--pp-terracotta)',
          borderRadius: 2,
          padding: 4,
          boxShadow: '0 2px 4px rgba(75,64,56,0.20)',
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, var(--pp-terracotta) 0%, var(--pp-soft-rose) 100%)',
            borderRadius: 1,
          }}/>
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            color: 'var(--surface-card)',
            fontFamily: 'var(--font-display)', fontSize: 22,
            textShadow: '0 1px 0 rgba(75,64,56,0.5)',
          }}>P&amp;P</div>
        </div>

        {/* hand-stamped destination */}
        <div style={{
          position: 'absolute', right: 28, top: 30,
          fontFamily: 'var(--font-script)', fontStyle: 'italic',
          fontSize: 17, color: 'rgba(75,64,56,0.7)',
          transform: 'rotate(-3deg)',
        }}>
          For you,<br/>with care
        </div>

        {/* string tie - vertical and horizontal */}
        <div style={{
          position: 'absolute', left: '50%', top: -10, bottom: -2, width: 4,
          background: 'linear-gradient(180deg, #7A6B52, #4B4038)',
          transform: 'translateX(-50%)',
          opacity: opening ? 0 : 1,
          transition: 'opacity 400ms var(--ease-paper)',
        }}/>
        <div style={{
          position: 'absolute', top: '52%', left: -2, right: -2, height: 4,
          background: 'linear-gradient(90deg, #7A6B52, #4B4038, #7A6B52)',
          transform: 'translateY(-50%)',
          opacity: opening ? 0 : 1,
          transition: 'opacity 400ms var(--ease-paper)',
        }}/>
        {/* bow */}
        <div style={{
          position: 'absolute', left: '50%', top: 36,
          width: 38, height: 18,
          transform: 'translateX(-50%)',
          opacity: opening ? 0 : 1,
          transition: 'opacity 400ms var(--ease-paper)',
        }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 16, height: 16, borderRadius: '50%',
            background: 'transparent', border: '3px solid #4B4038', transform: 'rotate(-20deg)' }}/>
          <div style={{ position: 'absolute', right: 0, top: 0, width: 16, height: 16, borderRadius: '50%',
            background: 'transparent', border: '3px solid #4B4038', transform: 'rotate(20deg)' }}/>
        </div>
      </div>

      {/* Lid — opens by tilting back */}
      <div style={{
        position: 'absolute', left: 8, right: 8, top: 40, height: 60,
        background: 'linear-gradient(180deg, #DCC09A 0%, #C2A07A 100%)',
        borderRadius: 6,
        boxShadow:
          '0 6px 10px -4px rgba(75,64,56,0.35),' +
          'inset 0 1px 0 rgba(255,255,255,0.4)',
        transformOrigin: 'top center',
        transform: opening ? 'rotateX(-110deg) translateY(-30px)' : 'rotateX(0) translateY(0)',
        transition: 'transform 700ms var(--ease-paper)',
        zIndex: 3,
      }}>
        {/* lid stripe */}
        <div style={{
          position: 'absolute', left: '50%', top: 6, bottom: 6, width: 4,
          background: 'linear-gradient(180deg, #7A6B52, #4B4038)',
          transform: 'translateX(-50%)',
          opacity: opening ? 0 : 1,
          transition: 'opacity 300ms var(--ease-paper)',
        }}/>
      </div>

      {/* Tissue paper rising */}
      <div style={{
        position: 'absolute', left: 40, right: 40, top: 60, height: 90,
        background: 'linear-gradient(180deg, var(--pp-soft-rose) 0%, #EFE9E1 70%)',
        borderRadius: '4px 4px 0 0',
        opacity: opening ? 1 : 0,
        transform: opening ? 'translateY(-20px)' : 'translateY(20px)',
        transition: 'all 700ms var(--ease-paper)',
        boxShadow: '0 -4px 8px rgba(75,64,56,0.15)',
        clipPath: 'polygon(0 100%, 100% 100%, 100% 24%, 76% 12%, 50% 26%, 24% 8%, 0 22%)',
      }}/>
    </div>
  );
};

/* ─── Pack contents reveal ──────────────────────────────────────── */
const PackReveal = () => {
  // Floating items drift in
  const items = [
    { type: 'paper',  label: 'Vintage paper',  color: 'var(--pp-soft-rose)',  delay: 0,    rot: -4 },
    { type: 'flower', label: 'Pressed daisy',  color: 'var(--pp-muted-olive)', delay: 120,  rot: 3  },
    { type: 'stamp',  label: 'Postage stamp',  color: 'var(--pp-terracotta)', delay: 240,  rot: -6 },
    { type: 'seal',   label: 'Wax seal',       color: 'var(--pp-forest)',     delay: 360,  rot: 0  },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 22, paddingTop: 50,
    }}>
      <div className="eyebrow" style={{ color: 'var(--pp-forest)' }}>Today's delivery</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 400,
        fontSize: 38, margin: 0, color: 'var(--fg-1)',
        letterSpacing: '-0.005em', textAlign: 'center',
      }}>
        Four new pieces for your collection
      </h2>
      <p style={{
        fontFamily: 'var(--font-script)', fontStyle: 'italic',
        fontSize: 18, color: 'var(--fg-2)', margin: 0, textAlign: 'center', maxWidth: 480,
      }}>
        Saved straight to your craft room — nothing ever expires.
      </p>

      {/* Item row */}
      <div style={{ display: 'flex', gap: 28, marginTop: 16 }}>
        {items.map((it, i) => (
          <div key={i}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 10,
              animation: `itemDrift 520ms var(--ease-petal) ${it.delay}ms both`,
              ['--rot']: `${it.rot}deg`,
            }}>
            <PackTile item={it} />
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--fg-3)', fontWeight: 600 }}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PackTile = ({ item }) => {
  const base = {
    width: 110, height: 130,
    background: 'var(--pp-cream)',
    border: '1.5px solid var(--pp-hairline)',
    borderRadius: 4,
    boxShadow: 'var(--sh-tape)',
    position: 'relative',
    transform: `rotate(${item.rot}deg)`,
  };
  if (item.type === 'paper') {
    return (
      <div style={{ ...base,
        background: 'repeating-linear-gradient(0deg, #FFFDF6 0 14px, #F8F1E2 14px 15px)',
      }}/>
    );
  }
  if (item.type === 'flower') {
    return (
      <div style={base}>
        <div style={{ position: 'absolute', left: '46%', top: 30, bottom: 18, width: 2, background: item.color }}/>
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--pp-soft-rose)',
          boxShadow: 'inset 0 0 0 2px rgba(75,64,56,0.18)',
        }}/>
        {[0,1,2].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            left: i === 0 ? 14 : i === 1 ? 'auto' : 34,
            right: i === 1 ? 14 : 'auto',
            top: 50 + i * 18,
            width: 22, height: 10,
            background: item.color, opacity: 0.55,
            borderRadius: '12px 2px 12px 2px',
            transform: `rotate(${i * 22 - 18}deg)`,
          }}/>
        ))}
      </div>
    );
  }
  if (item.type === 'stamp') {
    return (
      <div style={{ ...base, border: `2px dashed ${item.color}`, padding: 8 }}>
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, ${item.color}77, ${item.color}33)`,
          borderRadius: 2,
        }}/>
      </div>
    );
  }
  if (item.type === 'seal') {
    return (
      <div style={{ ...base, background: 'transparent', border: 'none', boxShadow: 'none',
        display: 'grid', placeItems: 'center' }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${item.color}, #2F4032)`,
          boxShadow: '0 6px 10px rgba(75,64,56,0.35)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 10,
            border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '50%' }}/>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontSize: 22,
            color: 'rgba(255,253,246,0.85)',
          }}>P</div>
        </div>
      </div>
    );
  }
  return null;
};

Object.assign(window, { PackageOpening });
