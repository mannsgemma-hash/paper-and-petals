# Paper & Petals — App UI Kit

Hi-fi recreations of the core screens of the Paper & Petals iPad app. Designed at
**1024 × 768** (iPad landscape), the canonical surface called out in the SDD.

## Screens included

- **SCR-01 Loading** — universal load splash with parchment background, monogram seal, hand-lettered "Welcome", and a slim progress bar.
- **SCR-02 Welcome / First launch** — first-run hero with the brand seal and the two onboarding CTAs.
- **SCR-05 Craft Room** — main hub: persistent left sidebar, illustrated craft-room scene, journal bookshelf, support icon.
- **SCR-07 Journal Editor** — page strip / double-page spread canvas with visible cover border and spine / right tool palette.
- **SCR-22 Support Menu** — modal overlay with four feedback categories + subscription link.
- **SCR-24 Subscription Management** — ethical, dark-pattern-free cancel-first layout.

## How to open

Open `index.html` in a browser. The top tab bar (modeled on the Figma mock) lets
you flip between screens.

## Files

| File | What |
|---|---|
| `index.html` | Click-through host with tab bar + screen mount. |
| `tokens.css` | Local cosmetic additions on top of `colors_and_type.css`. |
| `Icon.jsx` | Inline Tabler-style outline icons. |
| `Loading.jsx` | SCR-01 |
| `Welcome.jsx` | SCR-02 |
| `CraftRoom.jsx` | SCR-05 |
| `JournalEditor.jsx` | SCR-07 |
| `SupportMenu.jsx` | SCR-22 |
| `Subscription.jsx` | SCR-24 |

## Implementation notes

- React 18 + Babel-standalone, all components are `Object.assign(window, …)` exports so files can share scope without `type="module"`.
- The illustrated craft-room scene (back wall, shelves, isometric room) is a **placeholder** painted with CSS layers. Real art is a Unity asset, not yet exported. We render the **shape, depth, and composition** correctly so the rest of the layout reads true.
- Real ephemera art (postcards, pressed flowers, wax seals) is also placeholder — we use color-keyed paper tiles with rarity borders.
- Animations are gentle: 240 ms paper-settle for page transitions; 480 ms drift-in for parcel arrival.
