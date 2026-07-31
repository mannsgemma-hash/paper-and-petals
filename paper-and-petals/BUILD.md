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

# Cloud sync + mailing list (optional; app is local-first without it):
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

Cloud sync writes to a `spreads` table; the mailing-list capture writes to a
`subscribers` table. Both fail soft if absent. Minimal schema:

```sql
create table if not exists public.spreads (
  journal_id text not null,
  page_number int not null,
  scene jsonb,
  updated_at timestamptz not null default now(),
  primary key (journal_id, page_number)
);

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
