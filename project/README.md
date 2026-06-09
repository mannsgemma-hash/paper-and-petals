# Paper & Petals — Design System

> A cozy digital junk-journalling studio. Tactile vintage aesthetics, modern simplicity,
> calm creative space. Designed primarily for iPad / tablet, landscape, 1024 × 768.

---

## What this is

This is the design system folder for **Paper & Petals** (working/codebase name:
*Cozy Craft Journal*). It contains brand foundations, type and color tokens, real
brand assets, preview cards for the Design System tab, and a UI kit recreating
core screens of the app.

### Sources we worked from

| Source | Where | Notes |
|---|---|---|
| **Design Document (v2.0, authoritative)** | `cozy-craft-journal/ProjectDocumentation/Paper_and_Petals_Design_Document.md` | Source of truth on **product direction, authentication, monetization, screens, flows, and features**. Supersedes the v1 SDD. |
| Brand brief | Pasted into project intro | Tone, palette, fonts — aligned with the v2 design document. |
| Figma | `SCR-01 Loading Screen.fig` (mounted as VFS) | Single frame: Loading Screen at 1024×768. Used Nunito + Libre Baskerville and an organic monogram seal — these are **the production mock**, not the design system spec. We follow the spec. |
| Uploaded logo art | `uploads/ui_logo_main*.png`, `uploads/ui_main_logo_3.png` | Six round monogram seals in different colorways (sage, terracotta, mauve, dusty rose, blue, soft rose). Copied to `assets/logos/`. |
| Uploaded welcome script | `uploads/ui_welcome_text.png` | Hand-lettered "Welcome" — used on first-launch (SCR-02). Removed from SCR-01 in v2. |
| Unity codebase | `cozy-craft-journal/` (mounted local folder) | Empty scaffold — directories for sprites/scripts/scenes but no .cs source yet. The design document is the source of truth. |

### ⚠ Reconciliation note

**Accessibility floors.** v1 SDD framed the audience as "women 50–85,
large tap targets"; v2 reconciles to **women 18–45** (cottagecore, Pinterest,
TikTok). Accessibility floors are still inherited — **18pt body min, 48×48pt
tap targets, 4.5:1 contrast** — because those are good for everyone, not just a
specific demographic.

---

## Products

There is **one product**: the Paper & Petals iPad app. It has many screens (SCR-01
through SCR-25 documented in the SDD); we mock the core surfaces in the UI kit.
No web/marketing surface exists yet.

---

## Index

| File / folder | What's in it |
|---|---|
| `README.md` | This file — context, content fundamentals, visual foundations, iconography. |
| `SKILL.md` | Cross-compatible Agent Skill metadata for downstream use. |
| `colors_and_type.css` | All CSS variables — colors, fonts, spacing, radii, shadows, motion. Import first. |
| `assets/logos/` | Six monogram seal logos (sage, terracotta, mauve, dusty rose, blue, soft rose). |
| `assets/brand/` | Welcome script, loading-screen background paper, loading hero logo. |
| `preview/` | Design System cards — type, color, spacing, components, brand. |
| `ui_kits/app/` | Paper & Petals app UI kit: loading, craft room, journal editor, support, etc. Open `ui_kits/app/index.html`. |

---

## Content Fundamentals

**Voice.** Warm, calm, second-person, never urgent. The app talks to the user like
a thoughtful friend in a quiet room. Lowercase-comfortable sentences ending in periods,
not exclamation marks. Generous, never pushy. The product treats the user's time and
attention as precious.

**Person.** "Your craft room", "your collection", "your items and journals are yours
forever." We address the user as **you**. We refer to the app as **we** sparingly,
in service moments only ("How can we help?"). Avoid corporate "we" elsewhere.

**Casing.**
- **Headlines:** Sentence case. *"How can we help?"*, *"Loading your craft room"*.
- **Body:** Sentence case.
- **Buttons:** Sentence case for full-word CTAs (*"Start subscription"*, *"Send my note"*).
- **Eyebrow labels & micro-labels:** UPPERCASE with wide letter-spacing (`--ls-label`
  or `--ls-micro`) — only for category tags ("POSTCARDS · COMMON") or section eyebrows.

**Emoji.** No. Never. The visual vocabulary is illustrated ephemera, pressed flowers,
washi tape, wax seals, postcards. Emoji break the spell. If we need a small visual
mark, we use a Tabler outline icon, a botanical glyph, or a •/✦ unicode mark.

**Numbers & dates.** "One to three items a day", not "1–3". Spell small numbers in
body copy. Dates in long form on screen titles ("Thursday, 4 April"), short form in
metadata ("4 Apr · 2 items").

**Tone examples (taken from SDD copy):**

- ✅ *"Welcome"* — universal greeting on every load, not just first run.
- ✅ *"Loading your craft room"* — possessive, intimate, ritualised.
- ✅ *"Your note has been sent. Thank you for taking the time."* — closing acknowledgement.
- ✅ *"Your daily deliveries will return to 1 per day. You'll keep everything you've
  collected — your items and journals are yours forever."* — non-coercive cancellation copy.
