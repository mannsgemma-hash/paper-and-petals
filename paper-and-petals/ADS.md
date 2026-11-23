# Apple Ads — setup and weekly routine

Paid search for Paper & Petals: small, measured, and scaled only where it
earns. Australia first. Month one ≈ **$15 a day (~$450)**.

Apple renames buttons now and then; if a label doesn't match, the step's
intent does.

---

## 0 · Measurement first (once)

Ads are judged on **trials and purchases**, not installs. The app (1.0.1 on)
hands RevenueCat Apple's attribution token; switch on the other end:

1. **app.revenuecat.com → your project → Integrations → Apple Search Ads →
   Enable.**
2. Optional, for campaign *names* instead of numbers in RevenueCat: follow the
   integration page's steps to connect the Apple Ads API (Apple Ads → Settings
   → API → invite an API user, upload the key RevenueCat gives you).
3. Where to read results later: RevenueCat → **Charts** (trials, conversions,
   revenue) → filter or segment by **Apple Search Ads campaign / keyword**.

Only installs of **1.0.1 or later** are attributed. Start campaigns once 1.0.1
is live.

**App Privacy:** check RevenueCat's App Store privacy guide for Apple Search
Ads attribution, and update App Store Connect → App Privacy if it says to.
AdServices needs no tracking prompt and is not "tracking" in Apple's sense.

---

## 1 · Account  (done if Brand is running)

searchads.apple.com → sign in with the App Store Connect Apple ID →
**Advanced** → country **Australia**, currency **AUD**, payment card.

---

## 2 · Campaign: Brand  — $3/day

Your own name, cheap, keeps you top of results while organic search builds.

| Setting | Value |
|---|---|
| Campaign | `Brand – AU` · Search results · Australia · daily budget **$3** |
| Ad group | `Brand` · **Search match OFF** · default max CPT **$1.00** · audience: all users |
| Keywords (Exact) | `paper and petals`, `paper & petals`, `paper petals`, `paper and petals app`, `paper and petals scrapbook` |
| Ad | default (uses your App Store screenshots) |

---

## 3 · Campaign: Category  — $8/day

People searching for exactly what the app is. The core of the spend.

1. **Campaigns → Create Campaign** → Paper & Petals → **Search results** →
   **Australia**.
2. Name `Category – AU`, daily budget **$8**.
3. Ad group `Category`:
   - **Search match: OFF**
   - Default max CPT bid: **$1.20**
   - Audience: all users
4. Keywords, all **Exact match**:
   ```
   digital scrapbook
   scrapbook app
   scrapbooking
   digital journal
   junk journal
   journal stickers
   digital stickers
   vintage stickers
   ipad journal
   aesthetic journal
   planner stickers
   collage journal
   ```
5. **Negative keywords** (campaign level, Exact): `paper and petals`,
   `paper & petals`, `paper petals` — so brand searches stay in Brand.
6. Ad: default. **Start.**

---

## 4 · Campaign: Discovery  — $4/day

Lets Apple find search terms you haven't thought of, cheaply; you harvest the
winners into Category each week.

1. **Create Campaign** → Search results → Australia → name `Discovery – AU`,
   daily budget **$4**.
2. Ad group `Discovery – broad`:
   - **Search match: ON**
   - Default max CPT bid: **$0.60**
   - Keywords, **Broad match**: `scrapbook`, `journal`, `stickers`, `collage`
3. **Negative keywords** (campaign level, Exact): every Category keyword above
   and the three brand terms — Discovery should only pay for *new* terms.
4. **Start.**

---

## 5 · Weekly routine  — 15 minutes, Mondays

1. **Discovery → Search Terms** (report of what people actually typed):
   - A term with an install: add it to **Category** as **Exact**, then add it
     to **Discovery** as a **negative Exact** keyword.
   - A term that's clearly irrelevant (taps, no installs): add as **negative**
     in Discovery.
2. **Category → Keywords**, last 7 days. For each keyword, also look up its
   trials in RevenueCat:

   | What you see | Do |
   |---|---|
   | **Cost per trial under $5** | raise its bid **20%** |
   | Cost per trial $5–8 | leave it |
   | **Cost per trial over $8**, or ~30 taps and no installs | lower bid **30%**, or pause |
   | Very few impressions on a keyword you want | raise bid **20%** |

3. **Budgets:** a campaign that never spends its daily budget has bids too
   low; one that runs out before midday has bids too high (or is winning —
   check its cost per trial before raising the budget).

Why $5: a Studio trial is worth very roughly **$4–8** after Apple's 15% (Small
Business Program), depending on how many trials convert and how long people
stay. Replace this guess with RevenueCat's real numbers after the first month.

---

## 6 · Month one, then

- **Weeks 1–4:** ~$15/day total. Change bids at most once a week — Apple needs
  a few days of data per change.
- **End of month one:** in RevenueCat, cost per trial and per purchase by
  keyword. Move budget from losers to winners. Raise the total only if the
  Category campaign as a whole is under ~$5 per trial.
- **Then:** copy the winning Category keywords into `Category – US` and
  `Category – UK` campaigns (bigger markets, dearer taps) at the same rules.
- **Later, optional:** a competitor campaign (other journaling apps' names) —
  allowed, but costly and low-intent; only once the above is profitable.
