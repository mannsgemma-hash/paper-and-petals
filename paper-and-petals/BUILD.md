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

## Push notifications (OneSignal)

Four notifications, all opt-in through the app (Apple guideline 4.5.4). Nobody
gets one until they've said yes to "Hear about new collections?" (asked as they
leave their first journal) or turned on a switch in Settings.

| Notification | Sent by | Goes to (tag) | Tapping opens |
|---|---|---|---|
| New collections | `npm run notify -- --yes` (studio), each Saturday | `notify_new_items = 1` | Shop |
| Seasonal collections | `npm run notify -- --yes --audience seasonal` | `notify_collections = 1` | Shop |
| Studio trial ends in 2 days | Journey (below) | has `trial_reminder_at` | Shop |
| Journalling idea after 14 days away | Journey (below) | `notify_reminders = 1` | Home |

A notification picks its screen with Additional Data `route` = `shop` or
`home`. Nothing else is accepted (`src/lib/notifications.ts`).

### One-time setup

1. Apple Developer → Keys → **+** → tick **Apple Push Notifications service
   (APNs)** → download the `.p8` (you only get one download). Note its Key ID
   and your Team ID.
2. OneSignal → Settings → Push & In-App → **Apple iOS (APNs)** → upload the
   `.p8`, Key ID, Team ID, bundle ID `com.paperandpetals.app`.
3. OneSignal → Settings → Keys & IDs: the **App ID** goes into EAS as
   `EXPO_PUBLIC_ONESIGNAL_APP_ID`. The **App API key** is a secret: only ever
   set it in PowerShell for `npm run notify` (`$env:ONESIGNAL_API_KEY`).
4. The next `eas build` asks to set up credentials for
   `OneSignalNotificationServiceExtension` — say yes.
5. Before launch, once: `npm run notify -- --mark-all --yes` (studio), so the
   existing catalogue is never announced.

### Segments (Audience → Segments → New Segment)

- **Trial reminder due**: User Tag `trial_reminder_at` **time elapsed greater
  than** 0 seconds, AND User Tag `trial_reminder_at` **time elapsed less than**
  1 day. (The upper bound stops a stale tag sending a reminder weeks late.)
- **Away 14 days**: Last Session **greater than** 336 hours, AND User Tag
  `notify_reminders` **is** `1`.

### Journeys (Messages → Journeys → New Journey)

**Studio trial reminder**
- Entry: segment *Trial reminder due*. Re-entry: off.
- Step: Push.
  - Title: `Your Studio trial ends in 2 days`
  - Message: `Keep it and it carries on automatically. To cancel, open iPad Settings → your name → Subscriptions.`
  - Additional Data: `route` = `shop`
- Exit: after the push.

**Journalling idea**
- Entry: segment *Away 14 days*. Re-entry: allowed after 30 days.
- Step: Push.
  - Title: `Your journal misses you`
  - Message: `{{ journal_prompt | default: "What made you smile today?" }}`
  - Additional Data: `route` = `home`
- Exit: after the push, or when the person opens the app.

Send each one to yourself first (Journeys → Test) before turning it on.
