# Paper & Petals — Build Instructions for Claude Code

> **Read this first, then build phase by phase.** This is the implementation plan for turning the
> Paper & Petals design prototypes into a shipping app. It names every third-party service, gives the
> exact setup, schema, and entitlement logic, and sequences the work so each phase produces something
> runnable. Pair it with the project's prototype files (`ui_kits/`, `colors_and_type.css`, `docs/`).

---

## 0 · What's in this handoff

This handoff **is the whole design project**. The build plan lives in `design_handoff_build/`; the design
references it points to are the project's own prototype files (paths below are from the project root):

```
design_handoff_build/
├── BUILD_INSTRUCTIONS.md     ← you are here (the build plan)
├── theme.ts                  ← design tokens, ready to drop into the app
└── CLAUDE.md                 ← suggested project memory for the new repo
ui_kits/app/                  ← the consumer app prototype (React + Babel, HTML)
ui_kits/cms/                  ← the Studio CMS prototype (admin UI)
colors_and_type.css           ← source of truth for tokens / fonts (styles.css @imports it)
docs/                         ← Backend & Integration Guide, Accessibility report
cozy-craft-journal/ProjectDocumentation/  ← brand brief, ToS, privacy, shop content
```

**The HTML/JSX files are design references, not production code.** They are high-fidelity prototypes
showing the intended look, copy, behaviour, and data shapes. Your job is to **recreate them in a real
React Native (Expo) app** using the stack below — not to port the HTML verbatim. Read a screen's source
to learn its layout, states, and exact copy; then build it natively.

> **Fidelity: high.** Colours, type, spacing, radii, shadows, and copy in the prototypes are final.
> Match them. The one screen that is *interaction-spec, not pixel-spec* is the journal canvas (§9) — it's
> a custom engine you'll build, and the prototype shows the target behaviour.

---

## 1 · The stack (decided — do not re-litigate)

The Backend & Integration Guide (`docs/`) already locked this in. It is a small
assembly of mature platforms plus one piece of genuinely custom code (the canvas).

| Concern | Pick | Why |
|---|---|---|
| **App runtime** | **React Native + Expo** (TypeScript) | Prototypes are React; one codebase for iOS + Android. |
| **Content & scheduling** | **Sanity** | Items, Packs, Collections; native scheduled publishing. |
| **User data & journals** | **Supabase** (Postgres) | Relational journals, row-level security, realtime. |
| **Auth** | **Supabase Auth** | Same project as the DB; local-first friendly. |
| **File storage** | **Supabase Storage** | Journal images & exports. |
| **Subscriptions / IAP** | **RevenueCat** | One `premium` entitlement drives everything. |
| **Push notifications** | **OneSignal** | Daily-delivery reminder, new-pack alerts. |
| **Analytics** | **PostHog** | Funnels, retention, feature flags. |

**Navigation:** Expo Router (file-based). **State/server cache:** TanStack Query for all reads, Zustand
for local UI/editor state. **Canvas:** `@shopify/react-native-skia` + `react-native-gesture-handler` +
`react-native-reanimated`.

---

## 2 · Accounts & secrets to create

Create these before Phase 2. Put keys in `.env` (template in §11). Never commit secrets.

- [ ] **Sanity** project → `projectId`, `dataset` (`production`), a read token for the app, a write token for CMS deploys.
- [ ] **Supabase** project → `SUPABASE_URL`, `SUPABASE_ANON_KEY`, plus a `service_role` key for edge functions only.
- [ ] **RevenueCat** account → iOS + Android API keys; create entitlement **`premium`** and the two products: `cottage_monthly` ($4.99/mo) and `cottage_annual` ($39.99/yr). Wire to App Store Connect & Play Console.
- [ ] **OneSignal** app → App ID + REST key.
- [ ] **PostHog** project → project API key + host.
- [ ] **Apple Developer** + **Google Play** consoles (for the IAP products above and store builds).

---

## 3 · Scaffold the repo

```bash
# 1. App
npx create-expo-app@latest paper-and-petals -t expo-template-blank-typescript
cd paper-and-petals
npx expo install expo-router expo-font expo-secure-store expo-image \
  react-native-gesture-handler react-native-reanimated \
  @shopify/react-native-skia react-native-safe-area-context react-native-screens
npm i @tanstack/react-query zustand @supabase/supabase-js \
  react-native-purchases @sanity/client posthog-react-native react-native-onesignal

# 2. CMS (Sanity Studio) lives in a sibling folder
cd .. && npm create sanity@latest -- --template clean --create-project "Paper & Petals CMS" --dataset production
```