- ✅ *"Another beautiful find for your collection."* — fallback delivery line.
- ✅ *"We hope to see you again."* — warm farewell.

What to **avoid**:
- ❌ "Don't miss out!" "Last chance!" — urgency / FOMO is the opposite of cozy.
- ❌ "Unlock", "Earn", "Streak", "XP" — gamification language.
- ❌ "🌸 Welcome!! ✨" — emoji + exclamation.
- ❌ "Subscribers get **EXCLUSIVE** content!" — caps for emphasis.
- ❌ "Are you sure you want to cancel? You'll lose…" — loss-framed dark patterns.

**Decorative typography.** Cormorant Garamond Italic is reserved for **flourish moments**:
quotes ("a quiet morning ritual"), seasonal collection names ("Autumn Library"), and
journal volume titles. Don't use it for UI.

---

## Visual Foundations

### Colors

Three warm cream surfaces stacked light → darker. Four muted dusty accents (terracotta,
sage, dusty blue, mauve). Forest green is the **primary action** color (CTAs, active
states). Antique gold and soft rose are highlights only. No saturated colors, no pure
white, no pure black — soft charcoal `#2B2A28` is as dark as we go.

See `preview/color_*.html` cards for full swatches.

### Type

| Family | Use |
|---|---|
| **Henriette Regular** *(Adobe Fonts — Wedding Charmers)* | Screen titles, journal names, hero headings, feature cards. Warm humanist serif. Also drives uppercase small-caps labels. Falls back to DM Serif Display. |
| **Henriette Regular** *(same family, body weight)* | Buttons, nav, body, labels — the **full UI stack**. Inter is kept only as a sans fallback for environments without Henriette installed. |
| **Adorn Pomander Regular Smooth** *(Adobe — Wedding Charmers)* | Ornamental flourish moments only: hero quotes, single-line poetic copy. Token: `--font-flourish`. |
| **Chaparral Pro Light Italic** *(Adobe — Wedding Charmers)* | Romantic editorial italic — seasonal collection names, journal volume titles, in-line emphasis. Token: `--font-script`. Replaces the earlier Cormorant Garamond Italic role. |

Scale: 42 / 32 / 24 / 18 / 16 / 13 / 11. Body line-height 1.55. Display 1.2. Letter-
spacing slightly positive on UI (`+0.005em`), very wide on label tags (`+0.16em` to `+0.20em`).

### Spacing & layout

- **4px base unit.** Use generously — calm > dense. Default card padding 24–32px;
  section gutters 48–64px. Never crowd; always favor air over information density.
- **Tablet-first 1024 × 768 landscape.** Three-panel layouts are the dominant pattern:
  rail / canvas / palette (Journal Editor) or sidebar / scene / context (Craft Room).
- **Persistent left sidebar 110px** with 6 nav icons + name. **Persistent back arrow
  top-left** on every content screen. **Support icon top-right** on main screens.

### Backgrounds

Warm paper texture is the **base background**, not flat color. We have a real
parchment texture in `assets/brand/loading_background.png` — use it at low opacity
behind warm-white surfaces for the tactile feel. Other backgrounds:

- **Solid warm white** (`--bg-1`) for utility / form screens.
- **Vintage paper tint** (`--bg-3`) for hero / immersive screens.
- **Illustrated isometric craft-room scene** (placeholder in UI kit — real art TBD)
  for SCR-05 main.

No saturated gradients, no glassmorphism, no neon. If we ever use a gradient, it's
a soft cream-to-linen vertical fade at low contrast.

### Borders, shadows, depth

