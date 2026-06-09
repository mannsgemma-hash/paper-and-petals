/* @ds-bundle: {"format":3,"namespace":"PaperPetalsDesignSystem_b3b4be","components":[],"sourceHashes":{"design_handoff_build/theme.ts":"aa816446b5b1","ui_kits/app/FeedbackModal.jsx":"0909628b85e2","ui_kits/app/HomeScreen.jsx":"4d644710fd73","ui_kits/app/Icon.jsx":"307e80e9625b","ui_kits/app/JournalCovers.jsx":"8e4c7ebd696f","ui_kits/app/JournalEditor.jsx":"8c4d7a29ea06","ui_kits/app/LegalModal.jsx":"b15fc5b0adae","ui_kits/app/Loading.jsx":"03e8151226f3","ui_kits/app/PackageOpening.jsx":"882553043a68","ui_kits/app/Settings.jsx":"108b65a99402","ui_kits/app/Shop.jsx":"3640673d2f9a","ui_kits/app/Subscription.jsx":"bc416f98ace2","ui_kits/app/SupportMenu.jsx":"e27588c973a5","ui_kits/app/Welcome.jsx":"ccc30734d739","ui_kits/cms/Feedback.jsx":"be8b9f9f60c3","ui_kits/cms/Library.jsx":"c1c3fd8f9f59","ui_kits/cms/Packs.jsx":"6ef2d2dfbe23","ui_kits/cms/Schedule.jsx":"9c7703d29978","ui_kits/cms/cms-ui.jsx":"651cd665a1d6","ui_kits/cms/data.js":"ab59dfbee285"},"inlinedExternals":[],"unexposedExports":[{"name":"border","sourcePath":"design_handoff_build/theme.ts"},{"name":"color","sourcePath":"design_handoff_build/theme.ts"},{"name":"font","sourcePath":"design_handoff_build/theme.ts"},{"name":"fontSize","sourcePath":"design_handoff_build/theme.ts"},{"name":"layout","sourcePath":"design_handoff_build/theme.ts"},{"name":"letterSpacing","sourcePath":"design_handoff_build/theme.ts"},{"name":"lineHeight","sourcePath":"design_handoff_build/theme.ts"},{"name":"motion","sourcePath":"design_handoff_build/theme.ts"},{"name":"palette","sourcePath":"design_handoff_build/theme.ts"},{"name":"radius","sourcePath":"design_handoff_build/theme.ts"},{"name":"shadow","sourcePath":"design_handoff_build/theme.ts"},{"name":"space","sourcePath":"design_handoff_build/theme.ts"},{"name":"theme","sourcePath":"design_handoff_build/theme.ts"}]} */

(() => {

const __ds_ns = (window.PaperPetalsDesignSystem_b3b4be = window.PaperPetalsDesignSystem_b3b4be || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// design_handoff_build/theme.ts
try { (() => {
/**
 * Paper & Petals — Design tokens (typed)
 * Translation of colors_and_type.css. Import this everywhere; never hard-code hex.
 *   import { theme } from '@/theme/theme';
 */

const palette = {
  // Surfaces — warm paper backgrounds, layered light → dark
  warmWhite: '#F8F7F4',
  softLinen: '#EFE9E1',
  vintagePaper: '#E5D8C8',
  cream: '#FFFDF6',
  // Primary accents — muted, dusty, never saturated
  terracotta: '#C47B63',
  sage: '#87937C',
  dustyBlue: '#8FA3B8',
  mauve: '#A98C98',
  // Deep accents — CTAs / journal covers
  forest: '#4E6652',
  forestDeep: '#3B4E3F',
  // Text
  charcoal: '#2B2A28',
  espresso: '#4B4038',
  stone: '#9A8A72',
  stoneWarm: '#7A6B52',
  // Highlights
  antiqueGold: '#C8A96B',
  softRose: '#D7B7B0',
  mutedOlive: '#7A7D5C',
  // Borders / semantic
  hairline: '#C8BC9E',
  hairlineSoft: 'rgba(123,107,82,0.18)',
  stitch: 'rgba(75,64,56,0.35)',
  success: '#7A8F6E',
  warning: '#C8A96B',
  danger: '#B26A5A'
};
const color = {
  bg1: palette.warmWhite,
  // canvas
  bg2: palette.softLinen,
  // secondary surface
  bg3: palette.vintagePaper,
  // tinted panel
  surface: palette.cream,
  // lifted card / paper sheet

  fg1: palette.charcoal,
  // primary text
  fg2: palette.espresso,
  // secondary text
  fg3: palette.stoneWarm,
  // tertiary / labels
  fg4: palette.stone,
  // muted / disabled

  accent: palette.forest,
  accentHover: palette.forestDeep,
  accentSoft: palette.sage,
  highlight: palette.antiqueGold
};
const font = {
  display: 'Spectral',
  // headings, screen titles
  ui: 'NunitoSans',
  // body & functional UI
  script: 'EBGaramond-Italic',
  // pull-quotes, the &, soft lines
  flourish: 'PinyonScript',
  // ornamental hero moments only
  paper: 'Spectral' // small-caps labels
};
const fontSize = {
  h1: 42,
  h2: 32,
  h3: 24,
  bodyLg: 18,
  body: 16,
  caption: 13,
  micro: 11
};
const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  body: 1.55,
  loose: 1.65
};
const letterSpacing = {
  display: -0.005,
  ui: 0.005,
  label: 0.16,
  micro: 0.20 // em
};

/** Spacing scale — multiples of 4. Use generously: calm > dense. */
const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  11: 80,
  12: 96
};
const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999
};
const border = {
  hair: 1,
  card: 1.5,
  cover: 3
};

/** Shadows — soft, layered, paper-like. RN shadow props (iOS) + elevation (Android). */
const shadow = {
  paper: {
    shadowColor: '#4B4038',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6
    },
    elevation: 2
  },
  card: {
    shadowColor: '#4B4038',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 14
    },
    elevation: 4
  },
  lift: {
    shadowColor: '#4B4038',
    shadowOpacity: 0.28,
    shadowRadius: 40,
    shadowOffset: {
      width: 0,
      height: 24
    },
    elevation: 8
  },
  tape: {
    shadowColor: '#4B4038',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6
    },
    elevation: 3
  }
};

/** Motion — easing as cubic-bezier control points + durations (ms). */
const motion = {
  easePaper: [0.32, 0.72, 0.32, 1],
  // slow settle (default for page transitions)
  easePetal: [0.22, 1, 0.36, 1],
  // drift in
  easePress: [0.4, 0.0, 0.2, 1],
  durFast: 150,
  durBase: 240,
  durSlow: 480,
  durPage: 600
};

/** Layout — the prototype canvas + editor rails. */
const layout = {
  tabletW: 1024,
  tabletH: 768,
  phoneBreakpoint: 700,
  // < this → phone reflow
  sidebarW: 110,
  toolPaletteW: 68,
  pageStripW: 68
};
const theme = {
  palette,
  color,
  font,
  fontSize,
  lineHeight,
  letterSpacing,
  space,
  radius,
  border,
  shadow,
  motion,
  layout
};
Object.assign(__ds_scope, { palette, color, font, fontSize, lineHeight, letterSpacing, space, radius, border, shadow, motion, layout, theme });
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_build/theme.ts", error: String((e && e.message) || e) }); }

