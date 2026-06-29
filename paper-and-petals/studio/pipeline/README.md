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

Set credentials (a `.env` is fine if you load it, or export inline):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export SANITY_WRITE_TOKEN=sk...        # a write token from sanity.io/manage
# optional overrides (defaults shown):
# export SANITY_PROJECT_ID=cv53e819
# export SANITY_DATASET=production
```

## Folder convention

```
studio/incoming/
  Spring Meadow/          ← one folder = one collection (bundle)
    cover.png             ← optional cover (otherwise the first piece is used)
    collection.json       ← optional overrides (see below)
    pressed-rose.png
    linen-paper.png
  Old Romance/
    ...
  _free/                  ← images here become standalone FREE items (no collection)
    washi-sage.png
```

`collection.json` (all fields optional — anything you set wins over the AI):

```json
{ "name": "Spring Meadow", "palette": "sage", "price": 5.99, "free": false, "whatYouGet": "…" }
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

## Review & publish

Everything lands as `drafts.*`, invisible to the app. Open `npm run dev`
(Sanity Studio), skim the new items + collection (fix any tone/price/name), then
**Publish**. Publish the member items before (or together with) the collection so
its references resolve. Covers/art that fail to upload fall back to the glyph in
the app, so a missing image never breaks the page.

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
