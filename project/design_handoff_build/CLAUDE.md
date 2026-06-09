# Paper & Petals — Project Memory

> Copy this into the root of the new app repo as `CLAUDE.md` so Claude Code keeps these conventions in
> every session. Trim once the codebase establishes its own patterns.

## What this is
A cottagecore digital scrapbooking app. Users receive a daily parcel of paper craft items and arrange them
on journal spreads. Tablet-first, also runs on phones. Calm, tactile, hand-made feeling — **never** busy,
salesy, or aggressive.

## Stack (decided)
Expo + React Native (TypeScript) · Expo Router · TanStack Query (reads) · Zustand (local/editor state) ·
Sanity (content) · Supabase (user data, auth, storage) · RevenueCat (`premium` entitlement) ·
OneSignal (push) · PostHog (analytics) · Skia + gesture-handler + reanimated (journal canvas).

## Non-negotiables
- **Tokens only.** Import from `src/theme/theme.ts`. No hard-coded hex, font names, or magic spacing.
- **Four fonts:** Spectral (display), Nunito Sans (UI/body), EB Garamond Italic (script), Pinyon Script (flourish, sparingly).
- **Status is derived, never stored.** Content is Draft/Scheduled/Live from `publishAt` vs now.
- **One entitlement, `premium`,** controls: richer daily delivery, no ad banners, paid items free. Keep all three in sync.
- **No dark patterns.** Cancel-first subscription, no first-launch paywall, no scare screens. The Subscription value prop leads with *ad-free*.
- **Local-first.** The open journal lives in a store and writes through to Supabase on a debounce; reconcile on reconnect.
- **Responsive from day one.** `useDevice()` at a 700px breakpoint; phone = single column, full-width controls, ≥44px hit targets.

## Source of truth
The design prototypes (the project's `ui_kits/` HTML/JSX) define exact copy, layout, and states. When a
detail is missing from the build instructions, **read the relevant `.jsx`** rather than guessing.

## Voice
Warm, plain, unhurried. Lowercase-friendly, gentle. e.g. "with care, from the Paper & Petals studio."
Avoid hype, urgency, and exclamation-heavy copy.