// ui_kits/app/FeedbackModal.jsx
try { (() => {
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
const CANNY_BOARDS = {
  idea: 'Feature ideas',
  bug: 'Bug reports',
  love: 'Kind words'
};
const FEEDBACK_TYPES = [{
  id: 'idea',
  label: 'An idea',
  icon: 'sparkle'
}, {
  id: 'bug',
  label: 'A bug',
  icon: 'shield'
}, {
  id: 'love',
  label: 'Kind words',
  icon: 'heart'
}];
const FeedbackModal = ({
  open,
  onClose
}) => {
  const [type, setType] = React.useState('idea');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  // 'idle' | 'sending' | 'done'
  const [status, setStatus] = React.useState('idle');

  // Reset the form whenever the modal is opened fresh.
  React.useEffect(() => {
    if (open) {
      setType('idea');
      setMessage('');
      setEmail('');
      setStatus('idle');
    }
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose?.();
    };
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
      customFields: {
        appVersion: '1.0.0',
        platform: 'app'
      },
      createdAt: new Date().toISOString()
    };
    try {
      // Production: file the post on the Canny board (or open the Canny widget).
      // await fetch('https://canny.io/api/v1/posts/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey: CANNY_API_KEY, ...payload }),
      // });
      void CANNY_BOARD_TOKEN;
      void payload;
      await new Promise(r => setTimeout(r, 900)); // simulated round-trip
      setStatus('done');
    } catch (err) {
      // In the prototype we still resolve to 'done'; real code surfaces an error state.
      setStatus('done');
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      background: 'rgba(45,38,30,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      animation: 'pp-scrim-in 200ms var(--ease-paper) both',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-fb-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pp-fb-field::placeholder { color: var(--pp-stone); }
        .pp-fb-field:focus { outline: none; border-color: var(--pp-forest, #4E6652); box-shadow: 0 0 0 3px rgba(78,102,82,0.12); }
      `), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 520,
      background: 'var(--surface-card, #FFFDF6)',
      borderRadius: 18,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
      overflow: 'hidden',
      animation: 'pp-fb-in 280ms var(--ease-paper) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 44px',
      alignItems: 'start',
      padding: '22px 24px 18px',
      borderBottom: '1px solid var(--pp-hairline)',
      background: 'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-paper)',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--fg-3)'
    }
  }, "We're listening"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '6px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 26,
      letterSpacing: '-0.005em',
      color: 'var(--fg-1)'
    }
  }, "Send feedback")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    className: "pp-icon-btn",
    style: {
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  }))), status === 'done' ?
  /*#__PURE__*/
  /* ── Thank-you state ─────────────────────────────────────────── */
  React.createElement("div", {
    style: {
      padding: '40px 28px 36px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      margin: '0 auto 18px',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(78,102,82,0.12)',
      color: 'var(--pp-forest, #4E6652)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 30,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 22,
      color: 'var(--fg-1)'
    }
  }, "Thank you \u2014 it's on its way"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px auto 0',
      maxWidth: 360,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--fg-3)'
    }
  }, "Posted to our feedback board", email.trim() ? ', and we’ll email you when its status changes' : '', ". You can vote and follow along with what we build next."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 24,
      height: 46,
      padding: '0 26px',
      borderRadius: 999,
      background: 'var(--pp-forest, #4E6652)',
      color: '#FFFDF6',
      border: 0,
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: 'var(--sh-paper)'
    }
  }, "Back to settings")) :
  /*#__PURE__*/
  /* ── Form state ──────────────────────────────────────────────── */
  React.createElement("div", {
    style: {
      padding: '20px 24px 24px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--fg-2)'
    }
  }, "Share an idea, report a bug, or vote on what we build next. Your note is posted to our public feedback board so you can follow its progress."), /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": "Feedback type",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
      marginBottom: 18
    }
  }, FEEDBACK_TYPES.map(t => {
    const active = t.id === type;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "radio",
      "aria-checked": active,
      onClick: () => setType(t.id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 8px',
        borderRadius: 12,
        cursor: 'pointer',
        background: active ? 'rgba(78,102,82,0.10)' : 'var(--bg-2)',
        border: active ? '1.5px solid var(--pp-forest, #4E6652)' : '1.5px solid var(--pp-hairline)',
        color: active ? 'var(--pp-forest, #4E6652)' : 'var(--fg-2)',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: 600,
        transition: 'all 160ms var(--ease-paper)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 20
    }), t.label);
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--fg-2)',
      letterSpacing: '0.04em',
      marginBottom: 6
    }
  }, "Your message"), /*#__PURE__*/React.createElement("textarea", {
    className: "pp-fb-field",
    value: message,
    onChange: e => setMessage(e.target.value),
    placeholder: "Tell us what's on your mind\u2026",
    rows: 4,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      resize: 'vertical',
      padding: '12px 14px',
      borderRadius: 12,
      border: '1.5px solid var(--pp-hairline)',
      background: 'var(--pp-cream, #FFFDF6)',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--fg-1)',
      lineHeight: 1.5,
      transition: 'border-color 160ms, box-shadow 160ms'
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--fg-2)',
      letterSpacing: '0.04em',
      margin: '16px 0 6px'
    }
  }, "Email ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--fg-3)'
    }
  }, "(optional, if you'd like a reply)")), /*#__PURE__*/React.createElement("input", {
    className: "pp-fb-field",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@example.com",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 46,
      padding: '0 14px',
      borderRadius: 12,
      border: '1.5px solid var(--pp-hairline)',
      background: 'var(--pp-cream, #FFFDF6)',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--fg-1)',
      transition: 'border-color 160ms, box-shadow 160ms'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--fg-4)',
      lineHeight: 1.4,
      maxWidth: 240
    }
  }, "Posted to our feedback board, powered by Canny."), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    disabled: !canSend,
    style: {
      height: 46,
      padding: '0 26px',
      borderRadius: 999,
      border: 0,
      background: canSend ? 'var(--pp-forest, #4E6652)' : 'rgba(78,102,82,0.35)',
      color: '#FFFDF6',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      fontWeight: 600,
      cursor: canSend ? 'pointer' : 'default',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
      boxShadow: canSend ? 'var(--sh-paper)' : 'none',
      transition: 'background 160ms var(--ease-paper)'
    }
  }, status === 'sending' ? 'Posting…' : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16
  }), " Post to board"))))));
};
Object.assign(window, {
  FeedbackModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/FeedbackModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/HomeScreen.jsx
try { (() => {
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
const SEED_JOURNALS = [{
  id: 'j-spring',
  name: 'Spring',
  frontCover: 'leather-cognac',
  backCover: 'leather-cognac',
  items: 18,
  edited: '2 days ago'
}, {
  id: 'j-autumn',
  name: 'Autumn Library',
  frontCover: 'leather-cognac',
  backCover: 'leather-cognac',
  items: 24,
  edited: 'yesterday'
}, {
  id: 'j-coastal',
  name: 'Coastal',
  frontCover: 'leather-cognac',
  backCover: 'leather-cognac',
  items: 12,
  edited: '5 days ago'
}, {
  id: 'j-romantic',
  name: 'Romantic',
  frontCover: 'leather-cognac',
  backCover: 'leather-cognac',
  items: 9,
  edited: '1 week ago'
}, {
  id: 'j-cottage',
  name: 'Cottagecore',
  frontCover: 'leather-cognac',
  backCover: 'leather-cognac',
  items: 31,
  edited: '3 hours ago'
}, {
  id: 'j-fieldnotes',
  name: 'Field Notes',
  frontCover: 'leather-cognac',
  backCover: 'leather-cognac',
  items: 7,
  edited: 'today'
}, {
  isNew: true,
  id: 'j-new'
}];

// One journal cover card on the carousel. Front cover preset renders
// full-bleed inside a paper-bound card frame: rounded spine on the left,
// ribbon bookmark, brass label plate with the journal name + last edited.
// `isNew` renders the dashed empty slot.
const JournalCover = ({
  journal,
  active
}) => {
  if (journal.isNew) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        background: 'repeating-linear-gradient(0deg, transparent 0 5px, rgba(75,64,56,0.04) 5px 6px),' + 'linear-gradient(180deg, #F4ECDC 0%, #E6DAC0 100%)',
        borderRadius: '4px 10px 10px 4px',
        border: '2px dashed rgba(75,64,56,0.32)',
        boxShadow: active ? '0 22px 40px -10px rgba(75,64,56,0.30), 0 4px 8px rgba(75,64,56,0.10)' : '0 10px 22px -8px rgba(75,64,56,0.22)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        color: 'var(--fg-2)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '2px solid rgba(75,64,56,0.30)',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: 56,
        color: 'rgba(75,64,56,0.55)',
        background: 'rgba(255,253,246,0.4)'
      }
    }, "\uFF0B"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-script)',
        fontStyle: 'italic',
        fontSize: 22,
        color: 'var(--fg-1)',
        textAlign: 'center',
        padding: '0 24px'
      }
    }, "Start a new journal"));
  }
  const preset = COVER_BY_ID[journal.frontCover] || COVER_BY_ID[DEFAULT_FRONT_COVER];
  // Pick a brass-on-cream label tint that works on every cover; the brass
  // plate is intentionally consistent so the user’s shelf reads as a set.
  const inkLight = preset?.ink === 'light';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '4px 10px 10px 4px',
      boxShadow: active ? '0 24px 44px -10px rgba(45,38,30,0.50), 0 6px 10px rgba(45,38,30,0.22), inset 0 1px 0 rgba(255,253,246,0.18)' : '0 12px 26px -8px rgba(45,38,30,0.36), inset 0 1px 0 rgba(255,253,246,0.14)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CoverArt, {
    cover: journal.frontCover
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 18,
      background: 'linear-gradient(90deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 70%, transparent 100%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      bottom: 14,
      left: 26,
      right: 14,
      border: `1.5px dashed ${inkLight ? 'rgba(255,253,246,0.50)' : 'rgba(75,64,56,0.28)'}`,
      borderRadius: 4,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '54%',
      bottom: '14%',
      transform: 'translateX(-50%)',
      width: '74%',
      minHeight: 64,
      background: 'linear-gradient(180deg, #F0DFA6 0%, #D6BD78 45%, #A8893F 100%)',
      borderRadius: 4,
      border: '1px solid #7E6322',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 2px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 14px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      lineHeight: 1.1,
      color: '#3A2C0F',
      letterSpacing: '0.005em',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, journal.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 12,
      color: '#5A4A1F',
      marginTop: 2,
      letterSpacing: '0.02em'
    }
  }, journal.items, " items \xB7 ", journal.edited)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 36,
      top: -2,
      width: 16,
      height: 56,
      background: inkLight ? 'linear-gradient(180deg, #FFFDF6 0%, #E6DAC0 100%)' : 'linear-gradient(180deg, #C47B63 0%, #8C5440 100%)',
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
      filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.25))',
      pointerEvents: 'none'
    }
  }));
};
const HomeScreen = ({
  journals: journalsProp,
  onJournalTap,
  onShop,
  onSettings,
  subscribed = false
}) => {
  const journals = journalsProp || SEED_JOURNALS;
  const [active, setActive] = React.useState(0);
  const [dragDX, setDragDX] = React.useState(0);
  const dragRef = React.useRef({
    startX: null,
    lastDX: 0
  });
  const next = React.useCallback(() => {
    setActive(a => Math.min(a + 1, journals.length - 1));
  }, [journals.length]);
  const prev = React.useCallback(() => {
    setActive(a => Math.max(a - 1, 0));
  }, []);

  // Keyboard ←/→
  React.useEffect(() => {
    const onKey = e => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
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
  const onPointerDown = e => {
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current.startX = e.clientX;
    dragRef.current.lastDX = 0;
    dragRef.current.captured = false;
  };
  const onPointerMove = e => {
    if (dragRef.current.startX === null) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.lastDX = dx;
    // Begin capturing only once this is unmistakably a drag.
    if (!dragRef.current.captured && Math.abs(dx) > DRAG_THRESHOLD) {
      dragRef.current.captured = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    if (dragRef.current.captured) setDragDX(dx);
  };
  const endDrag = e => {
    if (dragRef.current.startX === null) return;
    const dx = dragRef.current.lastDX;
    const wasDrag = dragRef.current.captured;
    dragRef.current.startX = null;
    dragRef.current.captured = false;
    setDragDX(0);
    if (wasDrag && Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
    // Reset travel on the next tick so the card's click handler (which checks
    // lastDX to distinguish tap from swipe) still sees the real drag distance.
    requestAnimationFrame(() => {
      dragRef.current.lastDX = 0;
    });
  };
  const stage = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'var(--font-ui)',
    background: 'radial-gradient(900px 600px at 50% 35%, rgba(255,253,246,0.70), rgba(255,253,246,0) 60%),' + 'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' + 'var(--bg-1)'
  };

  // Per-journal placement relative to active index.
  // Step = horizontal offset between adjacent cards; sideScale shrinks neighbours.
  const STEP = 280;
  const placement = offset => {
    const a = Math.abs(offset);
    if (a > 2.4) return {
      hide: true
    };
    const sgn = Math.sign(offset);
    // Toca-Boca-style: neighbours sit a step out, scaled & tilted.
    const scale = a < 0.5 ? 1 : a < 1.5 ? 0.74 : 0.52;
    const tx = offset * STEP * (a < 1.5 ? 1 : 1.05);
    const rot = a < 0.5 ? 0 : sgn * (a < 1.5 ? 5 : 9);
    const ty = a < 0.5 ? 0 : a < 1.5 ? 14 : 26;
    const opacity = a < 0.5 ? 1 : a < 1.5 ? 0.95 : 0.40;
    const z = 10 - Math.round(a * 2);
    return {
      scale,
      tx,
      ty,
      rot,
      opacity,
      z
    };
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "pp-stage",
    style: stage
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 22,
      left: 24,
      zIndex: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/logo_sage.png",
    alt: "",
    style: {
      width: 64,
      height: 64,
      filter: 'drop-shadow(0 6px 12px rgba(75,64,56,.20))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--fg-1)',
      lineHeight: 1,
      letterSpacing: '-0.005em'
    }
  }, "Paper\xA0", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      color: 'var(--pp-terracotta)',
      fontWeight: 500
    }
  }, "&"), "\xA0Petals")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 24,
      right: 24,
      zIndex: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onShop,
    title: "Shop & packs",
    style: topBtnStyle('var(--pp-terracotta)')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shop",
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: topBtnLabel
  }, "Shop")), /*#__PURE__*/React.createElement("button", {
    onClick: onSettings,
    title: "Settings",
    style: topBtnStyle('var(--pp-sage)')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: topBtnLabel
  }, "Settings"))), /*#__PURE__*/React.createElement("div", {
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 96,
      bottom: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      touchAction: 'pan-y',
      cursor: dragRef.current.startX !== null ? 'grabbing' : 'grab'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%'
    }
  }, journals.map((j, i) => {
    const offset = i - active;
    const p = placement(offset);
    if (p.hide) return null;
    const isCenter = Math.abs(offset) < 0.5;
    return /*#__PURE__*/React.createElement("div", {
      key: j.name,
      onClick: e => {
        // Ignore the click that ends a swipe \u2014 the drag travelled
        // far enough to be a swipe, not a tap.
        if (Math.abs(dragRef.current.lastDX) > 5) return;
        // Any tapped journal goes straight into the editor for that
        // journal. Arrow buttons + swipe handle carousel navigation.
        j.isNew ? onJournalTap?.({
          ...j,
          _new: true
        }, i) : onJournalTap?.(j, i);
      },
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 300,
        height: 420,
        marginLeft: -150,
        marginTop: -210,
        transform: `translate3d(${p.tx + dragDX}px, ${p.ty}px, 0) scale(${p.scale}) rotate(${p.rot}deg)`,
        transition: dragRef.current.startX !== null ? 'none' : 'transform 420ms var(--ease-paper), opacity 420ms var(--ease-paper)',
        transformOrigin: '50% 60%',
        opacity: p.opacity,
        zIndex: p.z,
        cursor: 'pointer',
        willChange: 'transform'
      }
    }, /*#__PURE__*/React.createElement(JournalCover, {
      journal: j,
      active: isCenter
    }));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      prev();
    },
    disabled: active === 0,
    "aria-label": "Previous journal",
    style: arrowStyle('left', active === 0)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 28
  })), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      next();
    },
    disabled: active === journals.length - 1,
    "aria-label": "Next journal",
    style: arrowStyle('right', active === journals.length - 1)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      transform: 'scaleX(-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 28
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 96,
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      zIndex: 4
    }
  }, journals.map((j, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setActive(i),
    "aria-label": `Go to ${j.name}`,
    style: {
      width: i === active ? 24 : 8,
      height: 8,
      padding: 0,
      borderRadius: 999,
      border: 0,
      cursor: 'pointer',
      background: i === active ? 'var(--pp-forest, #4E6652)' : 'rgba(75,64,56,0.22)',
      transition: 'all 240ms var(--ease-paper)'
    }
  }))));
};

// ── helpers ───────────────────────────────────────────────────────────────
const topBtnStyle = color => ({
  width: 78,
  height: 56,
  borderRadius: 999,
  background: color,
  color: '#FFFDF6',
  border: '2px solid rgba(255,253,246,0.85)',
  boxShadow: '0 6px 12px -3px rgba(75,64,56,0.35), 0 2px 4px rgba(75,64,56,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  cursor: 'pointer',
  fontFamily: 'var(--font-ui)',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.02em',
  transition: 'transform 180ms var(--ease-paper), box-shadow 180ms var(--ease-paper)'
});
const topBtnLabel = {
  fontSize: 14,
  letterSpacing: '0.01em'
};
const arrowStyle = (side, disabled) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [side]: 18,
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'rgba(255,253,246,0.95)',
  border: '1.5px solid var(--pp-hairline)',
  boxShadow: '0 6px 14px -4px rgba(75,64,56,0.30), 0 2px 4px rgba(75,64,56,0.15)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--fg-1)',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.35 : 1,
  zIndex: 7,
  transition: 'all 180ms var(--ease-paper)'
});

// Ad banner — placeholder slot styled like a folded paper coupon with a small
// "Remove ads" upgrade link. Real ad creative drops in here at runtime.
const AdBanner = ({
  onUpgrade
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #FFFDF6 0%, #F4ECDC 100%)',
    border: '1px solid var(--pp-hairline)',
    borderRadius: 12,
    boxShadow: '0 -2px 10px rgba(75,64,56,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 16,
    padding: '0 18px',
    position: 'relative',
    overflow: 'hidden'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderTop: '14px solid rgba(75,64,56,0.10)',
    borderRight: '14px solid transparent'
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 56,
    height: 56,
    borderRadius: 8,
    background: 'repeating-linear-gradient(45deg, #E8DCC4 0 8px, #DDD0B6 8px 16px)',
    display: 'grid',
    placeItems: 'center',
    color: 'var(--fg-3)',
    fontFamily: 'var(--font-paper)',
    fontSize: 10,
    letterSpacing: '0.18em'
  }
}, "AD"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-paper)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--fg-3)'
  }
}, "Sponsored"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-display)',
    fontSize: 17,
    color: 'var(--fg-1)',
    marginTop: 2
  }
}, "Your advertisement here"))), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("button", {
  onClick: onUpgrade,
  style: {
    height: 40,
    padding: '0 18px',
    borderRadius: 999,
    background: 'transparent',
    border: '1.5px solid var(--pp-hairline)',
    color: 'var(--fg-1)',
    fontFamily: 'var(--font-ui)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "sparkle",
  size: 16
}), "Remove ads with subscription"));
const SubscribedRibbon = () => /*#__PURE__*/React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: 'var(--fg-2)',
    fontFamily: 'var(--font-script)',
    fontStyle: 'italic',
    fontSize: 18
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'var(--pp-forest, #4E6652)'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "sparkle",
  size: 16
})), "Thank you for being a Paper & Petals subscriber.");
Object.assign(window, {
  HomeScreen,
  JournalCover,
  SEED_JOURNALS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Tabler-style outline icons used across the kit. Stroke inherits from currentColor.
// 24×24 viewBox, 1.75 stroke, rounded caps.

const Icon = ({
  name,
  size = 22,
  stroke = 1.75,
  ...rest
}) => {
  const paths = {
    home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 12L12 5l7 7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 11v8h10v-8"
    })),
    undo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 7L4 12l5 5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 12h11a5 5 0 0 1 0 10h-1"
    })),
    redo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M15 7l5 5-5 5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 12H9a5 5 0 0 0 0 10h1"
    })),
    scissors: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "6",
      r: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "18",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.5 8.5L20 20M8.5 15.5L20 4"
    })),
    ribbon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M8 3l4 5 4-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 3l-3 6 7 12 7-12-3-6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v13"
    })),
    bag: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 9h14l-1.2 10.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 9V6a3 3 0 0 1 6 0v3"
    })),
    book: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 17a3 3 0 0 1 3-3h11"
    })),
    archive: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "6",
      width: "16",
      height: "4",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 14h4"
    })),
    window: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 12h16M12 4v16"
    })),
    shop: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 9h16l-1.5 10.5a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 9V6a3 3 0 0 1 6 0v3"
    })),
    settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
    })),
    mail: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 6h16v12H4z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 7l8 6 8-6"
    })),
    back: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M15 6l-6 6 6 6"
    })),
    close: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M19 5L5 19M5 5l14 14"
    })),
    add: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 6v12M6 12h12"
    })),
    edit: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14 6l4 4"
    })),
    share: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "12",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "6",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "18",
      r: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11l8-4M8 13l8 4"
    })),
    star: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
      points: "12,4 14.5,9.5 20.5,10 16,14.5 17.2,20.5 12,17.5 6.8,20.5 8,14.5 3.5,10 9.5,9.5"
    })),
    heart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"
    })),
    bug: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 9V6a3 3 0 0 1 6 0v3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 13h14M5 17h14M5 9h14"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9v12"
    })),
    bulb: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 18h6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 21h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3z"
    })),
    chat: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 12a8 8 0 1 1-3-6.3L21 4l-1.3 3.7A8 8 0 0 1 21 12z"
    })),
    flag: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 21V4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 4h11l-2 4 2 4H5"
    })),
    check: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 7"
    })),
    sparkle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3v6M12 15v6M3 12h6M15 12h6"
    })),
    scissors: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "6",
      r: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "18",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.5 8.5L20 20M8.5 15.5L20 4"
    })),
    pencil: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"
    })),
    stamp: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 21h14"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "14",
      width: "12",
      height: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 14V9a3 3 0 0 1 6 0v5"
    })),
    border: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "1",
      strokeDasharray: "3 3"
    })),
    paper: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 3h9l4 4v14H6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 3v4h4"
    })),
    flower: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "2.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9.6c0-2 1-3.6 2.6-3.6S17 7.6 17 9.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 14.4c0 2 1 3.6 2.6 3.6S17 16.4 17 14.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9.6c0-2-1-3.6-2.6-3.6S7 7.6 7 9.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 14.4c0 2-1 3.6-2.6 3.6S7 16.4 7 14.4"
    })),
    package: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 8l9-5 9 5M3 8v9l9 5M3 8l9 5M21 8v9l-9 5M21 8l-9 5M12 13v9"
    })),
    user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"
    })),
    bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 19a2 2 0 0 0 4 0"
    })),
    shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"
    })),
    info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8h.01M11 12h1v4h1"
    })),
    volume: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 10v4h4l5 4V6L8 10z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 8a5 5 0 0 1 0 8"
    })),
    refresh: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 11a8 8 0 1 0-2 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 5v6h-6"
    })),
    trash: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 7h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 11v6M14 11v6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
    })),
    chevron: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    })),
    crown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 18h18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 8l4 4 5-6 5 6 4-4v10H3z"
    })),
    moon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"
    })),
    gift: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "9",
      width: "16",
      height: "11",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 9h18M12 9v11"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 9a3 3 0 0 1 0-6c2 0 3 3 3 6-1 0-3 0-3 0z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 9a3 3 0 0 0 0-6c-2 0-3 3-3 6 1 0 3 0 3 0z"
    })),
    doc: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 3h9l4 4v14H6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 3v4h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 13h6M9 17h6M9 9h2"
    })),
    logout: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 8l4 4-4 4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 12H9"
    })),
    image: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "5",
      width: "18",
      height: "14",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "10",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 17l4-4 3 3 4-5 3 4"
    })),
    palette: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3a9 9 0 0 0 0 18c2 0 2-1 1.5-2.5S13 16 14.5 16H17a4 4 0 0 0 4-4 9 9 0 0 0-9-9z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "11",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "16",
      cy: "10",
      r: "1"
    })),
    seal: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 5v-2M12 19v2M5 12h-2M19 12h2"
    })),
    layers: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l9 5-9 5-9-5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 13l9 5 9-5"
    })),
    grip: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M8 8h8M8 12h8M8 16h8"
    })),
    leaf: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 19c4-13 14-14 14-14s-1 10-14 14z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 12L18 6"
    })),
    heart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 20s-7-4-9-9c-1-3 1-6 4-6s4 3 5 4c1-1 2-4 5-4s5 3 4 6c-2 5-9 9-9 9z"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, rest), paths[name] || null);
};
Object.assign(window, {
  Icon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/JournalCovers.jsx
try { (() => {
// Journal cover designs.
//
// A library of cover presets the user can pick from for the front and back
// of their journal. Each preset has an `id`, a human label, a category,
// and a `render()` that paints the cover with CSS — so it scales cleanly
// from the home-screen thumbnail (300×420) up to the editor cover surface
// (340×465 within the spread).
//
// Exports:
//   COVER_PRESETS           — the array of all presets, grouped by category.
//   COVER_BY_ID             — id → preset lookup map.
//   <CoverArt cover>        — renders a preset by id, fills its container.
//   <CoverPickerModal …>    — full picker UI (front/back tabs, category list,
//                             swatch grid) for the editor.

const COVER_CATEGORIES = [{
  id: 'leather',
  label: 'Leather bound'
}, {
  id: 'linen',
  label: 'Linen & cloth'
}, {
  id: 'floral',
  label: 'Floral'
}, {
  id: 'pattern',
  label: 'Patterned'
}, {
  id: 'solid',
  label: 'Solid colours'
}, {
  id: 'vintage',
  label: 'Vintage paper'
}];

// ── Pattern / texture helpers ────────────────────────────────────────────

// A reusable "paper grain" overlay used by most covers to keep them tactile.
const paperGrain = (opacity = 0.20) => ({
  position: 'absolute',
  inset: 0,
  opacity,
  mixBlendMode: 'overlay',
  pointerEvents: 'none',
  backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,253,246,0.25), transparent 35%),' + 'radial-gradient(circle at 80% 70%, rgba(0,0,0,0.18), transparent 40%),' + 'radial-gradient(circle at 65% 20%, rgba(255,253,246,0.15), transparent 30%)'
});

// Leather: deep radial + diagonal hairlines for grain.
const leatherFill = (base, top) => ({
  background: `radial-gradient(circle at 30% 30%, ${top} 0%, ${base} 70%),` + 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 5px)'
});

// Linen: two perpendicular hairline grids over a soft gradient.
const linenFill = (a, b) => ({
  background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px),` + `repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px),` + `linear-gradient(180deg, ${a} 0%, ${b} 100%)`
});

// SVG floral pattern — small ditsy flower repeat.
const ditsyFloralSVG = (petal, leaf, bg) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
      <rect width='80' height='80' fill='${bg}'/>
      <g fill='${petal}' opacity='0.85'>
        <circle cx='20' cy='20' r='3'/>
        <circle cx='16' cy='16' r='3'/>
        <circle cx='24' cy='16' r='3'/>
        <circle cx='16' cy='24' r='3'/>
        <circle cx='24' cy='24' r='3'/>
        <circle cx='60' cy='60' r='3'/>
        <circle cx='56' cy='56' r='3'/>
        <circle cx='64' cy='56' r='3'/>
        <circle cx='56' cy='64' r='3'/>
        <circle cx='64' cy='64' r='3'/>
      </g>
      <g fill='${leaf}' opacity='0.65'>
        <ellipse cx='40' cy='40' rx='3' ry='8' transform='rotate(30 40 40)'/>
        <ellipse cx='40' cy='40' rx='3' ry='8' transform='rotate(-30 40 40)'/>
      </g>
      <g fill='${petal}' opacity='0.55'>
        <circle cx='20' cy='60' r='2'/>
        <circle cx='60' cy='20' r='2'/>
      </g>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// Bigger botanical sprig pattern.
const botanicalSVG = (stem, accent, bg) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
      <rect width='120' height='120' fill='${bg}'/>
      <g stroke='${stem}' stroke-width='1.2' fill='none' opacity='0.65'>
        <path d='M30 110 Q 36 70, 30 30'/>
        <path d='M30 90 Q 18 80, 14 70' />
        <path d='M30 70 Q 42 60, 46 50' />
        <path d='M30 50 Q 18 42, 14 32' />
        <path d='M90 10 Q 84 50, 90 90'/>
        <path d='M90 30 Q 102 40, 106 50' />
        <path d='M90 50 Q 78 60, 74 70' />
        <path d='M90 70 Q 102 78, 106 88' />
      </g>
      <g fill='${accent}' opacity='0.5'>
        <ellipse cx='14' cy='70' rx='5' ry='2.4' transform='rotate(-30 14 70)'/>
        <ellipse cx='46' cy='50' rx='5' ry='2.4' transform='rotate(30 46 50)'/>
        <ellipse cx='106' cy='50' rx='5' ry='2.4' transform='rotate(30 106 50)'/>
        <ellipse cx='74' cy='70' rx='5' ry='2.4' transform='rotate(-30 74 70)'/>
      </g>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// Marbled paper — wavy curves over a tinted base.
const marbledSVG = (a, b, c) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <rect width='200' height='200' fill='${a}'/>
      <g fill='none' stroke-width='1.5' opacity='0.55'>
        <path stroke='${b}' d='M0 30 Q 50 10, 100 30 T 200 30'/>
        <path stroke='${b}' d='M0 60 Q 50 80, 100 60 T 200 60'/>
        <path stroke='${c}' d='M0 100 Q 50 80, 100 100 T 200 100'/>
        <path stroke='${b}' d='M0 140 Q 50 160, 100 140 T 200 140'/>
        <path stroke='${c}' d='M0 170 Q 50 150, 100 170 T 200 170'/>
      </g>
      <g fill='${c}' opacity='0.35'>
        <ellipse cx='30' cy='30' rx='25' ry='3' transform='rotate(-15 30 30)'/>
        <ellipse cx='160' cy='90' rx='25' ry='3' transform='rotate(10 160 90)'/>
        <ellipse cx='80' cy='170' rx='25' ry='3' transform='rotate(-10 80 170)'/>
      </g>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// ── Cover presets ────────────────────────────────────────────────────────

const COVER_PRESETS = [
// ── Leather ─────────────────────────────────────────────────────────
{
  id: 'leather-cognac',
  label: 'Cognac leather',
  category: 'leather',
  style: {
    ...leatherFill('#4B3320', '#6F4F35')
  },
  ink: 'light'
}, {
  id: 'leather-oxblood',
  label: 'Oxblood leather',
  category: 'leather',
  style: {
    ...leatherFill('#3B1818', '#5A2222')
  },
  ink: 'light'
}, {
  id: 'leather-forest',
  label: 'Forest leather',
  category: 'leather',
  style: {
    ...leatherFill('#243A2A', '#39553D')
  },
  ink: 'light'
}, {
  id: 'leather-ink',
  label: 'Ink leather',
  category: 'leather',
  style: {
    ...leatherFill('#191815', '#2E2C28')
  },
  ink: 'light'
},
// ── Linen ────────────────────────────────────────────────────────────
{
  id: 'linen-cream',
  label: 'Cream linen',
  category: 'linen',
  style: {
    ...linenFill('#F4ECDC', '#E6DAC0')
  },
  ink: 'dark'
}, {
  id: 'linen-sage',
  label: 'Sage linen',
  category: 'linen',
  style: {
    ...linenFill('#B6BFA5', '#8FA088')
  },
  ink: 'dark'
}, {
  id: 'linen-mauve',
  label: 'Mauve linen',
  category: 'linen',
  style: {
    ...linenFill('#C9AEB5', '#A98C98')
  },
  ink: 'dark'
}, {
  id: 'linen-coastal',
  label: 'Coastal linen',
  category: 'linen',
  style: {
    ...linenFill('#B8C7D2', '#8FA3B8')
  },
  ink: 'dark'
},
// ── Floral ───────────────────────────────────────────────────────────
{
  id: 'floral-wildrose',
  label: 'Wild rose',
  category: 'floral',
  style: {
    backgroundColor: '#F2E2DC',
    backgroundImage: ditsyFloralSVG('#C47B63', '#7C8E6B', '#F4E6DE'),
    backgroundSize: '110px 110px'
  },
  ink: 'dark'
}, {
  id: 'floral-meadow',
  label: 'Meadow flowers',
  category: 'floral',
  style: {
    backgroundColor: '#E5DECC',
    backgroundImage: ditsyFloralSVG('#7C8E6B', '#A98C98', '#EAE2CE'),
    backgroundSize: '110px 110px'
  },
  ink: 'dark'
}, {
  id: 'floral-botanical',
  label: 'Botanical study',
  category: 'floral',
  style: {
    backgroundColor: '#EDE3CB',
    backgroundImage: botanicalSVG('#4E6652', '#C47B63', '#EFE5CF'),
    backgroundSize: '140px 140px'
  },
  ink: 'dark'
},
// ── Patterned ────────────────────────────────────────────────────────
{
  id: 'pattern-stripes-sage',
  label: 'Sage stripes',
  category: 'pattern',
  style: {
    background: 'repeating-linear-gradient(90deg, #8FA088 0 12px, #B6BFA5 12px 24px)'
  },
  ink: 'dark'
}, {
  id: 'pattern-stripes-rose',
  label: 'Rose stripes',
  category: 'pattern',
  style: {
    background: 'repeating-linear-gradient(90deg, #D7B7B0 0 12px, #E6CFC9 12px 24px)'
  },
  ink: 'dark'
}, {
  id: 'pattern-polka',
  label: 'Cream polka',
  category: 'pattern',
  style: {
    backgroundColor: '#5F758A',
    backgroundImage: 'radial-gradient(circle, #F4ECDC 2.5px, transparent 3px)',
    backgroundSize: '18px 18px',
    backgroundPosition: '0 0'
  },
  ink: 'light'
}, {
  id: 'pattern-checker',
  label: 'Soft check',
  category: 'pattern',
  style: {
    backgroundColor: '#F4ECDC',
    backgroundImage: 'linear-gradient(45deg, rgba(168,140,116,0.18) 25%, transparent 25%, transparent 75%, rgba(168,140,116,0.18) 75%),' + 'linear-gradient(45deg, rgba(168,140,116,0.18) 25%, transparent 25%, transparent 75%, rgba(168,140,116,0.18) 75%)',
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 12px 12px'
  },
  ink: 'dark'
},
// ── Solids ───────────────────────────────────────────────────────────
{
  id: 'solid-terracotta',
  label: 'Terracotta',
  category: 'solid',
  style: {
    background: 'linear-gradient(170deg, #D08A72 0%, #B6624B 100%)'
  },
  ink: 'light'
}, {
  id: 'solid-sage',
  label: 'Sage',
  category: 'solid',
  style: {
    background: 'linear-gradient(170deg, #95A689 0%, #6E8270 100%)'
  },
  ink: 'light'
}, {
  id: 'solid-rose',
  label: 'Dusty rose',
  category: 'solid',
  style: {
    background: 'linear-gradient(170deg, #E5C6BF 0%, #BE8E89 100%)'
  },
  ink: 'dark'
}, {
  id: 'solid-mauve',
  label: 'Plum mauve',
  category: 'solid',
  style: {
    background: 'linear-gradient(170deg, #BFA1AC 0%, #8F6B7A 100%)'
  },
  ink: 'light'
}, {
  id: 'solid-blue',
  label: 'Slate blue',
  category: 'solid',
  style: {
    background: 'linear-gradient(170deg, #A2B5C5 0%, #6F8598 100%)'
  },
  ink: 'light'
}, {
  id: 'solid-charcoal',
  label: 'Charcoal',
  category: 'solid',
  style: {
    background: 'linear-gradient(170deg, #3D3A36 0%, #2A2724 100%)'
  },
  ink: 'light'
},
// ── Vintage ──────────────────────────────────────────────────────────
{
  id: 'vintage-parchment',
  label: 'Aged parchment',
  category: 'vintage',
  style: {
    background: 'radial-gradient(circle at 20% 30%, rgba(168,140,116,0.18), transparent 40%),' + 'radial-gradient(circle at 80% 70%, rgba(168,140,116,0.16), transparent 35%),' + 'radial-gradient(circle at 60% 20%, rgba(200,169,107,0.16), transparent 30%),' + 'linear-gradient(180deg, #F0E2C3 0%, #E0CDA3 100%)'
  },
  ink: 'dark'
}, {
  id: 'vintage-marbled-rose',
  label: 'Marbled rose',
  category: 'vintage',
  style: {
    backgroundColor: '#E8C6BE',
    backgroundImage: marbledSVG('#E8C6BE', '#B07365', '#F4E0D9'),
    backgroundSize: '220px 220px'
  },
  ink: 'dark'
}, {
  id: 'vintage-marbled-blue',
  label: 'Marbled blue',
  category: 'vintage',
  style: {
    backgroundColor: '#C7D3DE',
    backgroundImage: marbledSVG('#C7D3DE', '#5E7286', '#E1E8EE'),
    backgroundSize: '220px 220px'
  },
  ink: 'dark'
}];
const COVER_BY_ID = Object.fromEntries(COVER_PRESETS.map(c => [c.id, c]));

// Pick reasonable defaults if a cover id ever goes missing (e.g. legacy data).
const DEFAULT_FRONT_COVER = 'leather-cognac';
const DEFAULT_BACK_COVER = 'leather-cognac';

// ── Renderer ─────────────────────────────────────────────────────────────

const CoverArt = ({
  cover,
  children,
  style = {},
  grain = true
}) => {
  const preset = COVER_BY_ID[cover] || COVER_BY_ID[DEFAULT_FRONT_COVER];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      ...preset.style,
      ...style
    }
  }, grain && /*#__PURE__*/React.createElement("div", {
    style: paperGrain(0.18)
  }), children);
};

// ── Picker modal ─────────────────────────────────────────────────────────

const CoverPickerModal = ({
  open,
  initialSide = 'front',
  frontCover,
  backCover,
  onPickFront,
  onPickBack,
  unified = false,
  onPick,
  onClose
}) => {
  const [side, setSide] = React.useState(initialSide);
  React.useEffect(() => {
    if (open) setSide(initialSide);
  }, [open, initialSide]);

  // Close on Esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const selected = unified ? frontCover : side === 'front' ? frontCover : backCover;
  const pick = unified ? onPick : side === 'front' ? onPickFront : onPickBack;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 70,
      background: 'rgba(45,38,30,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      padding: 16,
      animation: 'pp-scrim-in 200ms var(--ease-paper) both'
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 820,
      maxHeight: '100%',
      background: 'var(--surface-card, #FFFDF6)',
      borderRadius: 18,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateAreas: '"header header" "preview grid" "footer footer"',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
      animation: 'pp-modal-in 280ms var(--ease-paper) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridArea: 'header',
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems: 'center',
      gap: 14,
      padding: '18px 22px',
      borderBottom: '1px solid var(--pp-hairline)',
      background: 'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-paper)',
      fontSize: 11,
      letterSpacing: '0.22em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase'
    }
  }, "Journal cover"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--fg-1)',
      lineHeight: 1.1,
      marginTop: 2,
      letterSpacing: '-0.005em'
    }
  }, "Choose a cover")), !unified ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: 'var(--bg-2)',
      borderRadius: 999,
      padding: 3,
      border: '1px solid var(--pp-hairline)'
    }
  }, ['front', 'back'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setSide(s),
    style: {
      padding: '8px 16px',
      minHeight: 36,
      borderRadius: 999,
      border: 0,
      background: side === s ? 'var(--surface-card)' : 'transparent',
      color: side === s ? 'var(--fg-1)' : 'var(--fg-3)',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.02em',
      cursor: 'pointer',
      boxShadow: side === s ? '0 1px 3px rgba(75,64,56,0.18)' : 'none',
      transition: 'all 160ms var(--ease-paper)',
      textTransform: 'capitalize'
    }
  }, s, " cover"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--fg-3)',
      letterSpacing: '0.02em',
      background: 'var(--bg-2)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 999,
      padding: '8px 16px'
    }
  }, "Front, spine, back & inside"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      border: '1px solid var(--pp-hairline)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--fg-1)',
      boxShadow: '0 2px 4px rgba(75,64,56,0.10)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridArea: 'preview',
      padding: 20,
      borderRight: '1px solid var(--pp-hairline)',
      background: 'radial-gradient(closest-side, rgba(255,253,246,0.85), rgba(247,242,232,0.85))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-paper)',
      fontSize: 10,
      letterSpacing: '0.22em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase'
    }
  }, "Preview \xB7 ", unified ? 'your cover' : side + ' cover'), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200,
      height: 280,
      borderRadius: '4px 10px 10px 4px',
      position: 'relative',
      boxShadow: '0 22px 40px -10px rgba(45,38,30,0.30), 0 6px 10px rgba(45,38,30,0.18)',
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.10)'
    }
  }, /*#__PURE__*/React.createElement(CoverArt, {
    cover: selected
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: side === 'front' ? 0 : 'auto',
      right: side === 'back' ? 0 : 'auto',
      top: 0,
      bottom: 0,
      width: 12,
      background: 'rgba(0,0,0,0.18)',
      pointerEvents: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      color: 'var(--fg-1)',
      textAlign: 'center'
    }
  }, COVER_BY_ID[selected]?.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 13,
      color: 'var(--fg-3)',
      textAlign: 'center',
      padding: '0 12px'
    }
  }, "Tap a cover on the right to try it on.", unified ? ' It dresses the front, spine, back and inside endpapers together.' : ' You can place items on the cover after closing this picker.')), /*#__PURE__*/React.createElement("div", {
    style: {
      gridArea: 'grid',
      overflowY: 'auto',
      padding: 18,
      background: 'var(--surface-card)'
    }
  }, COVER_CATEGORIES.map(cat => {
    const items = COVER_PRESETS.filter(p => p.category === cat.id);
    if (!items.length) return null;
    return /*#__PURE__*/React.createElement("section", {
      key: cat.id,
      style: {
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-paper)',
        fontSize: 10,
        letterSpacing: '0.22em',
        color: 'var(--fg-3)',
        textTransform: 'uppercase',
        marginBottom: 10
      }
    }, cat.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        gap: 10
      }
    }, items.map(p => {
      const isActive = p.id === selected;
      return /*#__PURE__*/React.createElement("button", {
        key: p.id,
        onClick: () => pick?.(p.id),
        title: p.label,
        style: {
          aspectRatio: '3 / 4',
          position: 'relative',
          padding: 0,
          border: 0,
          borderRadius: '3px 7px 7px 3px',
          background: 'transparent',
          cursor: 'pointer',
          outline: isActive ? '3px solid var(--pp-forest, #4E6652)' : '1px solid var(--pp-hairline)',
          outlineOffset: isActive ? 2 : 0,
          boxShadow: isActive ? '0 8px 16px -4px rgba(78,102,82,0.35), 0 2px 4px rgba(75,64,56,0.18)' : '0 4px 10px -4px rgba(75,64,56,0.22)',
          overflow: 'hidden',
          transition: 'all 160ms var(--ease-paper)'
        }
      }, /*#__PURE__*/React.createElement(CoverArt, {
        cover: p.id
      }), isActive && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: 5,
          right: 5,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--pp-forest, #4E6652)',
          color: '#FFFDF6',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(45,38,30,0.4)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 14,
        stroke: 2.4
      })));
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridArea: 'footer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      padding: '14px 22px',
      borderTop: '1px solid var(--pp-hairline)',
      background: 'rgba(247,242,232,0.7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--fg-3)',
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic'
    }
  }, "Front cover is what shows on your shelf at home."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      height: 44,
      padding: '0 22px',
      borderRadius: 999,
      background: 'var(--pp-forest, #4E6652)',
      color: '#FFFDF6',
      border: 0,
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.02em',
      cursor: 'pointer',
      boxShadow: '0 4px 10px -2px rgba(78,102,82,0.45)'
    }
  }, "Done"))));
};
Object.assign(window, {
  COVER_PRESETS,
  COVER_CATEGORIES,
  COVER_BY_ID,
  DEFAULT_FRONT_COVER,
  DEFAULT_BACK_COVER,
  CoverArt,
  CoverPickerModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/JournalCovers.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/JournalEditor.jsx
try { (() => {
// SCR-07 Journal Editor.
// Textured canvas pages, leather covers on pages 1 & N, page-flip animation, pinch zoom.
// No fixed right tool palette — a draggable floating "+" button opens a category drawer
// from the right edge with the user's collection. Pick an item, it inserts into the
// active page and the drawer minimises.

const MAX_PAGES = 30;
const PAGE_TEXTURES = {
  linen: {
    label: 'Linen',
    desc: 'Warm woven cream'
  },
  parchment: {
    label: 'Parchment',
    desc: 'Aged cream paper'
  },
  ruled: {
    label: 'Ruled',
    desc: 'Faint sage ruled'
  },
  dotted: {
    label: 'Dotted',
    desc: 'Soft dot grid'
  },
  vintage: {
    label: 'Vintage',
    desc: 'Foxed botanical'
  }
};
const textureBackground = id => {
  switch (id) {
    case 'linen':
      return {
        background: 'repeating-linear-gradient(0deg, rgba(168,140,116,0.06) 0 1px, transparent 1px 3px),' + 'repeating-linear-gradient(90deg, rgba(168,140,116,0.06) 0 1px, transparent 1px 3px),' + 'linear-gradient(180deg, #FFFDF6 0%, #F8F1E2 100%)'
      };
    case 'parchment':
      return {
        background: 'radial-gradient(circle at 20% 30%, rgba(168,140,116,0.10), transparent 40%),' + 'radial-gradient(circle at 80% 70%, rgba(168,140,116,0.08), transparent 35%),' + 'radial-gradient(circle at 60% 20%, rgba(200,169,107,0.08), transparent 30%),' + 'linear-gradient(180deg, #F4E9D2 0%, #E8D9BB 100%)'
      };
    case 'ruled':
      return {
        background: 'repeating-linear-gradient(0deg, transparent 0 28px, rgba(135,147,124,0.18) 28px 29px),' + 'linear-gradient(180deg, #FFFDF6 0%, #F6EFE0 100%)'
      };
    case 'dotted':
      return {
        background: 'radial-gradient(circle, rgba(135,147,124,0.30) 1px, transparent 1.5px) 0 0 / 18px 18px,' + 'linear-gradient(180deg, #FFFDF6 0%, #F6EFE0 100%)'
      };
    case 'vintage':
      return {
        background: 'radial-gradient(circle at 12% 18%, rgba(196,123,99,0.18), transparent 28%),' + 'radial-gradient(circle at 88% 82%, rgba(122,125,92,0.16), transparent 28%),' + 'radial-gradient(circle at 50% 50%, rgba(200,169,107,0.10), transparent 60%),' + 'linear-gradient(180deg, #ECE0C6 0%, #DCC9A7 100%)'
      };
    default:
      return {
        background: '#FFFDF6'
      };
  }
};
const leatherBackground = {
  background: 'radial-gradient(circle at 30% 30%, #6F4F35 0%, #4B3320 70%),' + 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 5px)'
};

/* ─── Collection (drawer contents) ─────────────────────────────── */

// Mirrors SCR-06 Shop's SHOP_CATEGORIES exactly so the "add item" drawer and
// the store share one taxonomy. 'all' shows the whole owned collection.
const CATEGORIES = [{
  id: 'all',
  label: 'All'
}, {
  id: 'collections',
  label: 'Collections'
}, {
  id: 'papers',
  label: 'Papers & backgrounds'
}, {
  id: 'stickers',
  label: 'Stickers'
}, {
  id: 'tape',
  label: 'Tape & fasteners'
}, {
  id: 'ephemera',
  label: 'Ephemera'
}, {
  id: 'florals',
  label: 'Florals & botanicals'
}, {
  id: 'frames',
  label: 'Frames & containers'
}, {
  id: 'type',
  label: 'Writing & typography'
}, {
  id: 'paint',
  label: 'Paint & artistic'
}, {
  id: 'fabric',
  label: 'Sewing & fabric'
}, {
  id: 'photos',
  label: 'Photos & memory keeping'
}, {
  id: 'details',
  label: 'Decorative details'
}];
const FLOWER_ASSETS = [{
  src: '../../assets/flowers/01-cornflower-violet.png',
  name: 'Cornflower violet'
}, {
  src: '../../assets/flowers/02-poppy-red.png',
  name: 'Crimson poppy'
}, {
  src: '../../assets/flowers/03-cosmos-lavender.png',
  name: 'Lavender cosmos'
}, {
  src: '../../assets/flowers/04-wildrose-pink.png',
  name: 'Wild rose, pink'
}, {
  src: '../../assets/flowers/05-cherryblossom-cluster.png',
  name: 'Cherry blossom cluster'
}, {
  src: '../../assets/flowers/06-zinnia-crimson.png',
  name: 'Crimson zinnia'
}];

// Per-category display names + a short descriptive blurb, surfaced in the
// single-click item details panel. Mirrors the Shop's voice (SCR-06).
const ITEM_DETAILS = {
  collections: {
    names: ['Spring Meadow', 'Old Romance', 'Coastal Almanac', 'Autumn Library', 'Winter Hearth', 'Garden Party', 'Seaside Holiday', 'Botanical Press'],
    blurb: 'A curated set of matching pieces — papers, stickers and ephemera that share one palette and mood.'
  },
  papers: {
    names: ['Linen Sheet', 'Soft Grid Page', 'Foxed Page', 'Polka Page', 'Old Ledger', 'Watercolour Wash'],
    blurb: 'A full-bleed background sheet sized to the page. Layer everything else on top of it.'
  },
  stickers: {
    names: ['Wax Seal', 'Hand-drawn Arrow', 'Inked Star', 'Tiny Heart', 'Checkmark', 'Pressed Bloom Sticker'],
    blurb: 'A die-cut sticker with a soft drop shadow. Place it, then nudge it into the perfect spot.'
  },
  tape: {
    names: ['Sage Washi', 'Linen Tape', 'Gingham Strip', 'Gold Foil Tape', 'Lace Trim'],
    blurb: 'A strip of washi tape for anchoring photos and notes — semi-transparent, just like the real thing.'
  },
  ephemera: {
    names: ['Library Card', 'Bus Ticket', 'Postage Receipt', 'Pressed Label', 'Ration Coupon'],
    blurb: 'Aged paper ephemera with authentic foxing and vintage type. Lovely for memory-keeping spreads.'
  },
  florals: {
    names: ['Pressed Bloom', 'Wildflower Sprig', 'Single Stem', 'Petal Scatter'],
    blurb: 'A pressed flower scanned at high resolution, with naturally soft, translucent petals.'
  },
  frames: {
    names: ['Postage Frame', 'Oval Mat', 'Deckle Edge', 'Ticket Border', 'Photo Corner'],
    blurb: 'A container to frame a photo or note. Drop a picture inside and it crops neatly to fit.'
  },
  type: {
    names: ['Date Stamp', 'Monogram', 'Title Banner', 'Quote Mark', 'Numeral'],
    blurb: 'A typographic accent — dates, titles and numerals set in the Paper & Petals house faces.'
  },
  paint: {
    names: ['Watercolour Dab', 'Ink Splatter', 'Gouache Bloom', 'Brush Sweep'],
    blurb: 'A loose, hand-painted mark to add colour and texture behind your layers.'
  },
  fabric: {
    names: ['Linen Swatch', 'Gingham Patch', 'Velvet Square', 'Floral Cotton'],
    blurb: 'A scrap of fabric with woven texture and a softly frayed edge.'
  },
  photos: {
    names: ['Polaroid Frame', 'Vintage Snapshot', 'Filmstrip', 'Memory Card'],
    blurb: 'A photo frame ready for your own picture. Tap the frame on the page to swap in an image.'
  },
  details: {
    names: ['Brass Charm', 'Enamel Pin', 'Pearl Bead', 'Ribbon Bow', 'Pearl Button'],
    blurb: 'A small decorative detail — charms, pins and beads to finish off a corner.'
  }
};

// Generate sample collection. In production this is the user's saved items.
const seedCollection = () => {
  const items = [];
  // Real pressed-flower assets first so they appear at the top of the category
  FLOWER_ASSETS.forEach((f, i) => {
    items.push({
      id: `florals-real-${i}`,
      category: 'florals',
      type: 'flower-image',
      imageSrc: f.src,
      name: f.name,
      desc: ITEM_DETAILS.florals.blurb,
      // First two are "new"
      isNew: i < 2
    });
  });

  // Owned pieces, organised under the SAME categories as the Shop (SCR-06).
  const recipe = {
    collections: {
      count: 8,
      type: 'card',
      palette: ['#FFFDF6', '#F8F1E2', '#EFE9E1', '#E5D8C8']
    },
    papers: {
      count: 12,
      type: 'card',
      palette: ['#FFFDF6', '#F8F1E2', '#EFE9E1', '#E5D8C8']
    },
    stickers: {
      count: 13,
      type: 'seal',
      palette: ['#4E6652', '#C47B63', '#A98C98', '#C8A96B']
    },
    tape: {
      count: 9,
      type: 'ribbon',
      palette: ['#D7B7B0', '#87937C', '#C8A96B', '#A98C98']
    },
    ephemera: {
      count: 9,
      type: 'antique',
      palette: ['#9E7C5C', '#C8A96B', '#7A6B52']
    },
    florals: {
      count: 8,
      type: 'flower',
      palette: ['#A98C98', '#87937C', '#D7B7B0', '#C47B63']
    },
    frames: {
      count: 10,
      type: 'stamp',
      palette: ['#C47B63', '#87937C', '#8FA3B8', '#A98C98']
    },
    type: {
      count: 8,
      type: 'antique',
      palette: ['#7A6B52', '#4B4038', '#9E7C5C']
    },
    paint: {
      count: 11,
      type: 'button',
      palette: ['#C8A96B', '#4E6652', '#A98C98', '#C47B63']
    },
    fabric: {
      count: 9,
      type: 'fabric',
      palette: ['#A98C98', '#87937C', '#D7B7B0', '#8FA3B8']
    },
    photos: {
      count: 7,
      type: 'card',
      palette: ['#E5D8C8', '#EFE9E1', '#F8F1E2']
    },
    details: {
      count: 12,
      type: 'craft',
      palette: ['#7A7D5C', '#C47B63', '#8FA3B8']
    }
  };
  for (const [catId, r] of Object.entries(recipe)) {
    const det = ITEM_DETAILS[catId] || {
      names: [],
      blurb: ''
    };
    for (let i = 0; i < r.count; i++) {
      const baseName = det.names[i % det.names.length] || 'Crafted piece';
      const name = i >= det.names.length ? `${baseName} ${Math.floor(i / det.names.length) + 1}` : baseName;
      items.push({
        id: `${catId}-${i}`,
        category: catId,
        type: r.type,
        color: r.palette[i % r.palette.length],
        name,
        desc: det.blurb,
        isNew: i < 2
      });
    }
  }
  return items;
};

/* ─── Editor root ──────────────────────────────────────────────── */

const JournalEditor = ({
  onBack,
  onSupportTap,
  journal,
  onSave,
  subscribed = false,
  onUpgrade,
  onShop
}) => {
  const journalDefaults = journal || {};
  // Journal-level state — name flows back to Home via onSave. Covers are always
  // leather (cognac); cover selection was removed, so they're constants now.
  const [journalName, setJournalName] = React.useState(journalDefaults.name || 'Journal 1');
  const frontCover = DEFAULT_FRONT_COVER;
  const backCover = DEFAULT_BACK_COVER;
  const [editingName, setEditingName] = React.useState(false);

  // Push every change back to the host (HomeScreen) so the carousel reflects
  // the latest cover & name without an explicit save action.
  const onSaveRef = React.useRef(onSave);
  React.useEffect(() => {
    onSaveRef.current = onSave;
  });
  React.useEffect(() => {
    onSaveRef.current?.({
      name: journalName,
      frontCover,
      backCover
    });
  }, [journalName]);
  const [pages, setPages] = React.useState(8);
  const [activePage, setActivePage] = React.useState(2);
  const [texture, setTexture] = React.useState('parchment');
  const [zoom, setZoom] = React.useState(1);
  const [flip, setFlip] = React.useState(null);
  const [placedByPage, setPlacedByPage] = React.useState({
    2: [{
      id: 1001,
      type: 'washi',
      x: 8,
      y: 12,
      w: 78,
      h: 28,
      color: 'var(--pp-soft-rose)',
      rotate: -4
    }, {
      id: 1002,
      type: 'card',
      x: 18,
      y: 42,
      w: 140,
      h: 92,
      rotate: -3,
      label: 'POSTCARD'
    }, {
      id: 1003,
      type: 'flower',
      x: 200,
      y: 30,
      w: 64,
      h: 96,
      color: 'var(--pp-muted-olive)',
      rotate: 8
    }],
    3: [{
      id: 1004,
      type: 'stamp',
      x: 200,
      y: 56,
      w: 78,
      h: 100,
      color: 'var(--pp-terracotta)',
      rotate: -6
    }, {
      id: 1005,
      type: 'seal',
      x: 320,
      y: 220,
      w: 56,
      h: 56,
      color: 'var(--pp-forest)'
    }, {
      id: 1006,
      type: 'tape',
      x: 120,
      y: 320,
      w: 130,
      h: 24,
      color: 'var(--pp-antique-gold)',
      rotate: 4
    }]
  });
  const [collection] = React.useState(seedCollection);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('all');

  // Selection: { page, index } picks one placed item on the spread.
  const [selection, setSelection] = React.useState(null);
  const [editingMove, setEditingMove] = React.useState(null); // { page, index, dx, dy }
  const [editingCrop, setEditingCrop] = React.useState(false);
  const nextIdRef = React.useRef(1);

  // Drag-and-drop state. When a tile is being dragged from the drawer
  // we float a ghost preview at pointer coords; on pointerup over the
  // canvas we insert the item at that location.
  const [drag, setDrag] = React.useState(null); // { item, x, y, overCanvas, side }
  const spreadRef = React.useRef(null);

  // Single-click opens this details panel; double-click / drag places instead.
  const [detailItem, setDetailItem] = React.useState(null);
  // Layers panel (lists the active page's placed items, front → back).
  const [layersOpen, setLayersOpen] = React.useState(false);

  // ── Undo / redo history for placed items ───────────────────────
  // pushHistory() is called at the START of each discrete edit (add, move,
  // resize, rotate, delete, reorder) so one gesture = one undo step.
  const histRef = React.useRef({
    past: [],
    future: []
  });
  const [, bumpHist] = React.useReducer(x => x + 1, 0);
  const pushHistory = () => {
    const h = histRef.current;
    h.past.push(placedByPage);
    if (h.past.length > 60) h.past.shift();
    h.future = [];
    bumpHist();
  };
  const undo = () => {
    const h = histRef.current;
    if (!h.past.length) return;
    h.future.unshift(placedByPage);
    setPlacedByPage(h.past.pop());
    setSelection(null);
    bumpHist();
  };
  const redo = () => {
    const h = histRef.current;
    if (!h.future.length) return;
    h.past.push(placedByPage);
    setPlacedByPage(h.future.shift());
    setSelection(null);
    bumpHist();
  };
  const canUndo = histRef.current.past.length > 0;
  const canRedo = histRef.current.future.length > 0;

  // Keyboard: ⌘/Ctrl+Z undo, ⌘/Ctrl+Shift+Z (or Ctrl+Y) redo.
  React.useEffect(() => {
    const onKey = e => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const k = e.key.toLowerCase();
      if (k === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      } else if (k === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const goToPage = target => {
    if (target < 1 || target > pages || target === activePage || flip) return;
    const dir = target > activePage ? 'next' : 'prev';
    setFlip({
      from: activePage,
      to: target,
      dir
    });
    window.setTimeout(() => {
      setActivePage(target);
      setFlip(null);
    }, 620);
  };
  const addPage = () => {
    if (pages < MAX_PAGES) setPages(p => p + 1);
  };
  const [confirmDeletePage, setConfirmDeletePage] = React.useState(false);
  const requestDeletePage = () => {
    if (pages <= 1) return; // can't delete the last page
    setConfirmDeletePage(true);
  };
  const deleteActivePage = () => {
    if (pages <= 1) {
      setConfirmDeletePage(false);
      return;
    }
    pushHistory();
    const target = activePage;
    // Shift placedByPage entries: keys > target decrement by 1, target removed
    setPlacedByPage(prev => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        const n = Number(k);
        if (n < target) next[n] = v;else if (n > target) next[n - 1] = v;
        // n === target → dropped
      }
      return next;
    });
    const newPages = pages - 1;
    setPages(newPages);
    // Move to neighbouring page
    setActivePage(Math.min(target, newPages));
    setSelection(null);
    setConfirmDeletePage(false);
  };

  /* ─── Item action handlers ──────────────────────────────────── */
  const mutateSelected = fn => {
    if (!selection) return;
    setPlacedByPage(prev => {
      const arr = [...(prev[selection.page] || [])];
      if (!arr[selection.index]) return prev;
      arr[selection.index] = fn(arr[selection.index]);
      return {
        ...prev,
        [selection.page]: arr
      };
    });
  };
  const rotateSelected = () => {
    pushHistory();
    mutateSelected(it => ({
      ...it,
      rotate: (it.rotate || 0) + 15
    }));
  };
  const scaleSelected = factor => {
    pushHistory();
    mutateSelected(it => ({
      ...it,
      w: Math.max(24, it.w * factor),
      h: Math.max(24, it.h * factor)
    }));
  };
  const deleteSelected = () => {
    if (!selection) return;
    pushHistory();
    setPlacedByPage(prev => {
      const arr = (prev[selection.page] || []).filter((_, i) => i !== selection.index);
      return {
        ...prev,
        [selection.page]: arr
      };
    });
    setSelection(null);
  };
  const reorderSelected = direction => {
    if (!selection) return;
    pushHistory();
    setPlacedByPage(prev => {
      const arr = [...(prev[selection.page] || [])];
      const i = selection.index;
      const j = direction === 'forward' ? i + 1 : i - 1;
      if (j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setSelection({
        page: selection.page,
        index: j
      });
      return {
        ...prev,
        [selection.page]: arr
      };
    });
  };

  /* ─── Drag a placed item around the page ────────────────────── */
  React.useEffect(() => {
    if (!editingMove) return;
    const onMove = e => {
      const pt = e;
      const spread = spreadRef.current;
      if (!spread) return;
      const r = spread.getBoundingClientRect();
      const sx = (pt.clientX - r.left) / r.width * SPREAD_W;
      const sy = (pt.clientY - r.top) / r.height * SPREAD_H;
      // Constrain x to the page side
      const side = editingMove.side;
      const localX = side === 'left' ? sx - 18 : sx - SPREAD_W / 2 - 6;
      const localY = sy - 18;
      setPlacedByPage(prev => {
        const arr = [...(prev[editingMove.page] || [])];
        const it = arr[editingMove.index];
        if (!it) return prev;
        // Allow the item to slide partly off any page edge — only a sliver
        // (MIN_VIS) must stay on-page. The page clips the overflow so it reads
        // as if the piece has been cut at the border. It can never vanish.
        const MIN_VIS = 30;
        arr[editingMove.index] = {
          ...it,
          x: Math.max(-(it.w - MIN_VIS), Math.min(SPREAD_W / 2 - MIN_VIS, localX - editingMove.dx)),
          y: Math.max(-(it.h - MIN_VIS), Math.min(SPREAD_H - MIN_VIS, localY - editingMove.dy))
        };
        return {
          ...prev,
          [editingMove.page]: arr
        };
      });
    };
    const onUp = () => setEditingMove(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [editingMove]);
  const beginItemMove = (page, index, side, ev) => {
    setSelection({
      page,
      index
    });
    pushHistory();
    const item = (placedByPage[page] || [])[index];
    if (!item) return;
    const spread = spreadRef.current;
    if (!spread) return;
    const r = spread.getBoundingClientRect();
    const sx = (ev.clientX - r.left) / r.width * SPREAD_W;
    const sy = (ev.clientY - r.top) / r.height * SPREAD_H;
    const localX = side === 'left' ? sx - 18 : sx - SPREAD_W / 2 - 6;
    const localY = sy - 18;
    setEditingMove({
      page,
      index,
      side,
      dx: localX - item.x,
      dy: localY - item.y
    });
  };

  /* ─── Resize ────────────────────────────────────────────────── */
  const [editingResize, setEditingResize] = React.useState(null);
  // { page, index, side, handle, init: { w0, h0, x0, y0, rotate, anchorSpreadX, anchorSpreadY } }

  React.useEffect(() => {
    if (!editingResize) return;
    const onMove = e => {
      const spread = spreadRef.current;
      if (!spread) return;
      const r = spread.getBoundingClientRect();
      const sx = (e.clientX - r.left) / r.width * SPREAD_W;
      const sy = (e.clientY - r.top) / r.height * SPREAD_H;
      const {
        page,
        index,
        side,
        handle,
        init
      } = editingResize;
      // Pointer relative to anchor in spread coords:
      const dx = sx - init.anchorSpreadX;
      const dy = sy - init.anchorSpreadY;
      // Rotate into the item's local (unrotated) frame:
      const θ = (init.rotate || 0) * Math.PI / 180;
      const cosθ = Math.cos(θ),
        sinθ = Math.sin(θ);
      const localDx = cosθ * dx + sinθ * dy;
      const localDy = -sinθ * dx + cosθ * dy;
      // Handle vector relative to anchor: handle is at (hx*newW, hy*newH).
      const hx = handle.hx,
        hy = handle.hy;
      let newW = init.w0;
      let newH = init.h0;
      if (hx !== 0) newW = Math.max(24, hx * localDx);
      if (hy !== 0) newH = Math.max(24, hy * localDy);
      // New center in spread coords. Center is at anchor + R(θ) · (hx*newW/2, hy*newH/2).
      const halfDx = hx * newW / 2;
      const halfDy = hy * newH / 2;
      const cx = init.anchorSpreadX + cosθ * halfDx - sinθ * halfDy;
      const cy = init.anchorSpreadY + sinθ * halfDx + cosθ * halfDy;
      // Convert center back to page-local x/y (top-left)
      const newCenterLocalX = side === 'left' ? cx - 18 : cx - SPREAD_W / 2 - 6;
      const newCenterLocalY = cy - 18;
      const newX = newCenterLocalX - newW / 2;
      const newY = newCenterLocalY - newH / 2;
      setPlacedByPage(prev => {
        const arr = [...(prev[page] || [])];
        if (!arr[index]) return prev;
        arr[index] = {
          ...arr[index],
          w: newW,
          h: newH,
          x: newX,
          y: newY
        };
        return {
          ...prev,
          [page]: arr
        };
      });
    };
    const onUp = () => setEditingResize(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [editingResize]);
  const beginItemResize = (page, index, side, handle, ev) => {
    const item = (placedByPage[page] || [])[index];
    if (!item) return;
    pushHistory();
    setSelection({
      page,
      index
    });
    // Anchor = the opposite handle's spread position. For handle (hx, hy),
    // the anchor in the item's local frame is at (-hx*w/2, -hy*h/2) relative
    // to center; in spread coords that's: center + R(θ) · (-hx*w/2, -hy*h/2).
    const θ = (item.rotate || 0) * Math.PI / 180;
    const cosθ = Math.cos(θ),
      sinθ = Math.sin(θ);
    const cxLocal = item.x + item.w / 2;
    const cyLocal = item.y + item.h / 2;
    // Convert center to spread coords (account for which page side):
    const cxSpread = (side === 'left' ? 18 : SPREAD_W / 2 + 6) + cxLocal;
    const cySpread = 18 + cyLocal;
    const ax = -handle.hx * item.w / 2;
    const ay = -handle.hy * item.h / 2;
    const anchorSpreadX = cxSpread + cosθ * ax - sinθ * ay;
    const anchorSpreadY = cySpread + sinθ * ax + cosθ * ay;
    setEditingResize({
      page,
      index,
      side,
      handle,
      init: {
        w0: item.w,
        h0: item.h,
        rotate: item.rotate || 0,
        anchorSpreadX,
        anchorSpreadY
      }
    });
  };

  /* ─── Rotate ────────────────────────────────────────────────── */
  const [editingRotate, setEditingRotate] = React.useState(null);
  // { page, index, side, init: { centerSpreadX, centerSpreadY, rotate0, startAngle } }

  React.useEffect(() => {
    if (!editingRotate) return;
    const onMove = e => {
      const spread = spreadRef.current;
      if (!spread) return;
      const r = spread.getBoundingClientRect();
      const sx = (e.clientX - r.left) / r.width * SPREAD_W;
      const sy = (e.clientY - r.top) / r.height * SPREAD_H;
      const {
        page,
        index,
        init
      } = editingRotate;
      const angle = Math.atan2(sy - init.centerSpreadY, sx - init.centerSpreadX);
      let newRotate = init.rotate0 + (angle - init.startAngle) * 180 / Math.PI;
      // Soft 15° snap when within ±3° of a multiple
      const snap = 15;
      const nearest = Math.round(newRotate / snap) * snap;
      if (Math.abs(newRotate - nearest) < 3) newRotate = nearest;
      setPlacedByPage(prev => {
        const arr = [...(prev[page] || [])];
        if (!arr[index]) return prev;
        arr[index] = {
          ...arr[index],
          rotate: newRotate
        };
        return {
          ...prev,
          [page]: arr
        };
      });
    };
    const onUp = () => setEditingRotate(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [editingRotate]);
  const beginItemRotate = (page, index, side, ev) => {
    const item = (placedByPage[page] || [])[index];
    if (!item) return;
    pushHistory();
    setSelection({
      page,
      index
    });
    const cxLocal = item.x + item.w / 2;
    const cyLocal = item.y + item.h / 2;
    const cxSpread = (side === 'left' ? 18 : SPREAD_W / 2 + 6) + cxLocal;
    const cySpread = 18 + cyLocal;
    const spread = spreadRef.current;
    if (!spread) return;
    const r = spread.getBoundingClientRect();
    const sx = (ev.clientX - r.left) / r.width * SPREAD_W;
    const sy = (ev.clientY - r.top) / r.height * SPREAD_H;
    const startAngle = Math.atan2(sy - cySpread, sx - cxSpread);
    setEditingRotate({
      page,
      index,
      side,
      init: {
        centerSpreadX: cxSpread,
        centerSpreadY: cySpread,
        rotate0: item.rotate || 0,
        startAngle
      }
    });
  };

  /* ─── Align ─────────────────────────────────────────────────── */
  const alignSelected = alignment => {
    if (!selection) return;
    pushHistory();
    setPlacedByPage(prev => {
      const arr = [...(prev[selection.page] || [])];
      const it = arr[selection.index];
      if (!it) return prev;
      const pageW = SPREAD_W / 2 - 24;
      const pageH = SPREAD_H - 36;
      const next = {
        ...it
      };
      if (alignment === 'left') next.x = 8;
      if (alignment === 'hcenter') next.x = (pageW - it.w) / 2;
      if (alignment === 'right') next.x = pageW - it.w - 8;
      if (alignment === 'top') next.y = 8;
      if (alignment === 'vcenter') next.y = (pageH - it.h) / 2;
      if (alignment === 'bottom') next.y = pageH - it.h - 8;
      arr[selection.index] = next;
      return {
        ...prev,
        [selection.page]: arr
      };
    });
  };

  /* Place an item straight onto the current page — used by double-click on a
     collection tile and by the "Add to page" button in the details panel. */
  const placeItemOnActivePage = item => {
    pushHistory();
    let targetPage = activePage;
    if (targetPage === 1) targetPage = Math.min(2, pages);else if (targetPage === pages) targetPage = Math.max(1, pages - 1);
    const w = defaultWidthFor(item.type);
    const h = defaultHeightFor(item.type);
    const pageW = SPREAD_W / 2 - 24;
    const pageH = SPREAD_H - 36;
    const jitter = () => Math.random() * 40 - 20;
    const newPlaced = {
      id: nextIdRef.current++,
      type: itemTypeToCanvas(item.type),
      imageSrc: item.imageSrc,
      x: Math.max(8, Math.min(pageW - w - 8, (pageW - w) / 2 + jitter())),
      y: Math.max(8, Math.min(pageH - h - 8, (pageH - h) / 2 + jitter())),
      w,
      h,
      color: item.color,
      rotate: Math.random() * 16 - 8,
      label: item.type === 'card' ? 'POSTCARD' : undefined
    };
    if (activePage !== targetPage) setActivePage(targetPage);
    setPlacedByPage(prev => {
      const arr = [...(prev[targetPage] || []), newPlaced];
      setSelection({
        page: targetPage,
        index: arr.length - 1
      });
      return {
        ...prev,
        [targetPage]: arr
      };
    });
  };
  const quickAddItem = item => {
    placeItemOnActivePage(item);
    setDrawerOpen(false);
    setDetailItem(null);
  };
  const openItemDetails = item => setDetailItem(item);

  /* Reorder a placed item within its page — drives the Layers panel z-order. */
  const reorderPlaced = (page, from, to) => {
    pushHistory();
    setPlacedByPage(prev => {
      const arr = [...(prev[page] || [])];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length || from === to) return prev;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return {
        ...prev,
        [page]: arr
      };
    });
    setSelection({
      page,
      index: to
    });
  };

  /* Drag handlers — invoked from CollectionTile via pointerdown */
  const beginDrag = (item, ev) => {
    setDrag({
      item,
      x: ev.clientX,
      y: ev.clientY,
      overCanvas: false,
      side: null
    });
    setDrawerOpen(false); // drawer minimises immediately so user can see the page
  };
  React.useEffect(() => {
    if (!drag) return;
    const onMove = e => {
      const pt = e.touches ? e.touches[0] : e;
      // Hit-test the spread
      let overCanvas = false,
        side = null,
        localX = 0,
        localY = 0;
      const spread = spreadRef.current;
      if (spread) {
        const r = spread.getBoundingClientRect();
        if (pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom) {
          overCanvas = true;
          // Spread is 720×500 design pixels; account for the current zoom
          // (the spread is scaled inside CanvasViewport).
          const sx = (pt.clientX - r.left) / r.width * SPREAD_W;
          const sy = (pt.clientY - r.top) / r.height * SPREAD_H;
          side = sx < SPREAD_W / 2 ? 'left' : 'right';
          // Convert to page-local coordinates (each page is ~340 wide post-padding)
          localX = side === 'left' ? sx - 18 : sx - SPREAD_W / 2 - 6;
          localY = sy - 18;
        }
      }
      setDrag(d => d ? {
        ...d,
        x: pt.clientX,
        y: pt.clientY,
        overCanvas,
        side,
        localX,
        localY
      } : d);
    };
    const onUp = e => {
      const d = drag;
      if (!d) return;
      if (d.overCanvas) {
        // Which page is on that side?
        const isFirst = activePage === 1;
        const isLast = activePage === pages;
        let targetPage;
        if (isFirst) targetPage = 1;else if (isLast) targetPage = pages;else if (activePage % 2 === 0) targetPage = d.side === 'left' ? activePage : activePage + 1;else targetPage = d.side === 'left' ? activePage - 1 : activePage;
        // Skip insert if dropped on a leather cover
        const droppedOnCover = isFirst && d.side === 'left' || isLast && d.side === 'right';
        if (!droppedOnCover) {
          pushHistory();
          const newPlaced = {
            id: nextIdRef.current++,
            type: itemTypeToCanvas(d.item.type),
            imageSrc: d.item.imageSrc,
            x: Math.max(8, Math.min(SPREAD_W / 2 - 60, (d.localX ?? 80) - defaultWidthFor(d.item.type) / 2)),
            y: Math.max(8, Math.min(SPREAD_H - 60, (d.localY ?? 80) - defaultHeightFor(d.item.type) / 2)),
            w: defaultWidthFor(d.item.type),
            h: defaultHeightFor(d.item.type),
            color: d.item.color,
            rotate: Math.random() * 16 - 8,
            label: d.item.type === 'card' ? 'POSTCARD' : undefined
          };
          setPlacedByPage(prev => {
            const arr = [...(prev[targetPage] || []), newPlaced];
            // Auto-select the just-dropped item
            setSelection({
              page: targetPage,
              index: arr.length - 1
            });
            return {
              ...prev,
              [targetPage]: arr
            };
          });
        }
      }
      setDrag(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, activePage, pages]);
  return /*#__PURE__*/React.createElement("div", {
    className: "pp-stage",
    style: {
      background: 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-topbar",
    style: {
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn circle",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 20
  })), /*#__PURE__*/React.createElement(EditableJournalTitle, {
    name: journalName,
    onCommit: setJournalName,
    editing: editingName,
    setEditing: setEditingName
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginLeft: 8,
      whiteSpace: 'nowrap'
    }
  }, "pg ", activePage, "/", pages)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(UndoRedo, {
    canUndo: canUndo,
    canRedo: canRedo,
    onUndo: undo,
    onRedo: redo
  }), /*#__PURE__*/React.createElement(ZoomControl, {
    zoom: zoom,
    setZoom: setZoom
  }), /*#__PURE__*/React.createElement(TextureControl, {
    texture: texture,
    setTexture: setTexture
  }), /*#__PURE__*/React.createElement(LayersButton, {
    count: (placedByPage[activePage] || []).length,
    active: layersOpen,
    onClick: () => setLayersOpen(o => !o)
  }), /*#__PURE__*/React.createElement("button", {
    className: "pp-btn pp-btn-secondary",
    style: {
      minHeight: 44,
      padding: '8px 14px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 18
  }), " Export"), /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn",
    onClick: onSupportTap
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 20
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 60,
      bottom: 0,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(PageStrip, {
    pages: pages,
    activePage: activePage,
    onGoTo: goToPage,
    onAdd: addPage
  }), /*#__PURE__*/React.createElement(CanvasViewport, {
    activePage: activePage,
    pages: pages,
    texture: texture,
    frontCover: frontCover,
    backCover: backCover,
    placedByPage: placedByPage,
    zoom: zoom,
    setZoom: setZoom,
    flip: flip,
    onTurn: dir => goToPage(activePage + (dir === 'next' ? 1 : -1)),
    spreadRef: spreadRef,
    dragOverSide: drag && drag.overCanvas ? drag.side : null,
    selection: selection,
    setSelection: setSelection,
    onItemPointerDown: beginItemMove,
    onBeginResize: beginItemResize,
    onBeginRotate: beginItemRotate,
    onDeletePage: requestDeletePage,
    canDeletePage: pages > 1 && activePage !== 1 && activePage !== pages,
    onCanvasMouseDown: target => {
      if (target.closest('[data-placed-item]')) return;
      if (target.closest('[data-item-toolbar]')) return;
      setSelection(null);
    }
  })), /*#__PURE__*/React.createElement(LayersPanel, {
    open: layersOpen,
    onClose: () => setLayersOpen(false),
    page: activePage,
    items: placedByPage[activePage] || [],
    selection: selection,
    onSelect: index => setSelection({
      page: activePage,
      index
    }),
    onReorder: (from, to) => reorderPlaced(activePage, from, to)
  }), !drawerOpen && !drag && /*#__PURE__*/React.createElement(FloatingAddButton, {
    onOpen: () => setDrawerOpen(true)
  }), /*#__PURE__*/React.createElement(CollectionDrawer, {
    open: drawerOpen,
    onClose: () => setDrawerOpen(false),
    categories: CATEGORIES,
    activeCategory: activeCategory,
    onSelectCategory: setActiveCategory,
    collection: collection,
    onBeginDrag: beginDrag,
    onOpenDetails: openItemDetails,
    onQuickAdd: quickAddItem,
    onShop: onShop
  }), /*#__PURE__*/React.createElement(ItemDetailsModal, {
    item: detailItem,
    categoryLabel: detailItem ? CATEGORIES.find(c => c.id === detailItem.category)?.label : '',
    onClose: () => setDetailItem(null),
    onAdd: () => {
      if (detailItem) quickAddItem(detailItem);
    }
  }), drag && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: drag.x,
      top: drag.y,
      width: 100,
      height: 130,
      marginLeft: -50,
      marginTop: -65,
      pointerEvents: 'none',
      zIndex: 100,
      transform: 'rotate(-3deg)',
      filter: 'drop-shadow(0 10px 18px rgba(75,64,56,0.35))',
      opacity: 0.95
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: 'var(--pp-cream)',
      border: '1.5px solid var(--pp-hairline)',
      borderRadius: 6,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CollectionGlyph, {
    item: drag.item
  }))), selection && !editingMove && !drag && /*#__PURE__*/React.createElement(ItemToolbar, {
    spreadRef: spreadRef,
    placedByPage: placedByPage,
    selection: selection,
    activePage: activePage,
    pages: pages,
    onRotate: rotateSelected,
    onScaleUp: () => scaleSelected(1.1),
    onScaleDown: () => scaleSelected(1 / 1.1),
    onCrop: () => setEditingCrop(true),
    onForward: () => reorderSelected('forward'),
    onBack: () => reorderSelected('back'),
    onDelete: deleteSelected
  }), editingCrop && selection && /*#__PURE__*/React.createElement(CropModal, {
    item: (placedByPage[selection.page] || [])[selection.index],
    onClose: () => setEditingCrop(false),
    onApply: () => setEditingCrop(false)
  }), confirmDeletePage && /*#__PURE__*/React.createElement(ConfirmDialog, {
    title: "Delete this page?",
    body: `Page ${activePage} and anything you\u2019ve placed on it will be removed. Your collected items stay safe in your collection.`,
    confirmLabel: "Delete this page",
    danger: true,
    onCancel: () => setConfirmDeletePage(false),
    onConfirm: deleteActivePage
  }));
};

/* ─── Item toolbar ─────────────────────────────────────────────── */

const ItemToolbar = ({
  spreadRef,
  placedByPage,
  selection,
  activePage,
  pages,
  onRotate,
  onScaleUp,
  onScaleDown,
  onCrop,
  onForward,
  onBack,
  onDelete
}) => {
  // Compute toolbar position. Re-measure each render via a layout effect.
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!spreadRef.current) return;
    const item = (placedByPage[selection.page] || [])[selection.index];
    if (!item) {
      setPos(null);
      return;
    }
    const spreadRect = spreadRef.current.getBoundingClientRect();
    // Item is positioned inside a PageSide. Figure out which side (left vs right).
    const isFirst = activePage === 1;
    const isLast = activePage === pages;
    let side;
    if (isFirst) side = selection.page === 1 ? 'right' : 'left';else if (isLast) side = selection.page === pages ? 'left' : 'right';else if (activePage % 2 === 0) side = selection.page === activePage ? 'left' : 'right';else side = selection.page === activePage ? 'right' : 'left';
    // Page-local coords → spread coords
    const sx = (side === 'left' ? 0 : SPREAD_W / 2) + (side === 'left' ? 18 : 6) + item.x;
    const sy = 18 + item.y;
    // Scale factor (spread is rendered at current zoom but we measure DOM rect, so it's already scaled)
    const scaleX = spreadRect.width / SPREAD_W;
    const scaleY = spreadRect.height / SPREAD_H;
    setPos({
      left: spreadRect.left + (sx + item.w / 2) * scaleX,
      top: spreadRect.top + sy * scaleY - 12
    });
  }, [selection, placedByPage, activePage, pages]);
  if (!pos) return null;
  const tools = [{
    id: 'crop',
    icon: 'border',
    label: 'Crop',
    onClick: onCrop
  }, {
    id: 'fwd',
    icon: 'star',
    label: 'Bring forward',
    onClick: onForward
  }, {
    id: 'back',
    icon: 'star',
    label: 'Send back',
    onClick: onBack,
    flip: true
  }, {
    id: 'del',
    icon: 'trash',
    label: 'Delete',
    onClick: onDelete,
    danger: true,
    dividerBefore: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    "data-item-toolbar": "",
    style: {
      position: 'fixed',
      left: pos.left,
      top: pos.top,
      transform: 'translate(-50%, -100%)',
      background: 'var(--surface-card)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 999,
      boxShadow: 'var(--sh-card)',
      padding: 4,
      display: 'flex',
      gap: 2,
      zIndex: 60,
      pointerEvents: 'auto'
    },
    onPointerDown: e => e.stopPropagation()
  }, tools.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t.id
  }, t.dividerBefore && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      alignSelf: 'stretch',
      margin: '4px 2px',
      background: 'var(--pp-hairline-soft)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    title: t.label,
    "aria-label": t.label,
    onClick: t.onClick,
    style: {
      width: 36,
      height: 36,
      borderRadius: 999,
      background: 'transparent',
      border: 'none',
      color: t.danger ? 'var(--pp-danger)' : 'var(--fg-2)',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      transition: 'background 160ms var(--ease-paper)'
    },
    onMouseEnter: e => e.currentTarget.style.background = t.danger ? 'rgba(178,106,90,0.10)' : 'var(--bg-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("span", {
    style: t.flip ? {
      transform: 'scaleY(-1)',
      display: 'grid',
      placeItems: 'center'
    } : {}
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 18
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: -6,
      transform: 'translateX(-50%) rotate(45deg)',
      width: 10,
      height: 10,
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--pp-hairline)',
      borderBottom: '1px solid var(--pp-hairline)'
    }
  }));
};
const CropModal = ({
  item,
  onClose,
  onApply
}) => {
  if (!item) return null;
  return /*#__PURE__*/React.createElement("div", {
    onPointerDown: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(43,42,40,0.45)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    onPointerDown: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 16,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 30px 60px -20px rgba(75,64,56,0.45)',
      padding: 24,
      minWidth: 360,
      maxWidth: 440
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 22
    }
  }, "Crop this piece"), /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '4px 0 14px',
      height: 180,
      borderRadius: 8,
      border: '2px dashed var(--pp-hairline)',
      background: 'var(--pp-cream)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--fg-3)'
    }
  }, "Drag the corners to trim \u2014 placeholder"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13,
      color: 'var(--fg-3)'
    }
  }, "The crop tool will let you trim the edges or shape this piece without changing its placement on the page."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp-btn pp-btn-ghost",
    onClick: onClose
  }, "Never mind"), /*#__PURE__*/React.createElement("button", {
    className: "pp-btn pp-btn-primary",
    onClick: onApply
  }, "Apply crop"))));
};