**Target folder structure** for the app:

```
app/                      # Expo Router routes (one file per screen)
  _layout.tsx             # providers: QueryClient, RevenueCat, fonts, safe-area
  index.tsx               # SCR-01 Loading (boot + route decision)
  welcome.tsx             # SCR-02
  (tabs)/                 # Home, Shop, Settings live behind the loaded app
  editor/[journalId].tsx  # SCR-07
  subscription.tsx        # SCR-24
src/
  theme/theme.ts          # ← copy from this bundle
  theme/fonts.ts          # font loading map (§4)
  components/             # Button, Card, SettingsRow, StatusStamp, AdBanner, Toggle …
  features/
    journals/             # canvas engine, scene model, autosave
    shop/  content/  packs/
  lib/
    supabase.ts  sanity.ts  revenuecat.ts  analytics.ts  notifications.ts
  store/                  # zustand stores (editor, ui)
```

---

## 4 · Port the design system (Phase 1)

**Tokens.** Copy `theme.ts` from this bundle into `src/theme/`. It is the typed translation of
`colors_and_type.css`. Every component reads from it — no hard-coded hex. (Full token reference is §10.)

**Fonts.** Four self-hosted faces (also in `` paths referenced by the brand brief). Load with `expo-font`:

| Role | Family | Use |
|---|---|---|
| Display / headings | **Spectral** (Regular) | titles, screen headers |
| Body & UI | **Nunito Sans** (variable) | everything functional |
| Script / italic | **EB Garamond Italic** | pull-quotes, the `&`, soft lines |
| Flourish | **Pinyon Script** | ornamental hero moments only |

Obtain the `.ttf` files from the design project's `/fonts` folder (Spectral-Regular, NunitoSans variable,
EBGaramond-Italic variable, PinyonScript-Regular) and place in `assets/fonts/`.

**Build these primitives first** (they recur everywhere — see prototype sources for exact styling):
`Screen`, `Button` (primary/secondary/ghost/pill), `Card` (+ stitched variant), `Eyebrow`, `Toggle`,
`StatusStamp`, `SettingsRow`, `Icon` (port `ui_kits/app/Icon.jsx` to an SVG icon set).

**Acceptance:** a Storybook-style sandbox screen renders all primitives matching the prototype.

---

## 5 · Responsive direction (tablet + phone)

The app is **tablet-first** (the prototype canvas is 1024×768) but must run on phones. The prototype's
device toggle (`ui_kits/app/index.html` → "Preview: Tablet / Phone") shows the intended reflow for the
three "easy" screens — **Welcome, Settings, Subscription** — which collapse to a single column with
full-width controls at phone width. Build every screen responsively from day one:

