# Art ingest pipeline

Turns a folder of finished artwork into reviewable Sanity drafts — processing,
metadata, and upload are automated; you only curate and publish.

```
finished art  →  remove bg + trim + resize  →  Claude writes metadata  →  Sanity drafts  →  you review & publish
```

## One-time setup (run on a machine that can reach Sanity + the Anthropic API)

```bash
cd studio
npm install
# optional, for non-transparent art (Midjourney etc.):
npm install @imgly/background-removal-node
```

Set credentials. This is a local content tool that runs wherever Node does —
typically the **PC** (the Mac is only needed for the iOS dev build). It makes
**outbound** HTTPS calls only (Sanity + Anthropic), so a firewall that blocks
Metro's LAN port won't affect it.

macOS / Linux (bash):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export SANITY_WRITE_TOKEN=sk...        # a write token from sanity.io/manage
# optional overrides (defaults shown):
# export SANITY_PROJECT_ID=cv53e819
# export SANITY_DATASET=production
```

Windows PowerShell (set for the session, then run):

```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
$env:SANITY_WRITE_TOKEN="sk..."
npm run ingest
```

Windows cmd.exe:

```bat
set ANTHROPIC_API_KEY=sk-ant-...
set SANITY_WRITE_TOKEN=sk...
npm run ingest
```

## Folder convention

```
studio/incoming/
  The Edwardian Seed Merchant's Catalogue/   ← one folder = one collection
    prompts.md                               ← optional notes/prompts (context for naming)
    cover.png                                ← optional cover (otherwise the first piece)
    collection.json                          ← optional overrides (see below)
    Papers/                                  ← optional CATEGORY subfolders
      scrapbook-page-1.png
      teapots_split.png                      ← sheet → pieces + teapots.sheet.png
    Stickers/
    Frames/
  _free/                                     ← FREE content
    washi-sage.png                           ← a loose image = a standalone free item
    Spring Pastels/                          ← a FOLDER = a whole free collection
      Stickers/
