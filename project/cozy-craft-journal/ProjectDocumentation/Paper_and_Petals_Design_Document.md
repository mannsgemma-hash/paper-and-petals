# Paper & Petals — Design Document

> v2.0 · May 2026 · supersedes Cozy_Craft_Journal_SDD v1
>
> This document is the **authoritative source of truth** for product direction,
> authentication model, and feature priorities. The brand foundations live in
> the project `README.md`; the implementation UI kit lives in `ui_kits/app/`.
> Where this document and earlier specs disagree, **this document wins**.

---

## 1 · Project metadata

| | |
|---|---|
| **Project name** | Paper & Petals |
| **Platform** | iPad-first mobile creative app (iOS first, Android later) |
| **Primary surface** | 1024 × 768 landscape |
| **Genre** | Creative journalling / digital scrapbooking / cozy creative sandbox |
| **Audience** | Women who love creative layering, vintage ephemera, paper crafts, and artistic self-expression |
| **Engine / stack** | Unity (per `cozy-craft-journal/`); design-system surfaces shipped as HTML mocks |

---

## 2 · Core product direction

Paper & Petals is **a premium cozy digital junk-journalling studio designed for
women who love creative layering, vintage ephemera, paper crafts, and artistic
self-expression.**

The app should feel: *tactile · calming · artistic · feminine · handcrafted ·
emotionally expressive · simple and intuitive.*

The experience should combine:

- the ease of Canva
- the creativity of physical junk journalling
- the cozy emotional feel of crafting at a real desk

**Paper & Petals is not a productivity tool.** It is a creative hobby experience.

---

## 3 · Authentication & account system

### 3.1 Hybrid model

The app uses a **hybrid account system**. Account creation is **optional at
every stage of the experience**.

### 3.2 Initial user experience

Users **do not need to create an account to begin using the app**. On first
launch:

- users immediately enter the app
- users can create journals instantly
- users can access free content
- users can purchase premium packs
- all data is stored locally on-device

**No onboarding friction. No forced sign-up wall.**

This is intentional, to:

- maximize retention
- reduce onboarding abandonment
- create a cozy, low-pressure experience
- support casual creative usage

### 3.3 Optional account system

After a user becomes invested in the app, they may optionally create an account.
Suggested prompt copy:

- "Save your journals safely."
- "Sync across devices."
- "Protect your creations."

Account creation must feel **helpful, not mandatory**. Loss-framed or
guilt-framed prompts are forbidden.

### 3.4 Account benefits

Optional accounts unlock:

- cloud backups
- multi-device syncing
- journal recovery
- premium purchase syncing
- future community features
- creator profile support

### 3.5 Local storage strategy

Without an account:

- journals save locally
- preferences save locally
- downloaded assets save locally
- purchases are restored through App Store / Google Play

A **Restore Purchases** button must be present in Settings.

### 3.6 Future cloud features (post-MVP)

Not MVP. Documented here as roadmap only:

- cloud saves
- creator marketplace
- online asset syncing
- collaborative journals
- social sharing
- profile collections

---

## 4 · Design philosophy

Paper & Petals should feel like:

- sitting at a beautiful craft desk
- handling real paper textures
- building layered handmade journals

The interface prioritizes:

- emotional comfort
- tactile interaction
- simplicity
- creativity
- collectibility

Avoid:

- cluttered UI
- aggressive gamification
- overly technical workflows
- corporate design language

---

## 5 · Visual direction

**Style:** modern editorial mixed with vintage junk journalling.

Visual inspirations:

- handmade paper ephemera
- layered collage art
- vintage stationery
- premium lifestyle apps
- cozy craft studios

Use:

- textured paper backgrounds
- muted earthy colours
- soft shadows
- rounded cards
- elegant typography
- subtle motion

Avoid:

- neon colours
- glossy UI
- hard black contrast
- cartoon aesthetics

> Full token definitions, palette, type stack, motion easings, and spacing
> system live in the project `README.md` and `colors_and_type.css`.

---

## 6 · Primary app features

### 6.1 Journals

Users create and organize multiple journals. Common purposes:

- memory journals
- travel journals
- reading journals
- mood journals
- creative collages
- scrapbook albums

Journals are central to the home screen (SCR-05) and are presented in a
horizontal carousel: featured journal centred, neighbours peeking on either
side, arrows + swipe to scrub, tap to open the editor (SCR-07).

---