- **Hairline parchment borders** (1px `--pp-hairline` ≈ #C8BC9E) on most cards.
- **Hand-stitch dashed line** (1.5px dashed `--pp-stitch`) on hero brand surfaces
  — echoes the stitched edge of the logo seal. Sparingly.
- **Shadows are soft and layered.** A card uses inset-highlight-on-top + low ambient
  + mid drop. See `--sh-paper`, `--sh-card`, `--sh-lift`, `--sh-tape`.
- **No harsh black drop shadows.** Shadows are colored with espresso/charcoal at
  6–18% opacity.

### Corner radii

| Token | Where |
|---|---|
| `--r-sm` 6px | Buttons, input fields |
| `--r-md` 10px | Tool palette icons, tray cards |
| `--r-lg` 16px | Modal overlays, panels |
| `--r-xl` 24px | Hero cards, the page-export frame |
| `--r-pill` | Pill toggles, rarity badges, "Start subscription" button on the welcome flow |

Never zero-radius corners — even thumbnails get 4–6px. Paper has no hard corners.

### Cards

A typical card = warm cream surface (`--surface-card` #FFFDF6) + `--bw-card` 1.5px
parchment border + `--sh-card` shadow stack + 24–32px padding + 16px radius. Hover
states **lift** (translateY -2px + shadow → `--sh-lift`) at 240ms `--ease-paper`.

### Hover & press states

- **Hover (mouse):** subtle lift (translateY -1 to -2px) + shadow upgrade. Background
  goes slightly warmer (`--bg-2` over `--bg-1`). Never use a darker text color on hover.
- **Press (touch):** 96% scale on the element + `--sh-pressed` inset shadow + 60ms
  duration with `--ease-press`. Feels like pressing down on paper.
- **Active state:** forest green fill, cream text. Used for active sidebar items.
- **Focus:** 2px sage outline at 2px offset, never blue. Always visible for keyboard.

### Transparency & blur

- **Modals dim the background** with `rgba(43, 42, 40, 0.45)` — warm charcoal at 45%,
  no blue. No backdrop-blur on tablet (perf) — just the dim.
- **Tape & ephemera** placed on the canvas use 88–96% opacity for a hand-cut look.
- **Sticker rarity borders** are 2–3px solid color (not blur), matching the rarity
  system (cream Common, sage Uncommon, dusty rose Rare, forest Heirloom).

### Imagery

All imagery skews **warm, slightly desaturated, with a soft paper grain**. Pressed
flowers and botanical sprigs are the dominant motif. Photographs (if any) are
warm-toned, never cool, never black-and-white. The brand seal is full color but
muted — terracotta/sage/mauve/dusty-rose colorways, never saturated.

### Motion

Soft, slow, paper-physics — never bouncy or springy.

| Pattern | Duration | Easing |
|---|---|---|
| Tap response (button press) | 120–150ms | `--ease-press` |
| Card / modal entrance | 240ms | `--ease-paper` |
| Paper cross-fade (background swap) | 200ms | `--ease-paper` |
| Page-flip / book pull-out | 600ms | `--ease-paper` |
| Drift-in (ephemera placement, parcel arrive) | 480ms | `--ease-petal` |

No bounces, no overshoot, no elastic. The "settle" easing curve (`cubic-bezier(0.32,
0.72, 0.32, 1)`) lands paper with weight — it slows in the last 20% rather than
overshooting.

### Layout rules

- Forced **landscape orientation** at 1024×768 on iPad.
- **Sidebar 110px** persistent. **Tool palette 68px** in the editor.
- **Page strip 68px** for thumbnails in the editor.
- **48×48pt minimum tap target.** Never violate this — accessibility floor.
- **18pt minimum body text** on screen — comes from the SDD accessibility rules.

---

## Iconography

**System.** Tabler Icons (outline style, 1.75–2px stroke, 24×24 default). This is
the SDD's specified icon system. Loaded from CDN — no install required:

```html
<script src="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons-react/index.js"></script>
<!-- or pull individual SVGs from https://tabler-icons.io -->
```

In our UI kit we load specific SVGs inline from the Tabler CDN at render time
(see `ui_kits/app/Icon.jsx`). Stroke color inherits from `currentColor`; default
size 24, scaled 20/28 for context.

**Style requirements.**
- **Outline only**, never filled — matches the airy, hand-drawn feel.
- **Stroke 1.75px** at 24px size. Looks weighty enough to read; never thin.
- **Rounded caps & joins.** Tabler ships this way; don't override.
- **No color icons** anywhere except inside illustrated ephemera (which are art, not icons).

**When NOT to use a Tabler icon.** Anywhere the icon should *feel* like a craft
object — a wax seal, a postage stamp, a pressed flower — we use illustrated art
assets (PNG/SVG sprites in `assets/`), not an outline icon. Outline icons are
for **navigation and tool actions**; craft objects are **collectibles**.

**Emoji.** Never used in product. See Content Fundamentals.

**Unicode marks.** Sparingly: `·` (middle dot), `—` (em dash), `&` (ampersand,
romantic when set in DM Serif Display or Cormorant), `✦` (only as a section divider
on the welcome screen). No 🌸 / 📓 / 🎨 emoji.

**Logo usage.**
- Use the **sage** (`logo_sage.png`) logo as the **primary** monogram — it's the
  most neutral, brand-leading background tint.
- Use **terracotta**, **mauve**, **dusty rose**, **blue**, or **soft rose** variants
  for seasonal moments, splash screens, and category headers — pick the colorway
  that matches the surface.
- Minimum logo size 96px (it has a lot of small detail). Don't tint, recolor, or
  add effects. Don't place on top of busy imagery — keep at least 24px clear space.

**Brand fonts as glyphs.** The DM Serif Display `&` and `P` glyphs are part of the
brand vocabulary — the logo monogram is two Ps in DM Serif Display. Use them at
large size when you need a quiet brand moment without showing the full seal.

---

## Working with this system

1. Import `colors_and_type.css` first.
2. Use the CSS variables — never hard-code hex codes inline.
3. For new screens, copy a component from `ui_kits/app/` and modify; don't start
   from scratch.
4. Real ephemera art (pressed flowers, washi, postage stamps, wax seals) is **not**
   in this system — those are gameplay assets in the Unity project. Use placeholder
   tiles in mocks and call them out.

— *Paper & Petals · v1.0 · May 2026*
