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
const SNAP_PRICES = process.argv.includes('--snap-prices');
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

async function ensurePrice(iapId, price) {
  if (!price) return false;
  if (await one(`/v2/inAppPurchases/${iapId}/iapPriceSchedule`)) return false;
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
        manualPrices: { data: [{ type: 'inAppPurchasePrices', id: 'p1' }] },
      },
    },
    included: [
      {
        type: 'inAppPurchasePrices',
        id: 'p1',
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
  if (await one(`/v2/inAppPurchases/${iapId}/appStoreReviewScreenshot`)) return false;
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
  if (DRY_RUN) return;
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
