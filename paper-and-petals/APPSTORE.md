# App Store Connect — Paper & Petals 1.0 listing

Everything to paste into App Store Connect for the first release, field by
field, with Apple's character limits checked. Spelling is Australian, like the
app. Square brackets mean "fill in yourself".

Where: **appstoreconnect.apple.com → Apps → Paper & Petals**, then the page
named in each section.

---

## 1 · App Information  (sidebar → General → App Information)

| Field | Value |
|---|---|
| **Name** (30) | `Paper & Petals: Scrapbook` |
| **Subtitle** (30) | `Vintage journal & stickers` |
| **Primary category** | Graphics & Design |
| **Secondary category** | Lifestyle |
| **Content rights** | "Does your app contain, show, or access third-party content?" → **No** (the art is your own) |
| **Age rating** | see section 6 |
| **Privacy Policy URL** | `https://www.paperandpetals.app/privacy` |

The name and subtitle are the two fields search weighs most, so "Scrapbook",
"Vintage", "journal" and "stickers" are spent there rather than in keywords.

---

## 2 · Version page  (sidebar → iOS App → 1.0 Prepare for Submission)

### Promotional text (170) — can be changed any time without a new build

```
New vintage collections every week. Layer papers, stickers and ephemera into beautiful journal pages, then print your favourites at home.
```

### Description (4000)

```
Paper & Petals is a cosy digital scrapbook for iPad. Layer vintage papers, stickers, ephemera, pressed flowers and handwriting into beautiful journal pages — no glue, no mess, and no running out of your favourite sticker.

CREATE PAGES YOU'LL LOVE
• Thousands of illustrated pieces: papers and backgrounds, stickers, frames, tape and fasteners, ephemera, paint and pressed botanicals
• Drag, resize and rotate everything; arrange layers to tuck pieces behind one another
• Write in a choice of handwriting, script and serif fonts, in any colour
• Doodle with a pen, add shapes, and bring in your own photos with torn edges and cut-out shapes
• Journals with real-looking covers and up to 30 pages each
• Share or save a picture of any finished spread

NEW COLLECTIONS EVERY WEEK
Themed collections arrive in the shop regularly — Victorian botanists, seaside pavilions, Art Nouveau stained glass, bright and modern colour pops, and many more. Free collections are included to get you started.

KEEP WHAT YOU LOVE
Buy a single collection and it's yours forever, including the high-resolution art to download and print for paper journals and crafting.

STUDIO SUBSCRIPTION
Studio unlocks every collection in the shop, including each new release, for as long as you subscribe. Choose monthly or yearly, with a 7-day free trial. Anything you've placed in a journal stays there, subscription or not.

A CALM PLACE TO CREATE
• Cosy soundscapes — rain, stream and ocean — while you work
• Gentle journalling prompts when you need an idea
• No account needed: your journals are saved on your iPad

Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Payment is charged to your Apple Account at confirmation of purchase. Manage or cancel in your Apple Account settings.

Terms of Use: https://www.paperandpetals.app/terms
Privacy Policy: https://www.paperandpetals.app/privacy
```

### Keywords (100) — commas, no spaces; words already in the name/subtitle left out

```
junk,journaling,ephemera,collage,planner,diary,digital,ipad,washi,aesthetic,memory,craft,printable
```

Don't add other apps' names (GoodNotes and the like): Apple rejects that
(guideline 2.3.7).

### URLs

| Field | Value |
|---|---|
| **Support URL** | `https://www.paperandpetals.app/support` |
| **Marketing URL** (optional) | `https://www.paperandpetals.app` |

### Other version fields

| Field | Value |
|---|---|
| **Version** | `1.0.0` (matches app.json) |
| **Copyright** | `2026 [your name or business name]` |
| **Screenshots** | iPad 13-inch: the nine captioned images, 01 first |
| **Build** | the newest iPad-only build, once processed |
| **In-App Purchases and Subscriptions** | tick **every collection** and **both Studio plans**; leave the four old orphans unticked |
| **What's New** | not shown for a first version |

---

## 3 · App Review Information  (same version page, near the bottom)

| Field | Value |
|---|---|
| **Sign-in required** | **No** — leave the demo account empty |
| **Contact** | [first name] [last name] · [phone] · admin@paperandpetals.app |

**Notes** (4000):

