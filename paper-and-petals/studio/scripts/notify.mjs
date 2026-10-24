// studio/scripts/notify.mjs
//
// Tell people about new collections: one push notification through OneSignal,
// for every published collection that hasn't been announced yet. Run it after
// the Saturday ingest.
//
// A collection counts as announced once its `announcedAt` is set, which this
// script does after a successful send. Ingest carries the field over, so
// re-cutting a collection never announces it twice.
//
// Safe by default: with no flag it only shows what it WOULD send.
//
// Usage (from studio/):
//   npm run notify                          # preview, send nothing
//   npm run notify -- --yes                 # send (10am in each person's time zone)
//   npm run notify -- --yes --now           # send immediately
//   npm run notify -- --yes --audience seasonal   # the "seasonal collections" switch
//   npm run notify -- --title "…" --message "…"   # your own wording
//   npm run notify -- --mark-all            # mark everything announced, send nothing
//                                           # (once, before launch, so the
//                                           # existing catalogue isn't announced)
//
// On Windows PowerShell:
//   $env:SANITY_WRITE_TOKEN="sk..."
//   $env:ONESIGNAL_APP_ID="…"        (OneSignal → Settings → Keys & IDs)
//   $env:ONESIGNAL_API_KEY="…"       (same page — the App API key. A secret:
//                                     never put it in the app or in git)

import { createClient } from '@sanity/client'
import { assertSanityToken, explainSanityError } from '../pipeline/lib/auth.mjs'

const projectId = process.env.SANITY_PROJECT_ID || 'cv53e819'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
assertSanityToken(token, 'mark collections as announced')

const argv = process.argv.slice(2)
const has = (f) => argv.includes(f)
const opt = (f) => {
  const i = argv.indexOf(f)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : undefined
}
const YES = has('--yes')
const NOW = has('--now')
const MARK_ALL = has('--mark-all')
const AUDIENCE = opt('--audience') ?? 'new-items'

// The Settings switches, as the app tags them (src/lib/notifications.ts).
const AUDIENCE_TAGS = { 'new-items': 'notify_new_items', seasonal: 'notify_collections' }
const tag = AUDIENCE_TAGS[AUDIENCE]
if (!tag) {
  console.error(`--audience must be one of: ${Object.keys(AUDIENCE_TAGS).join(', ')}`)
  process.exit(1)
}

/** More than this in one go is almost certainly a first run, not a Saturday. */
const FIRST_RUN_GUARD = 8

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false })

const UNANNOUNCED = `*[_type == "collection" && !(_id in path("drafts.**"))
  && !defined(announcedAt)
  && (!defined(publishAt) || publishAt <= now())
  && count(items) > 0] | order(_createdAt asc) { _id, name, free }`

const quote = (s) => `“${s}”`

function defaultWording(cols) {
  if (cols.length === 1) {
    const c = cols[0]
    return {
      title: c.free ? 'A free collection just arrived' : 'New in the shop',
      message: `${quote(c.name)} has just arrived. Come and take a look.`,
    }
  }
  const named = cols.slice(0, 2).map((c) => quote(c.name)).join(' and ')
  return {
    title: 'New in the shop',
    message: `${cols.length} new collections have just arrived, including ${named}.`,
  }
}

async function send({ title, message }) {
  const appId = process.env.ONESIGNAL_APP_ID
  const apiKey = process.env.ONESIGNAL_API_KEY
  if (!appId || !apiKey) {
    console.error('Missing ONESIGNAL_APP_ID or ONESIGNAL_API_KEY — both are on OneSignal → Settings → Keys & IDs.')
    process.exit(1)
  }
  const body = {
    app_id: appId,
    target_channel: 'push',
    headings: { en: title },
    contents: { en: message },
    filters: [{ field: 'tag', key: tag, relation: '=', value: '1' }],
    // The app opens the Shop for this key; it never takes a path from a push.
    data: { route: 'shop' },
    ...(NOW ? {} : { delayed_option: 'timezone', delivery_time_of_day: '10:00AM' }),
  }
  const res = await fetch('https://api.onesignal.com/notifications?c=push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${apiKey}` },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.id) {
    const why = json.errors ? JSON.stringify(json.errors) : `HTTP ${res.status}`
    throw new Error(`OneSignal did not accept the notification: ${why}`)
  }
  return json.id
}

async function markAnnounced(ids) {
  const at = new Date().toISOString()
  const tx = ids.reduce((t, id) => t.patch(id, (p) => p.set({ announcedAt: at })), client.transaction())
  await tx.commit()
}

async function main() {
  let cols
  try {
    cols = await client.fetch(UNANNOUNCED)
  } catch (err) {
    explainSanityError(err, projectId)
  }

  if (cols.length === 0) {
    console.log('Nothing new to announce — every published collection has been announced.')
    return
  }

  console.log(`Not yet announced (${cols.length}):`)
  for (const c of cols) console.log(`  · ${c.name}${c.free ? '  (free)' : ''}`)

  if (MARK_ALL) {
    if (!YES) {
      console.log(`\nWould mark these ${cols.length} as announced WITHOUT sending anything. Add --yes to do it.`)
      return
    }
    await markAnnounced(cols.map((c) => c._id))
    console.log(`\n✓ Marked ${cols.length} as announced. Nothing was sent.`)
    return
  }

  const wording = defaultWording(cols)
  const title = opt('--title') ?? wording.title
  const message = opt('--message') ?? wording.message
  console.log(`\nNotification:\n  ${title}\n  ${message}`)
  console.log(`To: everyone with "${AUDIENCE}" switched on (tag ${tag} = 1)`)
  console.log(`When: ${NOW ? 'immediately' : '10:00am in each person’s own time zone'}`)
  console.log('Tapping it opens the Shop.')

  if (cols.length > FIRST_RUN_GUARD) {
    console.log(
      `\n⚠ ${cols.length} collections at once looks like the existing catalogue, not this week's drop.` +
        '\n  If this is your first run, use --mark-all --yes instead, then announce future drops.',
    )
    if (!has('--force')) {
      console.log('  (Add --force to send anyway.)')
      return
    }
  }

  if (!YES) {
    console.log('\nNothing sent. Add --yes to send.')
    return
  }

  const id = await send({ title, message })
  try {
    await markAnnounced(cols.map((c) => c._id))
  } catch (err) {
    // The notification has gone; don't let a re-run send it twice.
    console.error(`\n✓ Sent (OneSignal id ${id}), but marking them announced failed: ${err?.message ?? err}`)
    console.error('  Run `npm run notify -- --mark-all --yes` now, or the next run will announce them again.')
    process.exit(1)
  }
  console.log(`\n✓ Sent (OneSignal id ${id}) and marked ${cols.length} as announced.`)
}

main().catch((err) => {
  console.error(`\n${err?.message ?? err}`)
  process.exit(1)
})
