#!/usr/bin/env node
/**
 * check-types — find documents whose fields aren't the type the app expects.
 *
 * Sanity's content lake is schemaless: the Studio schema constrains what the
 * EDITOR writes, not what the API accepts. Anything writing another way (the
 * ingest pipeline, a script, a hand patch) can store `price` as the string
 * "5.99", and the app's `price.toFixed(2)` then throws — taking the shop down
 * with "A little snag".
 *
 * Read-only: it reports, it never writes. Needs no token — published documents
 * are public. A valid SANITY_WRITE_TOKEN additionally includes drafts; a stale
 * or placeholder one is ignored rather than allowed to block the check.
 *
 *   node scripts/check-types.mjs
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'cv53e819'
const DATASET = process.env.SANITY_DATASET || 'production'
/** The docs placeholders people paste verbatim — set, but not a real token. */
const PLACEHOLDER = /^(sk\.\.\.|sk_?x+|<.*>|your.?token|paste.*here|\.\.\.)$/i
const rawToken = (process.env.SANITY_WRITE_TOKEN || '').trim()
let TOKEN = rawToken && !PLACEHOLDER.test(rawToken) ? rawToken : null
if (rawToken && !TOKEN) {
  console.warn('SANITY_WRITE_TOKEN looks like a placeholder — ignoring it and checking published documents only.\n')
}

/** field → the typeof the app requires, and whether it must be present. */
const COLLECTION_FIELDS = {
  name: { type: 'string', required: true },
  price: { type: 'number', required: false },
  free: { type: 'boolean', required: false },
  palette: { type: 'string', required: false },
  whatYouGet: { type: 'string', required: false },
  productId: { type: 'string', required: false },
}

const ITEM_FIELDS = {
  name: { type: 'string', required: true },
  category: { type: 'string', required: true },
  free: { type: 'boolean', required: false },
  tone: { type: 'string', required: false },
  glyphFallback: { type: 'string', required: false },
  description: { type: 'string', required: false },
}

async function fetchQuery(groq, token) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=${encodeURIComponent(groq)}`
  return fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
}

async function query(groq) {
  let res = await fetchQuery(groq, TOKEN)
  // An expired or wrong token makes even a PUBLIC read 401. This check only
  // needs public data, so drop the token and carry on rather than stopping on
  // a credential the job never required.
  if (!res.ok && TOKEN && (res.status === 401 || res.status === 403)) {
    console.warn(`SANITY_WRITE_TOKEN was rejected (${res.status}) — ignoring it and checking published documents only.`)
    console.warn('(That token is stale. It only affects drafts here, but ingest and clear will fail until you replace it.)\n')
    TOKEN = null
    res = await fetchQuery(groq, null)
  }
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`)
  return (await res.json()).result || []
}

function check(docs, fields, label) {
  const problems = []
  for (const doc of docs) {
    for (const [field, rule] of Object.entries(fields)) {
      const v = doc[field]
      if (v === undefined || v === null) {
        if (rule.required) problems.push({ id: doc._id, field, found: 'missing', value: '' })
        continue
      }
      if (typeof v !== rule.type) {
        problems.push({ id: doc._id, field, found: typeof v, value: JSON.stringify(v) })
      }
    }
  }
  console.log(`\n${label}: ${docs.length} document(s) checked`)
  if (problems.length === 0) {
    console.log('  ✓ every field is the type the app expects')
    return 0
  }
  for (const p of problems) {
    const want = fields[p.field].type
    console.log(`  ✗ ${p.id}`)
    console.log(`      ${p.field}: expected ${want}, found ${p.found} ${p.value}`)
  }
  return problems.length
}

async function main() {
  console.log(`Checking ${PROJECT_ID}/${DATASET}…`)
  const collections = await query(
    `*[_type == "collection"]{_id, name, price, free, palette, whatYouGet, productId}`,
  )
  const items = await query(
    `*[_type == "item"]{_id, name, category, free, tone, glyphFallback, description}`,
  )
  console.log(TOKEN ? '(published documents and drafts)' : '(published documents only)')
  const bad = check(collections, COLLECTION_FIELDS, 'Collections') + check(items, ITEM_FIELDS, 'Items')

  if (bad) {
    console.log(`\n${bad} problem(s). The app coerces these at read time, so it `)
    console.log('no longer crashes on them — but fix the data so the shop shows')
    console.log('the right values: correct it in Studio, or set the right type in')
    console.log("the collection's collection.json and re-run ingest for it:")
    console.log('\n  npm run ingest -- --only "<Collection>" --publish\n')
    process.exit(1)
  }
  console.log('\n✓ Nothing to fix.\n')
}

main().catch((e) => {
  console.error('\ncheck-types failed:', e?.message ?? e)
  process.exit(1)
})
