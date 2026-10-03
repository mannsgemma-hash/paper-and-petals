#!/usr/bin/env node
/**
 * asc-iap-sync — create/complete an App Store non-consumable for every paid
 * Paper & Petals collection in Sanity, idempotently. Run it weekly after adding
 * new collections; it skips anything already set up and only fills what's missing.
 *
 * Zero dependencies — Node 18+ (uses global fetch + node:crypto).
 *
 * It drives off the SAME data and the SAME product-id rule the app uses, so the
 * IDs always match what the app asks StoreKit for: an explicit `productId` field
 * on the Sanity collection wins; otherwise it's derived from the document id:
 *   "com.paperandpetals.collection." + <sanity _id minus "collection-", hyphens→underscores>
 *
 * For each paid collection it ensures, in order:
 *   1. the in-app purchase exists (Non-Consumable)
 *   2. an en-US localization (display name ≤30 chars + description)
 *   3. availability in all territories
 *   4. a price (matched from the collection's Sanity price)
 *   5. the App Store review screenshot (one image, reused for all)
 * When all are present the product reaches "Ready to Submit".
 *
 * Usage:
 *   node sync.mjs --list          # what's ALREADY in App Store Connect vs Sanity
 *   node sync.mjs --dry-run       # preview: list what it would create, no writes
 *   node sync.mjs                 # do it
 *   node sync.mjs --snap-prices   # accept the nearest tier when a price has no exact one
 *
 * Required env (see README.md):
 *   ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY_PATH  (App Store Connect API key)
 *   REVIEW_SCREENSHOT_PATH                            (a PNG/JPG, reused for all)
 * Optional env:
 *   APP_BUNDLE_ID       (default com.paperandpetals.app)
 *   SANITY_PROJECT_ID   (default cv53e819)
 *   SANITY_DATASET      (default production)
 *   OVERRIDES_PATH      (default ./overrides.json — per-product curation)
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// ── config ──────────────────────────────────────────────────────────────────
const {
  ASC_KEY_ID,
  ASC_ISSUER_ID,
  ASC_PRIVATE_KEY_PATH,
  APP_BUNDLE_ID = 'com.paperandpetals.app',
  SANITY_PROJECT_ID = 'cv53e819',
  SANITY_DATASET = 'production',
  OVERRIDES_PATH = 'overrides.json',
  REVIEW_SCREENSHOT_PATH,
} = process.env;

const DRY_RUN = process.argv.includes('--dry-run');
// App Store price tiers are a fixed per-currency ladder, so a Sanity price can
// legitimately have no exact match. Default is to stop and say so rather than
// quietly charge a different amount than the app displays.
const SNAP_PRICES = process.argv.includes('--snap-prices')
// Read-only audit: what products exist on Apple's side, and how they line up
// with what the app will actually ask StoreKit for.
const LIST = process.argv.includes('--list');
const API = 'https://api.appstoreconnect.apple.com';
// Australian store defaults. IAP_LOCALE = the localization language; BASE_TERRITORY
// = the territory whose price tier the Sanity `price` is matched against (i.e. the
// currency of that number), from which Apple equalizes every other territory.
const IAP_LOCALE = process.env.IAP_LOCALE || 'en-AU';
const BASE_TERRITORY = process.env.BASE_TERRITORY || 'AUS';
const PRODUCT_PREFIX = 'com.paperandpetals.collection.';
const MAX_DISPLAY_NAME = 30; // App Store hard limit for the IAP display name
const MAX_DESCRIPTION = 45; // conservative; bump if your account allows longer

// ── auth (ES256 JWT, no deps) ─────────────────────────────────────────────────
const b64url = (input) =>
  Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

let _tok = null;
let _tokAt = 0;
function token() {
  const now = Date.now();
  if (_tok && now - _tokAt < 12 * 60 * 1000) return _tok;
  const key = fs.readFileSync(ASC_PRIVATE_KEY_PATH, 'utf8');
  const header = { alg: 'ES256', kid: ASC_KEY_ID, typ: 'JWT' };
  const iat = Math.floor(now / 1000);
  const payload = { iss: ASC_ISSUER_ID, iat, exp: iat + 15 * 60, aud: 'appstoreconnect-v1' };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.sign('sha256', Buffer.from(signingInput), { key, dsaEncoding: 'ieee-p1363' });
  _tok = `${signingInput}.${b64url(sig)}`;
  _tokAt = now;
  return _tok;
}

async function api(method, url, body) {
  const full = url.startsWith('http') ? url : API + url;
  const res = await fetch(full, {
    method,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    const detail = json?.errors ? JSON.stringify(json.errors, null, 2) : text;
    throw new Error(`${method} ${url} → ${res.status}\n${detail}`);
  }
  return json;
}
// to-one relationship existence check that tolerates an empty/404 relationship
const one = (p) => api('GET', p).then((r) => r?.data ?? null).catch(() => null);

// ── helpers ───────────────────────────────────────────────────────────────────
// The product id the app will ask StoreKit for: an explicit Sanity `productId`
// wins, otherwise it's derived from the document id (matches the app's rule).
function productIdFor(c) {
  const explicit = typeof c.productId === 'string' ? c.productId.trim() : '';
  if (explicit) return explicit;
  return PRODUCT_PREFIX + c._id.replace(/^collection-/, '').replace(/-/g, '_');
}

function smartTruncate(s, max) {
  s = String(s || '').trim().replace(/\s+/g, ' ');
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).trim();
}

function loadOverrides() {
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
  } catch {
    return {};
  }
}

// ── App Store Connect operations ──────────────────────────────────────────────
async function getAppId() {
  const r = await api('GET', `/v1/apps?filter[bundleId]=${encodeURIComponent(APP_BUNDLE_ID)}&limit=1`);
  const app = r.data?.[0];
  if (!app) throw new Error(`No app found for bundleId ${APP_BUNDLE_ID}`);
  return app.id;
}

async function allTerritoryIds() {
  const ids = [];
  let url = '/v1/territories?limit=200';
  while (url) {
    const r = await api('GET', url);
    for (const t of r.data || []) ids.push(t.id);
    url = r.links?.next || null;
  }
  return ids;
}

/** Every in-app purchase already on the app, with its id, name and state. */
async function listIaps(appId) {
  const out = []
  let url = `/v1/apps/${appId}/inAppPurchasesV2?limit=200`
  while (url) {
    const r = await api('GET', url)
    for (const d of r.data || []) {
      out.push({
        id: d.id,
        productId: d.attributes?.productId,
        name: d.attributes?.name,
        state: d.attributes?.state,
      })
    }
    url = r.links?.next || null
  }
  return out
}

