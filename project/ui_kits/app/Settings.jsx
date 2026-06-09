// SCR-23 Settings.
//
// Single-column scrollable settings page with grouped cards. Calm, plain
// language. Top-left back arrow, "Settings" title centred, content area
// max-width 720 centred in the 1024x768 stage and scrolls internally.
//
// Sections, top to bottom:
//   1. Account            — local-first; an unobtrusive prompt to optionally
//                           create an account.
//   2. Membership         — subscription status + Restore purchases (required).
//   3. Preferences        — sound, haptics, seasonal monogram colourway, daily
//                           delivery time.
//   4. Notifications      — daily delivery reminder, new-pack alerts.
//   5. Privacy & data     — analytics opt-out, local backup note, export.
//   6. About              — version, credits, support, privacy, terms,
//                           and a quiet sign-out / clear-data row.

const settingsRowStyle = {
  display: 'grid',
  gridTemplateColumns: '32px 1fr auto',
  alignItems: 'center',
  gap: 16,
  minHeight: 64,
  padding: '14px 20px',
  fontFamily: 'var(--font-ui)',
  cursor: 'default',
};

const settingsRowDivider = {
  borderTop: '1px solid var(--pp-hairline)',
};

const SettingsRow = ({ icon, title, description, trailing, onClick, divider, danger }) => (
  <div
    onClick={onClick}
    style={{
      ...settingsRowStyle,
      ...(divider ? settingsRowDivider : null),
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background 160ms var(--ease-paper)',
    }}
    onMouseEnter={(e) => onClick && (e.currentTarget.style.background = 'rgba(75,64,56,0.03)')}
    onMouseLeave={(e) => onClick && (e.currentTarget.style.background = 'transparent')}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      display: 'grid', placeItems: 'center',
      color: danger ? 'var(--pp-terracotta)' : 'var(--pp-forest, #4E6652)',
      background: danger ? 'rgba(196,123,99,0.10)' : 'rgba(78,102,82,0.10)',
    }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: 15, fontWeight: 600,
        color: danger ? 'var(--pp-terracotta)' : 'var(--fg-1)',
        letterSpacing: '0.005em',
      }}>{title}</div>
      {description && (
        <div style={{
          fontSize: 13, color: 'var(--fg-3)',
          marginTop: 2, lineHeight: 1.35,
        }}>{description}</div>
      )}
    </div>
    {trailing && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg-3)' }}>
        {trailing}
      </div>
    )}
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange?.(!on)}
    aria-pressed={on}
    style={{
      width: 44, height: 26, borderRadius: 999,
      background: on ? 'var(--pp-forest, #4E6652)' : 'rgba(75,64,56,0.18)',
      border: 0, padding: 0,
      position: 'relative', cursor: 'pointer',
      transition: 'background 200ms var(--ease-paper)',
    }}>
    <span style={{
      position: 'absolute',
      top: 3, left: on ? 21 : 3,
      width: 20, height: 20, borderRadius: '50%',
      background: 'var(--surface-card)',
      boxShadow: '0 2px 4px rgba(75,64,56,0.30)',
      transition: 'left 200ms var(--ease-paper)',
    }}/>
  </button>
);

const ValuePill = ({ value }) => (
  <span style={{
    padding: '6px 12px', borderRadius: 999,
    background: 'var(--bg-2)',
    border: '1px solid var(--pp-hairline)',
    fontSize: 13, fontWeight: 600,
    color: 'var(--fg-2)',
    letterSpacing: '0.01em',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }}>{value}</span>
);

const ChevronEnd = () => (
  <span style={{ color: 'var(--pp-stone)', display: 'inline-flex' }}>
    <Icon name="chevron" size={18} stroke={2}/>
  </span>
);

const SectionCard = ({ eyebrow, children }) => (
  <section style={{ marginBottom: 28 }}>
    <div style={{
      fontFamily: 'var(--font-paper)',
      fontSize: 11, letterSpacing: '0.22em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase',
      padding: '0 8px 10px',
    }}>{eyebrow}</div>
    <div style={{
      background: 'var(--surface-card, #FFFDF6)',
      borderRadius: 16,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 2px 4px rgba(75,64,56,0.05), 0 12px 24px -16px rgba(75,64,56,0.12)',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  </section>
);

// Vintage stamp-style status badge — used for membership status, account state.
const StatusStamp = ({ tone = 'sage', children }) => {
  const palette = {
    sage:   { bg: 'rgba(78,102,82,0.10)', fg: 'var(--pp-forest, #4E6652)', border: 'rgba(78,102,82,0.30)' },
    cream:  { bg: 'rgba(75,64,56,0.06)',  fg: 'var(--fg-2)',              border: 'var(--pp-hairline)' },
    gold:   { bg: 'rgba(168,137,63,0.14)', fg: '#7E6322',                  border: 'rgba(168,137,63,0.45)' },
    terracotta: { bg: 'rgba(196,123,99,0.12)', fg: 'var(--pp-terracotta)', border: 'rgba(196,123,99,0.35)' },
  }[tone] || {};
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 999,
      background: palette.bg, color: palette.fg,
      border: `1px solid ${palette.border}`,
      fontFamily: 'var(--font-paper)', fontSize: 10,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      fontWeight: 600,
    }}>{children}</span>
  );
};

