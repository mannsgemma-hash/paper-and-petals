---
name: paper-petals-design
description: Use this skill to generate well-branded interfaces and assets for Paper & Petals, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# Paper & Petals — Design Skill

Read **`README.md`** first — it covers brand context, content fundamentals,
visual foundations, iconography, and the asset index.

## At a glance

- **Brand:** Paper & Petals (codename in repo: Cozy Craft Journal). A cozy
  digital junk-journalling iPad app. Tactile, vintage, feminine, calm.
- **Surfaces:** iPad landscape **1024 × 768**. No web/marketing surface yet.
- **Foundations file:** `colors_and_type.css` — import this first. All colors,
  type, spacing, radii, shadows, motion as CSS vars.
- **Fonts:** DM Serif Display (display) + Inter (UI) + Cormorant Garamond Italic
  (decorative). Loaded from Google Fonts; if you need offline-safe, mirror to
  `fonts/` and swap the @import.
- **Colors:** Warm cream surfaces (`--bg-1/2/3`), forest-green primary CTA
  (`--accent` = `#4E6652`), four dusty accents (terracotta, sage, dusty blue,
  mauve), antique gold + soft rose highlights, soft-charcoal text. **Never** use
  saturated colors or pure white/black.
- **Icons:** Tabler outline, 1.6–2px stroke, rounded caps. Inline SVG in
  `ui_kits/app/Icon.jsx` covers the core vocabulary. Add new ones from
  `https://tabler-icons.io`. **No emoji.**
- **Logos:** `assets/logos/` — six monogram seal colorways. Sage is primary.

## Working modes

**Visual artifacts (mocks, slides, throwaway prototypes):** Copy the assets
you need out of this skill folder, write a static HTML file that imports
`colors_and_type.css`, and use the foundations. For app screens, copy
components from `ui_kits/app/` and modify — don't start from scratch.

**Production code:** Read the foundations file as a spec, then encode the
tokens in your design framework (Tailwind config, Stitches theme, etc.).
Match the type scale, spacing, radii, and shadow ramps exactly.

## Content rules

Voice: warm, calm, second-person. Sentence case. Long-form dates. **No
exclamation marks. No emoji. No urgency / FOMO language.** Example:
"Your daily deliveries will return to 1 per day. You'll keep everything
you've collected — your items and journals are yours forever." See
README's CONTENT FUNDAMENTALS for full guidance.

## When invoked without guidance

Ask the user:

1. What surface? (App screen / mock / slide / marketing — only the app exists
   today, so anything else is exploratory.)
2. Which screens or moments? (Loading, onboarding, journal editor, support, etc.)
3. Is this production or throwaway?
4. Any seasonal/colorway preference? (Sage default, or terracotta/blue/mauve/rose.)
5. Do they want variations? Of what — layout, copy, palette?

Then act as an expert designer and output HTML artifacts (preferred) or
production code, depending on the need. Always honor the accessibility floors
inherited from the SDD: minimum 18pt body text, 48×48pt tap targets, 4.5:1
contrast.

— *Paper & Petals · Design Skill v1.0*