```

Anything else starting with `_` (`_originals`, `_live`, `_not_using`,
`_unprocessed`, …) is ignored entirely, so it's a handy staging area.

**Free collections:** put the whole theme folder inside `_free/` and it becomes
a normal collection that happens to be free — same category subfolders, same
cover, shown in the shop with a FREE pill instead of a price. No `collection.json`
needed, and no App Store product is created for it. (Setting `"free": true` in
`collection.json` on a normal theme does the same thing.)

Art can sit **loose in the collection folder, in category subfolders, or both**.
A subfolder whose name matches a category *pins* that category — no guessing,
and one less thing for the model to get wrong. Recognised names (the app's own
categories, with `and`/`&`/bare-id variants all accepted):

| Folder | Category |
|---|---|
| Papers · Papers and Backgrounds | `papers` |
| Stickers | `stickers` |
| Tape and Fasteners | `tape` |
| Ephemera | `ephemera` |
| Florals and Botanicals | `florals` |
| Frames and Containers | `frames` |
| Writing and Typography | `type` |
| Paint and Artistic | `paint` |
| Sewing and Fabric | `fabric` |
| Photos and Memory Keeping | `photos` |
| Decorative Details | `details` |

Names are matched loosely: an ordering prefix, underscores and `&` all fold away,
so `01_Papers`, `06_Tape_And_Fasteners` and `Photos & Memory Keeping` all match.

A subfolder that *isn't* a category still gets ingested — it just warns and lets
the model choose per item. Only one level deep is scanned; `_originals`, `_done`
and dot-folders are skipped. `npm run prep` walks the same subfolders.

`collection.json` (all fields optional — anything you set wins over the AI):

```json
{ "name": "Spring Meadow", "palette": "sage", "price": 5.99, "free": false, "whatYouGet": "…", "productId": "com.paperandpetals.collection.r2.spring_meadow" }
```

Firefly exports with transparency are used as-is; opaque art (e.g. Midjourney)
gets the background removed automatically if `@imgly/background-removal-node` is
installed.

## Run

```bash
npm run ingest                       # process everything → Sanity DRAFTS
npm run ingest -- --dry-run          # process + metadata only → pipeline/out/, no upload (cheap test)
npm run ingest -- --model claude-opus-4-8   # higher-quality metadata (default: claude-haiku-4-5, pennies)
npm run ingest -- --remove-bg        # force background removal even on transparent PNGs
npm run ingest -- --no-bg            # never remove background
npm run ingest -- --publish          # write live docs instead of drafts (skip review)
```

## Tag-driven prep (`prep`) — the easy way

Skip the separate split/staging folders: drop raw art **straight into its
collection folder**, tag the filename with what it needs, and run one command.

| Filename | Meaning |
|---|---|
| `teapots_split.png` | a sheet of many elements — split into `teapots-01.png`, `-02.png`… |
| `old-letter_cut.png` | one element on a background — background removed → `old-letter.png` |
| anything untagged | already ready — left alone |

(`-split` / `-cut` also work; case-insensitive.)

```bash
npm run prep                 # processes every tagged file under incoming/, in place
npm run prep -- --gap 12     # per-run overrides (same knobs as extract)
npm run prep -- --undo       # preview putting it all back
npm run prep -- --undo --yes # restore originals + delete the pieces they made
```

### Getting the split right

Two knobs decide whether items hold together and how sharp they stay.

**`--gap`** bridges thin breaks so one item doesn't shatter into several. The
default (`0`) only suits sheets where every item is one solid connected shape.
If an item has any detached part — a petal, a dangling tag, separate lettering —
those become their own "pieces". Raise the gap until the count matches what you
see on the page:

| Symptom | Fix |
|---|---|
| More pieces than items (things broken up) | raise `--gap` (try 12, then 24) |
| Fewer pieces than items (neighbours merged) | lower `--gap`, or raise `--alpha` to ~70 |
| Stray specks becoming pieces | raise `--min-size` |

`--gap` is measured against a 2400px baseline and scaled to the sheet, so each
run prints what it actually used (`gap≈15px` on a 3000px sheet from `--gap 12`).
To set that number directly instead, use `--gap-px`:

```bash
npm run prep -- --gap-px 13     # exactly 13 working pixels, no scaling
```

**`--max-edge`** (default `4000`) is the resolution the pieces are cut at, so it
sets the detail the art keeps **forever**. A 6-up page capped at 2400px yields
only ~800px pieces, which look soft in the editor. Raise it to match your source
art; it never enlarges past the original.

`--gap`, `--min-size` and `--pad` are measured against a 2400px baseline and
scaled to the working resolution, so changing `--max-edge` does **not** change
how items group. Each run prints the effective gap (`gap≈20px`) so you can see
what was actually applied.

**Iterating is safe:** `--undo --yes` puts the originals back and deletes only
the files that prep derived from them (`<base>-01…`, `<base>.sheet.*`), leaving
your other art alone. So you can re-split with different settings as often as
you like.

Pieces land in the **same collection folder**; originals are moved to
`incoming/_originals/` (kept, never deleted; ingest ignores that folder). If you
forget to prep, ingest refuses tagged files with a warning rather than uploading
a whole sheet as one item. Default split gap is **0** (tuned for grid sheets) —
raise it if one item breaks into pieces.

### Printable pages (`.sheet`) — what buyers download

When `prep` splits a sheet it also keeps the whole page beside the pieces as
`<base>.sheet.png`. Ingest never treats that as an item; instead it becomes the
**print asset for every piece cut from it**. So a 6-up fussy-cut page gives six
placeable cut-outs in the app, while **Download** hands the buyer the full
printable page — the thing you actually want to print and cut by hand.

```
incoming/Victorian Rose/
  teapots_split.png        ← you drop this in
  → teapots-01.png … -06.png   ← 6 placeable cut-outs (background already removed)
  → teapots.sheet.png          ← the full page; what Download gives you
