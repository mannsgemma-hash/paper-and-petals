// SCR-01 Loading. Universal load splash.
// Parchment background, monogram seal cycling colourways, progress bar, and a
// rotating loading phrase that crossfades every 3 seconds.
// When `progress` reaches 1, the stage softly fades and `onComplete()` fires.
// Caller routes the user based on launch state (new user → Welcome, returning ·
// first today → Package, returning · later → Home).

const LOGO_COLORWAYS = [
  '../../assets/logos/logo_sage.png',
  '../../assets/logos/logo_terracotta.png',
  '../../assets/logos/logo_mauve.png',
  '../../assets/logos/logo_dusty_rose.png',
  '../../assets/logos/logo_blue.png',
  '../../assets/logos/logo_rose.png',
];

const LOADING_PHRASES = [
  'Tearing vintage paper',
  'Layering pretty things',
  'Pressing wildflowers',
  'Sorting the sticker drawer',
  'Hunting for ephemera',
  'Stitching paper scraps',
  'Adding washi tape',
  'Collecting tiny treasures',
  'Brewing creative ideas',
  'Flipping through old journals',
  'Arranging paper layers',
  'Inking botanical stamps',
  'Saving beautiful memories',
  'Drying flower petals',
  'Curating your craft desk',
  'Dusting off old postcards',
  'Organising the paper stash',
  'Snipping delicate florals',
  'Building cozy journal spreads',
  'Gathering scraps and stories',
  'Making fussy cuts',
];

const Loading = ({ progress = 0, onComplete }) => {
  const [logoIdx, setLogoIdx] = React.useState(0);
  // Randomise phrase start so each load doesn't always begin with "Tearing…".
  const [phraseIdx, setPhraseIdx] = React.useState(
    () => Math.floor(Math.random() * LOADING_PHRASES.length)
  );
  const [departing, setDeparting] = React.useState(false);

  // Cycle the logo colourway every 500ms.
  React.useEffect(() => {
    const id = setInterval(
      () => setLogoIdx((i) => (i + 1) % LOGO_COLORWAYS.length),
      500
    );
    return () => clearInterval(id);
  }, []);

  // Advance the loading phrase every 3 seconds.
  React.useEffect(() => {
    const id = setInterval(
      () => setPhraseIdx((i) => (i + 1) % LOADING_PHRASES.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  // Keep onComplete in a ref so the timer's closure always sees the latest
  // callback even if the host swaps it (e.g. user changes launchState).
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => { onCompleteRef.current = onComplete; });

  // When the bar fills, soft-fade and notify caller to route.
  // IMPORTANT: depend on `progress` only. If we depended on `departing`,
  // setting it would re-run the effect and the cleanup would cancel the
  // setTimeout we just scheduled.
  React.useEffect(() => {
    if (progress < 1) return;
    setDeparting(true);
    const t = setTimeout(() => onCompleteRef.current?.(), 420);
    return () => clearTimeout(t);
  }, [progress]);

  const loadingStyle = {
    width: '100%', height: '100%', position: 'relative',
    background:
      'radial-gradient(1200px 700px at 50% 40%, rgba(255,255,255,0.65), rgba(255,255,255,0) 65%),' +
      'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' +
      'var(--bg-1)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'flex-start',
    paddingTop: 96,
    fontFamily: 'var(--font-ui)',
    opacity: departing ? 0 : 1,
    transition: 'opacity 380ms var(--ease-paper)',
  };

  // Corner botanical placeholders — very low-opacity sprigs (placeholder art).
  const cornerSprig = (pos) => ({
    position: 'absolute', width: 110, height: 110,
    opacity: 0.16, pointerEvents: 'none',
    backgroundImage:
      'radial-gradient(circle at 30% 70%, var(--pp-sage) 0 8px, transparent 9px),' +
      'radial-gradient(circle at 55% 50%, var(--pp-muted-olive) 0 6px, transparent 7px),' +
      'radial-gradient(circle at 65% 70%, var(--pp-sage) 0 5px, transparent 6px),' +
      'radial-gradient(circle at 45% 35%, var(--pp-sage) 0 4px, transparent 5px)',
    ...pos,
  });

  return (
    <div style={loadingStyle}>
      <style>{`
        .pp-phrase {
          position: absolute; inset: 0;
          font-family: var(--font-paper);
          font-size: 12px;
          letter-spacing: 0.22em;
          color: var(--pp-stone);
          text-transform: uppercase;
        }
      `}</style>

      {/* corner botanicals (placeholder) */}
      <div style={cornerSprig({ top: 24, left: 24 })} />
      <div style={cornerSprig({ top: 24, right: 24, transform: 'scaleX(-1)' })} />
      <div style={cornerSprig({ bottom: 24, left: 24, transform: 'scaleY(-1)' })} />
      <div style={cornerSprig({ bottom: 24, right: 24, transform: 'scale(-1,-1)' })} />

      {/* logo seal — cycles through colourways every 500ms */}
      <div style={{ width: 260, height: 260, position: 'relative' }}>
        {LOGO_COLORWAYS.map((src, i) => (
          <img key={src} src={src} alt="Paper & Petals"
            style={{
              position: 'absolute', inset: 0,
              width: 260, height: 260,
              opacity: i === logoIdx ? 1 : 0,
              transition: 'opacity 240ms var(--ease-paper)',
              filter: 'drop-shadow(0 12px 32px rgba(75,64,56,.18))',
            }} />
        ))}
      </div>

      {/* rotating phrase (3s cadence, soft fade between) */}
      <div style={{
        marginTop: 14,
        height: 22,
        position: 'relative',
        width: 'min(640px, 86%)',
        textAlign: 'center',
      }}>
        <div className="pp-phrase">
          {LOADING_PHRASES[phraseIdx]}<span style={{ letterSpacing: '0.02em' }}>…</span>
        </div>
      </div>

      {/* progress bar */}
      <div style={{
        marginTop: 14,
        width: 220, height: 2, borderRadius: 999,
        background: 'var(--pp-hairline)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.min(1, progress) * 100}%`, height: '100%',
          background: 'var(--accent)',
          transition: 'width 320ms var(--ease-paper)',
        }} />
      </div>
    </div>
  );
};

Object.assign(window, { Loading, LOADING_PHRASES });
