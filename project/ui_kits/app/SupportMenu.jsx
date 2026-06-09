// SCR-22 Support Menu — modal overlay with four feedback categories.

const SupportMenu = ({ onClose, onSelect }) => {
  const options = [
    { id: 'bug',        icon: 'bug',     title: 'Report a bug',     hint: "Something isn't working." },
    { id: 'idea',       icon: 'bulb',    title: 'Suggest something', hint: "I have an idea." },
    { id: 'compliment', icon: 'heart',   title: 'Send a compliment', hint: "I love something." },
    { id: 'complaint',  icon: 'chat',    title: 'Share a concern',   hint: "Something feels off." },
  ];
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50,
      background: 'rgba(43, 42, 40, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: 440, padding: '28px 28px 22px',
          background: '#FFFDF6',
          borderRadius: 16,
          border: '1px solid var(--pp-hairline)',
          boxShadow: '0 30px 60px -20px rgba(75,64,56,0.45)',
        }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4, gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 26, margin: 0, letterSpacing: '-0.005em', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
            How can we help?
          </h2>
          <button className="pp-icon-btn" onClick={onClose} aria-label="Close" style={{ flexShrink: 0 }}>
            <Icon name="close" size={20}/>
          </button>
        </div>
        <p style={{ margin: '0 0 18px', color: 'var(--fg-3)', fontSize: 14, fontFamily: 'var(--font-script)', fontStyle: 'italic' }}>
          Pick whatever feels closest — we read every note.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map((o) => (
            <button key={o.id} onClick={() => onSelect?.(o.id)}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: 'var(--pp-cream)',
                border: '1.2px solid var(--pp-hairline)',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 60,
                transition: 'all 180ms var(--ease-paper)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--pp-cream)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
              <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: 'var(--accent)', borderRadius: 4 }}/>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'var(--bg-2)',
                display: 'grid', placeItems: 'center',
                color: 'var(--accent)',
              }}>
                <Icon name={o.icon} size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--fg-1)' }}>{o.title}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>{o.hint}</div>
              </div>
              <Icon name="back" size={16} style={{ transform: 'scaleX(-1)', color: 'var(--fg-4)' }}/>
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--pp-hairline-soft)', margin: '20px -4px 12px' }}/>

        <button onClick={() => onSelect?.('subscription')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 4px', background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--fg-2)', fontSize: 14,
          }}>
          <span>Manage my subscription</span>
          <Icon name="back" size={16} style={{ transform: 'scaleX(-1)', color: 'var(--fg-4)' }}/>
        </button>

        <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--fg-4)', letterSpacing: '0.04em' }}>
          Nothing here will affect your collection — your items and journals are yours forever.
        </p>
      </div>
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

Object.assign(window, { SupportMenu });
