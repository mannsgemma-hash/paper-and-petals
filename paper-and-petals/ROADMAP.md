# Roadmap — after launch

Ideas and known follow-ups, not needed for version 1. Newest thinking at the top
of each section; move an item to "Done" (or delete it) when it ships.

## Editor
- **Soundscapes in the top bar.** Move the music button out of the side tool
  column into the top menu — tucked away under a small button, it gets
  forgotten.
- **Text box width.** Corners scale text like a picture (size and wrap width
  together). A separate way to make a box wider or narrower *without* changing
  the lettering size may be wanted once people use it.

## Shop
- **"New this week" row and browsing by theme/season** — at ~10 collections a
  month the shop passes 60–70 by spring, where one long list stops working.
- **Faster shop images** — cached, WebP thumbnails like the editor drawer
  (expo-image + `drawerThumbSource` in `src/lib/images.ts`).

## Accounts & platforms
- **iPhone.** Version 1 is iPad-only (`ios.isTabletOnly` in app.json). Adding
  iPhone later is allowed; removing it once shipped is not. Before turning it
  on: walk every screen at phone width (the editor especially), and take
  6.9-inch iPhone screenshots for App Store Connect.
- **Accounts and cloud sync** for journals (needs sign-in, Sign in with Apple,
  per-user storage, photo upload, in-app account deletion).
- **Android** — RevenueCat Android key, Play Store build and listing.

## App Store
- **"Rate Paper & Petals" row in Settings** — opens the App Store review page;
  needs the App Store app ID once the listing exists.

## Housekeeping
- **Home tour rings** still use fixed positions; measure them like the editor
  tour (`targets` on `TourStep`).
- **`npm audit fix`** on the build tools (Metro, Expo CLI) — not shipped in the
  app, deliberately left until after launch.
- **expo-audio microphone permission** — Expo commands sometimes add
  `RECORD_AUDIO` to `app.json`; set the audio plugin not to, before Android.
- **Protect full-resolution art** behind a server check of the buyer's
  entitlement (accepted risk for v1).
