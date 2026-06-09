// SCR-24 Subscription Management. Cancel-first, no-dark-patterns.
//
// Value prop revisited (Jun 2026): the Home (SCR-05) and Editor (SCR-07) ad
// banners promise "Remove ads with subscription", so the benefit list now leads
// with an ad-free studio — closing the loop for anyone who arrives from a banner.
// Benefits are phrased as plain, calm promises; no urgency, no dark patterns.

const SUB_BENEFITS = [
  'A calm, ad-free studio — no banners, ever',
  'Three deliveries each morning, instead of one',
  'Every seasonal pack included, the day it opens',
  'One exclusive heirloom item each month',
  'Everything you collect stays yours, forever',
];

const Subscription = ({ onBack, status = 'active', device = 'tablet' }) => {
  const phone = device === 'phone';
  return (
    <div className="pp-stage" style={{ background: 'var(--bg-2)', overflow: 'auto' }}>
      <div className="pp-topbar" style={{ background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="pp-icon-btn circle" onClick={onBack}><Icon name="back" size={20}/></button>
          <div className="pp-topbar-title" style={phone ? { fontSize: 18 } : null}>Manage your subscription</div>
        </div>
      </div>

      <div style={{
        maxWidth: 560, margin: phone ? '24px auto' : '40px auto',
        padding: phone ? '0 16px' : '0 24px',
        display: 'flex', flexDirection: 'column', gap: phone ? 14 : 18,
      }}>
        {/* Status card */}
        <div className="pp-card-stitched">
          <div className="eyebrow" style={{ color: 'var(--pp-forest)' }}>
            {status === 'active' ? 'You are in The Cottage' : 'Free tier'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 400,
            fontSize: phone ? 25 : 30, margin: '6px 0 6px', letterSpacing: '-0.005em',
          }}>
            <em style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', color: 'var(--pp-terracotta)' }}>
              The Cottage
            </em> · monthly
          </h2>
          <p style={{ margin: '0 0 18px', color: 'var(--fg-2)', fontSize: phone ? 14 : 15 }}>
            $4.99 AUD per month. Renews on <strong>4 May 2026</strong>. You can cancel any time —
            no scripts, no scare screens.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 12px', alignItems: 'start' }}>
            {SUB_BENEFITS.map((line, i) => (
              <React.Fragment key={i}>
                <div style={{ width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--pp-sage)', display: 'grid', placeItems: 'center', color: '#FFFDF6',
                  marginTop: 1 }}>
                  <Icon name="check" size={14} stroke={2.4} />
                </div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.4, paddingTop: 2 }}>{line}</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Cancel first */}
        <div className="pp-card" style={{ padding: phone ? 18 : 22 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20, margin: '0 0 6px' }}>
            Cancel subscription
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--fg-2)' }}>
            Your deliveries will return to one per day. You'll keep everything you've collected.
          </p>
          <button className="pp-btn" style={{
            background: 'transparent', color: 'var(--pp-danger)',
            border: '1.5px solid var(--pp-danger)', minHeight: 48, borderRadius: 6,
            width: phone ? '100%' : 'auto',
          }}>
            Cancel subscription
          </button>
        </div>

        {/* Switch plan */}
        <div className="pp-card" style={{ padding: phone ? 18 : 22 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20, margin: '0 0 12px' }}>
            Switch to annual
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: phone ? 'column' : 'row',
            alignItems: phone ? 'stretch' : 'center',
            justifyContent: 'space-between', gap: 14,
          }}>
            <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>
              $39.99 a year — save roughly two months. No price tricks at renewal.
            </div>
            <button className="pp-btn pp-btn-primary" style={{ flexShrink: 0, width: phone ? '100%' : 'auto' }}>
              Switch to annual
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-4)', letterSpacing: '0.06em', marginBottom: 32 }}>
          Billed through the App Store · Cancel any time, no scare screens
        </p>
      </div>
    </div>
  );
};

Object.assign(window, { Subscription });
