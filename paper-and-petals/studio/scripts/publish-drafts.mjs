// studio/scripts/publish-drafts.mjs
//
// Publish every draft item/collection in one go — Studio has no "publish all",
// and clicking through a few hundred drafts by hand is miserable.
//
// Publishing a draft means: copy `drafts.<id>` onto `<id>`, then delete the
// draft. Items are published BEFORE collections so a collection's references
// resolve to real documents the moment it goes live.
//
// Safe by default: with no flag it only COUNTS and changes nothing.
//
// Usage (from studio/):
//   SANITY_WRITE_TOKEN=...  npm run publish-drafts            # show counts, change nothing
//   SANITY_WRITE_TOKEN=...  npm run publish-drafts -- --yes   # actually publish
//   ... -- --yes --type collection                            # only one type
//
// On Windows PowerShell:  $env:SANITY_WRITE_TOKEN="sk..."

import { createClient } from '@sanity/client'
import { assertSanityToken, explainSanityError, preflightSanity } from '../pipeline/lib/auth.mjs'

const projectId = process.env.SANITY_PROJECT_ID || 'cv53e819'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
assertSanityToken(token, 'publish drafts')

const argv = process.argv.slice(2)
const YES = argv.includes('--yes')
const typeArg = (() => {
  const i = argv.indexOf('--type')
  return i >= 0 && argv[i + 1] ? argv[i + 1] : null
})()

// Items first: a collection references its members, so publishing members first
// means the live collection never points at documents that don't exist yet.
const TYPE_ORDER = ['item', 'collection', 'pack']
const TYPES = typeArg ? [typeArg] : TYPE_ORDER
const CHUNK = 50 // documents per transaction

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false })
await preflightSanity(client, projectId)

/** Draft ids for a type, oldest first. */
const draftIds = (type) =>
  client.fetch('*[_id in path("drafts.**") && _type == $type]._id | order(@ asc)', { type })

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

console.log(`Dataset ${projectId}/${dataset}\n`)

const byType = {}
let total = 0
for (const type of TYPES) {
  try {
    byType[type] = await draftIds(type)
  } catch (err) {
    explainSanityError(err, projectId)
  }
  total += byType[type].length
  console.log(`  ${type.padEnd(11)} ${byType[type].length} draft(s)`)
}

if (total === 0) {
  console.log('\nNo drafts to publish.')
  process.exit(0)
}

if (!YES) {
  console.log(`\n${total} draft(s) would be published. Re-run with --yes to publish them.`)
  process.exit(0)
}

console.log('\nPublishing…')
let done = 0
let published = 0
for (const type of TYPES) {
  const ids = byType[type]
  if (ids.length === 0) continue
  for (const group of chunk(ids, CHUNK)) {
    let docs
    try {
      docs = await client.fetch('*[_id in $ids]', { ids: group })
    } catch (err) {
      explainSanityError(err, projectId, { didWork: published > 0 })
    }
    const tx = client.transaction()
    for (const draft of docs) {
      // Strip system fields — _rev would clash with createOrReplace, and
      // _createdAt/_updatedAt are managed by Sanity.
      const { _rev, _createdAt, _updatedAt, ...rest } = draft
      tx.createOrReplace({ ...rest, _id: draft._id.replace(/^drafts\./, '') })
      tx.delete(draft._id)
    }
    try {
      await tx.commit()
    } catch (err) {
      explainSanityError(err, projectId, { didWork: published > 0 })
    }
    published += docs.length
    done += group.length
    console.log(`  ${type}: ${Math.min(done, ids.length)}/${ids.length}`)
  }
  done = 0
}

console.log(`\n✓ Published ${published} document(s). They're live in the app now.`)