/* ─── Small helpers ────────────────────────────────────────────── */

const itemTypeToCanvas = t => {
  if (t === 'flower-image') return 'flower-image';
  if (t === 'card') return 'card';
  if (t === 'flower') return 'flower';
  if (t === 'stamp') return 'stamp';
  if (t === 'seal') return 'seal';
  if (t === 'ribbon') return 'tape';
  if (t === 'fabric') return 'washi';
  if (t === 'button') return 'button';
  if (t === 'craft') return 'tape';
  if (t === 'antique') return 'card';
  return 'card';
};
const defaultWidthFor = t => ({
  'flower-image': 110,
  card: 120,
  fabric: 80,
  flower: 60,
  button: 40,
  stamp: 64,
  ribbon: 120,
  craft: 90,
  seal: 48,
  antique: 110
})[t] || 90;
const defaultHeightFor = t => ({
  'flower-image': 180,
  card: 80,
  fabric: 80,
  flower: 90,
  button: 40,
  stamp: 80,
  ribbon: 24,
  craft: 60,
  seal: 48,
  antique: 140
})[t] || 90;

/* ─── Page strip (left) ────────────────────────────────────────── */

const VISIBLE_PAGES = 8;
const PageStrip = ({
  pages,
  activePage,
  onGoTo,
  onAdd
}) => {
  const [windowStart, setWindowStart] = React.useState(1);
  // Auto-scroll the window when active page leaves it
  React.useEffect(() => {
    if (activePage < windowStart) setWindowStart(activePage);else if (activePage >= windowStart + VISIBLE_PAGES) setWindowStart(activePage - VISIBLE_PAGES + 1);
  }, [activePage]); // eslint-disable-line

  const maxStart = Math.max(1, pages - VISIBLE_PAGES + 1);
  const start = Math.min(windowStart, maxStart);
  const end = Math.min(pages, start + VISIBLE_PAGES - 1);
  const canUp = start > 1;
  const canDown = end < pages;
  const needsArrows = pages > VISIBLE_PAGES;
  const stepUp = () => setWindowStart(s => Math.max(1, s - VISIBLE_PAGES));
  const stepDown = () => setWindowStart(s => Math.min(maxStart, s + VISIBLE_PAGES));
  const arrowBtnStyle = enabled => ({
    height: 24,
    borderRadius: 4,
    background: 'transparent',
    border: '1.5px solid var(--pp-hairline)',
    color: enabled ? 'var(--fg-2)' : 'var(--fg-4)',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.5,
    display: 'grid',
    placeItems: 'center',
    padding: 0
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'var(--page-strip-w)',
      padding: '14px 8px',
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--pp-hairline-soft)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      overflow: 'hidden'
    }
  }, needsArrows && /*#__PURE__*/React.createElement("button", {
    onClick: stepUp,
    disabled: !canUp,
    "aria-label": "Scroll pages up",
    title: "Earlier pages",
    style: arrowBtnStyle(canUp)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 14,
    stroke: 2,
    style: {
      transform: 'rotate(90deg)'
    }
  })), Array.from({
    length: end - start + 1
  }).map((_, i) => {
    const n = start + i;
    const isActive = n === activePage;
    const isCover = n === 1 || n === pages;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => onGoTo(n),
      title: isCover ? n === 1 ? 'Inside front cover' : 'Inside back cover' : `Page ${n}`,
      style: {
        height: 56,
        borderRadius: 4,
        position: 'relative',
        background: isActive ? 'var(--accent)' : 'var(--pp-cream)',
        border: isActive ? '2px solid var(--accent)' : '1.5px solid var(--pp-hairline)',
        color: isActive ? 'var(--surface-card)' : 'var(--fg-3)',
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        cursor: 'pointer',
        boxShadow: 'var(--sh-paper)',
        padding: 0,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0
      }
    }, n, isCover && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        right: 4,
        fontSize: 8,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: isActive ? 'rgba(255,253,246,0.85)' : 'var(--fg-4)',
        fontWeight: 600,
        lineHeight: 1
      }
    }, n === 1 ? 'first' : 'last'));
  }), needsArrows && /*#__PURE__*/React.createElement("button", {
    onClick: stepDown,
    disabled: !canDown,
    "aria-label": "Scroll pages down",
    title: "Later pages",
    style: arrowBtnStyle(canDown)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 14,
    stroke: 2,
    style: {
      transform: 'rotate(-90deg)'
    }
  })), (!needsArrows || end === pages) && /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    disabled: pages >= MAX_PAGES,
    title: pages >= MAX_PAGES ? 'A journal holds 30 pages' : 'Add a page',
    style: {
      height: 56,
      borderRadius: 4,
      background: 'transparent',
      border: '1.5px dashed var(--pp-hairline)',
      color: pages >= MAX_PAGES ? 'var(--fg-4)' : 'var(--fg-3)',
      cursor: pages >= MAX_PAGES ? 'not-allowed' : 'pointer',
      display: 'grid',
      placeItems: 'center',
      opacity: pages >= MAX_PAGES ? 0.5 : 1,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 6,
      fontSize: 9,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--fg-4)',
      fontWeight: 600,
      textAlign: 'center'
    }
  }, needsArrows ? `${start}–${end} / ${pages}` : `${pages}/${MAX_PAGES}`));
};

