// Feedback form modal — opened from SCR-23 Settings ("Send feedback").
//
// Collects a category, a message, and an optional email, then files it with our
// third-party feedback manager (Canny). Canny gives us a public feedback board,
// voting, status updates (Planned / In progress / Shipped) and changelog — so
// users can see what we're building and we triage in one place instead of a
// raw inbox. Two integration paths:
//   1. Widget  — Canny.render({ boardToken }) opens their hosted board in-app.
//   2. API     — POST to /v1/posts/create with the payload shaped below.
// In production set CANNY_BOARD_TOKEN; the prototype simulates a round-trip.

const CANNY_BOARD_TOKEN = 'pp_canny_board_xxxxxxxx';
const CANNY_BOARDS = { idea: 'Feature ideas', bug: 'Bug reports', love: 'Kind words' };

const FEEDBACK_TYPES = [
  { id: 'idea', label: 'An idea', icon: 'sparkle' },
  { id: 'bug',  label: 'A bug',   icon: 'shield'  },
  { id: 'love', label: 'Kind words', icon: 'heart' },
];

const FeedbackModal = ({ open, onClose }) => {
  const [type, setType] = React.useState('idea');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  // 'idle' | 'sending' | 'done'
  const [status, setStatus] = React.useState('idle');

  // Reset the form whenever the modal is opened fresh.
  React.useEffect(() => {
    if (open) { setType('idea'); setMessage(''); setEmail(''); setStatus('idle'); }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canSend = message.trim().length > 0 && status === 'idle';

  const submit = async () => {
    if (!canSend) return;
    setStatus('sending');
    // Shape matches Canny's POST /v1/posts/create.
    const payload = {
      boardID: CANNY_BOARDS[type],
      title: message.trim().slice(0, 60),
      details: message.trim(),
      authorEmail: email.trim() || null,
      customFields: { appVersion: '1.0.0', platform: 'app' },
      createdAt: new Date().toISOString(),
    };
    try {
      // Production: file the post on the Canny board (or open the Canny widget).
      // await fetch('https://canny.io/api/v1/posts/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey: CANNY_API_KEY, ...payload }),
      // });
      void CANNY_BOARD_TOKEN; void payload;
      await new Promise(r => setTimeout(r, 900)); // simulated round-trip
      setStatus('done');
    } catch (err) {
      // In the prototype we still resolve to 'done'; real code surfaces an error state.
      setStatus('done');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 60,
        background: 'rgba(45,38,30,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'grid', placeItems: 'center',
        padding: 24,
        animation: 'pp-scrim-in 200ms var(--ease-paper) both',
        fontFamily: 'var(--font-ui)',
      }}>
      <style>{`
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-fb-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pp-fb-field::placeholder { color: var(--pp-stone); }
        .pp-fb-field:focus { outline: none; border-color: var(--pp-forest, #4E6652); box-shadow: 0 0 0 3px rgba(78,102,82,0.12); }
      `}</style>

      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: 'var(--surface-card, #FFFDF6)',
          borderRadius: 18,
          border: '1px solid var(--pp-hairline)',
          boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
          overflow: 'hidden',
          animation: 'pp-fb-in 280ms var(--ease-paper) both',
        }}>

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 44px', alignItems: 'start',
          padding: '22px 24px 18px',
          borderBottom: '1px solid var(--pp-hairline)',
          background: 'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-paper)', fontSize: 11, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'var(--fg-3)',
            }}>We're listening</div>
            <h2 style={{
              margin: '6px 0 0', fontFamily: 'var(--font-display)', fontWeight: 400,
              fontSize: 26, letterSpacing: '-0.005em', color: 'var(--fg-1)',
            }}>Send feedback</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="pp-icon-btn"
            style={{ background: 'var(--surface-card)' }}>
            <Icon name="close" size={20}/>
          </button>
        </div>

        {status === 'done' ? (
          /* ── Thank-you state ─────────────────────────────────────────── */
          <div style={{ padding: '40px 28px 36px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 18px',
              display: 'grid', placeItems: 'center',
              background: 'rgba(78,102,82,0.12)', color: 'var(--pp-forest, #4E6652)',
            }}>
              <Icon name="check" size={30} stroke={2.4}/>
            </div>
            <h3 style={{
              margin: 0, fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22,
              color: 'var(--fg-1)',
            }}>Thank you — it's on its way</h3>
            <p style={{
              margin: '8px auto 0', maxWidth: 360, fontSize: 14, lineHeight: 1.5,
              color: 'var(--fg-3)',
            }}>Posted to our feedback board{email.trim() ? ', and we’ll email you when its status changes' : ''}. You can vote and follow along with what we build next.</p>
            <button onClick={onClose}
              style={{
                marginTop: 24, height: 46, padding: '0 26px', borderRadius: 999,
                background: 'var(--pp-forest, #4E6652)', color: '#FFFDF6', border: 0,
                fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                boxShadow: 'var(--sh-paper)',
              }}>Back to settings</button>
          </div>
        ) : (
          /* ── Form state ──────────────────────────────────────────────── */
          <div style={{ padding: '20px 24px 24px' }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)' }}>
              Share an idea, report a bug, or vote on what we build next. Your note is posted to our public feedback board so you can follow its progress.
            </p>

            {/* Type segmented control */}
            <div role="radiogroup" aria-label="Feedback type" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18,
            }}>
              {FEEDBACK_TYPES.map(t => {
                const active = t.id === type;
                return (
                  <button key={t.id} role="radio" aria-checked={active}
                    onClick={() => setType(t.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '14px 8px', borderRadius: 12, cursor: 'pointer',
                      background: active ? 'rgba(78,102,82,0.10)' : 'var(--bg-2)',
                      border: active ? '1.5px solid var(--pp-forest, #4E6652)' : '1.5px solid var(--pp-hairline)',
                      color: active ? 'var(--pp-forest, #4E6652)' : 'var(--fg-2)',
                      fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
                      transition: 'all 160ms var(--ease-paper)',
                    }}>
                    <Icon name={t.icon} size={20}/>
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Message */}
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)',
              letterSpacing: '0.04em', marginBottom: 6,
            }}>Your message</label>
            <textarea
              className="pp-fb-field"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind…"
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical',
                padding: '12px 14px', borderRadius: 12,
                border: '1.5px solid var(--pp-hairline)', background: 'var(--pp-cream, #FFFDF6)',
                fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.5,
                transition: 'border-color 160ms, box-shadow 160ms',
              }}/>

            {/* Email (optional) */}
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)',
              letterSpacing: '0.04em', margin: '16px 0 6px',
            }}>Email <span style={{ fontWeight: 500, color: 'var(--fg-3)' }}>(optional, if you'd like a reply)</span></label>
            <input
              className="pp-fb-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', boxSizing: 'border-box', height: 46,
                padding: '0 14px', borderRadius: 12,
                border: '1.5px solid var(--pp-hairline)', background: 'var(--pp-cream, #FFFDF6)',
                fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-1)',
                transition: 'border-color 160ms, box-shadow 160ms',
              }}/>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, marginTop: 22,
            }}>
              <span style={{ fontSize: 11.5, color: 'var(--fg-4)', lineHeight: 1.4, maxWidth: 240 }}>
                Posted to our feedback board, powered by Canny.
              </span>
              <button onClick={submit} disabled={!canSend}
                style={{
                  height: 46, padding: '0 26px', borderRadius: 999, border: 0,
                  background: canSend ? 'var(--pp-forest, #4E6652)' : 'rgba(78,102,82,0.35)',
                  color: '#FFFDF6', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600,
                  cursor: canSend ? 'pointer' : 'default',
                  display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                  boxShadow: canSend ? 'var(--sh-paper)' : 'none',
                  transition: 'background 160ms var(--ease-paper)',
                }}>
                {status === 'sending'
                  ? 'Posting…'
                  : (<><Icon name="mail" size={16}/> Post to board</>)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { FeedbackModal });
