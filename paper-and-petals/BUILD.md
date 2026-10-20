# Building & releasing Paper & Petals

## TL;DR — cut a TestFlight build

```bash
eas build --profile production --platform ios
eas submit --profile production --platform ios   # or use the EAS dashboard
```

`production` has `autoIncrement: true`, so the build number bumps automatically
(the last TestFlight build was 9 → this will be 10).

The app builds and runs **without any environment variables**: it can't crash on
a missing backend, and journals persist on-device (local-first). The variables
below only switch on extra features.

## Environment variables for cloud builds

A gitignored `.env` is **not** uploaded to EAS cloud builds, so set these as EAS
environment variables. They're all `EXPO_PUBLIC_*` (embedded in the client by
design — not secrets), so plain-text visibility is fine.

Create them once (scoped to the build profiles you use):

```bash
# Most valuable for a test cycle — so the in-app crash reporter reaches you:
eas env:create --name EXPO_PUBLIC_POSTHOG_KEY        --value "<your posthog project key>" --environment production --visibility plaintext

# Mailing list (optional; the welcome form's emails also go to RevenueCat):
eas env:create --name EXPO_PUBLIC_SUPABASE_URL       --value "<https://xxx.supabase.co>"  --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY  --value "<your anon key>"            --environment production --visibility plaintext

# Android IAP (only needed for Android builds):
eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "<goog_...>"             --environment production --visibility plaintext

# Push notifications (optional):
eas env:create --name EXPO_PUBLIC_ONESIGNAL_APP_ID   --value "<onesignal app id>"        --environment production --visibility plaintext
```

Verify what a build will see:

```bash
eas env:list --environment production
```

Sanity (`cv53e819`/`production`) and the RevenueCat **iOS** key have built-in
defaults, so they only need overriding to point somewhere else. See
`.env.example` for the full list and what each one enables.

## Supabase tables (only if you set the Supabase vars)

The mailing-list capture writes to a `subscribers` table, and fails soft if it
is absent. Journals are **not** synced: they stay on the device until the app
has real accounts. An earlier build wrote journals to a `spreads` table keyed
only by journal id, which is the same (`j-first`) for every user and had no
row-level security. If that table exists, drop it:

```sql
drop table if exists public.spreads;
```

Minimal schema for the mailing list:

```sql
create table if not exists public.subscribers (
  email text primary key,
  name text,
  marketing_consent boolean not null default false,
  source text,
  created_at timestamptz not null default now()
);
alter table public.subscribers enable row level security;
create policy "anon can add subscribers"
  on public.subscribers for insert to anon with check (true);
```