- Use `useWindowDimensions()` + a `useDevice()` hook returning `'phone' | 'tablet'` at a ~700px breakpoint.
- Phone: single-column forms, full-width buttons, stacked card rows, reduced padding (see the prototype's `phone` branches in `Welcome.jsx`, `Settings.jsx`, `Subscription.jsx`).
- Tablet: the richer multi-column layouts.
- The **canvas-heavy screens** (Home, Shop, Editor) need dedicated phone layouts — budget extra time; the prototype only proves the easy screens.

Cross-check against `docs/Accessibility & Phone Readiness.html` for hit-target (≥44px)
and contrast requirements.

---

## 6 · Content model → Sanity schema (Phase 2)

The shapes in `ui_kits/cms/data.js` **are** the schema. One `item` powers both the Shop
(SCR-06) and the editor drawer (SCR-07). Status is **derived from `publishAt`, never stored**.

```ts
// sanity/schemas/item.ts
export default {
  name: 'item', type: 'document', title: 'Item',
  fields: [
    { name: 'name', type: 'string', validation: r => r.required() },
    { name: 'category', type: 'string', options: { list: [
      'collections','papers','stickers','washi','floral','ephemera',
      'frames','typography','stamps','ribbons','paint','details' ] } },
    { name: 'asset', type: 'image', title: 'Artwork' },   // replaces prototype glyph placeholder
    { name: 'tier', type: 'string', options: { list: ['free','paid'] }, initialValue: 'free' },
    { name: 'price', type: 'number', hidden: ({parent}) => parent?.tier === 'free' },
    { name: 'publishAt', type: 'datetime', title: 'Publish at (drives Draft/Scheduled/Live)' },
  ],
}

// pack.ts — one document per delivery date; two parcels (free for all, sub for members)
fields: [
  { name: 'date', type: 'date', validation: r => r.required().unique?.() },
  { name: 'title', type: 'string' },
  { name: 'free', type: 'array', of: [{ type: 'reference', to: [{type:'item'}] }] },
  { name: 'sub',  type: 'array', of: [{ type: 'reference', to: [{type:'item'}] }] },
]

// collection.ts — Shop bundles: { name, palette, price, items: ref[] }
// feedback.ts   — { type: 'idea'|'bug'|'love', message, email?, createdAt, read }  (app writes, CMS reads)
```

Enable **Sanity Scheduled Publishing**. The Studio CMS schedule view (`ui_kits/cms/Schedule.jsx`) is just
a read of `publishAt`: `publishAt > now` → Scheduled, `≤ now` → Live, empty → Draft.

---

## 7 · App DB & APIs → Supabase (Phase 3)

Journals and accounts live in Postgres. Content reads come from Sanity. The app **never sees drafts or
future content** — every content query filters `publishAt <= now()`.

```sql
-- supabase/migrations/0001_init.sql
create table journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  front_cover text default 'leather-cognac',
  back_cover  text default 'leather-cognac',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table spreads (
  id uuid primary key default gen_random_uuid(),
  journal_id uuid references journals on delete cascade not null,
  index int not null,
  -- ordered placed items: [{ itemId, x, y, w, h, rotate, z }]
  scene jsonb not null default '[]'::jsonb
);
alter table journals enable row level security;
alter table spreads  enable row level security;
create policy "own journals" on journals using (auth.uid() = user_id);
create policy "own spreads"  on spreads using (
  auth.uid() = (select user_id from journals where id = spreads.journal_id));
```

**API surface the app calls** (Sanity GROQ for content, Supabase client for user data):

```
GET  /items?status=live&category=stickers   → Sanity, filtered on publishAt
GET  /packs/today                            → Sanity, where date == today
GET  /me/journals                            → Supabase (RLS, auth-scoped)
PUT  /me/journals/:id (spread JSON)          → Supabase, debounced autosave
POST /feedback                               → Sanity feedback doc (via edge function)
```

Local-first: keep the open journal in a Zustand store, write through to Supabase on a debounce, and
reconcile on reconnect. Signing in turns on cross-device sync (Settings "Create account & turn on sync").

---

## 8 · Entitlements → RevenueCat (Phase 4)

One entitlement, `premium`, drives **three** behaviours. This is the centre of the business model and a
standard RevenueCat pattern — no custom billing code.

```ts
import Purchases from 'react-native-purchases';
const info = await Purchases.getCustomerInfo();
const isPremium = info.entitlements.active['premium'] != null;

const todaysItems = isPremium ? [...pack.free, ...pack.sub] : pack.free; // 1. richer daily delivery
const showAdBanner = !isPremium;                                          // 2. hide ad banners
const canUse = (item) => item.tier === 'free' || isPremium;              // 3. paid items free for members
```

**Ad banners & the value prop.** Free users see the ad banner on **Home (SCR-05)** and **Editor (SCR-07)**
("Remove ads with subscription"). The **Subscription screen (SCR-24)** value prop now *confirms* that —
it leads with *"A calm, ad-free studio — no banners, ever."* Keep that promise consistent across all three
surfaces when you build them: the banner CTA → SCR-24 → ad-free is the headline benefit. The full benefit
list and "cancel-first, no dark patterns" layout are in `ui_kits/app/Subscription.jsx`.

Mirror the prototype's Settings membership toggle: subscribing flips `premium`, which removes banners and
unlocks paid items app-wide.

---

## 9 · The journal canvas (custom — the hard part)

The one piece with no off-the-shelf answer. The editor's place / drag / resize / rotate / layer-reorder /
page-flip / zoom / off-page-clip is a real 2D scene graph. **Budget most engineering time here.** Read
`ui_kits/app/JournalEditor.jsx` for the full interaction spec.

- **Scene model:** each spread = ordered list of placed items `{ itemId, x, y, w, h, rotate, z }`.
- **Render** with Skia; **gestures** with gesture-handler + reanimated (pan/pinch/rotate per item).
- **Clipping:** items may slide partly off a page edge; a minimum sliver (~30px) must stay on-page so a piece can never vanish. The page clips the overflow.
- **Persist:** serialize each spread to the `spreads.scene` JSONB (§7) on a debounce.

What you already have: the exact interaction spec, the placed-item data shape, the cover/endpaper/texture
model, and the 12-category asset taxonomy (`cozy-craft-journal/ProjectDocumentation/Shop_Content_Reference.md`).

---

## 10 · Design tokens reference

Full source: `colors_and_type.css`. Typed version: `theme.ts`. Key values:

**Surfaces** `warm-white #F8F7F4` · `soft-linen #EFE9E1` · `vintage-paper #E5D8C8` · `cream #FFFDF6`
**Accents** `terracotta #C47B63` · `sage #87937C` · `dusty-blue #8FA3B8` · `mauve #A98C98`
**Deep** `forest #4E6652` (primary CTA) · `forest-deep #3B4E3F` (pressed)
**Text** `charcoal #2B2A28` · `espresso #4B4038` · `stone-warm #7A6B52` · `stone #9A8A72`
**Highlights** `antique-gold #C8A96B` · `soft-rose #D7B7B0`
**Semantic** `success #7A8F6E` · `warning #C8A96B` · `danger #B26A5A`
**Hairline** `#C8BC9E`

**Type scale** h1 42 · h2 32 · h3 24 · body-lg 18 · body 16 · caption 13 · micro 11
**Radii** xs 4 · sm 6 · md 10 · lg 16 · xl 24 · pill 999
**Spacing** 4·8·12·16·20·24·32·40·48·64·80·96 (multiples of 4 — calm > dense)
**Motion** `ease-paper cubic-bezier(.32,.72,.32,1)` · durations fast 150 / base 240 / slow 480 / page 600ms

---

## 11 · `.env` template

```bash
EXPO_PUBLIC_SANITY_PROJECT_ID=
EXPO_PUBLIC_SANITY_DATASET=production
SANITY_READ_TOKEN=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=            # edge functions only — never ship to client
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
ONESIGNAL_REST_KEY=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## 12 · Build phases & definition of done

| Phase | Goal | Brings online | Done when |
|---|---|---|---|
| **1 · Foundation** | Theme + nav shell | tokens, fonts, primitives, Expo router, static screens | every screen renders statically, on phone + tablet |
| **2 · Content** | Real Shop & library | Sanity schema, read APIs, Studio live for the team | Shop & editor drawer show live items; drafts hidden |
| **3 · Canvas** | Make & save a journal | editor engine, Supabase DB/Storage/Auth | place→move→save→reopen round-trips |
| **4 · Money** | Subscriptions & packs | RevenueCat `premium`, daily packs, ad removal | sandbox purchase flips banners + unlocks paid items |
| **5 · Growth** | Retention loop | OneSignal reminders, PostHog, feedback inbox | daily reminder fires; feedback reaches CMS inbox |

**Launch checklist:** entitlement `premium` tested in sandbox · `publishAt` filtering verified on every
content read · journal autosave + restore round-trips · feedback POST reaches the CMS inbox · privacy
policy & data export wired (drafted in `cozy-craft-journal/ProjectDocumentation/`) · ≥44px hit targets & AA contrast
(see Accessibility report).

---

## 13 · Screen inventory (prototype → app route)

| ID | Screen | Route | Source | Notes |
|---|---|---|---|---|
| SCR-01 | Loading | `app/index.tsx` | `Loading.jsx` | boots, then routes by user state (new / first-today / returning) |
| SCR-02 | Welcome | `app/welcome.tsx` | `Welcome.jsx` | first-launch form; "Subscribe & continue" / "Continue without" |
| SCR-03 | Package opening | `app/package.tsx` | `PackageOpening.jsx` | daily parcel reveal |
| SCR-05 | Home (craft room) | `app/(tabs)/index.tsx` | `HomeScreen.jsx` | journal shelf + **ad banner** (free) |
| SCR-06 | Shop | `app/(tabs)/shop.tsx` | `Shop.jsx` | items + collections; paid free for members |
| SCR-07 | Journal editor | `app/editor/[id].tsx` | `JournalEditor.jsx` | **the canvas** + ad banner (free) |
| SCR-23 | Settings | `app/(tabs)/settings.tsx` | `Settings.jsx` | account/sync, membership, prefs, privacy |
| SCR-24 | Subscription | `app/subscription.tsx` | `Subscription.jsx` | cancel-first; ad-free-led value prop |

Studio CMS (`ui_kits/cms/`) is a **separate Sanity Studio** the team operates — Library, Packs (two-track
daily builder), Schedule, Feedback inbox.

---

*Companion to the design prototypes. When a detail isn't here, the prototype source is the source of truth —
read the relevant `.jsx` for exact copy, layout, and states.*