## 7 · Asset library

The app ships a large categorized content library. Categories:

- papers
- stickers
- ephemera
- florals
- tape
- fabric
- frames
- typography
- paint textures
- seasonal kits
- themed collections

Assets are available as:

- free
- premium
- seasonal
- limited edition

---

## 8 · Core interaction model

**Primary interaction:** drag-and-drop layering.

Users can:

- place assets
- resize
- rotate
- overlap
- reorder layers
- lock layers
- duplicate elements

Interactions must feel tactile and satisfying — paper-physics easing, soft
settle, no bouncy/elastic overshoot.

---

## 9 · Tablet-first UX

The app is optimized primarily for **iPad / tablet** in landscape.

Tablet UX includes:

- side asset library panels
- a large creative workspace
- gesture-based controls
- drag interactions
- multi-touch support

Mobile phones use a simplified layout (deferred from MVP).

---

## 10 · Loading screen system

The loading screen (SCR-01) rotates through cozy crafting-related status text
at 3-second intervals. The phrase list lives in `ui_kits/app/Loading.jsx` as
`LOADING_PHRASES`. Examples:

- "Tearing vintage paper…"
- "Layering pretty things…"
- "Making fussy cuts…"
- "Collecting tiny treasures…"
- "Flipping through old journals…"

The loading animation should feel: *soft · cozy · playful · tactile.*

When startup tasks finish, the screen soft-fades and routes:

| User state | Destination |
|---|---|
| New user · first launch ever | SCR-02 Welcome |
| Returning user · first launch today | SCR-03 Package (daily delivery) |
| Returning user · subsequent launch today | SCR-05 Home |

---

## 11 · Logo system

**Brand:** Paper & Petals.

**Logo style:** circular layered junk-journal badge.

Features:

- "PP" monogram
- layered vintage ephemera
- floral elements
- textured paper-collage styling

The app uses multiple logo colourways for the loading animation while keeping
**the central PP, typography, and overall composition consistent**. Six
colourways currently shipped: sage, terracotta, mauve, dusty rose, blue, rose.

---

## 12 · Monetization strategy

**Primary:** premium subscription.

**Secondary:**

- themed asset packs
- seasonal collections
- creator collaborations
- premium journals
- exclusive decorative kits

Monetization should feel: *collectible · inspiring · aesthetic · non-invasive.*

Avoid:

- aggressive ads
- paywalls on first launch
- disruptive monetization

> The home screen (SCR-05) shows an ad banner at the bottom for non-subscribers.
> Subscribed users see the banner replaced with a quiet acknowledgement. No
> in-flow modals, no first-launch paywall.

---

## 13 · User experience goals

The app should create feelings of:

- calm creativity
- nostalgia
- comfort
- artistic inspiration
- emotional expression
- collecting and curating

The experience should encourage:

- long creative sessions
- personalization
- emotional attachment to journals
- repeat visits for new content

---

## 14 · Technical MVP priorities

**MVP must prioritize:**

- smooth drag-and-drop performance
- intuitive UI
- strong visual polish
- local save system
- asset management
- premium content delivery

**MVP must NOT prioritize:**

- social systems
- multiplayer
- creator marketplace
- advanced cloud infrastructure
- community features

Focus on a polished, emotionally engaging creative experience first.
Everything else is post-MVP.

---

## 15 · Change log

### v2.0 — May 2026

- Replaces the v1 SDD ("Cozy Craft Journal") as the authoritative product spec.
- **Audience direction reconciled.** v1 SDD's secondary "women 50–85
  accessibility-first" framing is dropped in favour of the brand brief's
  "women 18–45 who love creative layering, vintage ephemera, paper crafts,
  artistic self-expression." Accessibility floors (≥18pt body, 48×48pt tap
  targets, ≥4.5:1 contrast) are **kept** — they benefit everyone.
- **Authentication model rewritten.** v1 SDD's account-first sign-up flow is
  replaced with the hybrid model in §3 — local-first, account optional, no
  forced sign-up.
- **Monetization rewritten.** No first-launch paywall. Premium subscription
  + collectible asset packs only.
- **Loading screen system formalized** with the 21-phrase rotation and the
  three-way auto-route in §10.
- **Home screen formalized** as a Toca-Boca-style journal carousel (SCR-05),
  replacing the earlier "Craft Room" isometric-scene direction.

— *Paper & Petals · v2.0 · May 2026*
