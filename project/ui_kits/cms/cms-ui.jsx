// Shared CMS UI — icons, item thumbnail, status badge, tier toggle, helpers.

const CmsIcon = ({ name, size = 18, stroke = 1.75, ...rest }) => {
  const paths = {
    library:   <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 9v11"/></>,
    pack:      <><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v9"/></>,
    calendar:  <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></>,
    inbox:     <><path d="M4 13l2.5-8h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 13h4l1 2h6l1-2h4"/></>,
    search:    <><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></>,
    plus:      <><path d="M12 6v12M6 12h12"/></>,
    chevron:   <><path d="M9 6l6 6-6 6"/></>,
    flower:    <><circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c0-2 1-3.6 2.6-3.6S17 7.6 17 9.6M12 14.4c0 2 1 3.6 2.6 3.6S17 16.4 17 14.4M12 9.6c0-2-1-3.6-2.6-3.6S7 7.6 7 9.6M12 14.4c0 2-1 3.6-2.6 3.6S7 16.4 7 14.4"/></>,
    seal:      <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3.5"/></>,
    paper:     <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/></>,
    tape:      <><rect x="3" y="9" width="18" height="6" rx="1"/><path d="M3 12h18"/></>,
    card:      <><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18"/></>,
    frame:     <><rect x="4" y="4" width="16" height="16" rx="1"/><rect x="8" y="8" width="8" height="8"/></>,
    type:      <><path d="M5 6h14M12 6v12M9 18h6"/></>,
    paint:     <><path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/></>,
    fabric:    <><path d="M4 4h16v16H4z"/><path d="M4 4l16 16M20 4L4 20"/></>,
    charm:     <><circle cx="12" cy="14" r="5"/><path d="M12 9V5"/></>,
    star:      <><polygon points="12,4 14.2,9.4 20,9.8 15.6,13.6 17,19.4 12,16.2 7,19.4 8.4,13.6 4,9.8 9.8,9.4"/></>,
    heart:     <><path d="M12 20s-7-4-9-9c-1-3 1-6 4-6s4 3 5 4c1-1 2-4 5-4s5 3 4 6c-2 5-9 9-9 9z"/></>,
    collection:<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    idea:      <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3z"/></>,
    bug:       <><rect x="7" y="8" width="10" height="11" rx="5"/><path d="M9 8a3 3 0 0 1 6 0M4 12h3M17 12h3M4 17h3M17 17h3M12 8v11"/></>,
    check:     <><path d="M5 12l5 5L20 7"/></>,
    mail:      <><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></>,
    trash:     <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></>,
    clock:     <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></>,
    sparkle:   <><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></>,
    crown:     <><path d="M4 18h16M4 8l4 4 4-6 4 6 4-4v8H4z"/></>,
    lock:      <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || null}
    </svg>
  );
};

// Colored category-tone tile with the item's glyph.
const ItemThumb = ({ item, size = 40 }) => {
  const tone = window.CMS.CAT_TONE[item.category] || '#9A8A72';
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(160deg, ${tone}33, ${tone}1a)`,
      border: `1px solid ${tone}66`,
      display: 'grid', placeItems: 'center', color: tone,
    }}>
      <CmsIcon name={item.glyph} size={Math.round(size * 0.5)} stroke={1.8}/>
    </div>
  );
};

const STATUS_STYLE = {
  live:      { label: 'Live',      bg: 'rgba(78,102,82,0.12)',  fg: '#3F5443', dot: '#4E6652' },
  scheduled: { label: 'Scheduled', bg: 'rgba(168,137,63,0.16)', fg: '#7E6322', dot: '#C8A96B' },
  draft:     { label: 'Draft',     bg: 'rgba(75,64,56,0.08)',   fg: '#6B5E50', dot: '#9A8A72' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }}/>
      {s.label}
    </span>
  );
};

// Free / Paid segmented toggle.
const TierToggle = ({ tier, onChange }) => (
  <div style={{
    display: 'inline-flex', background: 'var(--bg-2)', borderRadius: 999,
    padding: 2, border: '1px solid var(--pp-hairline)',
  }}>
    {['free', 'paid'].map(t => {
      const active = tier === t;
      return (
        <button key={t} onClick={(e) => { e.stopPropagation(); onChange?.(t); }}
          style={{
            padding: '5px 14px', borderRadius: 999, border: 0, cursor: 'pointer',
            background: active ? (t === 'paid' ? 'var(--pp-antique-gold, #C8A96B)' : 'var(--pp-forest, #4E6652)') : 'transparent',
            color: active ? '#FFFDF6' : 'var(--fg-3)',
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
            textTransform: 'capitalize', letterSpacing: '0.02em',
            transition: 'all 150ms var(--ease-paper)',
          }}>{t}</button>
      );
    })}
  </div>
);

const fmtDate = (iso, opts) => {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', opts || { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtDayShort = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return { wd: d.toLocaleDateString('en-GB', { weekday: 'short' }), dm: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
};

Object.assign(window, { CmsIcon, ItemThumb, StatusBadge, TierToggle, fmtDate, fmtDayShort, STATUS_STYLE });
