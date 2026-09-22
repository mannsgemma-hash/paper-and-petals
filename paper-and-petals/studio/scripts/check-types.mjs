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
 * Read-only: it reports, it never writes. Needs no token (published docs are
 * public); set SANITY_WRITE_TOKEN to include drafts.
 *
 *   node scripts/check-types.mjs
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'cv53e819'
const DATASET = process.env.SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN

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

async function query(groq) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=${encodeURIComponent(groq)}`
  const res = await fetch(url, TOKEN ? { headers: { Authorization: `Bearer ${TOKEN}` } } : undefined)
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
  console.log(`Checking ${PROJECT_ID}/${DATASET}${TOKEN ? ' (including drafts)' : ' (published only)'}`)
  const collections = await query(
    `*[_type == "collection"]{_id, name, price, free, palette, whatYouGet, productId}`,
  )
  const items = await query(
    `*[_type == "item"]{_id, name, category, free, tone, glyphFallback, description}`,
  )
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
