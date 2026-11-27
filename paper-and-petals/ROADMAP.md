# Roadmap — after launch

Ideas and known follow-ups, not needed for version 1. Newest thinking at the top
of each section; move an item to "Done" (or delete it) when it ships.

## Editor
- **Text box width.** Corners scale text like a picture (size and wrap width
  together). A separate way to make a box wider or narrower *without* changing
  the lettering size may be wanted once people use it.
- **Drag to reorder layers.** 1.0 uses ▲/▼ buttons; drag-and-drop failed twice
  without a device to test on. Worth another go once it can be tried on an
  iPad during development.
- **Sharper torn-edge, shape-masked and photo pieces.** Shop art now renders at
  its on-screen resolution (`canvasSource`); these still draw the old way and
  may look soft at full-page size.

## Shop
- **Browsing by theme/season** — at ~10 collections a month the shop passes
  60–70 by spring, where one long list stops working. Needs a `theme` field on
  collections in Sanity, filled in for each one.
- **Faster shop images** — cached, WebP thumbnails like the editor drawer
  (expo-image + `drawerThumbSource` in `src/lib/images.ts`).

## Accounts & platforms
- **Accounts and cloud sync** for journals (needs sign-in, Sign in with Apple,
  per-user storage, photo upload, in-app account deletion).
- **Android** — RevenueCat Android key, Play Store build and listing.

## App Store & growth
- **"Rate Paper & Petals" row in Settings** — opens the App Store review page;
  needs the App Store app ID (App Store Connect → App Information → Apple ID).
- **App Preview video** (15–30 s, on the product page) cut from a screen
  recording.
- **Competitor-name Apple Ads campaign** — only once Category is profitable
  (see ADS.md).

## Subscriptions
- **In-app "Manage subscription" with a retention offer** (RevenueCat Customer
  Center): offers the discount when someone cancels from inside the app.
  Needs a new library, the In-App Purchase key in RevenueCat and a promotional
  offer in App Store Connect.

## Housekeeping
- **`npm audit fix`** on the build tools (Metro, Expo CLI) — not shipped in the
  app, deliberately left until after launch.
- **expo-audio microphone permission** — Expo commands sometimes add
  `RECORD_AUDIO` to `app.json`; set the audio plugin not to, before Android.
- **Protect full-resolution art** behind a server check of the buyer's
  entitlement (accepted risk for v1).

## Done
- **1.1:** iPhone (editor turns landscape on phones; round header buttons
  upright), "New this week" shop row, Sounds button in the editor top bar,
  measured home tour rings.
- **No build:** English (UK) keywords, Studio win-back offer (APPSTORE.md §9–10).
