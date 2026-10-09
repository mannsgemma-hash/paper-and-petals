# Saturday — the weekly content drop

New art from Dropbox into the live app. About 20 minutes, most of it waiting.

**No app build is needed.** The app reads the catalogue from Sanity when the
shop opens, so new collections appear for people who already have the app, with
no TestFlight or App Store release. A build is only for changes to the app
*code*. (`RUNBOOK.md` has the full version of all this, including first-time
setup.)

---

## 0 · Open PowerShell and set three keys  ·  1 min

```powershell
cd C:\Users\Gemma\paper-and-petals\paper-and-petals
git pull origin implement-paper-and-petals-app

$env:ANTHROPIC_API_KEY="sk-ant-..."
$env:SANITY_WRITE_TOKEN="sk..."
$env:ASC_KEY_ID="XXXXXXXXXX"
$env:ASC_ISSUER_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$env:ASC_PRIVATE_KEY_PATH="C:\path\to\AuthKey_XXXXXXXXXX.p8"
```

Keep this one window for the whole job — the keys vanish when it closes.

**If anything later says `401 Session not found`**, the Sanity token has
expired. New one at sanity.io/manage → your project → API → Tokens → Editor,
then set `$env:SANITY_WRITE_TOKEN` again. It is the single most common
interruption.

---

## 1 · Move the week's art in  ·  5 min

Drop each new collection into `studio\incoming\` as its own folder:

```
studio\incoming\
  The Victorian Lantern Maker's Moonlit Workshop\
    prompts.md                 ← optional, helps the metadata
    collection.json            ← optional; price must be 5.99, NOT "5.99"
    cover.png                  ← optional; else the first piece
    Papers\                    ← category subfolders pin the category
    Stickers\
    Paint and Artistic\
```

Then **rename the files that need cutting**. The tag on the end decides what
happens — this is the only part that needs your judgement:

| Ends with | Use it for |
|---|---|
| `-split` | a sheet of separate items (sticker sheets, fussy-cut pages) |
| `-splatter` | paint, glitter, anything that sheds specks — keeps them with their art |
| `-cut` | one item on a background that needs removing |
| *nothing* | already a finished cut-out |

`-splatter` is the one that matters for *Paint and Artistic*: ordinary `-split`
scatters a splatter piece into dozens of fragments.

---

## 2 · Cut the sheets  ·  2 min

```powershell
cd studio
npm run prep
```

**Read the piece counts against the sheets.** This is the one step you should
actually look at, because everything downstream inherits a bad cut:

```
📂 Victorian Lantern / Stickers
  ✂ lanterns-split.png: 6 piece(s)      ← does the sheet have 6 things on it?
```

Too many pieces means items broke apart; too few means neighbours merged.
To redo one:

```powershell
npm run prep -- --undo --yes --only "Victorian Lantern"
npm run prep -- --only "Victorian Lantern" --gap 12      # try 12, then 24
```

Originals are kept in `incoming\_originals\` and nothing is ever deleted, so
you can go round this as many times as you like.

Delete any junk pieces now, before they become documents.

---

## 3 · Preview the metadata  ·  2 min

```powershell
npm run ingest -- --dry-run
```

Writes nothing. Check the collection names, prices and piece counts look right:

```
📦 Collection: The Victorian Lantern Maker's Moonlit Workshop
  ↳ (dry-run) Victorian Lantern Maker · 44 pieces · $5.99 · amber
```

A name or price you don't like is fixed in that collection's `collection.json`
rather than after the fact. A collection showing `[incoming/_free/...] · FREE`
is in the free folder — move it out if it shouldn't be.

---

## 4 · Upload  ·  5–10 min

```powershell
npm run ingest
```

Goes **live** — there's no publish step to forget. Art already in Sanity is
skipped, so this costs roughly what the new art costs:

```
3245 item(s) already in Sanity — unchanged art will be skipped.
…
3205 piece(s) were already in Sanity and were not re-uploaded.
```

**If you re-cut a collection that was already uploaded**, its old pieces stay
published — add `--prune` for that one:

```powershell
npm run ingest -- --only "Victorian Lantern" --prune
```

---

## 5 · Check  ·  1 min

```powershell
npm run check-types
```

Two things, both of which you want to be zero:

- **wrongly-typed fields** — usually a price saved as `"5.99"`; fix the
  `collection.json` and re-ingest that collection
- **unreferenced items** — leftovers from a re-cut; re-ingest those collections
  with `--prune`

---

## 6 · Make the new collections buyable  ·  3 min

Only needed when you added **paid** collections. Free ones need nothing here.

```powershell
cd ..\scripts\asc-iap-sync
node sync.mjs --list      # what exists vs what the app asks for
node sync.mjs             # create the missing products
node sync.mjs --list      # every collection should now say Purchasable
```

**Purchasable is the word to look for.** A product that exists but reads
`MISSING_METADATA` cannot be bought — not even in testing — and the second
`--list` is what catches that. It names what each incomplete product is still
missing.

If it stops on a price, Apple has no AUD tier at that value:
`node sync.mjs --snap-prices` takes the nearest.

---

## 7 · RevenueCat  ·  2 min

In the browser, at app.revenuecat.com — there's no command for this.

**Products → Import.** That's it. It's what makes a purchase register against
the right collection.

Ignore the "Attach" prompt next to each collection — collections deliberately
don't use entitlements. Only Studio does.

---

## 8 · Confirm  ·  2 min

Open the app on the iPad — no new build needed — and check the shop:

- the new collections are there, with covers and the right prices
- tap one: the pieces show, and the Buy button gives a real price rather than
  "isn't available to buy yet"

If a purchase fails it names the product id it looked for. Paste that into App
Store Connect's search: not there or `MISSING_METADATA` → step 6; there and
Purchasable → step 7, or it's simply too new (new products take a few hours to
reach the sandbox).

---

## The short version

```powershell
cd C:\Users\Gemma\paper-and-petals\paper-and-petals\studio
npm run prep                  # then LOOK at the piece counts
npm run ingest -- --dry-run   # then LOOK at names and prices
npm run ingest
npm run check-types
cd ..\scripts\asc-iap-sync
node sync.mjs ; node sync.mjs --list
```

Then RevenueCat → Products → Import, and open the app.

## Things that are not part of Saturday

- **Cutting a build.** Only for app code changes.
- **`npm run clear`.** Wipes the entire catalogue. There is no undo and App
  Store product ids can never be reused.
- **`--force-upload`.** Re-uploads art that hasn't changed. You want it once,
  deliberately, to re-render the older collections at the higher resolution
  (`PP_MAX_DIM` went 1600 → 2400) — one collection at a time, not all at once.