/* ─── Draggable floating + button ──────────────────────────────── */

const FloatingAddButton = ({
  onOpen
}) => {
  const [pos, setPos] = React.useState({
    x: 1024 - 76,
    y: 80
  });
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef({
    dragging: false,
    dx: 0,
    dy: 0,
    sx: 0,
    sy: 0,
    moved: 0
  });
  const onDown = e => {
    const isTouch = e.type === 'touchstart';
    const pt = isTouch ? e.touches[0] : e;
    dragRef.current = {
      dragging: true,
      dx: pt.clientX,
      dy: pt.clientY,
      sx: pos.x,
      sy: pos.y,
      moved: 0
    };
    setDragging(true);
    if (!isTouch) e.preventDefault();
  };
  React.useEffect(() => {
    const onMove = e => {
      if (!dragRef.current.dragging) return;
      const isTouch = e.type === 'touchmove';
      const pt = isTouch ? e.touches[0] : e;
      const dx = pt.clientX - dragRef.current.dx;
      const dy = pt.clientY - dragRef.current.dy;
      dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx) + Math.abs(dy));
      // Find stage rect for live scaling
      const stage = document.querySelector('.pp-stage');
      const r = stage ? stage.getBoundingClientRect() : {
        width: 1024,
        height: 768
      };
      const scaleX = r.width / 1024;
      const scaleY = r.height / 768;
      setPos({
        x: Math.min(1024 - 60, Math.max(8, dragRef.current.sx + dx / scaleX)),
        y: Math.min(768 - 60, Math.max(70, dragRef.current.sy + dy / scaleY))
      });
    };
    const onUp = () => {
      if (!dragRef.current.dragging) return;
      const moved = dragRef.current.moved;
      dragRef.current.dragging = false;
      setDragging(false);
      if (moved < 6) onOpen();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, {
      passive: false
    });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [onOpen]);
  return /*#__PURE__*/React.createElement("button", {
    onMouseDown: onDown,
    onTouchStart: onDown,
    onClick: e => {
      if (dragRef.current.moved < 6) onOpen();
    },
    title: "Add from your collection",
    "aria-label": "Add an item",
    style: {
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--accent)',
      color: 'var(--surface-card)',
      border: 'none',
      boxShadow: '0 8px 18px -4px rgba(75,64,56,0.35),' + '0 2px 4px rgba(75,64,56,0.20),' + '0 0 0 4px rgba(78,102,82,0.10)',
      cursor: dragging ? 'grabbing' : 'grab',
      display: 'grid',
      placeItems: 'center',
      zIndex: 20,
      touchAction: 'none',
      transition: dragging ? 'none' : 'box-shadow 200ms var(--ease-paper)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add",
    size: 26,
    stroke: 2.4
  }));
};

/* ─── Collection drawer ────────────────────────────────────────── */

const CollectionDrawer = ({
  open,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  collection,
  onBeginDrag,
  onOpenDetails,
  onQuickAdd,
  onShop
}) => {
  const items = activeCategory === 'all' ? collection : collection.filter(it => it.category === activeCategory);
  const newCount = items.filter(it => it.isNew).length;
  const activeLabel = categories.find(c => c.id === activeCategory)?.label;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(43,42,40,0.18)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity 240ms var(--ease-paper)',
      zIndex: 25
    }
  }), /*#__PURE__*/React.createElement("aside", {
    role: "dialog",
    "aria-label": "Your collection",
    style: {
      position: 'absolute',
      top: 60,
      right: 0,
      bottom: 0,
      width: 420,
      background: 'var(--surface-card)',
      borderLeft: '1px solid var(--pp-hairline-soft)',
      boxShadow: '-18px 0 40px -16px rgba(75,64,56,0.30)',
      transform: open ? 'translateX(0)' : 'translateX(108%)',
      transition: 'transform 320ms var(--ease-paper)',
      zIndex: 26,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 12px',
      borderBottom: '1px solid var(--pp-hairline-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Your collection"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 22,
      letterSpacing: '-0.005em',
      color: 'var(--fg-1)'
    }
  }, activeLabel)), /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: 'var(--fg-3)'
    }
  }, items.length, " pieces", newCount > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pp-terracotta)',
      fontWeight: 600
    }
  }, newCount, " new")))), /*#__PURE__*/React.createElement("button", {
    onClick: onShop,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '12px 14px 2px',
      padding: '12px 14px',
      border: 0,
      borderRadius: 12,
      cursor: 'pointer',
      textAlign: 'left',
      background: 'linear-gradient(180deg, var(--pp-forest, #4E6652) 0%, var(--pp-forest-deep, #3B4E3F) 100%)',
      color: '#FFFDF6',
      boxShadow: 'var(--sh-paper)'
    },
    onMouseEnter: e => e.currentTarget.style.filter = 'brightness(1.06)',
    onMouseLeave: e => e.currentTarget.style.filter = 'none'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      flexShrink: 0,
      background: 'rgba(255,253,246,0.16)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shop",
    size: 19
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-ui)',
      fontSize: 14.5,
      fontWeight: 700,
      letterSpacing: '0.01em'
    }
  }, "Browse the Shop"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.82)',
      marginTop: 1
    }
  }, "More papers, stickers & seasonal packs")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10
    }
  }, items.map(it => /*#__PURE__*/React.createElement(CollectionTile, {
    key: it.id,
    item: it,
    onBeginDrag: onBeginDrag,
    onOpenDetails: onOpenDetails,
    onQuickAdd: onQuickAdd
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: '12px 6px',
      textAlign: 'center',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--fg-4)',
      fontWeight: 600
    }
  }, "\xB7 end of ", activeLabel.toLowerCase(), " \xB7"))), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Collection categories",
    style: {
      width: 132,
      flexShrink: 0,
      background: 'var(--bg-2)',
      borderLeft: '1px solid var(--pp-hairline-soft)',
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      overflowY: 'auto'
    }
  }, categories.map(c => {
    const isActive = c.id === activeCategory;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => onSelectCategory(c.id),
      style: {
        position: 'relative',
        padding: '12px 12px 12px 14px',
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? 'var(--accent)' : 'var(--fg-2)',
        cursor: 'pointer',
        minHeight: 44,
        lineHeight: 1.2,
        transition: 'all 160ms var(--ease-paper)'
      }
    }, isActive && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        width: 3,
        background: 'var(--accent)',
        borderRadius: 4
      }
    }), c.label);
  }))));
};

/* ─── Collection tile ─────────────────────────────────────────── */

const CollectionTile = ({
  item,
  onBeginDrag,
  onOpenDetails,
  onQuickAdd
}) => {
  const startRef = React.useRef(null);
  const draggingRef = React.useRef(false);
  const clickTimerRef = React.useRef(null);
  React.useEffect(() => () => {
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
  }, []);
  const onPointerDown = e => {
    if (e.button !== undefined && e.button !== 0) return;
    startRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    draggingRef.current = false;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };
  const onPointerMove = e => {
    if (!startRef.current || draggingRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    // Past the threshold this becomes a drag-to-place gesture.
    if (Math.hypot(dx, dy) > 6) {
      draggingRef.current = true;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      onBeginDrag?.(item, e);
    }
  };
  const onPointerUp = e => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    startRef.current = null;
  };
  // Single click → details panel. Double click → place straight onto the page.
  const onClick = () => {
    if (draggingRef.current) {
      draggingRef.current = false;
      return;
    }
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onQuickAdd?.(item);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        onOpenDetails?.(item);
      }, 220);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onClick: onClick,
    title: 'Click for details · double-click or drag to place',
    style: {
      position: 'relative',
      aspectRatio: '3/4',
      background: 'var(--pp-cream)',
      border: '1.5px solid var(--pp-hairline)',
      borderRadius: 6,
      padding: 0,
      cursor: 'grab',
      boxShadow: 'var(--sh-paper)',
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      transition: 'transform 180ms var(--ease-paper), box-shadow 180ms var(--ease-paper)',
      animation: item.isNew ? 'newGlow 2.2s ease-in-out infinite' : 'none'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--sh-card)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--sh-paper)';
    }
  }, /*#__PURE__*/React.createElement(CollectionGlyph, {
    item: item
  }), item.isNew && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 4,
      left: 4,
      fontSize: 8,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      background: 'var(--pp-terracotta)',
      color: 'var(--surface-card)',
      padding: '2px 6px',
      borderRadius: 999,
      fontWeight: 700
    }
  }, "new"));
};
const CollectionGlyph = ({
  item
}) => {
  const wrap = {
    position: 'absolute',
    inset: 6
  };
  if (item.type === 'flower-image' && item.imageSrc) {
    return /*#__PURE__*/React.createElement("img", {
      src: item.imageSrc,
      alt: "",
      draggable: false,
      style: {
        position: 'absolute',
        inset: 4,
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    });
  }
  switch (item.type) {
    case 'card':
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...wrap,
          background: 'repeating-linear-gradient(0deg, ' + item.color + ' 0 10px, rgba(0,0,0,0.04) 10px 11px)',
          borderRadius: 3
        }
      });
    case 'fabric':
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...wrap,
          background: 'repeating-linear-gradient(45deg, ' + item.color + ' 0 4px, ' + item.color + 'cc 4px 8px),' + 'repeating-linear-gradient(-45deg, transparent 0 4px, rgba(0,0,0,0.06) 4px 5px)',
          opacity: 0.92,
          borderRadius: 3
        }
      });
    case 'flower':
      return /*#__PURE__*/React.createElement("div", {
        style: wrap
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: '46%',
          top: '34%',
          bottom: 8,
          width: 2,
          background: item.color
        }
      }), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          left: i === 0 ? '14%' : i === 1 ? 'auto' : '52%',
          right: i === 1 ? '14%' : 'auto',
          top: `${34 + i * 14}%`,
          width: '40%',
          height: '16%',
          background: item.color,
          opacity: 0.55,
          borderRadius: '14px 2px 14px 2px',
          transform: `rotate(${i * 22 - 18}deg)`
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: '16%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '34%',
          height: '24%',
          borderRadius: '50%',
          background: 'var(--pp-soft-rose)',
          boxShadow: 'inset 0 0 0 2px rgba(75,64,56,0.18)'
        }
      }));
    case 'button':
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...wrap,
          display: 'grid',
          placeItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '64%',
          height: '64%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${item.color}, ${item.color}aa)`,
          boxShadow: '0 2px 4px rgba(75,64,56,0.25), inset 0 0 0 2px rgba(255,255,255,0.18)',
          position: 'relative'
        }
      }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)',
          left: i % 2 === 0 ? '36%' : '54%',
          top: i < 2 ? '36%' : '54%'
        }
      }))));
    case 'stamp':
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...wrap,
          background: 'var(--pp-cream)',
          border: `2px dashed ${item.color}`,
          borderRadius: 2,
          padding: 4
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${item.color}88, ${item.color}33)`,
          borderRadius: 1
        }
      }));
    case 'ribbon':
      return /*#__PURE__*/React.createElement("div", {
        style: wrap
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: '40%',
          height: '20%',
          background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}aa 100%)`,
          transform: 'rotate(-6deg)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          borderBottom: '1px solid rgba(0,0,0,0.10)',
          boxShadow: '0 2px 4px rgba(75,64,56,0.18)'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: '60%',
          height: '8%',
          background: `repeating-linear-gradient(90deg, ${item.color}55 0 4px, transparent 4px 6px)`,
          transform: 'rotate(-6deg)'
        }
      }));
    case 'craft':
      return /*#__PURE__*/React.createElement("div", {
        style: wrap
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 4,
          transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #C8A96B 0%, #4B4038 92%, #2B2A28 100%)',
          borderRadius: 1
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: '50%',
          top: -2,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: item.color,
          transform: 'translateX(-50%)',
          boxShadow: '0 1px 2px rgba(75,64,56,0.3)'
        }
      }));
    case 'seal':
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...wrap,
          display: 'grid',
          placeItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${item.color}, #2F4032)`,
          boxShadow: '0 4px 6px rgba(75,64,56,0.30)',
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: '14%',
          border: '1.5px solid rgba(255,253,246,0.30)',
          borderRadius: '50%'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'rgba(255,253,246,0.85)'
        }
      }, "P")));
    case 'antique':
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...wrap,
          background: `linear-gradient(135deg, ${item.color}33 0%, ${item.color}11 100%), repeating-linear-gradient(0deg, #F4E9D2 0 12px, #ECDFC2 12px 13px)`,
          borderRadius: 2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: 6,
          top: 6,
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          color: item.color,
          opacity: 0.7
        }
      }, "\u2116"), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          right: 6,
          bottom: 6,
          fontFamily: 'var(--font-script)',
          fontStyle: 'italic',
          fontSize: 9,
          color: item.color,
          opacity: 0.6
        }
      }, "1923"));
    default:
      return /*#__PURE__*/React.createElement("div", {
        style: wrap
      });
  }
};

/* ─── Canvas + spread (unchanged from prior revision) ──────────── */

const CanvasViewport = ({
  activePage,
  pages,
  texture,
  frontCover,
  backCover,
  placedByPage,
  zoom,
  setZoom,
  flip,
  onTurn,
  spreadRef,
  dragOverSide,
  selection,
  setSelection,
  onItemPointerDown,
  onCanvasMouseDown,
  onDeletePage,
  canDeletePage,
  onBeginResize,
  onBeginRotate
}) => {
  const lastPinchDist = React.useRef(null);
  const onWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.min(1.6, Math.max(0.6, z - e.deltaY * 0.002)));
    }
  };
  const onTouchMove = e => {
    if (e.touches.length !== 2) return;
    const [a, b] = e.touches;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (lastPinchDist.current != null) {
      const delta = (dist - lastPinchDist.current) * 0.005;
      setZoom(z => Math.min(1.6, Math.max(0.6, z + delta)));
    }
    lastPinchDist.current = dist;
  };
  const onTouchEnd = () => {
    lastPinchDist.current = null;
  };
  const isFirst = activePage === 1;
  const isLast = activePage === pages;
  const isCover = isFirst || isLast;
  return /*#__PURE__*/React.createElement("div", {
    onPointerDown: e => onCanvasMouseDown?.(e.target),
    onWheel: onWheel,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    style: {
      flex: 1,
      position: 'relative',
      background: 'radial-gradient(700px 500px at 50% 40%, rgba(255,253,246,0.7), transparent 70%),' + 'var(--bg-3)',
      display: 'grid',
      placeItems: 'center',
      padding: 30,
      overflow: 'hidden',
      touchAction: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${zoom})`,
      transition: 'transform 220ms var(--ease-paper)',
      transformOrigin: 'center center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Spread, {
    activePage: activePage,
    pages: pages,
    texture: texture,
    frontCover: frontCover,
    backCover: backCover,
    placedByPage: placedByPage,
    flip: flip,
    spreadRef: spreadRef,
    dragOverSide: dragOverSide,
    selection: selection,
    onItemPointerDown: onItemPointerDown,
    setSelection: setSelection,
    onBeginResize: onBeginResize,
    onBeginRotate: onBeginRotate
  })), activePage > 1 && !flip && /*#__PURE__*/React.createElement("button", {
    onClick: () => onTurn('prev'),
    title: "Previous page",
    style: {
      position: 'absolute',
      left: 18,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 44,
      height: 56,
      borderRadius: '999px 4px 4px 999px',
      background: 'rgba(255,253,246,0.85)',
      border: '1px solid var(--pp-hairline)',
      color: 'var(--fg-2)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'var(--sh-paper)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 22
  })), activePage < pages && !flip && /*#__PURE__*/React.createElement("button", {
    onClick: () => onTurn('next'),
    title: "Next page",
    style: {
      position: 'absolute',
      right: 18,
      top: '50%',
      transform: 'translateY(-50%) scaleX(-1)',
      width: 44,
      height: 56,
      borderRadius: '999px 4px 4px 999px',
      background: 'rgba(255,253,246,0.85)',
      border: '1px solid var(--pp-hairline)',
      color: 'var(--fg-2)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'var(--sh-paper)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 18,
      left: 22,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      color: 'var(--fg-3)',
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--pp-success)'
    }
  }), "Saved a moment ago"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 18,
      right: 22,
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onDeletePage,
    disabled: !canDeletePage,
    title: canDeletePage ? `Delete page ${activePage}` : 'You can\u2019t delete a cover page',
    "aria-label": `Delete page ${activePage}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      minHeight: 32,
      borderRadius: 999,
      background: 'rgba(255,253,246,0.85)',
      border: '1px solid var(--pp-hairline)',
      color: canDeletePage ? 'var(--pp-danger)' : 'var(--fg-4)',
      fontFamily: 'var(--font-ui)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      cursor: canDeletePage ? 'pointer' : 'not-allowed',
      opacity: canDeletePage ? 1 : 0.55,
      transition: 'background 160ms var(--ease-paper)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 14
  }), " Delete page"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--fg-4)',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Pinch \xB7 \u2318scroll to zoom \xB7 ", Math.round(zoom * 100), "%")), isCover && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 18,
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--fg-3)',
      background: 'rgba(255,253,246,0.85)',
      padding: '4px 14px',
      borderRadius: 999,
      border: '1px solid var(--pp-hairline-soft)'
    }
  }, isFirst ? 'Front cover' : 'Back cover'));
};
const SPREAD_W = 720;
const SPREAD_H = 500;
const Spread = ({
  activePage,
  pages,
  texture,
  frontCover,
  backCover,
  placedByPage,
  flip,
  spreadRef,
  dragOverSide,
  selection,
  onItemPointerDown,
  setSelection,
  onBeginResize,
  onBeginRotate
}) => {
  const isFirst = activePage === 1;
  const isLast = activePage === pages;
  let leftIs, rightIs;
  if (isFirst) {
    leftIs = 'cover-front';
    rightIs = 1;
  } else if (isLast) {
    leftIs = pages;
    rightIs = 'cover-back';
  } else if (activePage % 2 === 0) {
    leftIs = activePage;
    rightIs = activePage + 1 <= pages ? activePage + 1 : 'cover-back';
  } else {
    leftIs = activePage - 1 >= 1 ? activePage - 1 : 'cover-front';
    rightIs = activePage;
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: spreadRef,
    style: {
      width: SPREAD_W,
      height: SPREAD_H,
      position: 'relative',
      background: '#7E5E3F',
      border: '3px solid #6B4F33',
      borderRadius: 6,
      boxShadow: '0 30px 50px -20px rgba(75,64,56,.40), 0 8px 16px -8px rgba(75,64,56,.25)',
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 18,
      bottom: 18,
      width: 12,
      transform: 'translateX(-50%)',
      background: 'linear-gradient(180deg, #5C4129, #3D2A1A)',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.2), inset 1px 0 0 rgba(255,255,255,0.06)',
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 18,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(PageSide, {
    side: "left",
    pageOrCover: leftIs,
    texture: texture,
    frontCover: frontCover,
    backCover: backCover,
    endpaper: leftIs === 1 ? frontCover : leftIs === pages ? backCover : null,
    placed: typeof leftIs === 'number' ? placedByPage[leftIs] || [] : [],
    highlight: dragOverSide === 'left',
    pageNumber: typeof leftIs === 'number' ? leftIs : null,
    selection: selection,
    onItemPointerDown: onItemPointerDown,
    setSelection: setSelection,
    onBeginResize: onBeginResize,
    onBeginRotate: onBeginRotate
  }), /*#__PURE__*/React.createElement(PageSide, {
    side: "right",
    pageOrCover: rightIs,
    texture: texture,
    frontCover: frontCover,
    backCover: backCover,
    endpaper: rightIs === 1 ? frontCover : rightIs === pages ? backCover : null,
    placed: typeof rightIs === 'number' ? placedByPage[rightIs] || [] : [],
    highlight: dragOverSide === 'right',
    pageNumber: typeof rightIs === 'number' ? rightIs : null,
    selection: selection,
    onItemPointerDown: onItemPointerDown,
    setSelection: setSelection,
    onBeginResize: onBeginResize,
    onBeginRotate: onBeginRotate
  })), flip && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 18,
      bottom: 18,
      left: flip.dir === 'next' ? '50%' : 18,
      right: flip.dir === 'next' ? 18 : '50%',
      transformStyle: 'preserve-3d',
      perspective: 1600,
      pointerEvents: 'none',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      transformOrigin: flip.dir === 'next' ? 'left center' : 'right center',
      animation: `flip-${flip.dir} 620ms cubic-bezier(0.32, 0.72, 0.32, 1) forwards`,
      ...textureBackground(texture),
      border: '1px solid rgba(75,64,56,0.10)',
      boxShadow: '0 18px 30px -10px rgba(75,64,56,0.30)'
    }
  })), /*#__PURE__*/React.createElement("style", null, `
        @keyframes flip-next {
          0%   { transform: rotateY(0); box-shadow: 0 18px 30px -10px rgba(75,64,56,0.30); }
          100% { transform: rotateY(-178deg); box-shadow: -18px 18px 30px -10px rgba(75,64,56,0.30); }
        }
        @keyframes flip-prev {
          0%   { transform: rotateY(0); box-shadow: 0 18px 30px -10px rgba(75,64,56,0.30); }
          100% { transform: rotateY(178deg); box-shadow: 18px 18px 30px -10px rgba(75,64,56,0.30); }
        }
        @keyframes newGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196, 123, 99, 0), var(--sh-paper); }
          50%      { box-shadow: 0 0 12px 2px rgba(196, 123, 99, 0.50), var(--sh-paper); }
        }
      `));
};
const PageSide = ({
  side,
  pageOrCover,
  texture,
  frontCover,
  backCover,
  endpaper,
  placed,
  highlight,
  pageNumber,
  selection,
  onItemPointerDown,
  setSelection,
  onBeginResize,
  onBeginRotate
}) => {
  const isCover = pageOrCover === 'cover-front' || pageOrCover === 'cover-back';
  if (isCover) {
    const coverId = pageOrCover === 'cover-front' ? frontCover : backCover;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: 'relative',
        boxShadow: side === 'left' ? 'inset -8px 0 16px rgba(0,0,0,0.30), inset 1px 0 0 rgba(0,0,0,0.15)' : 'inset  8px 0 16px rgba(0,0,0,0.30), inset -1px 0 0 rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(CoverArt, {
      cover: coverId
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side === 'left' ? 'right' : 'left']: 0,
        width: 14,
        background: side === 'left' ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.22))' : 'linear-gradient(-90deg, transparent, rgba(0,0,0,0.22))',
        pointerEvents: 'none'
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      ...textureBackground(texture),
      borderRight: side === 'left' ? '1px solid rgba(75,64,56,0.08)' : 'none',
      boxShadow: side === 'left' ? 'inset -8px 0 14px -8px rgba(75,64,56,0.18)' : 'inset  8px 0 14px -8px rgba(75,64,56,0.18)',
      overflow: 'hidden',
      outline: highlight ? '3px solid var(--accent)' : 'none',
      outlineOffset: highlight ? '-3px' : '0',
      transition: 'outline 140ms var(--ease-paper)'
    }
  }, endpaper && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CoverArt, {
    cover: endpaper
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(255,253,246,0.64)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      [side === 'left' ? 'right' : 'left']: 0,
      width: 18,
      background: side === 'left' ? 'linear-gradient(90deg, transparent, rgba(75,64,56,0.16))' : 'linear-gradient(-90deg, transparent, rgba(75,64,56,0.16))'
    }
  })), highlight && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'rgba(78,102,82,0.08)'
    }
  }), placed.map((p, i) => {
    const isSelected = selection && selection.page === pageNumber && selection.index === i;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: p.id ?? i
    }, /*#__PURE__*/React.createElement(PlacedItem, {
      item: p,
      isSelected: isSelected,
      onPointerDown: ev => {
        ev.stopPropagation();
        onItemPointerDown?.(pageNumber, i, side, ev);
      }
    }), isSelected && /*#__PURE__*/React.createElement(SelectionFrame, {
      item: p,
      onBeginResize: (handle, ev) => onBeginResize?.(pageNumber, i, side, handle, ev),
      onBeginRotate: ev => onBeginRotate?.(pageNumber, i, side, ev)
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 10,
      [side === 'left' ? 'left' : 'right']: 16,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 13,
      color: 'var(--fg-4)'
    }
  }, pageOrCover));
};
const ZoomControl = ({
  zoom,
  setZoom
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'var(--bg-2)',
    borderRadius: 999,
    padding: 2,
    height: 36
  }
}, /*#__PURE__*/React.createElement("button", {
  onClick: () => setZoom(z => Math.max(0.6, z - 0.1)),
  "aria-label": "Zoom out",
  style: {
    width: 30,
    height: 30,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--fg-2)',
    borderRadius: 999,
    fontSize: 18,
    lineHeight: 1
  }
}, "\u2212"), /*#__PURE__*/React.createElement("div", {
  style: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--fg-2)',
    fontWeight: 600
  }
}, Math.round(zoom * 100), "%"), /*#__PURE__*/React.createElement("button", {
  onClick: () => setZoom(z => Math.min(1.6, z + 0.1)),
  "aria-label": "Zoom in",
  style: {
    width: 30,
    height: 30,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--fg-2)',
    borderRadius: 999,
    fontSize: 18,
    lineHeight: 1
  }
}, "+"));
const TextureControl = ({
  texture,
  setTexture
}) => {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 14px',
      minHeight: 36,
      borderRadius: 999,
      background: 'var(--bg-2)',
      border: 'none',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      color: 'var(--fg-2)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paper",
    size: 16
  }), " ", PAGE_TEXTURES[texture].label), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 0,
      zIndex: 30,
      background: 'var(--surface-card)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 10,
      padding: 6,
      boxShadow: 'var(--sh-card)',
      minWidth: 180
    }
  }, Object.entries(PAGE_TEXTURES).map(([id, info]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => {
      setTexture(id);
      setOpen(false);
    },
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 8px',
      borderRadius: 6,
      background: id === texture ? 'var(--bg-2)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 4,
      border: '1px solid var(--pp-hairline)',
      ...textureBackground(id)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--fg-1)',
      fontWeight: 600
    }
  }, info.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--fg-3)'
    }
  }, info.desc))))));
};
const PlacedItem = ({
  item,
  isSelected,
  onPointerDown
}) => {
  // The selection frame is now drawn as a separate sibling so this just renders the artwork.
  const wrap = children => /*#__PURE__*/React.createElement("div", {
    "data-placed-item": "",
    onPointerDown: onPointerDown,
    style: {
      position: 'absolute',
      left: item.x,
      top: item.y,
      width: item.w,
      height: item.h,
      transform: item.rotate ? `rotate(${item.rotate}deg)` : 'none',
      cursor: 'grab',
      touchAction: 'none'
    }
  }, children);
  if (item.type === 'washi' || item.type === 'tape') return wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: item.color,
      opacity: 0.85,
      borderTop: '1px dashed rgba(0,0,0,0.10)',
      borderBottom: '1px dashed rgba(0,0,0,0.10)',
      boxShadow: 'var(--sh-tape)'
    }
  }));
  if (item.type === 'flower-image' && item.imageSrc) return wrap(/*#__PURE__*/React.createElement("img", {
    src: item.imageSrc,
    alt: "",
    draggable: false,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 4px 8px rgba(75,64,56,0.25))',
      pointerEvents: 'none',
      userSelect: 'none'
    }
  }));
  if (item.type === 'card') return wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: 'repeating-linear-gradient(0deg, #FFFDF6 0 14px, #F8F1E2 14px 15px)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 3,
      padding: 8,
      boxShadow: 'var(--sh-tape)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontSize: 9,
      letterSpacing: '0.18em'
    }
  }, item.label || 'POSTCARD'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 12,
      color: 'var(--fg-3)'
    }
  }, "Greetings from the coast \u2014 ")));
  if (item.type === 'flower') return wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '46%',
      top: 18,
      bottom: 0,
      width: 2,
      background: item.color
    }
  }), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: i === 0 ? 8 : i === 1 ? 'auto' : 24,
      right: i === 1 ? 8 : 'auto',
      top: 18 + i * 18,
      width: 22,
      height: 12,
      background: item.color,
      opacity: 0.55,
      borderRadius: '12px 2px 12px 2px',
      transform: `rotate(${i * 22 - 18}deg)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'var(--pp-soft-rose)',
      boxShadow: 'inset 0 0 0 2px rgba(75,64,56,0.18)'
    }
  })));
  if (item.type === 'stamp') return wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#FFFDF6',
      border: `2px dashed ${item.color}`,
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(75,64,56,0.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 8,
      height: 'calc(100% - 16px)',
      background: `linear-gradient(135deg, ${item.color}55, ${item.color}22)`,
      borderRadius: 1
    }
  })));
  if (item.type === 'seal') return wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle at 35% 30%, ${item.color}, #2F4032)`,
      borderRadius: '50%',
      boxShadow: '0 4px 8px rgba(75,64,56,0.35)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 8,
      border: '1.5px solid rgba(255,255,255,0.3)',
      borderRadius: '50%'
    }
  })));
  if (item.type === 'button') return wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 30%, ${item.color}, ${item.color}aa)`,
      boxShadow: '0 2px 4px rgba(75,64,56,0.25), inset 0 0 0 2px rgba(255,255,255,0.18)',
      position: 'relative'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.4)',
      left: i % 2 === 0 ? '36%' : '54%',
      top: i < 2 ? '36%' : '54%'
    }
  })))));
  return null;
};

/* ─── Selection frame (Canva-style outline + handles) ──────────── */

const HANDLES = [{
  id: 'nw',
  hx: -1,
  hy: -1,
  cursor: 'nwse-resize'
}, {
  id: 'n',
  hx: 0,
  hy: -1,
  cursor: 'ns-resize'
}, {
  id: 'ne',
  hx: 1,
  hy: -1,
  cursor: 'nesw-resize'
}, {
  id: 'e',
  hx: 1,
  hy: 0,
  cursor: 'ew-resize'
}, {
  id: 'se',
  hx: 1,
  hy: 1,
  cursor: 'nwse-resize'
}, {
  id: 's',
  hx: 0,
  hy: 1,
  cursor: 'ns-resize'
}, {
  id: 'sw',
  hx: -1,
  hy: 1,
  cursor: 'nesw-resize'
}, {
  id: 'w',
  hx: -1,
  hy: 0,
  cursor: 'ew-resize'
}];
const SelectionFrame = ({
  item,
  onBeginResize,
  onBeginRotate
}) => {
  // Rendered as a sibling of PlacedItem inside the same PageSide, so
  // positioning matches: left/top/width/height in page-local coords,
  // rotated about the center.
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: item.x,
      top: item.y,
      width: item.w,
      height: item.h,
      transform: item.rotate ? `rotate(${item.rotate}deg)` : 'none',
      pointerEvents: 'none',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -1,
      border: '1.5px solid var(--accent)',
      borderRadius: 2
    }
  }), HANDLES.map(h => {
    const isEdge = h.hx === 0 || h.hy === 0;
    const sz = 12;
    return /*#__PURE__*/React.createElement("div", {
      key: h.id,
      "data-handle": h.id,
      onPointerDown: e => {
        e.preventDefault();
        e.stopPropagation();
        onBeginResize(h, e);
      },
      style: {
        position: 'absolute',
        left: h.hx < 0 ? -sz / 2 : h.hx > 0 ? `calc(100% - ${sz / 2}px)` : `calc(50% - ${sz / 2}px)`,
        top: h.hy < 0 ? -sz / 2 : h.hy > 0 ? `calc(100% - ${sz / 2}px)` : `calc(50% - ${sz / 2}px)`,
        width: sz,
        height: sz,
        borderRadius: isEdge ? 2 : '50%',
        background: 'var(--surface-card)',
        border: '1.5px solid var(--accent)',
        boxShadow: '0 1px 3px rgba(75,64,56,0.30)',
        cursor: h.cursor,
        pointerEvents: 'auto',
        touchAction: 'none'
      }
    });
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '100%',
      transform: 'translate(-50%, 14px)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1.5,
      height: 14,
      background: 'var(--accent)',
      margin: '-14px auto 0'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onPointerDown: e => {
      e.preventDefault();
      e.stopPropagation();
      onBeginRotate(e);
    },
    "aria-label": "Rotate",
    title: "Rotate",
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      border: '1.5px solid var(--accent)',
      boxShadow: 'var(--sh-paper)',
      color: 'var(--accent)',
      cursor: 'grab',
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'auto',
      touchAction: 'none',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-3-6.8"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "21 4 21 9 16 9"
  })))));
};
const ConfirmDialog = ({
  title,
  body,
  confirmLabel = 'Confirm',
  danger = false,
  onCancel,
  onConfirm
}) => /*#__PURE__*/React.createElement("div", {
  onPointerDown: onCancel,
  style: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(43,42,40,0.45)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 90
  }
}, /*#__PURE__*/React.createElement("div", {
  onPointerDown: e => e.stopPropagation(),
  style: {
    background: 'var(--surface-card)',
    borderRadius: 16,
    border: '1px solid var(--pp-hairline)',
    boxShadow: '0 30px 60px -20px rgba(75,64,56,0.45)',
    padding: '24px 26px 20px',
    maxWidth: 420,
    width: '90%'
  }
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    margin: '0 0 10px',
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    fontSize: 22,
    color: 'var(--fg-1)'
  }
}, title), /*#__PURE__*/React.createElement("p", {
  style: {
    margin: '0 0 22px',
    fontSize: 14,
    color: 'var(--fg-2)',
    lineHeight: 1.5
  }
}, body), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end'
  }
}, /*#__PURE__*/React.createElement("button", {
  className: "pp-btn pp-btn-ghost",
  onClick: onCancel
}, "Never mind"), /*#__PURE__*/React.createElement("button", {
  onClick: onConfirm,
  className: "pp-btn",
  style: danger ? {
    background: 'transparent',
    color: 'var(--pp-danger)',
    border: '1.5px solid var(--pp-danger)'
  } : {
    background: 'var(--accent)',
    color: 'var(--surface-card)'
  }
}, confirmLabel))));
Object.assign(window, {
  JournalEditor
});

// ── Editable journal title ────────────────────────────────────────────────
// Click to edit. Commits on Enter or blur, cancels on Esc.
const EditableJournalTitle = ({
  name,
  onCommit,
  editing,
  setEditing
}) => {
  const [draft, setDraft] = React.useState(name);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (!editing) setDraft(name);
  }, [name, editing]);
  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);
  const commit = () => {
    const trimmed = (draft || '').trim();
    if (trimmed && trimmed !== name) onCommit?.(trimmed);else setDraft(name);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(name);
    setEditing(false);
  };
  if (editing) {
    return /*#__PURE__*/React.createElement("input", {
      ref: inputRef,
      value: draft,
      onChange: e => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      },
      maxLength: 40,
      "aria-label": "Journal name",
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        color: 'var(--fg-1)',
        background: 'var(--bg-2)',
        border: '1px solid var(--pp-hairline)',
        borderRadius: 8,
        padding: '4px 10px',
        width: 'min(360px, 36vw)',
        outline: 'none',
        letterSpacing: '-0.005em'
      }
    });
  }
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(true),
    title: "Rename this journal",
    "aria-label": `Rename journal, currently ${name}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 0,
      padding: '4px 8px',
      borderRadius: 8,
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--fg-1)',
      letterSpacing: '-0.005em',
      maxWidth: 'min(360px, 36vw)',
      overflow: 'hidden',
      transition: 'background 160ms var(--ease-paper)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-4)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 14
  })));
};