// States in which App Store Connect will actually serve the product to
// StoreKit. Anything else — MISSING_METADATA above all — exists but cannot be
// bought, not even in sandbox.
const PURCHASABLE_STATES = new Set([
  'READY_TO_SUBMIT',
  'WAITING_FOR_REVIEW',
  'IN_REVIEW',
  'APPROVED',
  'DEVELOPER_ACTION_NEEDED',
  'PENDING_BINARY_APPROVAL',
])

/** Which of the four required pieces an incomplete product is still missing. */
async function whatsMissing(iapId) {
  const gaps = []
  try {
    const loc = await api('GET', `/v2/inAppPurchases/${iapId}/inAppPurchaseLocalizations?limit=1`)
    if (!loc.data?.length) gaps.push('localization (display name + description)')
  } catch {
    gaps.push('localization (could not read)')
  }
  if (!(await one(`/v2/inAppPurchases/${iapId}/inAppPurchaseAvailability`))) gaps.push('availability')
  if (!(await hasPrice(iapId))) gaps.push(`price (in ${BASE_TERRITORY})`)
  if (!(await hasScreenshot(iapId))) gaps.push('review screenshot')
  return gaps
}

/**
 * Compare what App Store Connect holds against what the app will ask for.
 *
 * Existence is not enough: a product sits in MISSING_METADATA until its
 * localization, availability, price and review screenshot are all present, and
 * StoreKit won't serve it until then — so an interrupted sync leaves a full set
 * of products that cannot be bought. Classify by state, and for anything
 * incomplete say which pieces are absent.
 *
 * Product ids can never be reused either, so a rebuild of the catalogue (new
 * names, or a new PP_PRODUCT_SERIES) strands the previous run's products under
 * ids nothing asks for any more.
 */
