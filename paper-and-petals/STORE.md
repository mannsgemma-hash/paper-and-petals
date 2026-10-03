# Store setup — App Store Connect + RevenueCat

What has to exist outside the codebase for a purchase to succeed, and how to
check each link. Two independent chains: **collections** (one-time) and
**Studio** (subscription). One can work while the other doesn't.

---

## Chain 1 — Collections (one-time purchases)

```
Sanity collection.productId
  → app calls Purchases.getProducts([productId])     src/lib/revenuecat.ts
  → product must exist in App Store Connect          ← created by scripts/asc-iap-sync
  → purchase recorded in nonSubscriptionTransactions ← needs the product known to RevenueCat
```

**Entitlements are deliberately not used here.** Ownership is read straight from
`nonSubscriptionTransactions` in `entitlementsFromInfo`, so RevenueCat's "Attach"
prompt next to a collection product can be ignored. Attaching one does no harm
but nothing reads it.

### Product ids are permanent and versioned

```
com.paperandpetals.collection.<series>.<collection-slug-with-underscores>
e.g.  com.paperandpetals.collection.r2.victorian_rose
```

App Store ids can **never** be reused or renamed, so a wiped-and-rebuilt
catalogue needs fresh ones — that is what the `<series>` token is for
(`PP_PRODUCT_SERIES`, kept in step with `COLLECTION_SERIES` in
`src/lib/revenuecat.ts`).

The trap: products created before a series bump, or before collections were
renamed, keep working in App Store Connect but **nothing asks for them any
more**. That looks identical to never having created anything. `--list` tells
the two apart:

```bash
cd scripts/asc-iap-sync
node sync.mjs --list     # read-only: what exists vs what the app asks for
node sync.mjs            # create whatever is missing
```

On a read, `collectionIdFromProduct` accepts ids from any series (and pre-series
ids), so anything genuinely bought under an old id still restores.

---

## Chain 2 — Studio (subscription)

```
app calls Purchases.getOfferings()
  → offerings.current must exist
  → with packages .monthly and .annual                ← RevenueCat Offering
  → each attached to the "studio" entitlement         ← STUDIO_ENTITLEMENT
```

`purchaseStudio` reads `offerings.current` and picks `.monthly` or `.annual`
off it. **Products alone are not enough** — without a current Offering holding
those two packages, subscribing fails even though the subscriptions exist in
App Store Connect and in RevenueCat.

Success is judged by `entitlements.active['studio']`, so the entitlement
identifier must be exactly `studio`.

---

## Checklist

| # | Where | What |
|---|---|---|
| 1 | App Store Connect | Paid Applications Agreement active |
| 2 | App Store Connect | A product per paid collection — `node sync.mjs` |
| 3 | RevenueCat | App Store Connect API key set, so products and their status sync |
| 4 | RevenueCat | Collection products imported (Products → Import) |
| 5 | RevenueCat | Entitlement `studio` attached to both Studio subscriptions |
| 6 | RevenueCat | An Offering, set as **current**, with Monthly + Annual packages |
| 7 | — | Wait: new products take a while to become fetchable in sandbox |

---

## Reading the states

**App Store Connect**

- *Missing Metadata* — a required field is blank (localization, price, review
  screenshot). Not purchasable, not even in sandbox.
- *Ready to Submit* / *Ready for Review* — complete. **Purchasable in sandbox,
  which is what TestFlight uses**, so the whole flow can be tested before the
  product is ever reviewed.
- *"Your first subscription group must be submitted with a new app version"* —
  about going **live**, not about testing. Sandbox works meanwhile.

**RevenueCat**

The Status column mirrors what RevenueCat last read from App Store Connect, so
it goes stale. A product showing *Missing Metadata* in RevenueCat while App
Store Connect shows *Ready for Review* means the sync hasn't run — connect the
App Store Connect API key (step 3) rather than chasing the product itself. The
badge is informational; what decides a purchase is whether StoreKit returns the
product.

**Test Store** products (`cottage_monthly`, `cottage_annual`) are RevenueCat's
own sandbox, unrelated to the App Store. Nothing in the app references them.

---

## When a purchase fails

`purchaseCollection` names the id it asked for:

```
No store product found for:
com.paperandpetals.collection.r2.victorian_rose
```

Paste that into App Store Connect's search.

- **Not there** → step 2.
- **There, but *Missing Metadata*** → finish its metadata in App Store Connect.
- **There and *Ready to Submit*** → it's RevenueCat (steps 3–4), or the product
  is simply too fresh to have propagated to sandbox (step 7).