// ── Undo / redo control for the topbar ───────────────────────────────────
const UndoRedo = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const btn = enabled => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 999,
    border: 'none',
    background: 'var(--bg-2)',
    color: enabled ? 'var(--fg-1)' : 'var(--fg-4)',
    cursor: enabled ? 'pointer' : 'default',
    opacity: enabled ? 1 : 0.45,
    transition: 'background 140ms var(--ease-paper)'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btn(canUndo),
    disabled: !canUndo,
    onClick: onUndo,
    title: "Undo (\u2318Z)",
    "aria-label": "Undo"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "undo",
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    style: btn(canRedo),
    disabled: !canRedo,
    onClick: onRedo,
    title: "Redo (\u2318\u21E7Z)",
    "aria-label": "Redo"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "redo",
    size: 18
  })));
};

// ── Layers button for the topbar ─────────────────────────────────────────
const LayersButton = ({
  count = 0,
  active,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  title: "Layers \u2014 reorder items on this page",
  style: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 14px',
    minHeight: 36,
    borderRadius: 999,
    background: active ? 'rgba(78,102,82,0.12)' : 'var(--bg-2)',
    border: active ? '1px solid var(--pp-forest, #4E6652)' : '1px solid transparent',
    fontFamily: 'var(--font-ui)',
    fontSize: 12,
    color: active ? 'var(--pp-forest, #4E6652)' : 'var(--fg-2)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "layers",
  size: 15
}), " Layers", count > 0 && /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'var(--font-ui)',
    fontSize: 11,
    fontWeight: 700,
    background: active ? 'var(--pp-forest, #4E6652)' : 'var(--pp-stone-warm, #7A6B52)',
    color: '#FFFDF6',
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    display: 'inline-grid',
    placeItems: 'center',
    padding: '0 5px',
    letterSpacing: 0
  }
}, count));

// Friendly label for a placed item shown in the Layers list.
const placedLabel = it => {
  if (it.label) return it.label.charAt(0) + it.label.slice(1).toLowerCase();
  const map = {
    washi: 'Washi tape',
    tape: 'Tape',
    card: 'Postcard',
    flower: 'Pressed flower',
    'flower-image': 'Pressed flower',
    stamp: 'Stamp',
    seal: 'Wax seal',
    button: 'Button',
    antique: 'Ephemera',
    craft: 'Charm',
    fabric: 'Fabric'
  };
  return map[it.type] || 'Item';
};

// ── Layers panel ─────────────────────────────────────────────────────────
// Lists the active page's placed items front → back. Drag a row up to bring a
// piece forward, down to send it back. Tapping a row selects it on the canvas.
const LayersPanel = ({
  open,
  onClose,
  page,
  items,
  selection,
  onSelect,
  onReorder
}) => {
  const ROW_H = 52; // row height incl. the 6px gap
  const n = items.length;
  // Display order is front-most first → reverse of the z-order array.
  const display = items.map((it, idx) => ({
    it,
    idx
  })).reverse();
  const [drag, setDrag] = React.useState(null); // { from(display), dy, target(display) }
  const startRef = React.useRef(null);
  const onGripDown = (displayIndex, e) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    startRef.current = {
      y: e.clientY,
      from: displayIndex
    };
    setDrag({
      from: displayIndex,
      dy: 0,
      target: displayIndex
    });
  };
  const onGripMove = e => {
    if (!startRef.current) return;
    const dy = e.clientY - startRef.current.y;
    const target = Math.max(0, Math.min(n - 1, Math.round((startRef.current.from * ROW_H + dy) / ROW_H)));
    setDrag({
      from: startRef.current.from,
      dy,
      target
    });
  };
  const onGripUp = e => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    if (startRef.current && drag) {
      const fromArr = n - 1 - drag.from;
      const toArr = n - 1 - drag.target;
      if (fromArr !== toArr) onReorder?.(fromArr, toArr);
    }
    startRef.current = null;
    setDrag(null);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement("aside", {
    role: "dialog",
    "aria-label": "Layers",
    style: {
      position: 'absolute',
      top: 68,
      right: 16,
      zIndex: 30,
      width: 296,
      maxHeight: 'calc(100% - 150px)',
      background: 'var(--surface-card)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 14,
      boxShadow: 'var(--sh-card)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
      animation: 'pp-fb-in 220ms var(--ease-paper) both'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes pp-fb-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: '1px solid var(--pp-hairline-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Layers"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      color: 'var(--fg-1)',
      marginTop: 2
    }
  }, "Page ", page)), /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn",
    onClick: onClose,
    "aria-label": "Close layers"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18
  }))), n === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 18px',
      textAlign: 'center',
      color: 'var(--fg-3)',
      fontSize: 13.5,
      lineHeight: 1.5
    }
  }, "No items on this page yet.", /*#__PURE__*/React.createElement("br", null), "Add some from your collection to stack them here.") : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, display.map((row, di) => {
    const isSel = selection && selection.page === page && selection.index === row.idx;
    const isDragging = drag && drag.from === di;
    const lifted = isDragging ? drag.dy : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: row.it.id ?? row.idx,
      onClick: () => onSelect?.(row.idx),
      style: {
        display: 'grid',
        gridTemplateColumns: '26px 36px 1fr auto',
        alignItems: 'center',
        gap: 10,
        height: ROW_H - 6,
        marginBottom: 6,
        padding: '0 8px',
        borderRadius: 10,
        cursor: 'pointer',
        background: isSel ? 'rgba(78,102,82,0.10)' : 'var(--bg-2)',
        border: isSel ? '1.5px solid var(--pp-forest, #4E6652)' : '1.5px solid var(--pp-hairline)',
        transform: isDragging ? `translateY(${lifted}px) scale(1.02)` : 'none',
        boxShadow: isDragging ? 'var(--sh-lift)' : 'none',
        transition: isDragging ? 'none' : 'background 140ms, border-color 140ms',
        position: 'relative',
        zIndex: isDragging ? 5 : 1,
        touchAction: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onPointerDown: e => onGripDown(di, e),
      onPointerMove: onGripMove,
      onPointerUp: onGripUp,
      onPointerCancel: onGripUp,
      title: "Drag to reorder",
      style: {
        display: 'grid',
        placeItems: 'center',
        height: '100%',
        cursor: 'grab',
        color: 'var(--fg-4)',
        touchAction: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "grip",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--pp-cream)',
        border: '1px solid var(--pp-hairline)'
      }
    }, row.it.imageSrc ? /*#__PURE__*/React.createElement("img", {
      src: row.it.imageSrc,
      alt: "",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 4,
        borderRadius: 3,
        background: row.it.color || 'var(--pp-sage)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--fg-1)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, placedLabel(row.it)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--fg-4)'
      }
    }, di === 0 ? 'Front' : di === n - 1 ? 'Back' : `Layer ${n - di}`)), /*#__PURE__*/React.createElement("div", null));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 8px 2px',
      fontSize: 11,
      color: 'var(--fg-4)',
      lineHeight: 1.4
    }
  }, "Top of the list sits in front. Drag a row up or down to restack.")));
};

// ── Item details panel (single click on a collection tile) ───────────────
const ItemDetailsModal = ({
  item,
  categoryLabel,
  onClose,
  onAdd
}) => {
  React.useEffect(() => {
    if (!item) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);
  if (!item) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 40,
      background: 'rgba(43,42,40,0.32)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      animation: 'pp-scrim-in 200ms var(--ease-paper) both',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes pp-scrim-in{from{opacity:0}to{opacity:1}}@keyframes pp-det-in{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}`), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 540,
      background: 'var(--surface-card)',
      borderRadius: 18,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45)',
      overflow: 'hidden',
      animation: 'pp-det-in 280ms var(--ease-paper) both',
      display: 'grid',
      gridTemplateColumns: '200px 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'radial-gradient(420px 320px at 40% 30%, rgba(255,253,246,0.9), transparent 70%), var(--bg-3)',
      display: 'grid',
      placeItems: 'center',
      padding: 22,
      borderRight: '1px solid var(--pp-hairline-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 150,
      height: 196,
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--pp-cream)',
      border: '1.5px solid var(--pp-hairline)',
      borderRadius: 8,
      boxShadow: 'var(--sh-card)'
    }
  }, /*#__PURE__*/React.createElement(CollectionGlyph, {
    item: item
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 20px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, categoryLabel || 'Collection'), /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      margin: -6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '6px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 26,
      letterSpacing: '-0.005em',
      color: 'var(--fg-1)',
      lineHeight: 1.1
    }
  }, item.name || placedLabel(item)), item.isNew && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      alignSelf: 'flex-start',
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      background: 'var(--pp-terracotta)',
      color: 'var(--surface-card)',
      padding: '3px 9px',
      borderRadius: 999,
      fontWeight: 700
    }
  }, "New this week"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--fg-2)'
    }
  }, item.desc || 'A piece from your collection, ready to place on the page.'), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    style: {
      height: 46,
      padding: '0 22px',
      borderRadius: 999,
      border: 0,
      background: 'var(--pp-forest, #4E6652)',
      color: '#FFFDF6',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: 'var(--sh-paper)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add",
    size: 18
  }), " Add to page"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--fg-4)',
      lineHeight: 1.4,
      maxWidth: 150
    }
  }, "Tip: double-click or drag the tile to place it instantly.")))));
};

// ── Editor ad banner (removed by subscription) ───────────────────────────
const EditorAdBanner = ({
  onUpgrade
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    zIndex: 6,
    background: 'linear-gradient(180deg, #FFFDF6 0%, #F4ECDC 100%)',
    borderTop: '1px solid var(--pp-hairline)',
    boxShadow: '0 -2px 10px rgba(75,64,56,0.07)',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 14,
    padding: '0 16px',
    fontFamily: 'var(--font-ui)'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 6,
    flexShrink: 0,
    background: 'repeating-linear-gradient(45deg, #E8DCC4 0 8px, #DDD0B6 8px 16px)',
    display: 'grid',
    placeItems: 'center',
    color: 'var(--fg-3)',
    fontFamily: 'var(--font-paper)',
    fontSize: 9,
    letterSpacing: '0.18em'
  }
}, "AD"), /*#__PURE__*/React.createElement("div", {
  style: {
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-paper)',
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--fg-3)'
  }
}, "Sponsored"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-display)',
    fontSize: 15,
    color: 'var(--fg-1)',
    marginTop: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}, "Your advertisement here"))), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("button", {
  onClick: onUpgrade,
  style: {
    height: 38,
    padding: '0 16px',
    borderRadius: 999,
    background: 'var(--pp-forest, #4E6652)',
    border: 0,
    color: '#FFFDF6',
    fontFamily: 'var(--font-ui)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    boxShadow: 'var(--sh-paper)'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "sparkle",
  size: 15
}), " Remove ads with subscription"));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/JournalEditor.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LegalModal.jsx
try { (() => {
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

const LegalModal = ({
  open,
  onClose,
  children
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      background: 'rgba(45,38,30,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      animation: 'pp-scrim-in 200ms var(--ease-paper) both'
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 720,
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      animation: 'pp-modal-in 280ms var(--ease-paper) both'
    }
  }, children));
};
const LegalDocument = ({
  title,
  effective,
  onClose,
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: 'var(--surface-card, #FFFDF6)',
    borderRadius: 18,
    border: '1px solid var(--pp-hairline)',
    boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--font-ui)',
    maxHeight: '100%'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '1fr 44px',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--pp-hairline)',
    background: 'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)'
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-paper)',
    fontSize: 11,
    letterSpacing: '0.22em',
    color: 'var(--fg-3)',
    textTransform: 'uppercase'
  }
}, "Legal"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    color: 'var(--fg-1)',
    lineHeight: 1.1,
    marginTop: 4,
    letterSpacing: '-0.005em'
  }
}, title), effective && /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-script)',
    fontStyle: 'italic',
    fontSize: 14,
    color: 'var(--fg-3)',
    marginTop: 4
  }
}, "Effective ", effective)), /*#__PURE__*/React.createElement("button", {
  onClick: onClose,
  "aria-label": "Close",
  style: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'var(--surface-card)',
    border: '1px solid var(--pp-hairline)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--fg-1)',
    boxShadow: '0 2px 4px rgba(75,64,56,0.10)'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "close",
  size: 18
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    overflowY: 'auto',
    padding: '20px 28px 28px',
    lineHeight: 1.6,
    fontSize: 14,
    color: 'var(--fg-1)'
  }
}, children), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    padding: '14px 20px',
    borderTop: '1px solid var(--pp-hairline)',
    background: 'rgba(247,242,232,0.7)'
  }
}, /*#__PURE__*/React.createElement("button", {
  onClick: onClose,
  style: {
    height: 44,
    padding: '0 22px',
    borderRadius: 999,
    background: 'var(--pp-forest, #4E6652)',
    color: '#FFFDF6',
    border: 0,
    fontFamily: 'var(--font-ui)',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    boxShadow: '0 4px 10px -2px rgba(78,102,82,0.45)'
  }
}, "Done")));

// ── Markdown-ish rendering helpers ────────────────────────────────────────
// Tiny renderer specialised for the legal doc shape (H1/H2, paragraphs,
// bullet lists). Not a full markdown engine — keeps the output styled in
// the brand voice.

const LegalH2 = ({
  children
}) => /*#__PURE__*/React.createElement("h2", {
  style: {
    fontFamily: 'var(--font-display)',
    fontSize: 17,
    color: 'var(--fg-1)',
    margin: '28px 0 8px',
    letterSpacing: '-0.005em',
    fontWeight: 600
  }
}, children);
const LegalP = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: '0 0 12px',
    color: 'var(--fg-2)'
  }
}, children);
const LegalUL = ({
  items
}) => /*#__PURE__*/React.createElement("ul", {
  style: {
    margin: '0 0 14px',
    padding: '0 0 0 20px',
    color: 'var(--fg-2)'
  }
}, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
  key: i,
  style: {
    margin: '4px 0'
  }
}, it)));

// Render a markdown string into our brand-styled blocks. Handles H1/H2,
// "- " bullet lists, blank-line separated paragraphs, **bold**, and
// auto-links email addresses. Enough for the legal docs we need.
const renderLegalMarkdown = src => {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let key = 0;
  const inline = text => {
    // bold
    const parts = [];
    const re = /\*\*([^*]+)\*\*/g;
    let last = 0,
      m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push(/*#__PURE__*/React.createElement("strong", {
        key: parts.length,
        style: {
          color: 'var(--fg-1)'
        }
      }, m[1]));
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    // email autolink — flatten string parts and replace
    return parts.flatMap((p, idx) => {
      if (typeof p !== 'string') return [p];
      const segs = [];
      const er = /([\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;
      let l = 0,
        em;
      while ((em = er.exec(p)) !== null) {
        if (em.index > l) segs.push(p.slice(l, em.index));
        segs.push(/*#__PURE__*/React.createElement("a", {
          key: `${idx}-${em.index}`,
          href: `mailto:${em[1]}`,
          style: {
            color: 'var(--pp-terracotta)',
            textDecoration: 'underline'
          }
        }, em[1]));
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
      out.push(/*#__PURE__*/React.createElement(LegalH2, {
        key: key++
      }, line.replace(/^##\s+/, '')));
      i++;
      continue;
    }
    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^-\s+/, '')));
        i++;
      }
      out.push(/*#__PURE__*/React.createElement(LegalUL, {
        key: key++,
        items: items
      }));
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }

    // paragraph — accumulate until blank line or block
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^(#|-)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(/*#__PURE__*/React.createElement(LegalP, {
      key: key++
    }, inline(buf.join(' '))));
  }
  return out;
};

// ── Document fetching ────────────────────────────────────────────────────
// Singleton cache so we only fetch each markdown file once per session.
const DOC_CACHE = {};
const useLegalDocument = url => {
  const [state, setState] = React.useState(() => DOC_CACHE[url] ? {
    status: 'loaded',
    text: DOC_CACHE[url]
  } : {
    status: 'loading'
  });
  React.useEffect(() => {
    if (DOC_CACHE[url]) {
      setState({
        status: 'loaded',
        text: DOC_CACHE[url]
      });
      return;
    }
    let alive = true;
    fetch(url).then(r => r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))).then(t => {
      DOC_CACHE[url] = t;
      if (alive) setState({
        status: 'loaded',
        text: t
      });
    }).catch(err => alive && setState({
      status: 'error',
      error: err.message
    }));
    return () => {
      alive = false;
    };
  }, [url]);
  return state;
};

// Concrete document modals — used by the Settings page.

const TermsOfServiceModal = ({
  open,
  onClose
}) => {
  const doc = useLegalDocument('../../cozy-craft-journal/ProjectDocumentation/Terms_of_Service.md');
  return /*#__PURE__*/React.createElement(LegalModal, {
    open: open,
    onClose: onClose
  }, /*#__PURE__*/React.createElement(LegalDocument, {
    title: "Terms of Service",
    effective: "27 May 2026",
    onClose: onClose
  }, doc.status === 'loading' && /*#__PURE__*/React.createElement(LegalP, null, /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "Loading\u2026")), doc.status === 'error' && /*#__PURE__*/React.createElement(LegalP, null, "Sorry, we couldn\u2019t load this document right now."), doc.status === 'loaded' && renderLegalMarkdown(doc.text)));
};
const PrivacyPolicyModal = ({
  open,
  onClose
}) => {
  const doc = useLegalDocument('../../cozy-craft-journal/ProjectDocumentation/Privacy_Policy.md');
  return /*#__PURE__*/React.createElement(LegalModal, {
    open: open,
    onClose: onClose
  }, /*#__PURE__*/React.createElement(LegalDocument, {
    title: "Privacy Policy",
    effective: "27 May 2026",
    onClose: onClose
  }, doc.status === 'loading' && /*#__PURE__*/React.createElement(LegalP, null, /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "Loading\u2026")), doc.status === 'error' && /*#__PURE__*/React.createElement(LegalP, null, "Sorry, we couldn\u2019t load this document right now."), doc.status === 'loaded' && renderLegalMarkdown(doc.text)));
};
Object.assign(window, {
  LegalModal,
  LegalDocument,
  TermsOfServiceModal,
  PrivacyPolicyModal,
  renderLegalMarkdown,
  useLegalDocument
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LegalModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Loading.jsx
try { (() => {
// SCR-01 Loading. Universal load splash.
// Parchment background, monogram seal cycling colourways, progress bar, and a
// rotating loading phrase that crossfades every 3 seconds.
// When `progress` reaches 1, the stage softly fades and `onComplete()` fires.
// Caller routes the user based on launch state (new user → Welcome, returning ·
// first today → Package, returning · later → Home).

const LOGO_COLORWAYS = ['../../assets/logos/logo_sage.png', '../../assets/logos/logo_terracotta.png', '../../assets/logos/logo_mauve.png', '../../assets/logos/logo_dusty_rose.png', '../../assets/logos/logo_blue.png', '../../assets/logos/logo_rose.png'];
const LOADING_PHRASES = ['Tearing vintage paper', 'Layering pretty things', 'Pressing wildflowers', 'Sorting the sticker drawer', 'Hunting for ephemera', 'Stitching paper scraps', 'Adding washi tape', 'Collecting tiny treasures', 'Brewing creative ideas', 'Flipping through old journals', 'Arranging paper layers', 'Inking botanical stamps', 'Saving beautiful memories', 'Drying flower petals', 'Curating your craft desk', 'Dusting off old postcards', 'Organising the paper stash', 'Snipping delicate florals', 'Building cozy journal spreads', 'Gathering scraps and stories', 'Making fussy cuts'];
const Loading = ({
  progress = 0,
  onComplete
}) => {
  const [logoIdx, setLogoIdx] = React.useState(0);
  // Randomise phrase start so each load doesn't always begin with "Tearing…".
  const [phraseIdx, setPhraseIdx] = React.useState(() => Math.floor(Math.random() * LOADING_PHRASES.length));
  const [departing, setDeparting] = React.useState(false);

  // Cycle the logo colourway every 500ms.
  React.useEffect(() => {
    const id = setInterval(() => setLogoIdx(i => (i + 1) % LOGO_COLORWAYS.length), 500);
    return () => clearInterval(id);
  }, []);

  // Advance the loading phrase every 3 seconds.
  React.useEffect(() => {
    const id = setInterval(() => setPhraseIdx(i => (i + 1) % LOADING_PHRASES.length), 3000);
    return () => clearInterval(id);
  }, []);

  // Keep onComplete in a ref so the timer's closure always sees the latest
  // callback even if the host swaps it (e.g. user changes launchState).
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });

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
    width: '100%',
    height: '100%',
    position: 'relative',
    background: 'radial-gradient(1200px 700px at 50% 40%, rgba(255,255,255,0.65), rgba(255,255,255,0) 65%),' + 'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' + 'var(--bg-1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 96,
    fontFamily: 'var(--font-ui)',
    opacity: departing ? 0 : 1,
    transition: 'opacity 380ms var(--ease-paper)'
  };

  // Corner botanical placeholders — very low-opacity sprigs (placeholder art).
  const cornerSprig = pos => ({
    position: 'absolute',
    width: 110,
    height: 110,
    opacity: 0.16,
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle at 30% 70%, var(--pp-sage) 0 8px, transparent 9px),' + 'radial-gradient(circle at 55% 50%, var(--pp-muted-olive) 0 6px, transparent 7px),' + 'radial-gradient(circle at 65% 70%, var(--pp-sage) 0 5px, transparent 6px),' + 'radial-gradient(circle at 45% 35%, var(--pp-sage) 0 4px, transparent 5px)',
    ...pos
  });
  return /*#__PURE__*/React.createElement("div", {
    style: loadingStyle
  }, /*#__PURE__*/React.createElement("style", null, `
        .pp-phrase {
          position: absolute; inset: 0;
          font-family: var(--font-paper);
          font-size: 12px;
          letter-spacing: 0.22em;
          color: var(--pp-stone);
          text-transform: uppercase;
        }
      `), /*#__PURE__*/React.createElement("div", {
    style: cornerSprig({
      top: 24,
      left: 24
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: cornerSprig({
      top: 24,
      right: 24,
      transform: 'scaleX(-1)'
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: cornerSprig({
      bottom: 24,
      left: 24,
      transform: 'scaleY(-1)'
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: cornerSprig({
      bottom: 24,
      right: 24,
      transform: 'scale(-1,-1)'
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 260,
      height: 260,
      position: 'relative'
    }
  }, LOGO_COLORWAYS.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: src,
    src: src,
    alt: "Paper & Petals",
    style: {
      position: 'absolute',
      inset: 0,
      width: 260,
      height: 260,
      opacity: i === logoIdx ? 1 : 0,
      transition: 'opacity 240ms var(--ease-paper)',
      filter: 'drop-shadow(0 12px 32px rgba(75,64,56,.18))'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      height: 22,
      position: 'relative',
      width: 'min(640px, 86%)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-phrase"
  }, LOADING_PHRASES[phraseIdx], /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: '0.02em'
    }
  }, "\u2026"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      width: 220,
      height: 2,
      borderRadius: 999,
      background: 'var(--pp-hairline)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.min(1, progress) * 100}%`,
      height: '100%',
      background: 'var(--accent)',
      transition: 'width 320ms var(--ease-paper)'
    }
  })));
};
Object.assign(window, {
  Loading,
  LOADING_PHRASES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Loading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PackageOpening.jsx
try { (() => {
// SCR-03 Package Opening. First-open-of-the-day ritual:
// 1) wiggling postage box on parchment background
// 2) user taps → box "opens" (lid lifts, contents drift up)
// 3) soft cross-fade to the pack contents reveal
// 4) another tap → transitions to the craft room
//
// Three internal phases: 'closed' | 'opening' | 'reveal'
// `onContinue` fires on the final tap from the reveal phase.

const PackageOpening = ({
  onContinue
}) => {
  const [phase, setPhase] = React.useState('closed');
  const handleTap = () => {
    if (phase === 'closed') {
      setPhase('opening');
      window.setTimeout(() => setPhase('reveal'), 700);
    } else if (phase === 'reveal') {
      onContinue?.();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: handleTap,
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'radial-gradient(900px 600px at 50% 40%, rgba(255,253,246,0.7), transparent 70%),' + 'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' + 'var(--bg-2)',
      cursor: 'pointer',
      overflow: 'hidden',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 24,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 20,
      color: 'var(--fg-2)'
    }
  }, "Thursday, 4 April"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 58,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 11,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'var(--fg-3)',
      fontWeight: 600
    }
  }, "A small parcel has arrived"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      opacity: phase === 'reveal' ? 0 : 1,
      transition: 'opacity 480ms var(--ease-paper)',
      pointerEvents: phase === 'reveal' ? 'none' : 'auto'
    }
  }, /*#__PURE__*/React.createElement(PostageBox, {
    phase: phase
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      opacity: phase === 'reveal' ? 1 : 0,
      transition: 'opacity 600ms var(--ease-paper)',
      pointerEvents: phase === 'reveal' ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement(PackReveal, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 38,
      textAlign: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--fg-4)',
      fontWeight: 600,
      animation: 'tapHint 2.4s var(--ease-paper) infinite'
    }
  }, phase === 'closed' && 'Tap the parcel when you\u2019re ready', phase === 'opening' && '\u00A0', phase === 'reveal' && 'Tap anywhere to step into your craft room'), /*#__PURE__*/React.createElement("style", null, `
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
      `));
};

/* ─── The parcel itself ─────────────────────────────────────────── */
const PostageBox = ({
  phase
}) => {
  const opening = phase === 'opening';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 320,
      height: 270,
      animation: phase === 'closed' ? 'boxWiggle 1.6s var(--ease-paper) infinite' : 'none',
      transition: 'transform 600ms var(--ease-paper)',
      transformOrigin: 'center bottom'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      right: 20,
      top: 70,
      bottom: 0,
      background: 'linear-gradient(180deg, #D2B58B 0%, #B89163 100%)',
      borderRadius: 6,
      boxShadow: '0 18px 24px -10px rgba(75,64,56,0.40),' + 'inset 0 1px 0 rgba(255,255,255,0.3),' + 'inset 0 -8px 14px rgba(75,64,56,0.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      top: 22,
      width: 60,
      height: 76,
      background: 'var(--pp-cream)',
      border: '2px dashed var(--pp-terracotta)',
      borderRadius: 2,
      padding: 4,
      boxShadow: '0 2px 4px rgba(75,64,56,0.20)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, var(--pp-terracotta) 0%, var(--pp-soft-rose) 100%)',
      borderRadius: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) rotate(-12deg)',
      color: 'var(--surface-card)',
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      textShadow: '0 1px 0 rgba(75,64,56,0.5)'
    }
  }, "P&P")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 28,
      top: 30,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 17,
      color: 'rgba(75,64,56,0.7)',
      transform: 'rotate(-3deg)'
    }
  }, "For you,", /*#__PURE__*/React.createElement("br", null), "with care"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: -10,
      bottom: -2,
      width: 4,
      background: 'linear-gradient(180deg, #7A6B52, #4B4038)',
      transform: 'translateX(-50%)',
      opacity: opening ? 0 : 1,
      transition: 'opacity 400ms var(--ease-paper)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '52%',
      left: -2,
      right: -2,
      height: 4,
      background: 'linear-gradient(90deg, #7A6B52, #4B4038, #7A6B52)',
      transform: 'translateY(-50%)',
      opacity: opening ? 0 : 1,
      transition: 'opacity 400ms var(--ease-paper)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 36,
      width: 38,
      height: 18,
      transform: 'translateX(-50%)',
      opacity: opening ? 0 : 1,
      transition: 'opacity 400ms var(--ease-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'transparent',
      border: '3px solid #4B4038',
      transform: 'rotate(-20deg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'transparent',
      border: '3px solid #4B4038',
      transform: 'rotate(20deg)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 8,
      right: 8,
      top: 40,
      height: 60,
      background: 'linear-gradient(180deg, #DCC09A 0%, #C2A07A 100%)',
      borderRadius: 6,
      boxShadow: '0 6px 10px -4px rgba(75,64,56,0.35),' + 'inset 0 1px 0 rgba(255,255,255,0.4)',
      transformOrigin: 'top center',
      transform: opening ? 'rotateX(-110deg) translateY(-30px)' : 'rotateX(0) translateY(0)',
      transition: 'transform 700ms var(--ease-paper)',
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 6,
      bottom: 6,
      width: 4,
      background: 'linear-gradient(180deg, #7A6B52, #4B4038)',
      transform: 'translateX(-50%)',
      opacity: opening ? 0 : 1,
      transition: 'opacity 300ms var(--ease-paper)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 40,
      right: 40,
      top: 60,
      height: 90,
      background: 'linear-gradient(180deg, var(--pp-soft-rose) 0%, #EFE9E1 70%)',
      borderRadius: '4px 4px 0 0',
      opacity: opening ? 1 : 0,
      transform: opening ? 'translateY(-20px)' : 'translateY(20px)',
      transition: 'all 700ms var(--ease-paper)',
      boxShadow: '0 -4px 8px rgba(75,64,56,0.15)',
      clipPath: 'polygon(0 100%, 100% 100%, 100% 24%, 76% 12%, 50% 26%, 24% 8%, 0 22%)'
    }
  }));
};

