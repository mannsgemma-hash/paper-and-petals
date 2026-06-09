// SCR-02 First-launch Welcome. Brand seal hero + intro form + onboarding CTAs.

const Welcome = ({ onBegin, onSubscribe, device = 'tablet' }) => {
  const phone = device === 'phone';
  const [form, setForm] = React.useState({ name: '', zip: '', email: '', dob: '' });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const canContinue = form.name.trim().length > 0;

  const fieldStyle = {
    fontFamily: 'var(--font-ui)',
    fontSize: 16,
    color: 'var(--fg-1)',
    background: 'var(--surface-card)',
    border: '1.5px solid var(--pp-hairline)',
    borderRadius: 6,
    padding: '11px 14px',
    minHeight: 46,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background:
        'radial-gradient(900px 600px at 50% 30%, rgba(255,255,255,0.6), transparent 70%),' +
        'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' +
        'var(--bg-2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: phone ? 'flex-start' : 'center',
      padding: phone ? '36px 20px' : '40px 56px', boxSizing: 'border-box',
      overflow: 'auto',
    }}>
      <img src="../../assets/logos/logo_terracotta.png"
        style={{ width: phone ? 104 : 140, height: phone ? 104 : 140, flexShrink: 0,
          filter: 'drop-shadow(0 8px 24px rgba(75,64,56,.16))' }} />

      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 400,
        fontSize: phone ? 38 : 48, margin: '12px 0 6px', color: 'var(--fg-1)',
        letterSpacing: '-0.005em', lineHeight: 1, whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'baseline', gap: phone ? 9 : 12,
      }}>
        <span>Paper</span>
        <em style={{
          fontFamily: 'var(--font-script)', fontStyle: 'italic',
          color: 'var(--pp-terracotta)', fontWeight: 500, fontSize: phone ? 42 : 52,
          lineHeight: 1, position: 'relative', top: 4,
        }}>&amp;</em>
        <span>Petals</span>
      </h1>

      <p style={{
        maxWidth: 480, textAlign: 'center', margin: '0 0 22px',
        fontFamily: 'var(--font-script)', fontStyle: 'italic',
        fontSize: phone ? 18 : 20, color: 'var(--fg-2)', lineHeight: 1.4,
      }}>
        Welcome! Let us get to know you a little better.
      </p>

      {/* Form */}
      <div style={{
        width: phone ? '100%' : 420, maxWidth: 420, display: 'grid', gap: 10,
        gridTemplateColumns: phone ? '1fr' : '1fr 1fr',
      }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Name <span style={{ color: 'var(--pp-terracotta)' }}>*</span>
          </label>
          <input style={fieldStyle} placeholder="What may we call you?" value={form.name} onChange={update('name')} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Email <span style={{ color: 'var(--fg-4)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>· optional</span>
          </label>
          <input type="email" style={fieldStyle} placeholder="you@somewhere.com" value={form.email} onChange={update('email')} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Zip <span style={{ color: 'var(--fg-4)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>· optional</span>
          </label>
          <input style={fieldStyle} placeholder="2000" value={form.zip} onChange={update('zip')} />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Date of birth <span style={{ color: 'var(--fg-4)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>· optional</span>
          </label>
          <input type="date" style={fieldStyle} value={form.dob} onChange={update('dob')} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22, alignItems: 'center',
        width: phone ? '100%' : 'auto', maxWidth: 420 }}>
        <button
          className="pp-btn pp-btn-primary pp-btn-pill"
          style={{ minWidth: phone ? 0 : 320, width: phone ? '100%' : 'auto', fontSize: 16,
            opacity: canContinue ? 1 : 0.6, cursor: canContinue ? 'pointer' : 'not-allowed' }}
          disabled={!canContinue}
          onClick={canContinue ? onSubscribe : undefined}>
          Subscribe &amp; continue
        </button>
        <button
          className="pp-btn pp-btn-ghost"
          style={{ minWidth: phone ? 0 : 320, width: phone ? '100%' : 'auto', fontSize: 14, color: 'var(--fg-2)',
            opacity: canContinue ? 1 : 0.5, cursor: canContinue ? 'pointer' : 'not-allowed' }}
          disabled={!canContinue}
          onClick={canContinue ? onBegin : undefined}>
          Continue without subscribing
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { Welcome });