async function runList(collections) {
  const appId = await getAppId()
  const existing = await listIaps(appId)
  const wanted = new Map(collections.map((c) => [productIdFor(c), c]))
  const have = new Map(existing.map((p) => [p.productId, p]))

  console.log(`App Store Connect holds ${existing.length} in-app purchase(s).`)
  console.log(`Sanity expects ${wanted.size} paid collection(s).\n`)

  const ids = [...wanted.keys()]
  const ready = ids.filter((id) => have.has(id) && PURCHASABLE_STATES.has(have.get(id).state))
  const incomplete = ids.filter((id) => have.has(id) && !PURCHASABLE_STATES.has(have.get(id).state))
  const missing = ids.filter((id) => !have.has(id))
  const orphans = existing.filter((p) => !wanted.has(p.productId))

  console.log(`── Purchasable (${ready.length}) ──`)
  for (const id of ready) console.log(`  ✓ ${id}   [${have.get(id).state}]`)
  if (!ready.length) console.log('  (none)')

  console.log(`\n── Exists but NOT purchasable (${incomplete.length}) ──`)
  for (const id of incomplete) {
    const p = have.get(id)
    console.log(`  ! ${id}   [${p.state}]`)
    const gaps = await whatsMissing(p.id)
    console.log(`      still needs: ${gaps.length ? gaps.join(', ') : '(nothing — may just need a moment to settle)'}`)
  }
  if (!incomplete.length) console.log('  (none)')

  console.log(`\n── Missing — the app asks for these and they don't exist (${missing.length}) ──`)
  for (const id of missing) console.log(`  ✗ ${id}   (${wanted.get(id).name})`)
  if (!missing.length) console.log('  (none)')

  console.log(`\n── In App Store Connect but no longer asked for (${orphans.length}) ──`)
  for (const p of orphans) console.log(`  · ${p.productId}   [${p.state}]`)
  if (!orphans.length) console.log('  (none)')

  console.log('')
  if (incomplete.length) {
    console.log(
      `${incomplete.length} product(s) exist but CANNOT be bought — a product stays in\n` +
        `MISSING_METADATA until every piece above is filled in, and StoreKit won't\n` +
        `serve it meanwhile. An earlier run created them and then failed partway.\n\n` +
        `Re-run \`node sync.mjs\` — it only fills what's absent, and prints Apple's\n` +
        `error for anything it still can't complete.`,
    )
  } else if (missing.length) {
    console.log(`Run \`node sync.mjs\` to create the ${missing.length} missing product(s).`)
  } else {
    console.log(
      `✓ Every collection the app asks for exists and is purchasable. If a purchase\n` +
        `  still fails, the next link is RevenueCat (Products → Import), or the\n` +
        `  product is too freshly created to have reached sandbox yet.`,
    )
  }
  if (orphans.length) {
    console.log(`\n(The ${orphans.length} orphan(s) are from an earlier catalogue. Ids can never be`)
    console.log(`  reused or renamed, so leave them — or remove them from sale.)`)
  }
}

async function findIap(appId, productId) {
  const r = await api(
    'GET',
    `/v1/apps/${appId}/inAppPurchasesV2?filter[productId]=${encodeURIComponent(productId)}&limit=1`,
  );
  return r.data?.[0] || null;
}