/* ─── Pack contents reveal ──────────────────────────────────────── */
const PackReveal = () => {
  // Floating items drift in
  const items = [{
    type: 'paper',
    label: 'Vintage paper',
    color: 'var(--pp-soft-rose)',
    delay: 0,
    rot: -4
  }, {
    type: 'flower',
    label: 'Pressed daisy',
    color: 'var(--pp-muted-olive)',
    delay: 120,
    rot: 3
  }, {
    type: 'stamp',
    label: 'Postage stamp',
    color: 'var(--pp-terracotta)',
    delay: 240,
    rot: -6
  }, {
    type: 'seal',
    label: 'Wax seal',
    color: 'var(--pp-forest)',
    delay: 360,
    rot: 0
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22,
      paddingTop: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--pp-forest)'
    }
  }, "Today's delivery"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 38,
      margin: 0,
      color: 'var(--fg-1)',
      letterSpacing: '-0.005em',
      textAlign: 'center'
    }
  }, "Four new pieces for your collection"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 18,
      color: 'var(--fg-2)',
      margin: 0,
      textAlign: 'center',
      maxWidth: 480
    }
  }, "Saved straight to your craft room \u2014 nothing ever expires."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 16
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      animation: `itemDrift 520ms var(--ease-petal) ${it.delay}ms both`,
      ['--rot']: `${it.rot}deg`
    }
  }, /*#__PURE__*/React.createElement(PackTile, {
    item: it
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--fg-3)',
      fontWeight: 600
    }
  }, it.label)))));
};
const PackTile = ({
  item
}) => {
  const base = {
    width: 110,
    height: 130,
    background: 'var(--pp-cream)',
    border: '1.5px solid var(--pp-hairline)',
    borderRadius: 4,
    boxShadow: 'var(--sh-tape)',
    position: 'relative',
    transform: `rotate(${item.rot}deg)`
  };
  if (item.type === 'paper') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        background: 'repeating-linear-gradient(0deg, #FFFDF6 0 14px, #F8F1E2 14px 15px)'
      }
    });
  }
  if (item.type === 'flower') {
    return /*#__PURE__*/React.createElement("div", {
      style: base
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '46%',
        top: 30,
        bottom: 18,
        width: 2,
        background: item.color
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'var(--pp-soft-rose)',
        boxShadow: 'inset 0 0 0 2px rgba(75,64,56,0.18)'
      }
    }), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: i === 0 ? 14 : i === 1 ? 'auto' : 34,
        right: i === 1 ? 14 : 'auto',
        top: 50 + i * 18,
        width: 22,
        height: 10,
        background: item.color,
        opacity: 0.55,
        borderRadius: '12px 2px 12px 2px',
        transform: `rotate(${i * 22 - 18}deg)`
      }
    })));
  }
  if (item.type === 'stamp') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        border: `2px dashed ${item.color}`,
        padding: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${item.color}77, ${item.color}33)`,
        borderRadius: 2
      }
    }));
  }
  if (item.type === 'seal') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 76,
        height: 76,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${item.color}, #2F4032)`,
        boxShadow: '0 6px 10px rgba(75,64,56,0.35)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 10,
        border: '1.5px solid rgba(255,255,255,0.3)',
        borderRadius: '50%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        color: 'rgba(255,253,246,0.85)'
      }
    }, "P")));
  }
  return null;
};
Object.assign(window, {
  PackageOpening
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PackageOpening.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Settings.jsx
try { (() => {
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
  cursor: 'default'
};
const settingsRowDivider = {
  borderTop: '1px solid var(--pp-hairline)'
};
const SettingsRow = ({
  icon,
  title,
  description,
  trailing,
  onClick,
  divider,
  danger
}) => /*#__PURE__*/React.createElement("div", {
  onClick: onClick,
  style: {
    ...settingsRowStyle,
    ...(divider ? settingsRowDivider : null),
    cursor: onClick ? 'pointer' : 'default',
    transition: 'background 160ms var(--ease-paper)'
  },
  onMouseEnter: e => onClick && (e.currentTarget.style.background = 'rgba(75,64,56,0.03)'),
  onMouseLeave: e => onClick && (e.currentTarget.style.background = 'transparent')
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'grid',
    placeItems: 'center',
    color: danger ? 'var(--pp-terracotta)' : 'var(--pp-forest, #4E6652)',
    background: danger ? 'rgba(196,123,99,0.10)' : 'rgba(78,102,82,0.10)'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: icon,
  size: 18
})), /*#__PURE__*/React.createElement("div", {
  style: {
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 15,
    fontWeight: 600,
    color: danger ? 'var(--pp-terracotta)' : 'var(--fg-1)',
    letterSpacing: '0.005em'
  }
}, title), description && /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    color: 'var(--fg-3)',
    marginTop: 2,
    lineHeight: 1.35
  }
}, description)), trailing && /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'var(--fg-3)'
  }
}, trailing));
const Toggle = ({
  on,
  onChange
}) => /*#__PURE__*/React.createElement("button", {
  onClick: () => onChange?.(!on),
  "aria-pressed": on,
  style: {
    width: 44,
    height: 26,
    borderRadius: 999,
    background: on ? 'var(--pp-forest, #4E6652)' : 'rgba(75,64,56,0.18)',
    border: 0,
    padding: 0,
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 200ms var(--ease-paper)'
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    position: 'absolute',
    top: 3,
    left: on ? 21 : 3,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--surface-card)',
    boxShadow: '0 2px 4px rgba(75,64,56,0.30)',
    transition: 'left 200ms var(--ease-paper)'
  }
}));
const ValuePill = ({
  value
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    padding: '6px 12px',
    borderRadius: 999,
    background: 'var(--bg-2)',
    border: '1px solid var(--pp-hairline)',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--fg-2)',
    letterSpacing: '0.01em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6
  }
}, value);
const ChevronEnd = () => /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'var(--pp-stone)',
    display: 'inline-flex'
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "chevron",
  size: 18,
  stroke: 2
}));
const SectionCard = ({
  eyebrow,
  children
}) => /*#__PURE__*/React.createElement("section", {
  style: {
    marginBottom: 28
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-paper)',
    fontSize: 11,
    letterSpacing: '0.22em',
    color: 'var(--fg-3)',
    textTransform: 'uppercase',
    padding: '0 8px 10px'
  }
}, eyebrow), /*#__PURE__*/React.createElement("div", {
  style: {
    background: 'var(--surface-card, #FFFDF6)',
    borderRadius: 16,
    border: '1px solid var(--pp-hairline)',
    boxShadow: '0 2px 4px rgba(75,64,56,0.05), 0 12px 24px -16px rgba(75,64,56,0.12)',
    overflow: 'hidden'
  }
}, children));

// Vintage stamp-style status badge — used for membership status, account state.
const StatusStamp = ({
  tone = 'sage',
  children
}) => {
  const palette = {
    sage: {
      bg: 'rgba(78,102,82,0.10)',
      fg: 'var(--pp-forest, #4E6652)',
      border: 'rgba(78,102,82,0.30)'
    },
    cream: {
      bg: 'rgba(75,64,56,0.06)',
      fg: 'var(--fg-2)',
      border: 'var(--pp-hairline)'
    },
    gold: {
      bg: 'rgba(168,137,63,0.14)',
      fg: '#7E6322',
      border: 'rgba(168,137,63,0.45)'
    },
    terracotta: {
      bg: 'rgba(196,123,99,0.12)',
      fg: 'var(--pp-terracotta)',
      border: 'rgba(196,123,99,0.35)'
    }
  }[tone] || {};
  return /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      borderRadius: 999,
      background: palette.bg,
      color: palette.fg,
      border: `1px solid ${palette.border}`,
      fontFamily: 'var(--font-paper)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, children);
};
const Settings = ({
  onBack,
  onManageSubscription,
  onStartSubscription,
  subscribed = false,
  onToggleSubscribed,
  device = 'tablet'
}) => {
  const phone = device === 'phone';
  const [prefs, setPrefs] = React.useState({
    sound: true,
    haptics: true,
    autosave: true,
    notifyDelivery: true,
    notifyPacks: false,
    analytics: true
  });
  // Account + sync state. In production this is owned by the auth/sync provider
  // (see Backend Integration Guide — e.g. Supabase Auth + a local-first sync
  // engine); signing in turns on automatic cross-device journal sync.
  const [account, setAccount] = React.useState({
    signedIn: false,
    email: '',
    lastSynced: 'just now'
  });
  const signIn = () => setAccount({
    signedIn: true,
    email: 'alice@papercraft.studio',
    lastSynced: 'just now'
  });
  const signOut = () => setAccount({
    signedIn: false,
    email: '',
    lastSynced: ''
  });
  // Membership status is owned by the app shell so subscribing here also clears
  // the ad banners on Home (SCR-05) and the Journal Editor (SCR-07).
  // Which legal document, if any, is currently open as a modal.
  // 'terms' | 'privacy' | null
  const [legalDoc, setLegalDoc] = React.useState(null);
  // Feedback form modal (routes to the third-party feedback manager).
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const setPref = (k, v) => setPrefs(p => ({
    ...p,
    [k]: v
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "pp-stage",
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'radial-gradient(900px 600px at 50% 25%, rgba(255,253,246,0.65), rgba(255,253,246,0) 60%),' + 'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' + 'var(--bg-1)',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 4,
      height: 76,
      display: 'grid',
      gridTemplateColumns: '76px 1fr 76px',
      alignItems: 'center',
      padding: '0 20px',
      background: 'linear-gradient(180deg, rgba(255,253,246,0.72) 0%, rgba(255,253,246,0) 100%)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Back",
    className: "pp-icon-btn",
    style: {
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--fg-1)',
      letterSpacing: '-0.005em'
    }
  }, "Settings"), /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: '92px 0 24px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: phone ? '0 14px' : '0 24px'
    }
  }, /*#__PURE__*/React.createElement(SectionCard, {
    eyebrow: "Account & sync"
  }, account.signedIn ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "user",
    title: account.email,
    description: "Signed in. Your journals back up and sync automatically across every device you use.",
    trailing: /*#__PURE__*/React.createElement(StatusStamp, {
      tone: "sage"
    }, "Synced")
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "refresh",
    title: "Automatic sync",
    description: `Last synced ${account.lastSynced}. Changes save in the background — no manual saving needed.`,
    trailing: /*#__PURE__*/React.createElement(ValuePill, {
      value: "On"
    })
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "user",
    title: "Playing locally",
    description: "Your journals live on this device. Create a free account to back them up and sync across devices.",
    trailing: /*#__PURE__*/React.createElement(StatusStamp, {
      tone: "cream"
    }, "Local only")
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "sparkle",
    title: "Create account & turn on sync",
    description: "Back up your journals and pick up on any device \u2014 phone or tablet. Takes a moment.",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: signIn
  }))), /*#__PURE__*/React.createElement(SectionCard, {
    eyebrow: "Membership"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "crown",
    title: subscribed ? 'Paper & Petals premium' : 'Paper & Petals free',
    description: subscribed ? 'Renews monthly. Includes all seasonal packs and the premium daily delivery.' : 'Subscribe to unlock seasonal packs and the richer premium daily delivery.',
    trailing: subscribed ? /*#__PURE__*/React.createElement(StatusStamp, {
      tone: "gold"
    }, "Premium") : /*#__PURE__*/React.createElement(StatusStamp, {
      tone: "cream"
    }, "Free")
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: subscribed ? 'settings' : 'sparkle',
    title: subscribed ? 'Manage subscription' : 'Start subscription',
    description: subscribed ? 'Change plan, pause, or cancel at any time. You keep everything you\u2019ve collected.' : 'A small monthly fee. Cancel any time \u2014 your items and journals are yours forever.',
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: () => {
      // For demo only \u2014 in product, this navigates to SCR-24 Subscription.
      if (subscribed) {
        onManageSubscription?.();
      } else {
        onStartSubscription?.();
      }
      onToggleSubscribed?.();
    }
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "refresh",
    title: "Restore purchases",
    description: "Restore packs and subscriptions from your App Store account.",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: () => {}
  })), /*#__PURE__*/React.createElement(SectionCard, {
    eyebrow: "Preferences"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "volume",
    title: "Sound effects",
    description: "Soft paper rustles when you place an item.",
    trailing: /*#__PURE__*/React.createElement(Toggle, {
      on: prefs.sound,
      onChange: v => setPref('sound', v)
    })
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "stamp",
    title: "Haptic feedback",
    description: "Gentle taps confirm presses on supported devices.",
    trailing: /*#__PURE__*/React.createElement(Toggle, {
      on: prefs.haptics,
      onChange: v => setPref('haptics', v)
    })
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "check",
    title: "Autosave",
    description: "Save journal spreads as you place items. We don\\u2019t recommend turning this off.",
    trailing: /*#__PURE__*/React.createElement(Toggle, {
      on: prefs.autosave,
      onChange: v => setPref('autosave', v)
    })
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "package",
    title: "Daily delivery time",
    description: "When your daily parcel of items arrives.",
    trailing: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ValuePill, {
      value: "9:00 AM"
    }), /*#__PURE__*/React.createElement(ChevronEnd, null)),
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "flower",
    title: "Logo colourway",
    description: "Choose which monogram seal greets you on the loading screen.",
    trailing: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ValuePill, {
      value: "Sage"
    }), /*#__PURE__*/React.createElement(ChevronEnd, null)),
    onClick: () => {}
  })), /*#__PURE__*/React.createElement(SectionCard, {
    eyebrow: "Notifications"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "bell",
    title: "Daily delivery reminder",
    description: "A soft nudge when your parcel of items is ready.",
    trailing: /*#__PURE__*/React.createElement(Toggle, {
      on: prefs.notifyDelivery,
      onChange: v => setPref('notifyDelivery', v)
    })
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "gift",
    title: "New seasonal packs",
    description: "Hear about new collections \\u2014 about once a month.",
    trailing: /*#__PURE__*/React.createElement(Toggle, {
      on: prefs.notifyPacks,
      onChange: v => setPref('notifyPacks', v)
    })
  })), /*#__PURE__*/React.createElement(SectionCard, {
    eyebrow: "Privacy & data"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "shield",
    title: "Anonymous usage analytics",
    description: "Helps us improve the app. Never includes your journal content.",
    trailing: /*#__PURE__*/React.createElement(Toggle, {
      on: prefs.analytics,
      onChange: v => setPref('analytics', v)
    })
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "archive",
    title: "Export your journals",
    description: "Save all of your journals as a single archive you can keep.",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "doc",
    title: "Privacy policy",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: () => setLegalDoc('privacy')
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "doc",
    title: "Terms of service",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: () => setLegalDoc('terms')
  })), /*#__PURE__*/React.createElement(SectionCard, {
    eyebrow: "About"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "info",
    title: "Version",
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-paper)',
        fontSize: 12,
        letterSpacing: '0.14em',
        color: 'var(--fg-3)'
      }
    }, "1.0.0 \xB7 MAY 2026")
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    icon: "mail",
    title: "Send feedback",
    description: "Share an idea, report a bug, or vote on what we build next \u2014 it opens our feedback board.",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: () => setFeedbackOpen(true)
  }), account.signedIn && /*#__PURE__*/React.createElement(SettingsRow, {
    divider: true,
    danger: true,
    icon: "logout",
    title: "Sign out",
    trailing: /*#__PURE__*/React.createElement(ChevronEnd, null),
    onClick: signOut
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 16,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--pp-stone)'
    }
  }, "with care, from the Paper\xA0", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pp-terracotta)'
    }
  }, "&"), "\xA0Petals studio"))), /*#__PURE__*/React.createElement(TermsOfServiceModal, {
    open: legalDoc === 'terms',
    onClose: () => setLegalDoc(null)
  }), /*#__PURE__*/React.createElement(PrivacyPolicyModal, {
    open: legalDoc === 'privacy',
    onClose: () => setLegalDoc(null)
  }), /*#__PURE__*/React.createElement(FeedbackModal, {
    open: feedbackOpen,
    onClose: () => setFeedbackOpen(false)
  }));
};
Object.assign(window, {
  Settings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Shop.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// SCR-06 Shop.
//
// Inspired by a Canva-style home: a search bar at the top, a row of category
// shortcuts under it, and a scrollable grid of items below. Tapping an item
// opens a Toca-Boca-style detail panel with a large preview, description,
// related items, and either a price button or an "Owned" stamp.
//
// All items here are mock data — when a real catalogue lands, replace
// SHOP_CATALOGUE and the placeholder thumbnails. Categories ARE final.

const SHOP_CATEGORIES = [{
  id: 'all',
  label: 'All',
  icon: 'sparkle'
}, {
  id: 'collections',
  label: 'Collections',
  icon: 'package'
}, {
  id: 'papers',
  label: 'Papers & backgrounds',
  icon: 'doc'
}, {
  id: 'stickers',
  label: 'Stickers',
  icon: 'seal'
}, {
  id: 'tape',
  label: 'Tape & fasteners',
  icon: 'ribbon'
}, {
  id: 'ephemera',
  label: 'Ephemera',
  icon: 'archive'
}, {
  id: 'florals',
  label: 'Florals & botanicals',
  icon: 'flower'
}, {
  id: 'frames',
  label: 'Frames & containers',
  icon: 'border'
}, {
  id: 'type',
  label: 'Writing & typography',
  icon: 'edit'
}, {
  id: 'paint',
  label: 'Paint & artistic',
  icon: 'palette'
}, {
  id: 'fabric',
  label: 'Sewing & fabric',
  icon: 'scissors'
}, {
  id: 'photos',
  label: 'Photos & memory keeping',
  icon: 'image'
}, {
  id: 'details',
  label: 'Decorative details',
  icon: 'star'
}];

// ── Catalogue ────────────────────────────────────────────────────────────

const SHOP_CATALOGUE = [
// Curated collections
{
  id: 'col-spring',
  category: 'collections',
  name: 'Spring meadow',
  price: 5.99,
  art: {
    kind: 'collection',
    tone: 'sage',
    glyphs: ['flower', 'flower', 'leaf']
  },
  desc: 'A 32-piece collection of pressed wildflowers, soft botanical papers, and hand-painted ribbon, made for cottagecore spreads.',
  items: 32,
  owned: false,
  isNew: true
}, {
  id: 'col-romance',
  category: 'collections',
  name: 'Old romance',
  price: 6.49,
  art: {
    kind: 'collection',
    tone: 'rose',
    glyphs: ['heart', 'flower', 'stamp']
  },
  desc: '24 pieces drawing from love letters, cherry blossoms, and lace handkerchiefs.',
  items: 24,
  owned: true,
  isNew: false
}, {
  id: 'col-coastal',
  category: 'collections',
  name: 'Coastal almanac',
  price: 5.99,
  art: {
    kind: 'collection',
    tone: 'blue',
    glyphs: ['shell', 'flag', 'leaf']
  },
  desc: 'Tide charts, soft-tone driftwood, postage from sea-side towns. 28 pieces.',
  items: 28,
  owned: false,
  isNew: false
}, {
  id: 'col-autumn',
  category: 'collections',
  name: 'Autumn library',
  price: 6.99,
  art: {
    kind: 'collection',
    tone: 'amber',
    glyphs: ['leaf', 'book', 'stamp']
  },
  desc: 'Acorns, library cards, foxed pages and dried oak leaves. 30 pieces.',
  items: 30,
  owned: false,
  isNew: true
},
// Papers & backgrounds
{
  id: 'pap-linen',
  category: 'papers',
  name: 'Linen sheets',
  price: 1.99,
  art: {
    kind: 'paper',
    tone: 'cream',
    pattern: 'linen'
  },
  desc: 'Eight cream linen weave backgrounds with subtle directional grain.',
  items: 8,
  owned: true,
  isNew: false
}, {
  id: 'pap-grid',
  category: 'papers',
  name: 'Soft grid pages',
  price: 1.49,
  art: {
    kind: 'paper',
    tone: 'sage',
    pattern: 'grid'
  },
  desc: 'Faint sage grid pages for journaling and notes.',
  items: 6,
  owned: false,
  isNew: false
}, {
  id: 'pap-foxed',
  category: 'papers',
  name: 'Foxed pages',
  price: 2.49,
  art: {
    kind: 'paper',
    tone: 'amber',
    pattern: 'foxed'
  },
  desc: 'Aged paper with botanical foxing marks. Great for layering.',
  items: 10,
  owned: false,
  isNew: true
}, {
  id: 'pap-dots',
  category: 'papers',
  name: 'Soft polka dots',
  price: 1.99,
  art: {
    kind: 'paper',
    tone: 'rose',
    pattern: 'polka'
  },
  desc: 'Six pastel dotted backgrounds in our most-loved palette.',
  items: 6,
  owned: false,
  isNew: false
}, {
  id: 'pap-ledger',
  category: 'papers',
  name: 'Old ledger pages',
  price: 2.99,
  art: {
    kind: 'paper',
    tone: 'mauve',
    pattern: 'lines'
  },
  desc: 'Aged accounting paper. Perfect for memory keeping.',
  items: 8,
  owned: false,
  isNew: false
},
// Stickers
{
  id: 'stk-seals',
  category: 'stickers',
  name: 'Wax seal stickers',
  price: 2.49,
  art: {
    kind: 'sticker',
    tone: 'oxblood',
    shape: 'seal'
  },
  desc: 'Twelve wax-impression seals in cottage palette.',
  items: 12,
  owned: true,
  isNew: false
}, {
  id: 'stk-arrows',
  category: 'stickers',
  name: 'Hand-drawn arrows',
  price: 1.49,
  art: {
    kind: 'sticker',
    tone: 'forest',
    shape: 'arrow'
  },
  desc: 'Soft ink-drawn arrows to point at the things that matter.',
  items: 18,
  owned: false,
  isNew: false
}, {
  id: 'stk-stars',
  category: 'stickers',
  name: 'Hand-drawn stars',
  price: 1.49,
  art: {
    kind: 'sticker',
    tone: 'amber',
    shape: 'star'
  },
  desc: 'A constellation of inked stars and tiny sparkles.',
  items: 14,
  owned: false,
  isNew: true
}, {
  id: 'stk-checks',
  category: 'stickers',
  name: 'Checkmarks & ticks',
  price: 0.99,
  art: {
    kind: 'sticker',
    tone: 'sage',
    shape: 'check'
  },
  desc: 'Twelve cosy ticks and check-marks for to-dos.',
  items: 12,
  owned: false,
  isNew: false
}, {
  id: 'stk-hearts',
  category: 'stickers',
  name: 'Tiny heart stickers',
  price: 1.49,
  art: {
    kind: 'sticker',
    tone: 'rose',
    shape: 'heart'
  },
  desc: 'Painted hearts in three sizes, all the right pinks.',
  items: 16,
  owned: false,
  isNew: false
},
// Tape & fasteners
{
  id: 'tap-washi',
  category: 'tape',
  name: 'Sage washi',
  price: 1.99,
  art: {
    kind: 'tape',
    tone: 'sage'
  },
  desc: 'Sage washi tape in three widths.',
  items: 6,
  owned: true,
  isNew: false
}, {
  id: 'tap-floral',
  category: 'tape',
  name: 'Floral washi roll',
  price: 2.49,
  art: {
    kind: 'tape',
    tone: 'rose'
  },
  desc: 'Floral pattern washi with soft rose roses on cream.',
  items: 4,
  owned: false,
  isNew: true
}, {
  id: 'tap-stripes',
  category: 'tape',
  name: 'Vintage striped tape',
  price: 1.99,
  art: {
    kind: 'tape',
    tone: 'amber'
  },
  desc: 'Striped washi in warm amber and ivory.',
  items: 4,
  owned: false,
  isNew: false
}, {
  id: 'tap-twine',
  category: 'tape',
  name: 'Garden twine',
  price: 1.49,
  art: {
    kind: 'tape',
    tone: 'mauve'
  },
  desc: 'Soft mauve twine and paper-clip fasteners.',
  items: 8,
  owned: false,
  isNew: false
}, {
  id: 'tap-pins',
  category: 'tape',
  name: 'Brass paperclips',
  price: 1.99,
  art: {
    kind: 'tape',
    tone: 'gold'
  },
  desc: 'Antique brass paperclips and corner stays.',
  items: 10,
  owned: false,
  isNew: false
},
// Ephemera
{
  id: 'eph-postage',
  category: 'ephemera',
  name: 'Vintage postage',
  price: 2.99,
  art: {
    kind: 'ephemera',
    tone: 'oxblood',
    shape: 'stamp'
  },
  desc: 'Twenty vintage postage stamps from old letters.',
  items: 20,
  owned: false,
  isNew: true
}, {
  id: 'eph-tickets',
  category: 'ephemera',
  name: 'Train tickets',
  price: 1.99,
  art: {
    kind: 'ephemera',
    tone: 'mauve',
    shape: 'ticket'
  },
  desc: 'Twelve printed train and tram tickets.',
  items: 12,
  owned: false,
  isNew: false
}, {
  id: 'eph-letters',
  category: 'ephemera',
  name: 'Old letters & notes',
  price: 3.49,
  art: {
    kind: 'ephemera',
    tone: 'cream',
    shape: 'letter'
  },
  desc: 'Eight aged letters with cursive handwriting.',
  items: 8,
  owned: false,
  isNew: false
}, {
  id: 'eph-cards',
  category: 'ephemera',
  name: 'Library cards',
  price: 1.99,
  art: {
    kind: 'ephemera',
    tone: 'amber',
    shape: 'card'
  },
  desc: 'Eight checkout cards from old libraries.',
  items: 8,
  owned: false,
  isNew: false
},
// Florals & botanicals — real assets
{
  id: 'flo-press',
  category: 'florals',
  name: 'Pressed wildflowers',
  price: 3.99,
  art: {
    kind: 'florals',
    files: ['01-cornflower-violet.png', '02-poppy-red.png', '04-wildrose-pink.png']
  },
  desc: 'Six real pressed wildflowers, gently scanned.',
  items: 6,
  owned: true,
  isNew: false
}, {
  id: 'flo-blossom',
  category: 'florals',
  name: 'Cherry blossom',
  price: 2.99,
  art: {
    kind: 'florals',
    files: ['05-cherryblossom-cluster.png']
  },
  desc: 'Two cherry blossom clusters.',
  items: 2,
  owned: false,
  isNew: true
}, {
  id: 'flo-zinnia',
  category: 'florals',
  name: 'Garden zinnias',
  price: 2.49,
  art: {
    kind: 'florals',
    files: ['06-zinnia-crimson.png']
  },
  desc: 'A small bouquet of crimson zinnias.',
  items: 3,
  owned: false,
  isNew: false
}, {
  id: 'flo-cosmos',
  category: 'florals',
  name: 'Lavender cosmos',
  price: 2.49,
  art: {
    kind: 'florals',
    files: ['03-cosmos-lavender.png']
  },
  desc: 'Lavender cosmos in two sizes.',
  items: 2,
  owned: false,
  isNew: false
},
// Frames & containers
{
  id: 'frm-oval',
  category: 'frames',
  name: 'Oval portrait frames',
  price: 2.99,
  art: {
    kind: 'frame',
    shape: 'oval'
  },
  desc: 'Six oval frames for photos and clippings.',
  items: 6,
  owned: false,
  isNew: false
}, {
  id: 'frm-corner',
  category: 'frames',
  name: 'Gilded corners',
  price: 1.99,
  art: {
    kind: 'frame',
    shape: 'corner'
  },
  desc: 'Eight gilded corner pieces for layering.',
  items: 8,
  owned: false,
  isNew: true
}, {
  id: 'frm-tag',
  category: 'frames',
  name: 'Hang-tags & cards',
  price: 2.49,
  art: {
    kind: 'frame',
    shape: 'tag'
  },
  desc: 'Twelve hang-tag shapes with eyelets.',
  items: 12,
  owned: false,
  isNew: false
},
// Writing & typography
{
  id: 'typ-quotes',
  category: 'type',
  name: 'Hand-written quotes',
  price: 2.99,
  art: {
    kind: 'type',
    tone: 'forest',
    style: 'script'
  },
  desc: 'Twenty hand-written cottagecore quotes.',
  items: 20,
  owned: false,
  isNew: false
}, {
  id: 'typ-num',
  category: 'type',
  name: 'Numbers & dates',
  price: 1.99,
  art: {
    kind: 'type',
    tone: 'oxblood',
    style: 'numbers'
  },
  desc: 'Ink-pressed numbers, days of the week, and months.',
  items: 48,
  owned: false,
  isNew: false
}, {
  id: 'typ-labels',
  category: 'type',
  name: 'Type labels',
  price: 2.49,
  art: {
    kind: 'type',
    tone: 'cream',
    style: 'labels'
  },
  desc: 'Press-typed paper labels in nine layouts.',
  items: 9,
  owned: true,
  isNew: false
},
// Paint & artistic
{
  id: 'pnt-splash',
  category: 'paint',
  name: 'Watercolour splashes',
  price: 2.49,
  art: {
    kind: 'paint',
    tone: 'rose'
  },
  desc: 'Soft rose watercolour splashes.',
  items: 8,
  owned: false,
  isNew: true
}, {
  id: 'pnt-strokes',
  category: 'paint',
  name: 'Brush strokes',
  price: 1.99,
  art: {
    kind: 'paint',
    tone: 'sage'
  },
  desc: 'Hand-painted sage brush strokes.',
  items: 10,
  owned: false,
  isNew: false
}, {
  id: 'pnt-pencil',
  category: 'paint',
  name: 'Pencil scribbles',
  price: 1.49,
  art: {
    kind: 'paint',
    tone: 'mauve'
  },
  desc: 'Casual pencil marks and doodles.',
  items: 12,
  owned: false,
  isNew: false
},
// Sewing & fabric
{
  id: 'fab-linen',
  category: 'fabric',
  name: 'Linen swatches',
  price: 2.49,
  art: {
    kind: 'fabric',
    tone: 'sage'
  },
  desc: 'Six woven linen swatches with frayed edges.',
  items: 6,
  owned: false,
  isNew: false
}, {
  id: 'fab-lace',
  category: 'fabric',
  name: 'Antique lace',
  price: 2.99,
  art: {
    kind: 'fabric',
    tone: 'cream'
  },
  desc: 'Lace trim from an old wedding gown.',
  items: 5,
  owned: false,
  isNew: true
}, {
  id: 'fab-stitch',
  category: 'fabric',
  name: 'Cross-stitch motifs',
  price: 1.99,
  art: {
    kind: 'fabric',
    tone: 'rose'
  },
  desc: 'Twelve small embroidered motifs.',
  items: 12,
  owned: false,
  isNew: false
},
// Photos & memory keeping
{
  id: 'pho-polaroid',
  category: 'photos',
  name: 'Polaroid frames',
  price: 2.49,
  art: {
    kind: 'photo',
    shape: 'polaroid'
  },
  desc: 'Six polaroid frames you can fill with a photo.',
  items: 6,
  owned: false,
  isNew: false
}, {
  id: 'pho-vellum',
  category: 'photos',
  name: 'Vellum overlays',
  price: 1.99,
  art: {
    kind: 'photo',
    shape: 'vellum'
  },
  desc: 'Translucent vellum sheets for layering.',
  items: 5,
  owned: false,
  isNew: false
},
// Decorative details
{
  id: 'dec-doily',
  category: 'details',
  name: 'Lace doilies',
  price: 1.99,
  art: {
    kind: 'detail',
    shape: 'doily'
  },
  desc: 'Six paper doilies in cream and ivory.',
  items: 6,
  owned: false,
  isNew: false
}, {
  id: 'dec-ribbon',
  category: 'details',
  name: 'Velvet ribbons',
  price: 2.49,
  art: {
    kind: 'detail',
    shape: 'ribbon'
  },
  desc: 'Eight velvet ribbon ends.',
  items: 8,
  owned: false,
  isNew: false
}, {
  id: 'dec-bow',
  category: 'details',
  name: 'Tiny paper bows',
  price: 1.49,
  art: {
    kind: 'detail',
    shape: 'bow'
  },
  desc: 'Twelve tiny tied paper bows.',
  items: 12,
  owned: false,
  isNew: true
}];

// ── Visual atom: paint a placeholder thumbnail for an item ──────────────
//
// Each item kind has its own visual; everything is CSS / SVG, so they scale
// from the grid tile (130×170) up to the detail preview (260×340).

const SHOP_TONES = {
  sage: {
    bg: '#B6BFA5',
    accent: '#5F6E55',
    ink: 'light'
  },
  forest: {
    bg: '#4E6652',
    accent: '#33473A',
    ink: 'light'
  },
  rose: {
    bg: '#D7B7B0',
    accent: '#9F6F6A',
    ink: 'dark'
  },
  mauve: {
    bg: '#A98C98',
    accent: '#7B5F6B',
    ink: 'light'
  },
  blue: {
    bg: '#9EB1C2',
    accent: '#6E8598',
    ink: 'light'
  },
  amber: {
    bg: '#D9B97A',
    accent: '#9B7B43',
    ink: 'dark'
  },
  cream: {
    bg: '#F1E6CC',
    accent: '#A98C68',
    ink: 'dark'
  },
  oxblood: {
    bg: '#8C3F3A',
    accent: '#5A2222',
    ink: 'light'
  },
  gold: {
    bg: '#D6BD78',
    accent: '#A8893F',
    ink: 'dark'
  }
};
const itemGlyph = (name, color, size = 40) => {
  // Tiny inline SVGs. Brand-friendly outlines, currentColor strokes.
  const c = color || 'currentColor';
  const stroke = {
    stroke: c,
    strokeWidth: 1.5,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  const fill = {
    fill: c
  };
  switch (name) {
    case 'flower':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("g", fill, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "2.4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "6",
        r: "2.8",
        opacity: "0.85"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "12",
        r: "2.8",
        opacity: "0.85"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "12",
        r: "2.8",
        opacity: "0.85"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "18",
        r: "2.8",
        opacity: "0.85"
      })));
    case 'leaf':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 19 C 9 6, 19 5, 19 5 C 19 5, 18 15, 5 19 Z"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 12 L 18 7"
      }, stroke)));
    case 'heart':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 20s-7-4.4-9-9 1.5-7 4-7 5 4 5 4 2.5-4 5-4 6 2 4 7-9 9-9 9z"
      }, fill)));
    case 'star':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("polygon", _extends({
        points: "12,4 14.5,9.5 20.5,10 16,14.5 17.2,20.5 12,17.5 6.8,20.5 8,14.5 3.5,10 9.5,9.5"
      }, fill)));
    case 'check':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 13 L 10 18 L 20 6"
      }, stroke, {
        strokeWidth: "2.2"
      })));
    case 'arrow':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 12 H 19 M14 7 L 19 12 L 14 17"
      }, stroke, {
        strokeWidth: "2"
      })));
    case 'seal':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "8"
      }, fill, {
        opacity: "0.92"
      })), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "5",
        stroke: "#FFFDF6",
        strokeWidth: "1.2",
        fill: "none",
        opacity: "0.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8 v 8 M 8 12 h 8",
        stroke: "#FFFDF6",
        strokeWidth: "1.1",
        opacity: "0.5"
      }));
    case 'stamp':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: "5",
        y: "6",
        width: "14",
        height: "12",
        rx: "1"
      }, stroke)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "2.4"
      }, fill)));
    case 'ticket':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 8 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v2 a 1.5 1.5 0 0 0 0 4 v2 a2 2 0 0 1 -2 2 h -12 a 2 2 0 0 1 -2 -2 v -2 a 1.5 1.5 0 0 0 0 -4 z"
      }, stroke)));
    case 'letter':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: "4",
        y: "6",
        width: "16",
        height: "12",
        rx: "1"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 8 l 8 6 l 8 -6"
      }, stroke)));
    case 'card':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: "4",
        y: "5",
        width: "16",
        height: "14",
        rx: "1.5"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M7 9 h 10 M 7 13 h 10 M 7 17 h 6"
      }, stroke)));
    case 'book':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 5 v14 a 2 2 0 0 1 2 -2 h 14 V 5 H 6 a 2 2 0 0 0 -2 2 z"
      }, stroke)));
    case 'shell':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 4 C 18 4 21 12 19 18 H 5 C 3 12 6 4 12 4 z M 9 6 L 12 18 M 15 6 L 12 18 M 7 10 L 17 10 M 6 14 L 18 14"
      }, stroke)));
    case 'flag':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 21 V 4"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 4 h 11 l -2 4 l 2 4 H 5"
      }, stroke)));
    default:
      return null;
  }
};
const PaperGrain = ({
  opacity = 0.16
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    inset: 0,
    opacity,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,253,246,0.25), transparent 35%),' + 'radial-gradient(circle at 80% 70%, rgba(0,0,0,0.18), transparent 40%),' + 'radial-gradient(circle at 65% 20%, rgba(255,253,246,0.15), transparent 30%)'
  }
});
const ItemArt = ({
  item,
  size = 'tile'
}) => {
  const art = item.art;
  const tone = SHOP_TONES[art.tone] || SHOP_TONES.cream;
  const fg = tone.ink === 'light' ? '#FFFDF6' : '#3A2C1F';
  const wrapStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: `linear-gradient(170deg, ${tone.bg} 0%, ${tone.accent} 100%)`,
    color: fg
  };

  // Paper kinds: pattern fills with subtle colour wash
  if (art.kind === 'paper') {
    const patterns = {
      linen: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
      grid: 'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px) 0 0 / 14px 14px, linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px) 0 0 / 14px 14px',
      foxed: 'radial-gradient(circle at 25% 30%, rgba(168,140,116,0.30), transparent 25%), radial-gradient(circle at 75% 60%, rgba(168,140,116,0.25), transparent 30%)',
      polka: 'radial-gradient(circle, rgba(255,253,246,0.7) 2px, transparent 2.5px) 0 0 / 14px 14px',
      lines: 'repeating-linear-gradient(0deg, transparent 0 22px, rgba(0,0,0,0.08) 22px 23px)'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: patterns[art.pattern] || patterns.linen
      }
    }), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'tape') {
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: -10,
        right: -10,
        top: 18 + i * 32,
        height: 22,
        background: `repeating-linear-gradient(${i % 2 ? -8 : 8}deg, ${tone.accent} 0 12px, ${tone.bg} 12px 24px)`,
        transform: `rotate(${i % 2 ? -4 : 4}deg)`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        opacity: 0.95
      }
    })), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'sticker') {
    const positions = [[22, 28], [62, 22], [40, 50], [20, 70], [62, 64]];
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, positions.map(([x, y], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%,-50%) rotate(${i * 23 % 30 - 15}deg)`,
        color: fg,
        opacity: 0.92
      }
    }, itemGlyph(art.shape, fg, 30))), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'ephemera') {
    const sh = art.shape;
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${15 + i * 22}%`,
        top: `${30 + i % 2 * 22}%`,
        transform: `rotate(${(i - 1) * 8}deg)`,
        color: fg
      }
    }, itemGlyph(sh, fg, 56))), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'florals') {
    const files = art.files || [];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrapStyle,
        background: 'linear-gradient(170deg, #F1E6CC 0%, #DCC9A7 100%)'
      }
    }, files.slice(0, 3).map((f, i) => /*#__PURE__*/React.createElement("img", {
      key: i,
      src: `../../assets/flowers/${f}`,
      alt: "",
      draggable: false,
      style: {
        position: 'absolute',
        left: i === 1 ? '50%' : i === 0 ? '22%' : '78%',
        top: i === 1 ? '50%' : i === 0 ? '38%' : '60%',
        transform: `translate(-50%, -50%) rotate(${(i - 1) * 10}deg)`,
        height: '60%',
        width: 'auto',
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    })), /*#__PURE__*/React.createElement(PaperGrain, {
      opacity: 0.10
    }));
  }
  if (art.kind === 'frame') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrapStyle,
        background: 'linear-gradient(170deg, #EFE5CF 0%, #DCC9A7 100%)'
      }
    }, art.shape === 'oval' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: '20% 22%',
        border: '6px double rgba(58,44,15,0.65)',
        borderRadius: '50%',
        boxShadow: 'inset 0 0 8px rgba(58,44,15,0.18), 0 2px 4px rgba(0,0,0,0.15)'
      }
    }), art.shape === 'corner' && /*#__PURE__*/React.createElement(React.Fragment, null, [[12, 12, 0], [12, 'auto', 'rotate(90deg)'], ['auto', 12, 'rotate(-90deg)'], ['auto', 'auto', 'rotate(180deg)']].map(([t, l, tr], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        top: t === 12 ? 16 : 'auto',
        bottom: t === 'auto' ? 16 : 'auto',
        left: l === 12 ? 16 : 'auto',
        right: l === 'auto' ? 16 : 'auto',
        width: 28,
        height: 28,
        borderTop: '4px solid rgba(58,44,15,0.65)',
        borderLeft: '4px solid rgba(58,44,15,0.65)',
        transform: tr ? tr : 'none'
      }
    }))), art.shape === 'tag' && /*#__PURE__*/React.createElement(React.Fragment, null, [[30, 38, -8], [55, 42, 4]].map(([x, y, r], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '36%',
        height: '40%',
        background: i ? '#E5D8C8' : '#F8F1E2',
        border: '1.5px solid rgba(58,44,15,0.45)',
        borderRadius: 4,
        transform: `translate(-50%,-50%) rotate(${r}deg)`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 6,
        transform: 'translateX(-50%)',
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#A8893F',
        border: '1px solid #7E6322'
      }
    })))), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'type') {
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 6
      }
    }, art.style === 'script' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-script)',
        fontStyle: 'italic',
        fontSize: 26,
        color: fg,
        transform: 'rotate(-3deg)'
      }
    }, "love letters"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-script)',
        fontStyle: 'italic',
        fontSize: 18,
        color: fg,
        opacity: 0.7,
        transform: 'rotate(2deg)'
      }
    }, "memories & little notes")), art.style === 'numbers' && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 42,
        color: fg,
        textAlign: 'center',
        letterSpacing: '0.04em'
      }
    }, "0 1 2", /*#__PURE__*/React.createElement("br", null), "3 4 5"), art.style === 'labels' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(0,0,0,0.12)',
        color: fg,
        padding: '4px 10px',
        borderRadius: 2,
        fontFamily: 'var(--font-paper)',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        alignSelf: 'flex-start'
      }
    }, "monday"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(0,0,0,0.12)',
        color: fg,
        padding: '4px 10px',
        borderRadius: 2,
        fontFamily: 'var(--font-paper)',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        alignSelf: 'flex-end'
      }
    }, "April \xB7 2026"))), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'paint') {
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${15 + i * 22}%`,
        top: `${30 + i % 2 * 30}%`,
        width: 48,
        height: 18,
        background: tone.accent,
        borderRadius: '50%',
        transform: `translate(-50%,-50%) rotate(${i * 30 % 60 - 30}deg)`,
        opacity: 0.85,
        filter: `blur(${i % 2 ? 1 : 0.3}px)`
      }
    })), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'fabric') {
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(45deg, ${tone.accent} 0 4px, transparent 4px 8px),` + `repeating-linear-gradient(-45deg, rgba(0,0,0,0.10) 0 4px, transparent 4px 8px)`
      }
    }), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'photo') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrapStyle,
        background: 'linear-gradient(170deg, #EFE5CF 0%, #DCC9A7 100%)'
      }
    }, art.shape === 'polaroid' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%) rotate(-3deg)',
        width: '62%',
        height: '70%',
        background: '#FFFDF6',
        padding: '8px 8px 22px',
        boxShadow: '0 6px 14px rgba(0,0,0,0.20)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(140deg, #C9D6DD 0%, #6F8598 100%)'
      }
    })), art.shape === 'vellum' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: '15%',
        background: 'rgba(255,253,246,0.55)',
        border: '1.5px solid rgba(75,64,56,0.18)',
        borderRadius: 4,
        backdropFilter: 'blur(1px)'
      }
    }), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  if (art.kind === 'detail') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrapStyle,
        background: 'linear-gradient(170deg, #EFE5CF 0%, #DCC9A7 100%)'
      }
    }, art.shape === 'doily' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: '70%',
        aspectRatio: '1',
        borderRadius: '50%',
        background: '#FFFDF6',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        backgroundImage: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.10) 31%, transparent 33%),' + 'repeating-conic-gradient(rgba(0,0,0,0.08) 0deg 6deg, transparent 6deg 18deg)'
      }
    }), art.shape === 'ribbon' && /*#__PURE__*/React.createElement(React.Fragment, null, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: '50%',
        top: `${30 + i * 38}%`,
        transform: `translate(-50%, -50%) rotate(${i ? 6 : -4}deg)`,
        width: '78%',
        height: 16,
        background: i ? '#A98C98' : '#7C8E6B',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.18)'
      }
    }))), art.shape === 'bow' && /*#__PURE__*/React.createElement(React.Fragment, null, [[30, 40, -6], [60, 55, 6]].map(([x, y, r], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%,-50%) rotate(${r}deg)`,
        width: 56,
        height: 24,
        background: i ? '#D7B7B0' : '#C8A96B',
        clipPath: 'polygon(0% 50%, 22% 0%, 35% 25%, 50% 50%, 35% 75%, 22% 100%, 22% 50%, 78% 50%, 78% 100%, 65% 75%, 50% 50%, 65% 25%, 78% 0%, 78% 50%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.18)'
      }
    }))), /*#__PURE__*/React.createElement(PaperGrain, null));
  }

  // Collections — pile of glyphs over a wash
  if (art.kind === 'collection') {
    return /*#__PURE__*/React.createElement("div", {
      style: wrapStyle
    }, (art.glyphs || []).slice(0, 5).map((g, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${18 + i * 16}%`,
        top: `${28 + i % 3 * 18}%`,
        transform: `translate(-50%,-50%) rotate(${i * 36 % 60 - 30}deg)`,
        color: fg,
        opacity: 0.92
      }
    }, itemGlyph(g, fg, 56))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-paper)',
        fontSize: 9,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: fg,
        opacity: 0.85,
        fontWeight: 600
      }
    }, "collection"), /*#__PURE__*/React.createElement(PaperGrain, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: wrapStyle
  }, /*#__PURE__*/React.createElement(PaperGrain, null));
};

