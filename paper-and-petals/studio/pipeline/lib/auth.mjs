// studio/pipeline/lib/auth.mjs
//
// Shared Sanity credential checks for the local content tools (ingest, clear).
// A bad token otherwise surfaces as a 40-line ClientError stack trace that reads
// like the script is broken, when the real message is "your token is wrong".

/** The docs placeholders people paste verbatim — set, but not a real token. */
const PLACEHOLDER = /^(sk\.\.\.|sk_?x+|<.*>|your.?token|paste.*here|\.\.\.)$/i

/**
 * Exit early unless the token is present and at least plausibly real.
 * @param {string|undefined} token
 * @param {string} need  what the token is needed for, e.g. 'upload'
 */
export function assertSanityToken(token, need = 'write to Sanity') {
  if (!token) {
    console.error(`Missing SANITY_WRITE_TOKEN — needed to ${need}.`)
    console.error('Create one at https://sanity.io/manage → your project → API → Tokens (Editor),')
    console.error('then, in this same terminal:  $env:SANITY_WRITE_TOKEN="<paste the token>"')
    process.exit(1)
  }
  if (PLACEHOLDER.test(token.trim())) {
    console.error(`SANITY_WRITE_TOKEN is still the placeholder ("${token.trim()}") — not a real token.`)
    console.error('Create one at https://sanity.io/manage → your project → API → Tokens (Editor),')
    console.error('then, in this same terminal:  $env:SANITY_WRITE_TOKEN="<paste the token>"')
    process.exit(1)
  }
}

/** Print one actionable line for a Sanity auth/permission failure, then exit. */
export function explainSanityError(err, projectId, { didWork = false } = {}) {
  const status = err?.statusCode ?? err?.response?.statusCode
  if (status === 401) {
    console.error('\nSanity rejected the token (401 Unauthorized — "Session not found").')
    console.error('SANITY_WRITE_TOKEN is wrong, expired, revoked, or from another project.')
    console.error(`\nFix: https://sanity.io/manage → project ${projectId} → API → Tokens → Add API token`)
    console.error('     Give it Editor permissions, copy the value, then in this same terminal:')
    console.error('       $env:SANITY_WRITE_TOKEN="<paste the token>"')
    console.error('     (A token only lasts for the terminal session you set it in.)')
  } else if (status === 403) {
    console.error('\nSanity refused the request (403 Forbidden).')
    console.error('The token is valid but lacks write access — create one with Editor permissions.')
  } else {
    console.error('\nSanity request failed:', err?.message ?? err)
  }
  if (!didWork) console.error('\nNothing was uploaded or changed.')
  process.exit(1)
}

/**
 * Verify the token before doing any expensive work. An invalid token makes even
 * a public read return 401, so one cheap query is enough to catch the common
 * wrong/expired/placeholder cases up front — instead of failing once per item
 * after paying for all the metadata.
 */
export async function preflightSanity(client, projectId) {
  try {
    await client.fetch('count(*[_type == "item"])')
  } catch (err) {
    explainSanityError(err, projectId)
  }
}
