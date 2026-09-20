# asc-iap-sync

Create/complete an App Store **Non-Consumable** in-app purchase for every paid
Paper & Petals collection in Sanity — idempotently. Run it whenever you add
collections; it skips anything already done and only fills what's missing.

It uses the **same** product ids the app uses, so they always match what the app
asks StoreKit for. Ingest pins a `productId` onto every collection in Sanity and
this script prefers that value; the derived form is only a fallback for a
collection that somehow has none:

```
pinned:   collection.productId in Sanity   e.g. com.paperandpetals.collection.r2.victorian_rose
fallback: com.paperandpetals.collection.<sanity _id, minus "collection-", hyphens → underscores>
```

The `r2` in a pinned id is the product **series** (see the pipeline README) —
App Store ids can never be reused, so a wiped-and-rebuilt catalogue needs a new
series. Never hand-edit these to match an older series.

For each paid collection it ensures: the IAP exists → en-US localization →
availability (all territories) → price (from the collection's Sanity `price`) →
review screenshot. When all are present, the product is **Ready to Submit**.

No dependencies. Requires **Node 18+** (works on 22).

---

## One-time setup

### 1. Create an App Store Connect API key
App Store Connect → **Users and Access → Integrations → App Store Connect API**
→ **Team Keys** → **＋** (Generate API Key).

- Give it access level **App Manager** or **Admin** (needed to manage in-app purchases).
- Note the **Issuer ID** (top of the page) and the new key's **Key ID**.
- **Download the `.p8`** private key (you can only download it once). Keep it safe — it's a credential.

### 2. Have a review screenshot ready
One image (PNG/JPG, ≥ 640×920) — the same one you used for Victorian Rose is
fine. Apple only needs *a* screenshot in the review field; it doesn't have to be
per-product. Save its path.

### 3. Set the environment variables
```bash
export ASC_KEY_ID=XXXXXXXXXX
export ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export ASC_PRIVATE_KEY_PATH=/absolute/path/to/AuthKey_XXXXXXXXXX.p8
export REVIEW_SCREENSHOT_PATH=/absolute/path/to/review.png
# optional (these have sensible defaults):
# export APP_BUNDLE_ID=com.paperandpetals.app
# export SANITY_PROJECT_ID=cv53e819
# export SANITY_DATASET=production
# export IAP_LOCALE=en-AU        # localization language (default en-AU)
# export BASE_TERRITORY=AUS      # currency the `price` is matched in (default AUS = AUD)
```

> **Localization is `en-AU` and prices are matched in `AUD` (base territory AUS)**
> by default, for the Australian store. A Sanity `price` of `5.99` therefore maps
> to the **AUD $5.99** tier, and Apple equalizes all other territories from there.
> If your Sanity prices are actually meant as USD, set `BASE_TERRITORY=USA`.
> Make sure this matches how you priced **Victorian Rose** manually.

> Don't commit the `.p8` (the repo already gitignores `*.p8`). Keep it out of the repo.

---

## Run it

Preview first — lists what it would create, makes **no** changes. It reads only
public Sanity data, so it needs no Apple credentials and is the cheapest way to
confirm the ids and prices are what you expect:
```bash
node sync.mjs --dry-run
```

Then for real:
```bash
node sync.mjs
```

It prints a per-collection log and a summary. It's safe to re-run any time: it
only creates what's missing, so a failed run can be re-run to resume.

**Weekly flow:** add collections in Sanity → `node sync.mjs` → new App Store
products appear as **Ready to Submit**. Then in RevenueCat, **Products → Import**
to pull the new ones in (needed only for clean Restore/reporting — collections
don't need entitlements or offerings).

---

## Optional: curate specific products (`overrides.json`)

Display names are auto-truncated to App Store's 30-char limit and descriptions
come from each collection's `whatYouGet`. To hand-write any of them (or set a
specific price), drop an `overrides.json` next to the script, keyed by product id:

```json
{
  "com.paperandpetals.collection.junk_journal_victorian_rose_tags_and_labels_shab": {
    "displayName": "Victorian Rose Tags (Pink)",
    "description": "Victorian rose tags & labels, pink.",
    "price": 5.99
  }
}
```

Anything you omit falls back to the Sanity data. (Set `OVERRIDES_PATH` to use a
different location.)

---

## Notes & troubleshooting

- **Prices** are matched to an App Store price point in AUD (base territory
  `AUS`, override with `BASE_TERRITORY`), then Apple auto-equalizes the other
  territories. Apple's tiers are a fixed ladder per currency, **not** a
  continuous range — the Australian store has no A$4.99, for example — so a
  Sanity price can legitimately have no exact match. When that happens the
  script stops for that product and prints the nearest tier plus the ones
  around it, rather than quietly charging a different amount than the app
  shows. Fix it either way:

  ```bash
  node sync.mjs --snap-prices     # take the nearest tier for everything
  ```

  …or set an exact, valid price per product in `overrides.json` (and match it
  in Sanity so the shop displays the same number).
- **App Store product IDs can never be reused** once created, so double-check a
  new collection's Sanity `_id` is what you want before the first run.
- The App Store API for in-app purchases is multi-step; if any endpoint returns
  an error, the script prints Apple's full error JSON for that product and moves
  on to the next. Paste that output back and it's usually a one-line fix.
- Products can take a little while to become fetchable in sandbox after creation.
