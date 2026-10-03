# Runbook — new artwork to a working purchase

Everything from a folder of art to a collection a customer can buy. Run it in
order; each step is safe to repeat.

Two separate chains hang off the same Sanity data — the **content** the app
shows, and the **product** the App Store sells. A collection can be perfectly
visible in the shop and still unbuyable, so the last steps are not optional.

```
Dropbox art  →  prep  →  ingest  →  Sanity  →  App Store Connect  →  RevenueCat
                 cut      upload    content       the product         the sale
```

---

## Before you start — credentials

PowerShell, in the window you'll run everything from. These last for that
window only.

```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."     # writes the item metadata
$env:SANITY_WRITE_TOKEN="sk..."         # sanity.io/manage → API → Tokens (Editor)
$env:ASC_KEY_ID="XXXXXXXXXX"            # App Store Connect → Users and Access
$env:ASC_ISSUER_ID="xxxxxxxx-xxxx-..."  #   → Integrations → App Store Connect API
$env:ASC_PRIVATE_KEY_PATH="C:\path\to\AuthKey_XXXXXXXXXX.p8"
```

The Sanity token expires. When `ingest`, `clear` or `publish-drafts` return
`401 Session not found`, that's all it is — make a new one.

The review screenshot path is baked into `sync.mjs`, so there's nothing to set.

---

## 1. Lay the art out

```
studio\incoming\
  The Victorian Clockmaker's Workshop\     ← one folder = one collection
    collection.json                        ← optional; price must be a NUMBER
    cover.png                              ← optional; else the first piece
    Papers\                                ← category subfolders pin the category
      ledger-paper.png                     ← already cut — left alone
      teapots-split.png                    ← a sheet → split into pieces
    Paint and Artistic\
      splotches-splatter.png               ← a sheet that sheds specks → clustered
    Stickers\
      old-letter-cut.png                   ← one element → background removed
  _free\
    Spring Pastels\                        ← a whole free collection
```

Filename tags decide what happens to each file:

| Tag | What it does |
|---|---|
| `-split` | sheet of separate elements → one piece each |
| `-splatter` | sheet whose items shed specks → clustered, so specks stay with their art |
| `-cut` | a single element on a background → background removed |
| none | already ready |

Underscores work too, and case doesn't matter.

## 2. Cut the sheets

```powershell
cd C:\Users\Gemma\paper-and-petals\paper-and-petals\studio
npm run prep
```

Reads the tags and cuts in place. Originals move to `incoming\_originals\` —
kept, never deleted. Each sheet also leaves a `<base>.sheet.png`: the full
printable page, which is what buyers get when they hit Download.

**Check the piece count against the sheet.** Too many means items are breaking
up; too few means neighbours merged. Then:

```powershell
npm run prep -- --undo --yes --only "<Collection>"   # put it back
npm run prep -- --only "<Collection>" --gap 12       # and try again
```

`--only` matches loosely — partial names, and `"Theme/Category"` for one folder.

## 3. Upload to Sanity

```powershell
npm run ingest -- --dry-run      # metadata only, no upload — read it first
npm run ingest                   # for real — goes live
```

Metadata is cached by image content, so a re-run only pays for art that
actually changed. `--only "<Collection>"` narrows it to one.

Documents go **live** — there's no review step to forget. Re-ingesting a
collection whose art changed leaves the **old pieces published**, and the app
lists every published item, so use `--prune` to clear them out:

```powershell
npm run ingest -- --only "<Collection>" --prune
```

To park a batch in Studio for review instead, `--drafts`, then publish them
when you're happy:

```powershell
npm run ingest -- --drafts
npm run publish-drafts -- --yes
```

## 4. Check the data

```powershell
npm run check-types
```

Read-only, no token needed. Reports **unreferenced items** — leftovers from a
re-prep that `--prune` would have cleared — and any field stored with the wrong
type — a
price saved as `"5.99"` instead of `5.99` used to take the whole shop down.
The app copes with it now, but it still shows the wrong price.

## 5. Create the App Store products

```powershell
cd ..\scripts\asc-iap-sync
node sync.mjs --list     # read-only: what exists vs what the app asks for
node sync.mjs            # create and complete whatever is missing
node sync.mjs --list     # confirm every collection is now Purchasable
```

**Existence is not enough.** A product sits in `MISSING_METADATA` until its
localization, availability, price and review screenshot are all present, and
the store won't serve it until then — not even in the sandbox. `--list` splits
*Purchasable* from *exists but not*, and names what each one is still missing.

If it stops on a price, Apple has no AUD tier at that value. Either
`node sync.mjs --snap-prices` to take the nearest, or set exact prices in
`overrides.json` **and** match them in Sanity so the shop shows the same number.

Free collections correctly get no product, so the count here is lower than your
collection count.

## 6. RevenueCat

In the dashboard — there's no CLI for this.

1. **Products → Import** — pulls in the new App Store products. This is what
   makes a completed purchase appear in `nonSubscriptionTransactions`, which is
   what the app reads to decide you own a collection.
2. Collections need **no entitlement**. RevenueCat prompts to "Attach" one;
   ignore it. Ownership comes from the transaction, not an entitlement.
3. **Studio only:** an **Offering**, marked *current*, with a **Monthly** and an
   **Annual** package, each on the `studio` entitlement. `purchaseStudio` reads
   `offerings.current` — without it, subscribing fails even though the
   subscriptions exist and look fine.

If RevenueCat shows a stale status, give it the App Store Connect **In-App
Purchase Key** and the **App-Specific Shared Secret** under Project settings →
Apps. The shared secret is what validates subscription receipts, so Studio
needs it regardless.

## 7. Test it

```powershell
cd ..\..
npx eas build --platform ios --profile production --auto-submit
```

TestFlight buys against the **sandbox**, so products at *Ready to Submit* are
purchasable without review and without being charged. Allow a few hours after
creating a product before deciding a failure means something is wrong — they
take a while to reach the sandbox.

A failed purchase names the id it asked for:

```
No store product found for:
com.paperandpetals.collection.r2.victorian_rose
```

Paste that into App Store Connect's search. Not there → step 5. There but
`MISSING_METADATA` → step 5. There and Purchasable → step 6, or it's too fresh.

---

## Going live

Separate from all of the above: Apple requires the first in-app purchase and
the first subscription group to be submitted **with an app version**. That's why
App Store Connect says *"add an app version for the selected platform"* — it is
about release, not testing, and nothing above is blocked by it. Attach the
products to the submission when you send the app for review.

## The one-liner, once it's all set up

A normal week — new art in, nothing else changed:

```powershell
cd C:\Users\Gemma\paper-and-petals\paper-and-petals\studio
npm run prep
npm run ingest
npm run check-types
cd ..\scripts\asc-iap-sync && node sync.mjs && node sync.mjs --list
```

Then RevenueCat → Products → Import for the new ones.
