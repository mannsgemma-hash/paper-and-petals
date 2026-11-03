// studio/scripts/notify.mjs
//
// Tell people about new collections: push notifications through OneSignal for
// every collection not yet announced — one notification per release day.
// Run it once after the upload-day ingest.
//
// Collections released by `ingest --release-every N` get their notification
// SCHEDULED for their release day, so a whole batch is announced in one
// sitting but reaches people one collection at a time, as each appears in the
// shop. Anything already live goes out today.
//
// When it arrives: by default OneSignal's Intelligent Delivery, which sends to
// each person at the hour they usually open the app (it can take up to a day).
// `--at "7:30PM"` sends at a fixed time in each person's own time zone instead.
//
// A collection counts as announced once its `announcedAt` is set, which this
// script does once OneSignal has accepted (or scheduled) the notification; the
// notification's id is kept in `announceId` so a scheduled one can be cancelled.
// Ingest carries both over, so re-cutting a collection never announces it twice.
//
// Safe by default: with no flag it only shows what it WOULD send.
//
// Usage (from studio/):
//   npm run notify                          # preview, send nothing
//   npm run notify -- --yes                 # send / schedule
//   npm run notify -- --yes --at "7:30PM"   # fixed local time instead of each person's best hour
//   npm run notify -- --yes --now           # already-live collections: send this minute
//   npm run notify -- --yes --audience seasonal   # the "seasonal collections" switch
//   npm run notify -- --title "…" --message "…"   # your own wording (one release day only)
//   npm run notify -- --cancel              # preview cancelling every scheduled, unsent one
//   npm run notify -- --cancel --yes        # …do it (then change dates, re-ingest, notify again)
//   npm run notify -- --mark-all --yes      # mark everything announced, send nothing
//                                           # (once, before launch, so the
//                                           # existing catalogue isn't announced)
//
// On Windows PowerShell:
//   $env:SANITY_WRITE_TOKEN="sk..."
//   $env:ONESIGNAL_API_KEY="…"       (OneSignal → Settings → Keys & IDs → App API key.
//                                     A secret: never put it in the app or in git)
//   $env:ONESIGNAL_APP_ID="…"        (optional — Paper & Petals' App ID is built in)

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
const CANCEL = has('--cancel')
const AT = opt('--at')
const AUDIENCE = opt('--audience') ?? 'new-items'

if (AT && !/^(1[0-2]|[1-9]):[0-5]\d(AM|PM)$/i.test(AT)) {
  console.error('--at takes a time like "7:30PM" or "10:00AM".')
  process.exit(1)
}

// The Settings switches, as the app tags them (src/lib/notifications.ts).
const AUDIENCE_TAGS = { 'new-items': 'notify_new_items', seasonal: 'notify_collections' }
const tag = AUDIENCE_TAGS[AUDIENCE]
if (!tag) {
  console.error(`--audience must be one of: ${Object.keys(AUDIENCE_TAGS).join(', ')}`)
  process.exit(1)
}

/** More than this live at once is almost certainly a first run, not a drop. */
const FIRST_RUN_GUARD = 8

const APP_ID = process.env.ONESIGNAL_APP_ID || 'd50abe7b-a314-4d1b-8c05-0b838b72aacd'
const API_KEY = process.env.ONESIGNAL_API_KEY

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false })

const UNANNOUNCED = `*[_type == "collection" && !(_id in path("drafts.**"))
  && !defined(announcedAt)
  && count(items) > 0] | order(publishAt asc, _createdAt asc) { _id, name, free, publishAt }`

const SCHEDULED = `*[_type == "collection" && !(_id in path("drafts.**"))
  && defined(announceId) && publishAt > now()] | order(publishAt asc) { _id, name, publishAt, announceId }`

const quote = (s) => `“${s}”`
/** Release days are Brisbane dates — the same clock ingest schedules on. */
const brisbaneDate = (ms) => new Date(ms + 10 * 60 * 60 * 1000).toISOString().slice(0, 10)
const isFuture = (iso) => !!iso && Date.parse(iso) > Date.now()

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

function requireKey() {
  if (!API_KEY) {
    console.error('Missing ONESIGNAL_API_KEY — the App API key on OneSignal → Settings → Keys & IDs.')
    process.exit(1)
  }
}

async function onesignal(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${API_KEY}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const why = json.errors ? JSON.stringify(json.errors) : `HTTP ${res.status}`
    throw new Error(`OneSignal refused (${method}): ${why}`)
  }
  return json
}

/** How a notification reaches people, as shown in the preview and sent. */
function timing(sendAfter) {
  const when = sendAfter ? `from ${brisbaneDate(Date.parse(sendAfter))}, ` : ''
  if (!sendAfter && NOW) return { label: 'immediately', fields: {} }
  if (AT) {
    return {
      label: `${when}at ${AT} in each person’s own time zone`,
      fields: { delayed_option: 'timezone', delivery_time_of_day: AT },
    }
  }
  return {
    label: `${when}at each person’s usual app time (Intelligent Delivery, within a day)`,
    fields: { delayed_option: 'last-active' },
  }
}