```

Downloads de-duplicate by page, so a 12-piece collection made of two sheets
zips as **two pages**, not twelve copies. Anything without a sheet (a one-off
`_cut` piece, already-ready art) still prints as itself, so mixed collections
work unchanged. To ship a differently-laid-out print page than the one you cut
from, just drop in your own `<base>.sheet.png`.

## Background removal & sheet splitting (`extract`)

A prep tool for before ingest. Two modes:

```bash
# Just remove backgrounds for a folder (or one file) → transparent PNGs
node pipeline/extract.mjs ./raw --out ./cutouts

# Split a sheet of many elements into individual cut-out items
node pipeline/extract.mjs ./sheets/spring-stickers.png --split --out "./incoming/Spring Meadow"
```

`--split` removes the background, finds each separated blob of artwork, and saves
it as its own transparent PNG (`spring-stickers-01.png`, `-02.png`, …). Ideal for
sticker sheets / contact-sheet generations where items don't touch.

Useful options: `--gap <px>` bridges thin breaks so one item doesn't split in two
(default 4; raise if a flower loses a petal); `--min-size <px>` drops specks
(default 28); `--pad <px>` adds breathing room (default 12); `--remove-bg` /
`--no-bg` force or skip removal; `--max-edge <px>` caps working resolution
(default 2400). Items that physically overlap merge into one piece — separate
them on the page, or raise `--min-size` and re-run.

Output naming is top-to-bottom, left-to-right. Then just rename the output folder
into `incoming/` and run `npm run ingest`. (Needs `@imgly/background-removal-node`
installed for opaque art; transparent input is used as-is.)

## Store product ids

Every collection gets its App Store / Play product id **pinned into Sanity** on
ingest, so the app and `scripts/asc-iap-sync` both use the exact same string:

```
com.paperandpetals.collection.<series>.<collection-slug-with-underscores>
e.g.  com.paperandpetals.collection.r2.victorian_rose
```

**App Store product ids can never be reused** — not even after deleting the
product. So if you wipe the catalogue and rebuild it, reusing a collection name
would collide with a burned id. The `<series>` token (`r2`) exists for exactly
that: bump `PP_PRODUCT_SERIES` (and `COLLECTION_SERIES` in
`src/lib/revenuecat.ts`) and every id changes at once. Ids from earlier series
still resolve on restore, so nothing breaks.

```bash
PP_PRODUCT_SERIES=r3 npm run ingest    # after another full wipe
```

An explicit id always wins, and a re-run never clobbers one you set by hand:
put `"productId": "com.paperandpetals.collection.r2.my_id"` in `collection.json`,
or edit the **Store product ID** field in Sanity Studio.

## Review & publish

Everything lands as `drafts.*`, invisible to the app. Open `npm run dev`
(Sanity Studio), skim the new items + collection (fix any tone/price/name), then
**Publish**. Publish the member items before (or together with) the collection so
its references resolve. Covers/art that fail to upload fall back to the glyph in
the app, so a missing image never breaks the page.

Studio has no "publish all", so to publish a whole ingest at once:

```bash
npm run publish-drafts                      # counts only, changes nothing
npm run publish-drafts -- --yes             # publish every draft
npm run publish-drafts -- --yes --type collection   # just one type
```

It publishes **items before collections**, so a collection never goes live
pointing at pieces that aren't published yet.

To skip review entirely, ingest straight to live documents:

```bash
npm run ingest -- --publish
```

## Cost

Metadata is generated per image. On Haiku 4.5 that's a fraction of a cent each;
a 40-piece pack is a few cents. Use `--dry-run` to eyeball the metadata before
spending anything on uploads.

## Notes

- `--dry-run` needs only `ANTHROPIC_API_KEY`; uploading needs `SANITY_WRITE_TOKEN`.
- This is a local tool. In a restricted/cloud environment, allowlist
  `*.api.sanity.io` and `api.anthropic.com` first.
- The vocab (categories, tones) is kept in sync with `src/data/shop.ts` and the
  Sanity schemas — update `brand-voice.md` and the enums in `ingest.mjs` if those change.