```
Thank you for reviewing Paper & Petals, a digital scrapbook for iPad.

No account or sign-in is needed. On first launch the app asks for a name (email optional), then opens the home screen of journals.

Where things are:
• Journals: tap a cover on the home screen to open the editor. The "+" button opens the drawer of art; the side buttons add text, photos, pen doodles, soundscapes and shapes.
• Shop (home screen, top right): collections. Each collection is a one-time non-consumable purchase; some are free.
• Studio: an auto-renewing subscription (monthly or yearly, 7-day free trial) that unlocks every collection. Reached from the Shop, with Terms of Use and Privacy Policy links on the purchase screen.
• Library: collections the user owns, with high-resolution art to download for printing.
• Settings: Restore purchases, notification choices, privacy policy and terms.

Notifications: the app does not ask at launch. After the user leaves their first journal it asks, in its own words, whether they'd like to hear about new collections, and shows the iOS permission prompt only if they say yes.

The app is iPad only. All artwork is original to Paper & Petals.
```

---

## 4 · In-app purchases

The collections are created by `scripts/asc-iap-sync/sync.mjs`. Before
submitting, `node sync.mjs --list` must show every one **Purchasable**.

### Studio subscription  (sidebar → Monetization → Subscriptions)

| Field | Value |
|---|---|
| **Subscription group — reference name** | `Studio` |
| **Group localization — display name** (en-AU) | `Paper & Petals Studio` |
| **Monthly — display name** (30) | `Studio Monthly` |
| **Monthly — description** (45) | `Every collection, plus new ones each week` |
| **Annual — display name** (30) | `Studio Yearly` |
| **Annual — description** (45) | `Every collection for a year, best value` |
| **Free trial** | Introductory offer → Free → 1 week, on both plans |
| **Review screenshot** | a screenshot of the Studio purchase screen (any iPad screenshot size) |
| **Review notes** | `Unlocks every collection in the shop while active. Purchase from Shop → Studio.` |

Prices must match the app's Studio screen: **$5.99 a month** and **$39.99 a
year** (AUD). If you choose different tiers, tell Claude so
`src/data/shop.ts` (`STUDIO_PRICING`) is changed to match.

---

## 5 · Pricing and Availability  (sidebar → Pricing and Availability)

| Field | Value |
|---|---|
| **Price** | Free (the app itself; purchases are in-app) |
| **Availability** | All countries and regions, or start with Australia, New Zealand, the US, the UK and Canada |
| **Apple silicon Mac availability** | **Untick** "Make this app available" on Mac — not tested there |

---

## 6 · Age rating  (App Information → Age Rating → Edit)

Answer **None / No** to everything, except:

| Question | Answer |
|---|---|
| In-app purchases | **Yes** (if asked) |
| Unrestricted web access | **No** — the only links open your own pages |
| User-generated content shared with others | **No** — journals stay private on the device |
| Messaging or chat | **No** |

Expected result: **4+**. The app is safe for children but not made for them,
so don't choose the Kids category.

---

## 7 · App Privacy  (sidebar → App Privacy → Edit)

| Data type | Linked to the user | Used for |
|---|---|---|
| Contact info — Name | Yes | App Functionality; Developer's Advertising or Marketing |
| Contact info — Email address | Yes | App Functionality; Developer's Advertising or Marketing |
| Purchases — Purchase history | Yes | App Functionality |
| Identifiers — User ID (RevenueCat) | Yes | App Functionality |
| Identifiers — Device ID (push token) | Yes | App Functionality |
| Usage data — Product interaction | No | Analytics |
| Diagnostics — Crash data, Other diagnostic data | No | App Functionality |

- **Tracking: No.**
- **Not collected:** photos, journal content, location, date of birth.
- Cross-check against the RevenueCat, PostHog and OneSignal App Store privacy
  guides before publishing.

---

## 8 · Before you press Submit

- [ ] Agreements, Tax and Banking: Paid Apps agreement **Active**
- [ ] Every collection **Purchasable** (`node sync.mjs --list`); RevenueCat → Products → Import done
- [ ] Studio: both plans complete, with free trial, review screenshot and notes
- [ ] New build tested on TestFlight, then selected on the version page
- [ ] Purchases and both Studio plans ticked on the version page
- [ ] `npm run notify -- --mark-all --yes` (studio) so the existing catalogue is never announced
- [ ] Website pages load: privacy, terms, support