async function createIap(appId, productId, name) {
  const r = await api('POST', '/v2/inAppPurchases', {
    data: {
      type: 'inAppPurchases',
      attributes: { name: name.slice(0, 64), productId, inAppPurchaseType: 'NON_CONSUMABLE' },
      relationships: { app: { data: { type: 'apps', id: appId } } },
    },
  });
  return r.data;
}

async function ensureLocalization(iapId, displayName, description) {
  const cur = await api('GET', `/v2/inAppPurchases/${iapId}/inAppPurchaseLocalizations?limit=1`);
  if (cur.data?.length) return false;
  await api('POST', '/v1/inAppPurchaseLocalizations', {
    data: {
      type: 'inAppPurchaseLocalizations',
      attributes: {
        locale: IAP_LOCALE,
        name: smartTruncate(displayName, MAX_DISPLAY_NAME),
        description: smartTruncate(description, MAX_DESCRIPTION),
      },
      relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iapId } } },
    },
  });
  return true;
}

async function ensureAvailability(iapId, territoryIds) {
  if (await one(`/v2/inAppPurchases/${iapId}/inAppPurchaseAvailability`)) return false;
  await api('POST', '/v1/inAppPurchaseAvailabilities', {
    data: {
      type: 'inAppPurchaseAvailabilities',
      attributes: { availableInNewTerritories: true },
      relationships: {
        inAppPurchase: { data: { type: 'inAppPurchases', id: iapId } },
        availableTerritories: { data: territoryIds.map((id) => ({ type: 'territories', id })) },
      },
    },
  });
  return true;
}

/**
 * Every price point Apple offers for this product in the base territory.
 * Tiers are per-currency and are NOT a continuous range — the Australian store
 * has no A$4.99, for instance — so an exact match can legitimately not exist.
 */
async function listPricePoints(iapId) {
  const out = [];
  let url = `/v2/inAppPurchases/${iapId}/pricePoints?filter[territory]=${BASE_TERRITORY}&limit=200`;
  while (url) {
    const r = await api('GET', url);
    for (const p of r.data || []) out.push({ id: p.id, price: Number(p.attributes.customerPrice) });
    url = r.links?.next || null;
  }
  return out.sort((a, b) => a.price - b.price);
}

async function findPricePointId(iapId, price, { snap = false } = {}) {
  const points = await listPricePoints(iapId);
  const target = Number(price).toFixed(2);
  const exact = points.find((p) => p.price.toFixed(2) === target);
  if (exact) return { id: exact.id, price: exact.price, exact: true };
  if (!points.length) return null;
  const near = points.reduce((a, b) =>
    Math.abs(b.price - price) < Math.abs(a.price - price) ? b : a,
  );
  if (snap) return { id: near.id, price: near.price, exact: false };
  // Not snapping: fail, but say what IS available so the fix is one line.
  const around = points
    .filter((p) => Math.abs(p.price - price) <= Math.max(2, price * 0.4))
    .slice(0, 6)
    .map((p) => p.price.toFixed(2))
    .join(', ');
  throw new Error(
    `No ${BASE_TERRITORY} price point at ${target}. Nearest is ${near.price.toFixed(2)}` +
      (around ? ` (available near it: ${around})` : '') +
      `. Re-run with --snap-prices to take the nearest, or set an exact price in overrides.json.`,
  );
}

/**
 * Whether the product actually has a price.
 *
 * NOT the same as "a price schedule exists": App Store Connect auto-creates an
 * empty schedule for every in-app purchase, so testing for the schedule is
 * always true and skips the work forever, leaving the product stuck in
 * MISSING_METADATA. The prices hang off the schedule, so count those.
 */