async function send({ title, message, sendAfter }) {
  const json = await onesignal('POST', 'https://api.onesignal.com/notifications?c=push', {
    app_id: APP_ID,
    target_channel: 'push',
    headings: { en: title },
    contents: { en: message },
    filters: [{ field: 'tag', key: tag, relation: '=', value: '1' }],
    // The app opens the Shop for this key; it never takes a path from a push.
    data: { route: 'shop' },
    ...(sendAfter ? { send_after: sendAfter } : {}),
    ...timing(sendAfter).fields,
  })
  if (!json.id) throw new Error(`OneSignal accepted nothing: ${JSON.stringify(json.errors ?? json)}`)
  return json.id
}

async function mark(ids, fields) {
  const tx = ids.reduce((t, id) => t.patch(id, (p) => p.set(fields)), client.transaction())
  await tx.commit()
}

async function cancelScheduled() {
  const cols = await client.fetch(SCHEDULED)
  if (cols.length === 0) {
    console.log('Nothing scheduled to cancel.')
    return
  }
  console.log(`Scheduled and not yet released (${cols.length}):`)
  for (const c of cols) console.log(`  · ${brisbaneDate(Date.parse(c.publishAt))}  ${c.name}`)
  if (!YES) {
    console.log('\nWould cancel these notifications and mark the collections unannounced. Add --yes to do it.')
    return
  }
  requireKey()
  for (const id of [...new Set(cols.map((c) => c.announceId))]) {
    try {
      await onesignal('DELETE', `https://api.onesignal.com/notifications/${id}?app_id=${APP_ID}`)
    } catch (err) {
      // Already sent or already cancelled — either way nothing is left to stop.
      console.warn(`  ⚠ ${id}: ${err?.message ?? err}`)
    }
  }
  const tx = cols.reduce(
    (t, c) => t.patch(c._id, (p) => p.unset(['announcedAt', 'announceId'])),
    client.transaction(),
  )
  await tx.commit()
  console.log(`\n✓ Cancelled. Change the dates, re-ingest, then run \`npm run notify\` again.`)
}

async function main() {
  if (CANCEL) return cancelScheduled()

  let cols
  try {
    cols = await client.fetch(UNANNOUNCED)
  } catch (err) {
    explainSanityError(err, projectId)
  }

  if (cols.length === 0) {
    console.log('Nothing new to announce — every collection has been announced or scheduled.')
    return
  }

  if (MARK_ALL) {
    console.log(`Not yet announced (${cols.length}):`)
    for (const c of cols) console.log(`  · ${c.name}${c.free ? '  (free)' : ''}`)
    if (!YES) {
      console.log(`\nWould mark these ${cols.length} as announced WITHOUT sending anything. Add --yes to do it.`)
      return
    }
    await mark(cols.map((c) => c._id), { announcedAt: new Date().toISOString() })
    console.log(`\n✓ Marked ${cols.length} as announced. Nothing was sent.`)
    return
  }

  // One notification per release day; everything already live shares "today".
  const groups = new Map()
  for (const c of cols) {
    const key = isFuture(c.publishAt) ? brisbaneDate(Date.parse(c.publishAt)) : 'live'
    if (!groups.has(key)) groups.set(key, { sendAfter: isFuture(c.publishAt) ? c.publishAt : null, cols: [] })
    groups.get(key).cols.push(c)
  }
  const plan = [...groups.entries()].map(([key, g]) => {
    const wording = defaultWording(g.cols)
    const custom = groups.size === 1
    return {
      key,
      ...g,
      title: (custom && opt('--title')) || wording.title,
      message: (custom && opt('--message')) || wording.message,
    }
  })
  if (groups.size > 1 && (opt('--title') || opt('--message'))) {
    console.log('(--title/--message only apply when there is one release day — using the default wording.)\n')
  }

  console.log(`To: everyone with "${AUDIENCE}" switched on (tag ${tag} = 1). Tapping opens the Shop.\n`)
  for (const p of plan) {
    console.log(`${p.key === 'live' ? 'Live now' : `Releases ${p.key}`}  ·  ${timing(p.sendAfter).label}`)
    for (const c of p.cols) console.log(`    · ${c.name}${c.free ? '  (free)' : ''}`)
    console.log(`  ${p.title}\n  ${p.message}\n`)
  }

  const live = groups.get('live')?.cols.length ?? 0
  if (live > FIRST_RUN_GUARD && !has('--force')) {
    console.log(
      `⚠ ${live} live collections at once looks like the existing catalogue, not a new drop.\n` +
        '  If this is your first run, use --mark-all --yes instead. (Add --force to send anyway.)',
    )
    return
  }

  if (!YES) {
    console.log(`Nothing sent. Add --yes to send/schedule these ${plan.length} notification(s).`)
    return
  }

  requireKey()
  for (const p of plan) {
    const id = await send(p)
    try {
      await mark(p.cols.map((c) => c._id), { announcedAt: new Date().toISOString(), announceId: id })
    } catch (err) {
      // The notification has gone (or is queued); don't let a re-run send it twice.
      console.error(`\n✓ ${p.key}: sent (${id}), but marking it announced failed: ${err?.message ?? err}`)
      console.error('  Run `npm run notify -- --mark-all --yes` now, or the next run will announce it again.')
      process.exit(1)
    }
    console.log(`✓ ${p.key === 'live' ? 'Sent' : `Scheduled for ${p.key}`} (OneSignal id ${id})`)
  }
}

main().catch((err) => {
  console.error(`\n${err?.message ?? err}`)
  process.exit(1)
})
