// Modal overlay used by SCR-23 Settings to show legal / long-form documents
// such as Terms of Service and Privacy Policy.
//
// LegalDocument is a presentational shell:
//   <LegalDocument title="Terms of Service" effective="27 May 2026" onClose={...}>
//     ...rich content nodes (headings + paragraphs + lists)...
//   </LegalDocument>
//
// LegalModal wraps it in a scrim and animates in. Esc and the close button
// dismiss; clicking the scrim does too. The body locks scroll while open.

const LegalModal = ({ open, onClose, children }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(45,38,30,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'grid', placeItems: 'center',
        padding: 24,
        animation: 'pp-scrim-in 200ms var(--ease-paper) both',
      }}>
      <style>{`
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720, maxHeight: '100%',
          display: 'flex', flexDirection: 'column',
          animation: 'pp-modal-in 280ms var(--ease-paper) both',
        }}>
        {children}
      </div>
    </div>
  );
};

const LegalDocument = ({ title, effective, onClose, children }) => (
  <div style={{
    background: 'var(--surface-card, #FFFDF6)',
    borderRadius: 18,
    border: '1px solid var(--pp-hairline)',
    boxShadow:
      '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--font-ui)',
    maxHeight: '100%',
  }}>
    {/* Header */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 44px',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid var(--pp-hairline)',
      background:
        'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-paper)',
          fontSize: 11, letterSpacing: '0.22em',
          color: 'var(--fg-3)',
          textTransform: 'uppercase',
        }}>Legal</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24, color: 'var(--fg-1)',
          lineHeight: 1.1, marginTop: 4,
          letterSpacing: '-0.005em',
        }}>{title}</div>
        {effective && (
          <div style={{
            fontFamily: 'var(--font-script)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--fg-3)', marginTop: 4,
          }}>Effective {effective}</div>
        )}
      </div>
      <button onClick={onClose}
        aria-label="Close"
        style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--surface-card)',
          border: '1px solid var(--pp-hairline)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--fg-1)',
          boxShadow: '0 2px 4px rgba(75,64,56,0.10)',
        }}>
        <Icon name="close" size={18}/>
      </button>
    </div>

    {/* Body — scrolling rich-text */}
    <div style={{
      overflowY: 'auto',
      padding: '20px 28px 28px',
      lineHeight: 1.6,
      fontSize: 14,
      color: 'var(--fg-1)',
    }}>
      {children}
    </div>

    {/* Footer */}
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
      gap: 10,
      padding: '14px 20px',
      borderTop: '1px solid var(--pp-hairline)',
      background: 'rgba(247,242,232,0.7)',
    }}>
      <button onClick={onClose}
        style={{
          height: 44, padding: '0 22px', borderRadius: 999,
          background: 'var(--pp-forest, #4E6652)',
          color: '#FFFDF6',
          border: 0,
          fontFamily: 'var(--font-ui)',
          fontSize: 14, fontWeight: 600,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          boxShadow: '0 4px 10px -2px rgba(78,102,82,0.45)',
        }}>Done</button>
    </div>
  </div>
);

// ── Markdown-ish rendering helpers ────────────────────────────────────────
// Tiny renderer specialised for the legal doc shape (H1/H2, paragraphs,
// bullet lists). Not a full markdown engine — keeps the output styled in
// the brand voice.

const LegalH2 = ({ children }) => (
  <h2 style={{
    fontFamily: 'var(--font-display)',
    fontSize: 17, color: 'var(--fg-1)',
    margin: '28px 0 8px',
    letterSpacing: '-0.005em',
    fontWeight: 600,
  }}>{children}</h2>
);

const LegalP = ({ children }) => (
  <p style={{ margin: '0 0 12px', color: 'var(--fg-2)' }}>{children}</p>
);

const LegalUL = ({ items }) => (
  <ul style={{
    margin: '0 0 14px',
    padding: '0 0 0 20px',
    color: 'var(--fg-2)',
  }}>
    {items.map((it, i) => (
      <li key={i} style={{ margin: '4px 0' }}>{it}</li>
    ))}
  </ul>
);

// Render a markdown string into our brand-styled blocks. Handles H1/H2,
// "- " bullet lists, blank-line separated paragraphs, **bold**, and
// auto-links email addresses. Enough for the legal docs we need.
const renderLegalMarkdown = (src) => {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let key = 0;

  const inline = (text) => {
    // bold
    const parts = [];
    const re = /\*\*([^*]+)\*\*/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push(<strong key={parts.length} style={{ color: 'var(--fg-1)' }}>{m[1]}</strong>);
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    // email autolink — flatten string parts and replace
    return parts.flatMap((p, idx) => {
      if (typeof p !== 'string') return [p];
      const segs = [];
      const er = /([\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;
      let l = 0, em;
      while ((em = er.exec(p)) !== null) {
        if (em.index > l) segs.push(p.slice(l, em.index));
        segs.push(
          <a key={`${idx}-${em.index}`} href={`mailto:${em[1]}`}
            style={{ color: 'var(--pp-terracotta)', textDecoration: 'underline' }}>{em[1]}</a>
        );
        l = em.index + em[0].length;
      }
      if (l < p.length) segs.push(p.slice(l));
      return segs;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^#\s+/.test(line)) {
      // H1 — skip (already shown in header)
      i++;
      continue;
    }

    if (/^##\s+/.test(line)) {
      out.push(<LegalH2 key={key++}>{line.replace(/^##\s+/, '')}</LegalH2>);
      i++;
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^-\s+/, '')));
        i++;
      }
      out.push(<LegalUL key={key++} items={items}/>);
      continue;
    }

    if (line.trim() === '') { i++; continue; }

    // paragraph — accumulate until blank line or block
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' &&
           !/^(#|-)/.test(lines[i])) {
      buf.push(lines[i]); i++;
    }
    out.push(<LegalP key={key++}>{inline(buf.join(' '))}</LegalP>);
  }
  return out;
};

// ── Document fetching ────────────────────────────────────────────────────
// Singleton cache so we only fetch each markdown file once per session.
const DOC_CACHE = {};

const useLegalDocument = (url) => {
  const [state, setState] = React.useState(() =>
    DOC_CACHE[url] ? { status: 'loaded', text: DOC_CACHE[url] } : { status: 'loading' }
  );
  React.useEffect(() => {
    if (DOC_CACHE[url]) {
      setState({ status: 'loaded', text: DOC_CACHE[url] });
      return;
    }
    let alive = true;
    fetch(url)
      .then((r) => r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((t) => {
        DOC_CACHE[url] = t;
        if (alive) setState({ status: 'loaded', text: t });
      })
      .catch((err) => alive && setState({ status: 'error', error: err.message }));
    return () => { alive = false; };
  }, [url]);
  return state;
};

// Concrete document modals — used by the Settings page.

const TermsOfServiceModal = ({ open, onClose }) => {
  const doc = useLegalDocument(
    '../../cozy-craft-journal/ProjectDocumentation/Terms_of_Service.md'
  );
  return (
    <LegalModal open={open} onClose={onClose}>
      <LegalDocument
        title="Terms of Service"
        effective="27 May 2026"
        onClose={onClose}>
        {doc.status === 'loading' && (
          <LegalP><em style={{ color: 'var(--fg-3)' }}>Loading…</em></LegalP>
        )}
        {doc.status === 'error' && (
          <LegalP>Sorry, we couldn’t load this document right now.</LegalP>
        )}
        {doc.status === 'loaded' && renderLegalMarkdown(doc.text)}
      </LegalDocument>
    </LegalModal>
  );
};

const PrivacyPolicyModal = ({ open, onClose }) => {
  const doc = useLegalDocument(
    '../../cozy-craft-journal/ProjectDocumentation/Privacy_Policy.md'
  );
  return (
    <LegalModal open={open} onClose={onClose}>
      <LegalDocument
        title="Privacy Policy"
        effective="27 May 2026"
        onClose={onClose}>
        {doc.status === 'loading' && (
          <LegalP><em style={{ color: 'var(--fg-3)' }}>Loading…</em></LegalP>
        )}
        {doc.status === 'error' && (
          <LegalP>Sorry, we couldn’t load this document right now.</LegalP>
        )}
        {doc.status === 'loaded' && renderLegalMarkdown(doc.text)}
      </LegalDocument>
    </LegalModal>
  );
};

Object.assign(window, {
  LegalModal, LegalDocument,
  TermsOfServiceModal, PrivacyPolicyModal,
  renderLegalMarkdown, useLegalDocument,
});