async function hasPrice(iapId) {
  const schedule = await one(`/v2/inAppPurchases/${iapId}/iapPriceSchedule`);
  const scheduleId = schedule?.id;
  if (!scheduleId) return false;
  for (const rel of ['manualPrices', 'automaticPrices']) {
    try {
      const r = await api('GET', `/v1/inAppPurchasePriceSchedules/${scheduleId}/${rel}?limit=1`);
      if (r?.data?.length) return true;
    } catch {
      /* relationship unreadable — try the other one */
    }
  }
  return false;
}

/**
 * Whether the review screenshot is present AND finished uploading. A reserved
 * asset whose upload failed still answers the relationship, which would
 * likewise skip the retry forever.
 */
async function hasScreenshot(iapId) {
  const shot = await one(`/v2/inAppPurchases/${iapId}/appStoreReviewScreenshot`);
  if (!shot) return false;
  const state = shot.attributes?.assetDeliveryState?.state;
  // Older responses omit the state; treat a present asset as done rather than
  // re-uploading it on every run.
  return state === undefined || state === 'COMPLETE';
}

/**
 * The price is created inline with its schedule, and App Store Connect requires
 * such an entity to carry a "local id" — literally `${name}`, dollar sign and
 * braces included — which it swaps for a real id. A plain 'p1' is rejected with
 * ENTITY_ERROR.INCLUDED.INVALID_ID. Single-quoted on purpose: this is a literal
 * string, not a JS template.
 */
const LOCAL_PRICE_ID = '${price1}';

async function ensurePrice(iapId, price) {
  if (!price) return false;
  if (await hasPrice(iapId)) return false;
  const point = await findPricePointId(iapId, price, { snap: SNAP_PRICES });
  if (!point) throw new Error(`No price points available in ${BASE_TERRITORY}`);
  const pricePointId = point.id;
  if (!point.exact) {
    console.log(`  · no ${BASE_TERRITORY} tier at ${Number(price).toFixed(2)} — snapped to ${point.price.toFixed(2)}`);
  }
  await api('POST', '/v1/inAppPurchasePriceSchedules', {
    data: {
      type: 'inAppPurchasePriceSchedules',
      relationships: {
        inAppPurchase: { data: { type: 'inAppPurchases', id: iapId } },
        baseTerritory: { data: { type: 'territories', id: BASE_TERRITORY } },
        manualPrices: { data: [{ type: 'inAppPurchasePrices', id: LOCAL_PRICE_ID }] },
      },
    },
    included: [
      {
        type: 'inAppPurchasePrices',
        id: LOCAL_PRICE_ID,
        attributes: { startDate: null },
        relationships: {
          inAppPurchasePricePoint: { data: { type: 'inAppPurchasePricePoints', id: pricePointId } },
        },
      },
    ],
  });
  return true;
}

async function ensureScreenshot(iapId, filePath) {
  if (await hasScreenshot(iapId)) return false;
  const data = fs.readFileSync(filePath);
  const reserve = await api('POST', '/v1/inAppPurchaseAppStoreReviewScreenshots', {
    data: {
      type: 'inAppPurchaseAppStoreReviewScreenshots',
      attributes: { fileName: path.basename(filePath), fileSize: data.length },
      relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iapId } } },
    },
  });
  const assetId = reserve.data.id;
  for (const op of reserve.data.attributes.uploadOperations || []) {
    const headers = {};
    for (const h of op.requestHeaders || []) headers[h.name] = h.value;
    const chunk = data.subarray(op.offset, op.offset + op.length);
    const up = await fetch(op.url, { method: op.method, headers, body: chunk });
    if (!up.ok) throw new Error(`screenshot upload chunk failed: ${up.status} ${await up.text()}`);
  }
  await api('PATCH', `/v1/inAppPurchaseAppStoreReviewScreenshots/${assetId}`, {
    data: {
      type: 'inAppPurchaseAppStoreReviewScreenshots',
      id: assetId,
      attributes: { uploaded: true, sourceFileChecksum: crypto.createHash('md5').update(data).digest('hex') },
    },
  });
  return true;
}