// ── Pricing pill / Owned stamp ──────────────────────────────────────────

const PriceTag = ({
  price,
  owned
}) => {
  if (owned) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        background: 'rgba(78,102,82,0.12)',
        border: '1px solid rgba(78,102,82,0.42)',
        color: 'var(--pp-forest, #4E6652)',
        borderRadius: 999,
        fontFamily: 'var(--font-paper)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 700
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      stroke: 2.4
    }), " Owned");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '5px 12px',
      background: 'linear-gradient(180deg, #F0DFA6 0%, #D6BD78 55%, #A8893F 100%)',
      border: '1px solid #7E6322',
      color: '#3A2C0F',
      borderRadius: 999,
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.01em',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 3px rgba(0,0,0,0.22)'
    }
  }, "$", price.toFixed(2));
};

// ── Card ────────────────────────────────────────────────────────────────

const ShopItemCard = ({
  item,
  onOpen
}) => /*#__PURE__*/React.createElement("button", {
  onClick: () => onOpen(item),
  style: {
    background: 'var(--surface-card, #FFFDF6)',
    border: '1px solid var(--pp-hairline)',
    borderRadius: 12,
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 4px rgba(75,64,56,0.05), 0 12px 24px -16px rgba(75,64,56,0.10)',
    transition: 'transform 180ms var(--ease-paper), box-shadow 180ms var(--ease-paper)'
  },
  onMouseEnter: e => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 8px 14px -6px rgba(75,64,56,0.18), 0 18px 28px -16px rgba(75,64,56,0.18)';
  },
  onMouseLeave: e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(75,64,56,0.05), 0 12px 24px -16px rgba(75,64,56,0.10)';
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'relative',
    aspectRatio: '4 / 5',
    borderBottom: '1px solid var(--pp-hairline-soft)',
    overflow: 'hidden'
  }
}, /*#__PURE__*/React.createElement(ItemArt, {
  item: item
}), item.isNew && /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontSize: 9,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    background: 'var(--pp-terracotta)',
    color: '#FFFDF6',
    padding: '3px 8px',
    borderRadius: 999,
    fontWeight: 700
  }
}, "New")), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: '10px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-ui)',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--fg-1)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}, item.name), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}, /*#__PURE__*/React.createElement(PriceTag, {
  price: item.price,
  owned: item.owned
}), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'var(--font-paper)',
    fontSize: 9,
    letterSpacing: '0.18em',
    color: 'var(--fg-3)',
    textTransform: 'uppercase',
    fontWeight: 600
  }
}, item.items, " pcs"))));

// ── Item detail modal ──────────────────────────────────────────────────

const ShopItemDetail = ({
  item,
  related,
  onClose,
  onPurchase,
  onOpenRelated
}) => {
  if (!item) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      background: 'rgba(45,38,30,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      padding: 16,
      animation: 'pp-scrim-in 200ms var(--ease-paper) both'
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes pp-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 820,
      maxHeight: '100%',
      background: 'var(--surface-card, #FFFDF6)',
      borderRadius: 18,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 30px 60px -20px rgba(45,38,30,0.45), 0 12px 24px -12px rgba(45,38,30,0.30)',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
      animation: 'pp-modal-in 280ms var(--ease-paper) both',
      display: 'grid',
      gridTemplateColumns: '320px 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'radial-gradient(closest-side, rgba(255,253,246,0.85), rgba(247,242,232,0.85))',
      padding: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRight: '1px solid var(--pp-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4 / 5',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 22px 40px -10px rgba(45,38,30,0.30), 0 6px 10px rgba(45,38,30,0.18)',
      border: '1px solid rgba(0,0,0,0.10)'
    }
  }, /*#__PURE__*/React.createElement(ItemArt, {
    item: item
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 540
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 44px',
      alignItems: 'flex-start',
      gap: 14,
      padding: '20px 24px',
      borderBottom: '1px solid var(--pp-hairline)',
      background: 'linear-gradient(180deg, rgba(255,253,246,1) 0%, rgba(247,242,232,1) 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-paper)',
      fontSize: 10,
      letterSpacing: '0.22em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase'
    }
  }, SHOP_CATEGORIES.find(c => c.id === item.category)?.label || 'Item'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--fg-1)',
      lineHeight: 1.1,
      marginTop: 4,
      letterSpacing: '-0.005em'
    }
  }, item.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 14,
      color: 'var(--fg-3)'
    }
  }, item.items, " pieces \xB7 digital pack")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      border: '1px solid var(--pp-hairline)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--fg-1)',
      boxShadow: '0 2px 4px rgba(75,64,56,0.10)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '18px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--fg-2)',
      lineHeight: 1.55,
      fontSize: 14
    }
  }, item.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      borderRadius: 12,
      background: 'var(--bg-2)',
      border: '1px solid var(--pp-hairline)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontSize: 13,
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Drag onto any journal page"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Yours to keep \u2014 works offline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Restored on every device you sign in to")), related && related.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-paper)',
      fontSize: 10,
      letterSpacing: '0.22em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, "You may also like"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10
    }
  }, related.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.id,
    onClick: () => onOpenRelated(r),
    style: {
      padding: 0,
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/5',
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 4px 10px -4px rgba(75,64,56,0.18)'
    }
  }, /*#__PURE__*/React.createElement(ItemArt, {
    item: r
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--fg-2)',
      marginTop: 6,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, r.name)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 14,
      padding: '14px 22px',
      borderTop: '1px solid var(--pp-hairline)',
      background: 'rgba(247,242,232,0.7)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PriceTag, {
    price: item.price,
    owned: item.owned
  })), item.owned ? /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      height: 44,
      padding: '0 22px',
      borderRadius: 999,
      background: 'var(--surface-card)',
      color: 'var(--fg-1)',
      border: '1px solid var(--pp-hairline)',
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.02em',
      cursor: 'pointer'
    }
  }, "Use in editor") : /*#__PURE__*/React.createElement("button", {
    onClick: () => onPurchase(item),
    style: {
      height: 44,
      padding: '0 22px',
      borderRadius: 999,
      background: 'var(--pp-terracotta)',
      color: '#FFFDF6',
      border: 0,
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.02em',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 4px 10px -2px rgba(196,123,99,0.45)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 14
  }), " Add to your collection")))));
};

// ── Shop screen ────────────────────────────────────────────────────────