const Settings = ({ onBack, onManageSubscription, onStartSubscription, subscribed = false, onToggleSubscribed, device = 'tablet' }) => {
  const phone = device === 'phone';
  const [prefs, setPrefs] = React.useState({
    sound: true,
    haptics: true,
    autosave: true,
    notifyDelivery: true,
    notifyPacks: false,
    analytics: true,
  });
  // Account + sync state. In production this is owned by the auth/sync provider
  // (see Backend Integration Guide — e.g. Supabase Auth + a local-first sync
  // engine); signing in turns on automatic cross-device journal sync.
  const [account, setAccount] = React.useState({ signedIn: false, email: '', lastSynced: 'just now' });
  const signIn = () => setAccount({ signedIn: true, email: 'alice@papercraft.studio', lastSynced: 'just now' });
  const signOut = () => setAccount({ signedIn: false, email: '', lastSynced: '' });
  // Membership status is owned by the app shell so subscribing here also clears
  // the ad banners on Home (SCR-05) and the Journal Editor (SCR-07).
  // Which legal document, if any, is currently open as a modal.
  // 'terms' | 'privacy' | null
  const [legalDoc, setLegalDoc] = React.useState(null);
  // Feedback form modal (routes to the third-party feedback manager).
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);

  const setPref = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <div className="pp-stage" style={{
      width: '100%', height: '100%', position: 'relative',
      background:
        'radial-gradient(900px 600px at 50% 25%, rgba(255,253,246,0.65), rgba(255,253,246,0) 60%),' +
        'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' +
        'var(--bg-1)',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
    }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4,
        height: 76,
        display: 'grid',
        gridTemplateColumns: '76px 1fr 76px',
        alignItems: 'center',
        padding: '0 20px',
        background:
          'linear-gradient(180deg, rgba(255,253,246,0.72) 0%, rgba(255,253,246,0) 100%)',
      }}>
        <button onClick={onBack}
          aria-label="Back"
          className="pp-icon-btn"
          style={{ background: 'var(--surface-card)' }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 22, color: 'var(--fg-1)',
          letterSpacing: '-0.005em',
        }}>Settings</div>
        <div/>
      </div>

      {/* ── Scrollable content ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '92px 0 24px',
        overflowY: 'auto',
      }}>
        <div style={{
          maxWidth: 720, margin: '0 auto', padding: phone ? '0 14px' : '0 24px',
        }}>

          {/* ─── Account ───────────────────────────────────────────── */}
          <SectionCard eyebrow="Account & sync">
            {account.signedIn ? (
              <>
                <SettingsRow
                  icon="user"
                  title={account.email}
                  description="Signed in. Your journals back up and sync automatically across every device you use."
                  trailing={<StatusStamp tone="sage">Synced</StatusStamp>}/>
                <SettingsRow
                  divider
                  icon="refresh"
                  title="Automatic sync"
                  description={`Last synced ${account.lastSynced}. Changes save in the background — no manual saving needed.`}
                  trailing={<ValuePill value="On"/>}/>
              </>
            ) : (
              <>
                <SettingsRow
                  icon="user"
                  title="Playing locally"
                  description="Your journals live on this device. Create a free account to back them up and sync across devices."
                  trailing={<StatusStamp tone="cream">Local only</StatusStamp>}/>
                <SettingsRow
                  divider
                  icon="sparkle"
                  title="Create account & turn on sync"
                  description="Back up your journals and pick up on any device — phone or tablet. Takes a moment."
                  trailing={<ChevronEnd/>}
                  onClick={signIn}/>
              </>
            )}
          </SectionCard>

          {/* ─── Membership ────────────────────────────────────────── */}
          <SectionCard eyebrow="Membership">
            <SettingsRow
              icon="crown"
              title={subscribed ? 'Paper & Petals premium' : 'Paper & Petals free'}
              description={
                subscribed
                  ? 'Renews monthly. Includes all seasonal packs and the premium daily delivery.'
                  : 'Subscribe to unlock seasonal packs and the richer premium daily delivery.'
              }
              trailing={
                subscribed
                  ? <StatusStamp tone="gold">Premium</StatusStamp>
                  : <StatusStamp tone="cream">Free</StatusStamp>
              }/>
            <SettingsRow
              divider
              icon={subscribed ? 'settings' : 'sparkle'}
              title={subscribed ? 'Manage subscription' : 'Start subscription'}
              description={subscribed
                ? 'Change plan, pause, or cancel at any time. You keep everything you\u2019ve collected.'
                : 'A small monthly fee. Cancel any time \u2014 your items and journals are yours forever.'}
              trailing={<ChevronEnd/>}
              onClick={() => {
                // For demo only \u2014 in product, this navigates to SCR-24 Subscription.
                if (subscribed) { onManageSubscription?.(); }
                else { onStartSubscription?.(); }
                onToggleSubscribed?.();
              }}/>
            <SettingsRow
              divider
              icon="refresh"
              title="Restore purchases"
              description="Restore packs and subscriptions from your App Store account."
              trailing={<ChevronEnd/>}
              onClick={() => {}}/>
          </SectionCard>

          {/* ─── Preferences ───────────────────────────────────────── */}
          <SectionCard eyebrow="Preferences">
            <SettingsRow
              icon="volume"
              title="Sound effects"
              description="Soft paper rustles when you place an item."
              trailing={<Toggle on={prefs.sound} onChange={(v) => setPref('sound', v)}/>}/>
            <SettingsRow
              divider
              icon="stamp"
              title="Haptic feedback"
              description="Gentle taps confirm presses on supported devices."
              trailing={<Toggle on={prefs.haptics} onChange={(v) => setPref('haptics', v)}/>}/>
            <SettingsRow
              divider
              icon="check"
              title="Autosave"
              description="Save journal spreads as you place items. We don\u2019t recommend turning this off."
              trailing={<Toggle on={prefs.autosave} onChange={(v) => setPref('autosave', v)}/>}/>
            <SettingsRow
              divider
              icon="package"
              title="Daily delivery time"
              description="When your daily parcel of items arrives."
              trailing={<><ValuePill value="9:00 AM"/><ChevronEnd/></>}
              onClick={() => {}}/>
            <SettingsRow
              divider
              icon="flower"
              title="Logo colourway"
              description="Choose which monogram seal greets you on the loading screen."
              trailing={<><ValuePill value="Sage"/><ChevronEnd/></>}
              onClick={() => {}}/>
          </SectionCard>

          {/* ─── Notifications ─────────────────────────────────────── */}
          <SectionCard eyebrow="Notifications">
            <SettingsRow
              icon="bell"
              title="Daily delivery reminder"
              description="A soft nudge when your parcel of items is ready."
              trailing={<Toggle on={prefs.notifyDelivery} onChange={(v) => setPref('notifyDelivery', v)}/>}/>
            <SettingsRow
              divider
              icon="gift"
              title="New seasonal packs"
              description="Hear about new collections \u2014 about once a month."
              trailing={<Toggle on={prefs.notifyPacks} onChange={(v) => setPref('notifyPacks', v)}/>}/>
          </SectionCard>

          {/* ─── Privacy & data ────────────────────────────────────── */}
          <SectionCard eyebrow="Privacy & data">
            <SettingsRow
              icon="shield"
              title="Anonymous usage analytics"
              description="Helps us improve the app. Never includes your journal content."
              trailing={<Toggle on={prefs.analytics} onChange={(v) => setPref('analytics', v)}/>}/>
            <SettingsRow
              divider
              icon="archive"
              title="Export your journals"
              description="Save all of your journals as a single archive you can keep."
              trailing={<ChevronEnd/>}
              onClick={() => {}}/>
            <SettingsRow
              divider
              icon="doc"
              title="Privacy policy"
              trailing={<ChevronEnd/>}
              onClick={() => setLegalDoc('privacy')}/>
            <SettingsRow
              divider
              icon="doc"
              title="Terms of service"
              trailing={<ChevronEnd/>}
              onClick={() => setLegalDoc('terms')}/>
          </SectionCard>

          {/* ─── About ─────────────────────────────────────────────── */}
          <SectionCard eyebrow="About">
            <SettingsRow
              icon="info"
              title="Version"
              trailing={<span style={{
                fontFamily: 'var(--font-paper)', fontSize: 12,
                letterSpacing: '0.14em', color: 'var(--fg-3)',
              }}>1.0.0 · MAY 2026</span>}/>
            <SettingsRow
              divider
              icon="mail"
              title="Send feedback"
              description="Share an idea, report a bug, or vote on what we build next — it opens our feedback board."
              trailing={<ChevronEnd/>}
              onClick={() => setFeedbackOpen(true)}/>
            {account.signedIn && (
              <SettingsRow
                divider
                danger
                icon="logout"
                title="Sign out"
                trailing={<ChevronEnd/>}
                onClick={signOut}/>
            )}
          </SectionCard>

          {/* Closing flourish */}
          <div style={{
            textAlign: 'center',
            marginTop: 8, marginBottom: 16,
            fontFamily: 'var(--font-script)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--pp-stone)',
          }}>
            with care, from the Paper&nbsp;<span style={{ color: 'var(--pp-terracotta)' }}>&amp;</span>&nbsp;Petals studio
          </div>
        </div>
      </div>

      {/* Legal document modals — stack above the settings page. */}
      <TermsOfServiceModal
        open={legalDoc === 'terms'}
        onClose={() => setLegalDoc(null)}/>
      <PrivacyPolicyModal
        open={legalDoc === 'privacy'}
        onClose={() => setLegalDoc(null)}/>

      {/* Feedback form — routes to the third-party feedback manager. */}
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}/>
    </div>
  );
};

Object.assign(window, { Settings });