// ── Sanity source of truth ────────────────────────────────────────────────────
async function fetchCollections() {
  // Published collections only (exclude drafts), skip free ones.
  const query = `*[_type == "collection" && !(_id in path("drafts.**"))]{_id, name, price, free, productId, whatYouGet}`;
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${await res.text()}`);
  const { result } = await res.json();
  return (result || []).filter((c) => !c.free);
}

// ── main ──────────────────────────────────────────────────────────────────────
function requireEnv() {
  // --dry-run only reads public Sanity data, so it needs no credentials.
  if (DRY_RUN) return
  // --list reads App Store Connect but writes nothing, so it needs the API key
  // but not a review screenshot.
  if (LIST) {
    const missing = ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY_PATH'].filter(
      (k) => !process.env[k],
    )
    if (missing.length) {
      console.error(`Missing required env: ${missing.join(', ')}\nSee README.md.`)
      process.exit(1)
    }
    return
  };
  const missing = ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY_PATH', 'REVIEW_SCREENSHOT_PATH']
    .filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required env: ${missing.join(', ')}\nSee README.md.`);
    process.exit(1);
  }
}

async function main() {
  requireEnv();
  const overrides = loadOverrides();
  const collections = await fetchCollections();
  console.log(`Sanity: ${collections.length} paid collection(s).${DRY_RUN ? '  [DRY RUN]' : ''}\n`);

  if (LIST) {
    await runList(collections)
    return
  }

  if (DRY_RUN) {
    for (const c of collections) {
      const o = overrides[productIdFor(c)] || {};
      console.log(`• ${c.name}  ($${o.price ?? c.price ?? '—'})`);
      console.log(`    ${productIdFor(c)}`);
      console.log(`    name: "${smartTruncate(o.displayName || c.name, MAX_DISPLAY_NAME)}"`);
      if (!(o.price ?? c.price)) console.log('    ⚠ no price — set one in Sanity or overrides.json');
    }
    console.log('\nDry run only — no changes made.');
    return;
  }

  const appId = await getAppId();
  const territoryIds = await allTerritoryIds();
  const results = { created: [], updated: [], ok: [], failed: [] };

  for (const c of collections) {
    const productId = productIdFor(c);
    const o = overrides[productId] || {};
    const displayName = o.displayName || c.name;
    const description = o.description || c.whatYouGet || `${c.name}.`;
    const price = o.price ?? c.price;
    process.stdout.write(`• ${c.name}\n  ${productId}\n`);
    if (!price) {
      console.log('  ⚠ no price in Sanity — the product will stay incomplete until one is set');
    }
    try {
      let iap = await findIap(appId, productId);
      let touched = false;
      if (!iap) {
        iap = await createIap(appId, productId, c.name);
        touched = true;
        console.log('  + created in-app purchase');
      }
      touched = (await ensureLocalization(iap.id, displayName, description)) || touched;
      touched = (await ensureAvailability(iap.id, territoryIds)) || touched;
      touched = (await ensurePrice(iap.id, price)) || touched;
      touched = (await ensureScreenshot(iap.id, REVIEW_SCREENSHOT_PATH)) || touched;
      console.log(`  ✓ ${touched ? 'ready' : 'already complete'}\n`);
      (results[touched ? 'updated' : 'ok']).push(productId);
    } catch (err) {
      console.error(`  ✗ ${err.message}\n`);
      results.failed.push({ productId, error: err.message.split('\n')[0] });
    }
  }

  console.log('── Summary ──');
  console.log(`  updated/created: ${results.updated.length}`);
  console.log(`  already complete: ${results.ok.length}`);
  console.log(`  failed: ${results.failed.length}`);
  for (const f of results.failed) console.log(`    - ${f.productId}: ${f.error}`);
  process.exit(results.failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