const Shop = ({
  onBack,
  onSettings
}) => {
  const [catalogue, setCatalogue] = React.useState(SHOP_CATALOGUE);
  const [category, setCategory] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [openItem, setOpenItem] = React.useState(null);
  const filtered = catalogue.filter(it => (category === 'all' || it.category === category) && (!query || it.name.toLowerCase().includes(query.toLowerCase())));

  // Find a few related items in the same category (excluding the open one)
  const related = openItem ? catalogue.filter(c => c.category === openItem.category && c.id !== openItem.id).slice(0, 3) : [];
  const handlePurchase = item => {
    // Mock purchase — flip owned, then close.
    setCatalogue(cs => cs.map(c => c.id === item.id ? {
      ...c,
      owned: true
    } : c));
    setOpenItem(prev => prev ? {
      ...prev,
      owned: true
    } : prev);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "pp-stage",
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'radial-gradient(900px 600px at 50% 25%, rgba(255,253,246,0.55), rgba(255,253,246,0) 60%),' + 'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' + 'var(--bg-1)',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 5,
      height: 76,
      display: 'grid',
      gridTemplateColumns: '76px 1fr 76px',
      alignItems: 'center',
      padding: '0 20px',
      background: 'linear-gradient(180deg, rgba(255,253,246,0.78) 0%, rgba(255,253,246,0) 100%)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Back",
    className: "pp-icon-btn",
    style: {
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--fg-1)',
      letterSpacing: '-0.005em'
    }
  }, "The\xA0", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      color: 'var(--pp-terracotta)',
      fontWeight: 500
    }
  }, "shop")), /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: '76px 0 16px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 920,
      margin: '0 auto',
      padding: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '4px 0 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--fg-1)',
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    }
  }, "What will you craft today?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--fg-3)'
    }
  }, "A little library of papers, stickers, and treasures.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '6px 8px 6px 18px',
      background: 'var(--surface-card)',
      border: '1px solid var(--pp-hairline)',
      borderRadius: 999,
      boxShadow: '0 4px 12px -4px rgba(75,64,56,0.15)',
      margin: '0 auto',
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 18,
    stroke: 2,
    style: {
      color: 'var(--fg-3)',
      transform: 'scaleX(-1) rotate(0deg)',
      display: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.5 14.5L20 20"
  }))), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search papers, stickers, ephemera\u2026",
    style: {
      flex: 1,
      border: 0,
      outline: 0,
      background: 'transparent',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--fg-1)',
      padding: '12px 0'
    }
  }), query && /*#__PURE__*/React.createElement("button", {
    onClick: () => setQuery(''),
    "aria-label": "Clear",
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '22px 0 18px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '14px 18px'
    }
  }, SHOP_CATEGORIES.map(c => {
    const isActive = c.id === category;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => setCategory(c.id),
      title: c.label,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: 0,
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        width: 88
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: isActive ? 'var(--pp-forest, #4E6652)' : 'var(--surface-card)',
        color: isActive ? '#FFFDF6' : 'var(--fg-1)',
        border: isActive ? '2px solid transparent' : '1px solid var(--pp-hairline)',
        display: 'grid',
        placeItems: 'center',
        boxShadow: isActive ? '0 6px 14px -4px rgba(78,102,82,0.45)' : '0 2px 6px -2px rgba(75,64,56,0.15)',
        transition: 'all 180ms var(--ease-paper)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? 'var(--fg-1)' : 'var(--fg-3)',
        letterSpacing: '0.01em',
        textAlign: 'center',
        lineHeight: 1.25
      }
    }, c.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      margin: '8px 4px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--fg-1)',
      letterSpacing: '-0.005em'
    }
  }, category === 'all' ? query ? `Results for “${query}”` : 'Featured today' : SHOP_CATEGORIES.find(c => c.id === category)?.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-paper)',
      fontSize: 11,
      letterSpacing: '0.18em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, filtered.length, " items")), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: 18,
      color: 'var(--fg-3)'
    }
  }, "We couldn\u2019t find anything matching that yet.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
      gap: 14,
      paddingBottom: 28
    }
  }, filtered.map(it => /*#__PURE__*/React.createElement(ShopItemCard, {
    key: it.id,
    item: it,
    onOpen: setOpenItem
  }))))), openItem && /*#__PURE__*/React.createElement(ShopItemDetail, {
    item: openItem,
    related: related,
    onClose: () => setOpenItem(null),
    onPurchase: handlePurchase,
    onOpenRelated: r => setOpenItem(r)
  }));
};
Object.assign(window, {
  Shop,
  SHOP_CATALOGUE,
  SHOP_CATEGORIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Shop.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Subscription.jsx
try { (() => {
// SCR-24 Subscription Management. Cancel-first, no-dark-patterns.
//
// Value prop revisited (Jun 2026): the Home (SCR-05) and Editor (SCR-07) ad
// banners promise "Remove ads with subscription", so the benefit list now leads
// with an ad-free studio — closing the loop for anyone who arrives from a banner.
// Benefits are phrased as plain, calm promises; no urgency, no dark patterns.

const SUB_BENEFITS = ['A calm, ad-free studio — no banners, ever', 'Three deliveries each morning, instead of one', 'Every seasonal pack included, the day it opens', 'One exclusive heirloom item each month', 'Everything you collect stays yours, forever'];
const Subscription = ({
  onBack,
  status = 'active',
  device = 'tablet'
}) => {
  const phone = device === 'phone';
  return /*#__PURE__*/React.createElement("div", {
    className: "pp-stage",
    style: {
      background: 'var(--bg-2)',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-topbar",
    style: {
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn circle",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "pp-topbar-title",
    style: phone ? {
      fontSize: 18
    } : null
  }, "Manage your subscription"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: phone ? '24px auto' : '40px auto',
      padding: phone ? '0 16px' : '0 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: phone ? 14 : 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-card-stitched"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--pp-forest)'
    }
  }, status === 'active' ? 'You are in The Cottage' : 'Free tier'), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: phone ? 25 : 30,
      margin: '6px 0 6px',
      letterSpacing: '-0.005em'
    }
  }, /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      color: 'var(--pp-terracotta)'
    }
  }, "The Cottage"), " \xB7 monthly"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      color: 'var(--fg-2)',
      fontSize: phone ? 14 : 15
    }
  }, "$4.99 AUD per month. Renews on ", /*#__PURE__*/React.createElement("strong", null, "4 May 2026"), ". You can cancel any time \u2014 no scripts, no scare screens."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '10px 12px',
      alignItems: 'start'
    }
  }, SUB_BENEFITS.map((line, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'var(--pp-sage)',
      display: 'grid',
      placeItems: 'center',
      color: '#FFFDF6',
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--fg-2)',
      lineHeight: 1.4,
      paddingTop: 2
    }
  }, line))))), /*#__PURE__*/React.createElement("div", {
    className: "pp-card",
    style: {
      padding: phone ? 18 : 22
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 20,
      margin: '0 0 6px'
    }
  }, "Cancel subscription"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 14,
      color: 'var(--fg-2)'
    }
  }, "Your deliveries will return to one per day. You'll keep everything you've collected."), /*#__PURE__*/React.createElement("button", {
    className: "pp-btn",
    style: {
      background: 'transparent',
      color: 'var(--pp-danger)',
      border: '1.5px solid var(--pp-danger)',
      minHeight: 48,
      borderRadius: 6,
      width: phone ? '100%' : 'auto'
    }
  }, "Cancel subscription")), /*#__PURE__*/React.createElement("div", {
    className: "pp-card",
    style: {
      padding: phone ? 18 : 22
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 20,
      margin: '0 0 12px'
    }
  }, "Switch to annual"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: phone ? 'column' : 'row',
      alignItems: phone ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--fg-2)'
    }
  }, "$39.99 a year \u2014 save roughly two months. No price tricks at renewal."), /*#__PURE__*/React.createElement("button", {
    className: "pp-btn pp-btn-primary",
    style: {
      flexShrink: 0,
      width: phone ? '100%' : 'auto'
    }
  }, "Switch to annual"))), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--fg-4)',
      letterSpacing: '0.06em',
      marginBottom: 32
    }
  }, "Billed through the App Store \xB7 Cancel any time, no scare screens")));
};
Object.assign(window, {
  Subscription
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Subscription.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SupportMenu.jsx
try { (() => {
// SCR-22 Support Menu — modal overlay with four feedback categories.

const SupportMenu = ({
  onClose,
  onSelect
}) => {
  const options = [{
    id: 'bug',
    icon: 'bug',
    title: 'Report a bug',
    hint: "Something isn't working."
  }, {
    id: 'idea',
    icon: 'bulb',
    title: 'Suggest something',
    hint: "I have an idea."
  }, {
    id: 'compliment',
    icon: 'heart',
    title: 'Send a compliment',
    hint: "I love something."
  }, {
    id: 'complaint',
    icon: 'chat',
    title: 'Share a concern',
    hint: "Something feels off."
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      background: 'rgba(43, 42, 40, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 440,
      padding: '28px 28px 22px',
      background: '#FFFDF6',
      borderRadius: 16,
      border: '1px solid var(--pp-hairline)',
      boxShadow: '0 30px 60px -20px rgba(75,64,56,0.45)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 4,
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 26,
      margin: 0,
      letterSpacing: '-0.005em',
      lineHeight: 1.15,
      whiteSpace: 'nowrap'
    }
  }, "How can we help?"), /*#__PURE__*/React.createElement("button", {
    className: "pp-icon-btn",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      color: 'var(--fg-3)',
      fontSize: 14,
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic'
    }
  }, "Pick whatever feels closest \u2014 we read every note."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    onClick: () => onSelect?.(o.id),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      background: 'var(--pp-cream)',
      border: '1.2px solid var(--pp-hairline)',
      borderRadius: 10,
      cursor: 'pointer',
      textAlign: 'left',
      minHeight: 60,
      transition: 'all 180ms var(--ease-paper)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--surface-card)';
      e.currentTarget.style.transform = 'translateX(2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--pp-cream)';
      e.currentTarget.style.transform = 'translateX(0)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 8,
      bottom: 8,
      width: 3,
      background: 'var(--accent)',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: 'var(--bg-2)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: o.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--fg-1)'
    }
  }, o.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--fg-3)'
    }
  }, o.hint)), /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 16,
    style: {
      transform: 'scaleX(-1)',
      color: 'var(--fg-4)'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--pp-hairline-soft)',
      margin: '20px -4px 12px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSelect?.('subscription'),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 4px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--fg-2)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, "Manage my subscription"), /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 16,
    style: {
      transform: 'scaleX(-1)',
      color: 'var(--fg-4)'
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 12,
      color: 'var(--fg-4)',
      letterSpacing: '0.04em'
    }
  }, "Nothing here will affect your collection \u2014 your items and journals are yours forever.")), /*#__PURE__*/React.createElement("style", null, `
        @keyframes modalIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `));
};
Object.assign(window, {
  SupportMenu
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SupportMenu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Welcome.jsx
try { (() => {
// SCR-02 First-launch Welcome. Brand seal hero + intro form + onboarding CTAs.

const Welcome = ({
  onBegin,
  onSubscribe,
  device = 'tablet'
}) => {
  const phone = device === 'phone';
  const [form, setForm] = React.useState({
    name: '',
    zip: '',
    email: '',
    dob: ''
  });
  const update = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
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
    boxSizing: 'border-box'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'radial-gradient(900px 600px at 50% 30%, rgba(255,255,255,0.6), transparent 70%),' + 'url("../../assets/brand/loading_background.png") center / cover no-repeat, ' + 'var(--bg-2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: phone ? 'flex-start' : 'center',
      padding: phone ? '36px 20px' : '40px 56px',
      boxSizing: 'border-box',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/logo_terracotta.png",
    style: {
      width: phone ? 104 : 140,
      height: phone ? 104 : 140,
      flexShrink: 0,
      filter: 'drop-shadow(0 8px 24px rgba(75,64,56,.16))'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: phone ? 38 : 48,
      margin: '12px 0 6px',
      color: 'var(--fg-1)',
      letterSpacing: '-0.005em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'baseline',
      gap: phone ? 9 : 12
    }
  }, /*#__PURE__*/React.createElement("span", null, "Paper"), /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      color: 'var(--pp-terracotta)',
      fontWeight: 500,
      fontSize: phone ? 42 : 52,
      lineHeight: 1,
      position: 'relative',
      top: 4
    }
  }, "&"), /*#__PURE__*/React.createElement("span", null, "Petals")), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 480,
      textAlign: 'center',
      margin: '0 0 22px',
      fontFamily: 'var(--font-script)',
      fontStyle: 'italic',
      fontSize: phone ? 18 : 20,
      color: 'var(--fg-2)',
      lineHeight: 1.4
    }
  }, "Welcome! Let us get to know you a little better."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: phone ? '100%' : 420,
      maxWidth: 420,
      display: 'grid',
      gap: 10,
      gridTemplateColumns: phone ? '1fr' : '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: 'var(--fg-3)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Name ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pp-terracotta)'
    }
  }, "*")), /*#__PURE__*/React.createElement("input", {
    style: fieldStyle,
    placeholder: "What may we call you?",
    value: form.name,
    onChange: update('name')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: 'var(--fg-3)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Email ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-4)',
      textTransform: 'none',
      letterSpacing: 0,
      fontWeight: 400
    }
  }, "\xB7 optional")), /*#__PURE__*/React.createElement("input", {
    type: "email",
    style: fieldStyle,
    placeholder: "you@somewhere.com",
    value: form.email,
    onChange: update('email')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: 'var(--fg-3)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Zip ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-4)',
      textTransform: 'none',
      letterSpacing: 0,
      fontWeight: 400
    }
  }, "\xB7 optional")), /*#__PURE__*/React.createElement("input", {
    style: fieldStyle,
    placeholder: "2000",
    value: form.zip,
    onChange: update('zip')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: 'var(--fg-3)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Date of birth ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-4)',
      textTransform: 'none',
      letterSpacing: 0,
      fontWeight: 400
    }
  }, "\xB7 optional")), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: fieldStyle,
    value: form.dob,
    onChange: update('dob')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 22,
      alignItems: 'center',
      width: phone ? '100%' : 'auto',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp-btn pp-btn-primary pp-btn-pill",
    style: {
      minWidth: phone ? 0 : 320,
      width: phone ? '100%' : 'auto',
      fontSize: 16,
      opacity: canContinue ? 1 : 0.6,
      cursor: canContinue ? 'pointer' : 'not-allowed'
    },
    disabled: !canContinue,
    onClick: canContinue ? onSubscribe : undefined
  }, "Subscribe & continue"), /*#__PURE__*/React.createElement("button", {
    className: "pp-btn pp-btn-ghost",
    style: {
      minWidth: phone ? 0 : 320,
      width: phone ? '100%' : 'auto',
      fontSize: 14,
      color: 'var(--fg-2)',
      opacity: canContinue ? 1 : 0.5,
      cursor: canContinue ? 'pointer' : 'not-allowed'
    },
    disabled: !canContinue,
    onClick: canContinue ? onBegin : undefined
  }, "Continue without subscribing")));
};
Object.assign(window, {
  Welcome
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Welcome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms/Feedback.jsx
try { (() => {
// CMS · Feedback — inbox of submissions from the in-app Send-feedback form
// (SCR-23). Filter by type, mark read.

const FB_TYPE = {
  idea: {
    label: 'Idea',
    icon: 'idea',
    bg: 'rgba(168,137,63,0.16)',
    fg: '#7E6322'
  },
  bug: {
    label: 'Bug',
    icon: 'bug',
    bg: 'rgba(178,106,90,0.14)',
    fg: '#9C4F3D'
  },
  love: {
    label: 'Kind words',
    icon: 'heart',
    bg: 'rgba(78,102,82,0.12)',
    fg: '#3F5443'
  }
};
const FB_FILTERS = [{
  id: 'all',
  label: 'All'
}, {
  id: 'unread',
  label: 'Unread'
}, {
  id: 'idea',
  label: 'Ideas'
}, {
  id: 'bug',
  label: 'Bugs'
}, {
  id: 'love',
  label: 'Kind words'
}];
const Feedback = ({
  feedback,
  onToggleRead
}) => {
  const [filter, setFilter] = React.useState('all');
  const unread = feedback.filter(f => !f.read).length;
  const rows = feedback.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !f.read;
    return f.type === filter;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-view-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "cms-h1"
  }, "Feedback"), /*#__PURE__*/React.createElement("p", {
    className: "cms-sub"
  }, unread, " unread \xB7 synced from your Canny feedback board (in-app \u201CSend feedback\u201D)"))), /*#__PURE__*/React.createElement("div", {
    className: "cms-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-segment"
  }, FB_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: filter === f.id ? 'on' : '',
    onClick: () => setFilter(f.id)
  }, f.label)))), /*#__PURE__*/React.createElement("div", {
    className: "cms-fblist"
  }, rows.map(f => {
    const t = FB_TYPE[f.type];
    return /*#__PURE__*/React.createElement("div", {
      key: f.id,
      className: 'cms-fbcard' + (f.read ? '' : ' unread')
    }, /*#__PURE__*/React.createElement("span", {
      className: "cms-fb-type",
      style: {
        background: t.bg,
        color: t.fg
      }
    }, /*#__PURE__*/React.createElement(CmsIcon, {
      name: t.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cms-fb-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cms-fb-typelabel",
      style: {
        color: t.fg
      }
    }, t.label), /*#__PURE__*/React.createElement("span", {
      className: "cms-muted cms-fb-date"
    }, fmtDate(f.date))), /*#__PURE__*/React.createElement("p", {
      className: "cms-fb-msg"
    }, f.message), /*#__PURE__*/React.createElement("div", {
      className: "cms-fb-from"
    }, f.email ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CmsIcon, {
      name: "mail",
      size: 13
    }), " ", /*#__PURE__*/React.createElement("a", {
      href: 'mailto:' + f.email
    }, f.email)) : /*#__PURE__*/React.createElement("span", {
      className: "cms-muted"
    }, "Anonymous"))), /*#__PURE__*/React.createElement("button", {
      className: "cms-fb-read",
      onClick: () => onToggleRead(f.id),
      title: f.read ? 'Mark unread' : 'Mark read'
    }, f.read ? 'Mark unread' : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CmsIcon, {
      name: "check",
      size: 15,
      stroke: 2.2
    }), " Mark read")));
  }), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cms-empty"
  }, "Nothing here.")));
};
Object.assign(window, {
  Feedback
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms/Feedback.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms/Library.jsx
try { (() => {
// CMS · Library view — the single Item collection that feeds the Shop and the
// journal editor. Filter by category / tier / status, search, toggle free↔paid.

const LIB_STATUS_FILTERS = [{
  id: 'all',
  label: 'All'
}, {
  id: 'live',
  label: 'Live'
}, {
  id: 'scheduled',
  label: 'Scheduled'
}, {
  id: 'draft',
  label: 'Draft'
}];
const Library = ({
  items,
  onTierChange,
  onNew
}) => {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const {
    CATEGORIES,
    CAT_LABEL,
    statusOf
  } = window.CMS;
  const rows = items.filter(it => {
    if (cat !== 'all' && it.category !== cat) return false;
    if (status !== 'all' && statusOf(it) !== status) return false;
    if (q.trim() && !it.name.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  });
  const COLS = '2.4fr 1.4fr 0.9fr 0.7fr 1fr 1fr';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-view-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "cms-h1"
  }, "Library"), /*#__PURE__*/React.createElement("p", {
    className: "cms-sub"
  }, items.length, " items \xB7 one collection powers the Shop and the journal editor")), /*#__PURE__*/React.createElement("button", {
    className: "cms-btn-primary",
    onClick: onNew
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "plus",
    size: 17,
    stroke: 2.2
  }), " New item")), /*#__PURE__*/React.createElement("div", {
    className: "cms-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-search"
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search items\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cms-segment"
  }, LIB_STATUS_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: status === f.id ? 'on' : '',
    onClick: () => setStatus(f.id)
  }, f.label))), /*#__PURE__*/React.createElement("select", {
    className: "cms-select",
    value: cat,
    onChange: e => setCat(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All categories"), CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "cms-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-trow cms-thead",
    style: {
      gridTemplateColumns: COLS
    }
  }, /*#__PURE__*/React.createElement("div", null, "Item"), /*#__PURE__*/React.createElement("div", null, "Category"), /*#__PURE__*/React.createElement("div", null, "Tier"), /*#__PURE__*/React.createElement("div", null, "Price"), /*#__PURE__*/React.createElement("div", null, "Status"), /*#__PURE__*/React.createElement("div", null, "Publish date")), rows.map(it => {
    const st = statusOf(it);
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      className: "cms-trow",
      style: {
        gridTemplateColumns: COLS
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cms-cell-item"
    }, /*#__PURE__*/React.createElement(ItemThumb, {
      item: it
    }), /*#__PURE__*/React.createElement("span", {
      className: "cms-item-name"
    }, it.name)), /*#__PURE__*/React.createElement("div", {
      className: "cms-muted"
    }, CAT_LABEL[it.category]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TierToggle, {
      tier: it.tier,
      onChange: t => onTierChange(it.id, t)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: it.tier === 'paid' ? 'var(--fg-1)' : 'var(--fg-3)'
      }
    }, it.tier === 'paid' ? `$${it.price.toFixed(2)}` : 'Free'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: st
    })), /*#__PURE__*/React.createElement("div", {
      className: "cms-muted",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, st === 'scheduled' && /*#__PURE__*/React.createElement(CmsIcon, {
      name: "clock",
      size: 14
    }), fmtDate(it.publishAt)));
  }), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cms-empty"
  }, "No items match these filters.")));
};
Object.assign(window, {
  Library
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms/Library.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms/Packs.jsx
try { (() => {
// CMS · Daily Packs — build the parcel that lands in each user's app on a given
// date. Each date has two tracks: a FREE pack (every user) and a SUBSCRIPTION
// pack (premium members). Each track references library items by id.

const TRACKS = {
  free: {
    label: 'Free pack',
    short: 'Free',
    icon: 'pack',
    accent: '#4E6652',
    soft: 'rgba(78,102,82,0.12)',
    blurb: 'Ships to every user. Keep it small — one or two free pieces.'
  },
  sub: {
    label: 'Subscription pack',
    short: 'Premium',
    icon: 'crown',
    accent: '#9C7A22',
    soft: 'rgba(168,137,63,0.18)',
    blurb: 'Premium members only. A richer set — include paid items free for subscribers.'
  }
};
const Packs = ({
  packs,
  items,
  onAddItem,
  onRemoveItem
}) => {
  const [selected, setSelected] = React.useState(packs[0]?.date);
  const [track, setTrack] = React.useState('free');
  const [adding, setAdding] = React.useState(false);
  const [q, setQ] = React.useState('');
  const byId = React.useMemo(() => Object.fromEntries(items.map(i => [i.id, i])), [items]);
  const {
    CAT_LABEL
  } = window.CMS;
  const pack = packs.find(p => p.date === selected) || packs[0];
  const ids = pack[track] || [];
  const packItems = ids.map(id => byId[id]).filter(Boolean);
  const candidates = items.filter(i => !ids.includes(i.id) && (!q.trim() || i.name.toLowerCase().includes(q.trim().toLowerCase())));
  const T = TRACKS[track];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-view-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "cms-h1"
  }, "Daily delivery packs"), /*#__PURE__*/React.createElement("p", {
    className: "cms-sub"
  }, "Curate two parcels per day \u2014 a free drop for everyone and a richer subscription drop for members. They publish automatically on their date."))), /*#__PURE__*/React.createElement("div", {
    className: "cms-packs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-card cms-daterail"
  }, packs.map(p => {
    const d = fmtDayShort(p.date);
    const on = p.date === selected;
    const isToday = p.date === window.CMS.TODAY;
    return /*#__PURE__*/React.createElement("button", {
      key: p.date,
      className: 'cms-dayrow' + (on ? ' on' : ''),
      onClick: () => {
        setSelected(p.date);
        setAdding(false);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cms-day-cal"
    }, /*#__PURE__*/React.createElement("span", {
      className: "wd"
    }, d.wd), /*#__PURE__*/React.createElement("span", {
      className: "dm"
    }, p.date.slice(8))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cms-day-title"
    }, p.title, isToday && /*#__PURE__*/React.createElement("span", {
      className: "cms-today"
    }, "Today")), /*#__PURE__*/React.createElement("span", {
      className: "cms-day-meta"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cms-dot",
      style: {
        background: '#4E6652'
      }
    }), " ", p.free.length, " free", /*#__PURE__*/React.createElement("span", {
      className: "cms-dot",
      style: {
        background: '#C8A96B',
        marginLeft: 8
      }
    }), " ", p.sub.length, " premium")), /*#__PURE__*/React.createElement(CmsIcon, {
      name: "chevron",
      size: 16
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cms-card cms-packdetail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-packdetail-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-eyebrow"
  }, fmtDate(pack.date, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })), /*#__PURE__*/React.createElement("h2", {
    className: "cms-h2"
  }, pack.title)), /*#__PURE__*/React.createElement("button", {
    className: "cms-btn-secondary",
    onClick: () => setAdding(a => !a)
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "plus",
    size: 16,
    stroke: 2.2
  }), " Add items")), /*#__PURE__*/React.createElement("div", {
    className: "cms-trackbar"
  }, Object.entries(TRACKS).map(([id, t]) => {
    const active = track === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      className: 'cms-track' + (active ? ' on' : ''),
      onClick: () => {
        setTrack(id);
        setAdding(false);
      },
      style: active ? {
        borderColor: t.accent,
        background: t.soft,
        color: t.accent
      } : {}
    }, /*#__PURE__*/React.createElement(CmsIcon, {
      name: t.icon,
      size: 17
    }), t.label, /*#__PURE__*/React.createElement("span", {
      className: "cms-track-cnt",
      style: active ? {
        background: t.accent,
        color: '#FFFDF6'
      } : {}
    }, pack[id].length));
  })), /*#__PURE__*/React.createElement("p", {
    className: "cms-track-blurb"
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: track === 'sub' ? 'lock' : 'sparkle',
    size: 13
  }), " ", T.blurb), adding && /*#__PURE__*/React.createElement("div", {
    className: "cms-addpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-search sm"
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "search",
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: `Add an item to the ${T.short.toLowerCase()} pack…`,
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "cms-addlist"
  }, candidates.slice(0, 8).map(i => /*#__PURE__*/React.createElement("button", {
    key: i.id,
    className: "cms-addrow",
    onClick: () => onAddItem(pack.date, track, i.id)
  }, /*#__PURE__*/React.createElement(ItemThumb, {
    item: i,
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    className: "cms-addrow-name"
  }, i.name), /*#__PURE__*/React.createElement("span", {
    className: 'cms-tier-tag ' + i.tier
  }, i.tier === 'paid' ? `$${i.price.toFixed(2)}` : 'Free'), /*#__PURE__*/React.createElement(CmsIcon, {
    name: "plus",
    size: 15,
    stroke: 2.2
  }))), candidates.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cms-empty sm"
  }, "Nothing left to add."))), packItems.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "cms-packempty"
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: T.icon,
    size: 30
  }), /*#__PURE__*/React.createElement("p", null, track === 'sub' ? 'No premium items yet. Subscribers expect a little more — add a few, including paid pieces they get for free.' : 'This free pack is empty. Add a piece or two that every user receives.')) : /*#__PURE__*/React.createElement("div", {
    className: "cms-chipgrid"
  }, packItems.map(i => /*#__PURE__*/React.createElement("div", {
    key: i.id,
    className: "cms-itemchip"
  }, /*#__PURE__*/React.createElement(ItemThumb, {
    item: i,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-chip-name"
  }, i.name), /*#__PURE__*/React.createElement("div", {
    className: "cms-chip-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'cms-tier-tag ' + i.tier
  }, i.tier === 'paid' ? `$${i.price.toFixed(2)}` : 'Free'), /*#__PURE__*/React.createElement("span", {
    className: "cms-muted"
  }, CAT_LABEL[i.category]))), /*#__PURE__*/React.createElement("button", {
    className: "cms-chip-x",
    onClick: () => onRemoveItem(pack.date, track, i.id),
    "aria-label": "Remove"
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "trash",
    size: 15
  }))))))));
};
Object.assign(window, {
  Packs
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms/Packs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms/Schedule.jsx
try { (() => {
// CMS · Schedule — month calendar of what goes live when: daily packs (forest)
// and individual item launches via publishAt (gold).

const pad2 = n => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const Schedule = ({
  items,
  packs
}) => {
  const [ym, setYm] = React.useState({
    y: 2026,
    m: 5
  }); // June 2026
  const {
    TODAY
  } = window.CMS;
  const first = new Date(ym.y, ym.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first offset
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const step = dir => setYm(({
    y,
    m
  }) => {
    const nm = m + dir;
    if (nm < 0) return {
      y: y - 1,
      m: 11
    };
    if (nm > 11) return {
      y: y + 1,
      m: 0
    };
    return {
      y,
      m: nm
    };
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-view-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "cms-h1"
  }, "Schedule"), /*#__PURE__*/React.createElement("p", {
    className: "cms-sub"
  }, "Everything dated \u2014 staged weeks ahead, live automatically on the day.")), /*#__PURE__*/React.createElement("div", {
    className: "cms-monthnav"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => step(-1),
    "aria-label": "Previous month",
    style: {
      transform: 'scaleX(-1)'
    }
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "chevron",
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, MONTHS[ym.m], " ", ym.y), /*#__PURE__*/React.createElement("button", {
    onClick: () => step(1),
    "aria-label": "Next month"
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: "chevron",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cms-legend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#4E6652'
    }
  }), " Daily pack"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#C8A96B'
    }
  }), " Item launch"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ring"
  }), " Today")), /*#__PURE__*/React.createElement("div", {
    className: "cms-card cms-cal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-cal-grid cms-cal-head"
  }, WEEKDAYS.map(w => /*#__PURE__*/React.createElement("div", {
    key: w,
    className: "cms-cal-wd"
  }, w))), /*#__PURE__*/React.createElement("div", {
    className: "cms-cal-grid"
  }, cells.map((d, i) => {
    if (d === null) return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "cms-cal-cell empty"
    });
    const iso = `${ym.y}-${pad2(ym.m + 1)}-${pad2(d)}`;
    const pk = packs.find(p => p.date === iso);
    const launches = items.filter(it => it.publishAt === iso);
    const isToday = iso === TODAY;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: 'cms-cal-cell' + (isToday ? ' today' : '')
    }, /*#__PURE__*/React.createElement("span", {
      className: "cms-cal-num"
    }, d), /*#__PURE__*/React.createElement("div", {
      className: "cms-cal-events"
    }, pk && /*#__PURE__*/React.createElement("span", {
      className: "cms-cal-ev pack",
      title: pk.title + (pk.sub.length ? ' · +' + pk.sub.length + ' premium' : '')
    }, /*#__PURE__*/React.createElement(CmsIcon, {
      name: "pack",
      size: 11
    }), " ", pk.title, pk.sub.length > 0 && /*#__PURE__*/React.createElement(CmsIcon, {
      name: "crown",
      size: 11,
      style: {
        marginLeft: 'auto',
        color: '#9C7A22'
      }
    })), launches.length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "cms-cal-ev launch",
      title: launches.map(l => l.name).join(', ')
    }, /*#__PURE__*/React.createElement(CmsIcon, {
      name: "sparkle",
      size: 11
    }), " ", launches.length, " launch", launches.length === 1 ? '' : 'es')));
  }))));
};
Object.assign(window, {
  Schedule
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms/Schedule.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms/cms-ui.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared CMS UI — icons, item thumbnail, status badge, tier toggle, helpers.

const CmsIcon = ({
  name,
  size = 18,
  stroke = 1.75,
  ...rest
}) => {
  const paths = {
    library: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 9h16M9 9v11"
    })),
    pack: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 8l9-5 9 5v8l-9 5-9-5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 8l9 5 9-5M12 13v9"
    })),
    calendar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "5",
      width: "16",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 9h16M8 3v4M16 3v4"
    })),
    inbox: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 13l2.5-8h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 13h4l1 2h6l1-2h4"
    })),
    search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 20l-3.5-3.5"
    })),
    plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 6v12M6 12h12"
    })),
    chevron: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    })),
    flower: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "2.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9.6c0-2 1-3.6 2.6-3.6S17 7.6 17 9.6M12 14.4c0 2 1 3.6 2.6 3.6S17 16.4 17 14.4M12 9.6c0-2-1-3.6-2.6-3.6S7 7.6 7 9.6M12 14.4c0 2-1 3.6-2.6 3.6S7 16.4 7 14.4"
    })),
    seal: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3.5"
    })),
    paper: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 3h9l4 4v14H6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 3v4h4"
    })),
    tape: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "9",
      width: "18",
      height: "6",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 12h18"
    })),
    card: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "6",
      width: "18",
      height: "12",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 10h18"
    })),
    frame: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "8",
      y: "8",
      width: "8",
      height: "8"
    })),
    type: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 6h14M12 6v12M9 18h6"
    })),
    paint: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"
    })),
    fabric: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 4h16v16H4z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 4l16 16M20 4L4 20"
    })),
    charm: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "14",
      r: "5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9V5"
    })),
    star: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
      points: "12,4 14.2,9.4 20,9.8 15.6,13.6 17,19.4 12,16.2 7,19.4 8.4,13.6 4,9.8 9.8,9.4"
    })),
    heart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 20s-7-4-9-9c-1-3 1-6 4-6s4 3 5 4c1-1 2-4 5-4s5 3 4 6c-2 5-9 9-9 9z"
    })),
    collection: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 8h8M8 12h8M8 16h5"
    })),
    idea: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3z"
    })),
    bug: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "7",
      y: "8",
      width: "10",
      height: "11",
      rx: "5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 8a3 3 0 0 1 6 0M4 12h3M17 12h3M4 17h3M17 17h3M12 8v11"
    })),
    check: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 7"
    })),
    mail: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 6h16v12H4z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 7l8 6 8-6"
    })),
    trash: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
    })),
    clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v4l3 2"
    })),
    sparkle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3v6M12 15v6M3 12h6M15 12h6"
    })),
    crown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 18h16M4 8l4 4 4-6 4 6 4-4v8H4z"
    })),
    lock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8a4 4 0 0 1 8 0v3"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, rest), paths[name] || null);
};

// Colored category-tone tile with the item's glyph.
const ItemThumb = ({
  item,
  size = 40
}) => {
  const tone = window.CMS.CAT_TONE[item.category] || '#9A8A72';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 8,
      flexShrink: 0,
      background: `linear-gradient(160deg, ${tone}33, ${tone}1a)`,
      border: `1px solid ${tone}66`,
      display: 'grid',
      placeItems: 'center',
      color: tone
    }
  }, /*#__PURE__*/React.createElement(CmsIcon, {
    name: item.glyph,
    size: Math.round(size * 0.5),
    stroke: 1.8
  }));
};
const STATUS_STYLE = {
  live: {
    label: 'Live',
    bg: 'rgba(78,102,82,0.12)',
    fg: '#3F5443',
    dot: '#4E6652'
  },
  scheduled: {
    label: 'Scheduled',
    bg: 'rgba(168,137,63,0.16)',
    fg: '#7E6322',
    dot: '#C8A96B'
  },
  draft: {
    label: 'Draft',
    bg: 'rgba(75,64,56,0.08)',
    fg: '#6B5E50',
    dot: '#9A8A72'
  }
};
const StatusBadge = ({
  status
}) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.draft;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 999,
      background: s.bg,
      color: s.fg,
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: s.dot
    }
  }), s.label);
};

// Free / Paid segmented toggle.
const TierToggle = ({
  tier,
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'inline-flex',
    background: 'var(--bg-2)',
    borderRadius: 999,
    padding: 2,
    border: '1px solid var(--pp-hairline)'
  }
}, ['free', 'paid'].map(t => {
  const active = tier === t;
  return /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: e => {
      e.stopPropagation();
      onChange?.(t);
    },
    style: {
      padding: '5px 14px',
      borderRadius: 999,
      border: 0,
      cursor: 'pointer',
      background: active ? t === 'paid' ? 'var(--pp-antique-gold, #C8A96B)' : 'var(--pp-forest, #4E6652)' : 'transparent',
      color: active ? '#FFFDF6' : 'var(--fg-3)',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'capitalize',
      letterSpacing: '0.02em',
      transition: 'all 150ms var(--ease-paper)'
    }
  }, t);
}));
const fmtDate = (iso, opts) => {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', opts || {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
const fmtDayShort = iso => {
  const d = new Date(iso + 'T00:00:00');
  return {
    wd: d.toLocaleDateString('en-GB', {
      weekday: 'short'
    }),
    dm: d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    })
  };
};
Object.assign(window, {
  CmsIcon,
  ItemThumb,
  StatusBadge,
  TierToggle,
  fmtDate,
  fmtDayShort,
  STATUS_STYLE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms/cms-ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms/data.js
try { (() => {
// Paper & Petals — Studio CMS · mock data layer.
//
// In production every array below is a collection in your headless CMS
// (Sanity / Strapi / Contentful). One "Item" model powers BOTH the consumer
// Shop (SCR-06) and the journal-editor drawer (SCR-07); "Pack" references items
// by id for the daily delivery; "Feedback" is filled by the in-app Send-feedback
// form (SCR-23). Dates are ISO so the app can filter on `now`.

window.CMS = function () {
  const TODAY = '2026-06-09';

  // The shared taxonomy — identical to SHOP_CATEGORIES in the app.
  const CATEGORIES = [{
    id: 'collections',
    label: 'Collections',
    tone: '#A98C98'
  }, {
    id: 'papers',
    label: 'Papers & backgrounds',
    tone: '#C8A96B'
  }, {
    id: 'stickers',
    label: 'Stickers',
    tone: '#4E6652'
  }, {
    id: 'tape',
    label: 'Tape & fasteners',
    tone: '#C47B63'
  }, {
    id: 'ephemera',
    label: 'Ephemera',
    tone: '#9E7C5C'
  }, {
    id: 'florals',
    label: 'Florals & botanicals',
    tone: '#87937C'
  }, {
    id: 'frames',
    label: 'Frames & containers',
    tone: '#8FA3B8'
  }, {
    id: 'type',
    label: 'Writing & typography',
    tone: '#7A6B52'
  }, {
    id: 'paint',
    label: 'Paint & artistic',
    tone: '#B26A5A'
  }, {
    id: 'fabric',
    label: 'Sewing & fabric',
    tone: '#A98C98'
  }, {
    id: 'photos',
    label: 'Photos & memory keeping',
    tone: '#8FA3B8'
  }, {
    id: 'details',
    label: 'Decorative details',
    tone: '#C8A96B'
  }];
  const CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
  const CAT_TONE = Object.fromEntries(CATEGORIES.map(c => [c.id, c.tone]));

  // status is derived from tier + publishAt in real life; stored here for the mock.
  //   live      → publishAt <= today
  //   scheduled → publishAt  > today
  //   draft     → no publishAt yet
  const ITEMS = [{
    id: 'col-spring',
    name: 'Spring Meadow collection',
    category: 'collections',
    tier: 'paid',
    price: 5.99,
    publishAt: '2026-05-02',
    glyph: 'collection'
  }, {
    id: 'col-romance',
    name: 'Old Romance collection',
    category: 'collections',
    tier: 'paid',
    price: 6.49,
    publishAt: '2026-05-20',
    glyph: 'collection'
  }, {
    id: 'col-autumn',
    name: 'Autumn Library collection',
    category: 'collections',
    tier: 'paid',
    price: 6.99,
    publishAt: '2026-08-15',
    glyph: 'collection'
  }, {
    id: 'pap-linen',
    name: 'Linen sheets',
    category: 'papers',
    tier: 'free',
    price: 0,
    publishAt: '2026-04-12',
    glyph: 'paper'
  }, {
    id: 'pap-foxed',
    name: 'Foxed pages',
    category: 'papers',
    tier: 'paid',
    price: 2.49,
    publishAt: '2026-05-28',
    glyph: 'paper'
  }, {
    id: 'pap-ledger',
    name: 'Old ledger pages',
    category: 'papers',
    tier: 'paid',
    price: 2.99,
    publishAt: '2026-06-12',
    glyph: 'paper'
  }, {
    id: 'stk-seals',
    name: 'Wax seal stickers',
    category: 'stickers',
    tier: 'paid',
    price: 2.49,
    publishAt: '2026-05-06',
    glyph: 'seal'
  }, {
    id: 'stk-stars',
    name: 'Hand-drawn stars',
    category: 'stickers',
    tier: 'free',
    price: 0,
    publishAt: '2026-04-30',
    glyph: 'star'
  }, {
    id: 'stk-hearts',
    name: 'Tiny heart stickers',
    category: 'stickers',
    tier: 'free',
    price: 0,
    publishAt: null,
    glyph: 'heart'
  }, {
    id: 'tap-sage',
    name: 'Sage washi',
    category: 'tape',
    tier: 'free',
    price: 0,
    publishAt: '2026-05-18',
    glyph: 'tape'
  }, {
    id: 'tap-gold',
    name: 'Gold foil tape',
    category: 'tape',
    tier: 'paid',
    price: 1.99,
    publishAt: '2026-06-15',
    glyph: 'tape'
  }, {
    id: 'eph-library',
    name: 'Library cards',
    category: 'ephemera',
    tier: 'paid',
    price: 2.29,
    publishAt: '2026-05-11',
    glyph: 'card'
  }, {
    id: 'eph-ticket',
    name: 'Vintage bus tickets',
    category: 'ephemera',
    tier: 'free',
    price: 0,
    publishAt: '2026-06-16',
    glyph: 'card'
  }, {
    id: 'flo-rose',
    name: 'Pressed wild roses',
    category: 'florals',
    tier: 'free',
    price: 0,
    publishAt: '2026-05-01',
    glyph: 'flower'
  }, {
    id: 'flo-poppy',
    name: 'Crimson poppies',
    category: 'florals',
    tier: 'paid',
    price: 1.49,
    publishAt: '2026-06-10',
    glyph: 'flower'
  }, {
    id: 'flo-cosmos',
    name: 'Lavender cosmos',
    category: 'florals',
    tier: 'paid',
    price: 1.49,
    publishAt: null,
    glyph: 'flower'
  }, {
    id: 'frm-oval',
    name: 'Oval photo mats',
    category: 'frames',
    tier: 'paid',
    price: 1.99,
    publishAt: '2026-05-22',
    glyph: 'frame'
  }, {
    id: 'frm-deckle',
    name: 'Deckle-edge frames',
    category: 'frames',
    tier: 'paid',
    price: 2.49,
    publishAt: '2026-06-13',
    glyph: 'frame'
  }, {
    id: 'typ-date',
    name: 'Date stamps',
    category: 'type',
    tier: 'free',
    price: 0,
    publishAt: '2026-04-26',
    glyph: 'type'
  }, {
    id: 'typ-banner',
    name: 'Title banners',
    category: 'type',
    tier: 'paid',
    price: 1.29,
    publishAt: '2026-06-20',
    glyph: 'type'
  }, {
    id: 'pnt-wash',
    name: 'Watercolour washes',
    category: 'paint',
    tier: 'paid',
    price: 2.99,
    publishAt: '2026-05-30',
    glyph: 'paint'
  }, {
    id: 'fab-gingham',
    name: 'Gingham patches',
    category: 'fabric',
    tier: 'paid',
    price: 1.79,
    publishAt: null,
    glyph: 'fabric'
  }, {
    id: 'pho-polaroid',
    name: 'Polaroid frames',
    category: 'photos',
    tier: 'free',
    price: 0,
    publishAt: '2026-05-14',
    glyph: 'frame'
  }, {
    id: 'det-charms',
    name: 'Brass charms',
    category: 'details',
    tier: 'paid',
    price: 2.19,
    publishAt: '2026-06-18',
    glyph: 'charm'
  }];

  // Daily delivery packs — each date ships a FREE parcel (every user) and a
  // SUBSCRIPTION parcel (premium members), each referencing items by id.
  const PACKS = [{
    date: '2026-06-09',
    title: 'Quiet Monday',
    free: ['pap-linen', 'stk-stars'],
    sub: ['pap-linen', 'stk-stars', 'flo-rose', 'eph-library', 'frm-oval']
  }, {
    date: '2026-06-10',
    title: 'Poppy Field',
    free: ['tap-sage', 'typ-date'],
    sub: ['tap-sage', 'typ-date', 'flo-poppy', 'pnt-wash', 'det-charms']
  }, {
    date: '2026-06-11',
    title: 'Letters Home',
    free: ['pap-linen', 'eph-ticket'],
    sub: ['pap-linen', 'eph-ticket', 'eph-library', 'stk-seals', 'col-romance']
  }, {
    date: '2026-06-12',
    title: 'Ledger & Ink',
    free: ['typ-date'],
    sub: ['typ-date', 'pap-ledger', 'typ-banner', 'stk-seals']
  }, {
    date: '2026-06-13',
    title: 'Framed',
    free: ['pho-polaroid'],
    sub: ['pho-polaroid', 'frm-deckle', 'frm-oval', 'det-charms']
  }, {
    date: '2026-06-14',
    title: 'Sunday Garden',
    free: ['flo-rose'],
    sub: ['flo-rose', 'flo-poppy', 'flo-cosmos', 'col-spring']
  }, {
    date: '2026-06-15',
    title: 'Gilded',
    free: ['stk-hearts'],
    sub: ['stk-hearts', 'tap-gold', 'det-charms', 'pnt-wash']
  }];
  const FEEDBACK = [{
    id: 'fb1',
    type: 'idea',
    message: 'Could we get a "duplicate spread" button? I make a lot of similar weekly layouts.',
    email: 'marion@example.com',
    date: '2026-06-08',
    read: false
  }, {
    id: 'fb2',
    type: 'love',
    message: 'The daily parcel is the highlight of my morning. Thank you for making something so calm.',
    email: '',
    date: '2026-06-08',
    read: false
  }, {
    id: 'fb3',
    type: 'bug',
    message: 'Wax seal stickers sometimes paste behind the page when I place them near the spine.',
    email: 'devon@example.com',
    date: '2026-06-07',
    read: false
  }, {
    id: 'fb4',
    type: 'idea',
    message: 'Please add a sepia paper pack for old photos!',
    email: 'lena@example.com',
    date: '2026-06-06',
    read: true
  }, {
    id: 'fb5',
    type: 'love',
    message: 'Pinyon Script on the loading screen is gorgeous.',
    email: '',
    date: '2026-06-05',
    read: true
  }, {
    id: 'fb6',
    type: 'bug',
    message: 'Export button did nothing on my older tablet (iPad 6th gen).',
    email: 'sam@example.com',
    date: '2026-06-04',
    read: true
  }];
  function statusOf(item) {
    if (!item.publishAt) return 'draft';
    return item.publishAt > TODAY ? 'scheduled' : 'live';
  }
  return {
    TODAY,
    CATEGORIES,
    CAT_LABEL,
    CAT_TONE,
    ITEMS,
    PACKS,
    FEEDBACK,
    statusOf
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms/data.js", error: String((e && e.message) || e) }); }

})();
