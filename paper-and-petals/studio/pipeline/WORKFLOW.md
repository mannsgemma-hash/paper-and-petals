# Catalogue production line — step by step (PC)

Two guides: **Part A** sets everything up once. **Part B** is what you repeat
every time you create new art. (The Mac is only for testing the app on the iPad;
all content work happens here on the PC.)

Paths assume the repo is cloned to `C:\Users\Gemma\paper-and-petals`, so the
studio lives at `…\paper-and-petals\paper-and-petals\studio`. Adjust if yours
differs.

---

## Part A — One-time setup

**1. Install the tools** (skip any you already have):
- Node.js LTS — https://nodejs.org (gives `node` and `npm`).
- Git — https://git-scm.com.

Check they work (open **PowerShell**):
```powershell
node -v
git --version
```

**2. Get the code**
```powershell
cd C:\Users\Gemma
git clone https://github.com/mannsgemma-hash/paper-and-petals.git
cd paper-and-petals
git checkout implement-paper-and-petals-app
```

**3. Install the studio + pipeline dependencies**
```powershell
cd paper-and-petals\studio
npm install
npm install @imgly/background-removal-node    # enables background removal for opaque art (Midjourney)
```

**4. Get your two keys**
- **Anthropic API key** — https://console.anthropic.com → API Keys → Create Key.
- **Sanity write token** — https://sanity.io/manage → project **cv53e819** → API →
  Tokens → Add token → permission **Editor** (or **Write**).

**5. Save the keys so PowerShell can see them** (once, persists across reboots):
```powershell
setx ANTHROPIC_API_KEY "sk-ant-…"
setx SANITY_WRITE_TOKEN "sk…"
```
**Close and reopen PowerShell** afterwards (setx only applies to new windows).
Verify:
```powershell
echo $env:ANTHROPIC_API_KEY
echo $env:SANITY_WRITE_TOKEN
```

Setup done. You won't repeat Part A unless you move to a new PC.

---

## Part B — Update the catalogue (repeat each time)

Run all commands from the studio folder:
```powershell
cd C:\Users\Gemma\paper-and-petals\paper-and-petals\studio
git pull                     # grab any code/pipeline updates
```

**1. Create the art** in Firefly / Midjourney / from your artist (using your
daily prompts). Save the image files somewhere, e.g. `C:\Users\Gemma\art-in`.

**2. Turn the art into individual, background-free pieces.**

- If a file is **a sheet of many items** (a sticker page, a contact sheet), split
  it into separate cut-outs straight into a collection folder:
  ```powershell
  node pipeline/extract.mjs "C:\Users\Gemma\art-in\spring-sheet.png" --split --out ".\incoming\Spring Meadow"
  ```
- If a file is **already one item per image** but has a background, just cut out:
  ```powershell
  node pipeline/extract.mjs "C:\Users\Gemma\art-in" --out ".\incoming\Spring Meadow"
  ```
- If your art is **already transparent, one item per file** (typical Firefly),
  skip extract — just copy the files into a collection folder yourself.

Useful flags: `--gap 8` if one item splits into pieces; `--min-size 40` if you get
specks; `--no-bg` if already transparent. (See `README.md`.)

**3. Lay out the `incoming` folder.** One folder per collection; a special
`_free` folder for free-tier items:
```
incoming\
  Spring Meadow\          ← becomes a paid collection
    cover.png             (optional; else the first piece is the cover)
    collection.json       (optional; see below)
    spring-sheet-01.png
    spring-sheet-02.png
  _free\                  ← these become free starter-set items (no collection)
    washi-sage.png
```
Open the folder, **delete any junk crops**, and rename pieces if you like.

Optional `collection.json` to override what the AI guesses (any field optional):
```json
{ "name": "Spring Meadow", "palette": "sage", "price": 5.99, "free": false }
```

**4. Preview the metadata (cheap, no upload).**
```powershell
npm run ingest -- --dry-run
```
Look in `pipeline\out\` — you'll see the names, categories, tones, descriptions
and suggested prices the AI produced. Tweak art/folders if anything's off.

**5. Upload as drafts.**
```powershell
npm run ingest
```
This processes every image, uploads it to Sanity, and creates **draft** items +
collections. Nothing is live yet.

**6. Review and publish.**
```powershell
npm run dev
```
Opens Sanity Studio at http://localhost:3333. Check the new drafts (fix any
name/price/tone), then **Publish** — publish the member **items** first, then the
**collection** so its links resolve. Press `Ctrl+C` in PowerShell to stop Studio.

**7. Check it in the app.** Reload the app (on the iPad via the Mac, or web) — the
new collection appears in the shop, free items appear in "Free to use".

**8. Tidy up.** Move the processed art out of `incoming\` (it's git-ignored, so
nothing to commit). You're done.

---

### One extra step for brand-new PAID collections
For people to *buy* a new paid collection (not just get it via a Studio
subscription), create a matching in-app-purchase product in App Store Connect /
Google Play with id **`com.paperandpetals.collection.<id>`** (the `<id>` is the
collection's id in Sanity, e.g. `col-spring`). Studio subscribers see every
collection without this; it's only needed for one-time purchases. Free
collections and Studio-only releases need nothing here.
