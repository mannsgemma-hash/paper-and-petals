// The two system prompts — push permission and the App Store review — and when
// each is earned. Both fire as someone leaves a journal, never on entry: the
// first visit already shows the editor tips, and a system dialog on top of a
// half-made page interrupts the very thing the app is for.
//
//   push    → after the first journal visit, once ever
//   review  → after the third visit that left something on the page, once per
//             app version (Apple also caps it at three a year and may show
//             nothing — requestReview is a request, not a guarantee)

import Constants from 'expo-constants'
import { getItem, setItem } from './storage'
import { requestNotificationPermission } from './notifications'

let StoreReview: any = null
try { StoreReview = require('expo-store-review') } catch {}

const KEY_PUSH_ASKED = 'pp:push-asked'
const KEY_SESSIONS = 'pp:journal-sessions'
const KEY_REVIEW_ASKED = 'pp:review-asked-version'

/** Visits that left at least one piece on the page before a review is asked. */
const REVIEW_AFTER_SESSIONS = 3
/** Let the editor's exit transition finish before a dialog appears. */
const SETTLE_MS = 800

/** Call when the editor closes, with how many pieces the journal now holds. */
export function onJournalClosed(itemCount: number) {
  setTimeout(() => {
    run(itemCount).catch(() => {})
  }, SETTLE_MS)
}

async function run(itemCount: number) {
  // One dialog per exit: the push ask always comes first and alone.
  if ((await getItem(KEY_PUSH_ASKED)) !== '1') {
    await setItem(KEY_PUSH_ASKED, '1')
    requestNotificationPermission()
    return
  }
  if (itemCount === 0) return

  const sessions = Number((await getItem(KEY_SESSIONS)) ?? '0') + 1
  await setItem(KEY_SESSIONS, String(sessions))
  if (sessions < REVIEW_AFTER_SESSIONS) return

  const version = Constants.expoConfig?.version ?? 'unknown'
  if ((await getItem(KEY_REVIEW_ASKED)) === version) return
  if (!StoreReview || !(await StoreReview.isAvailableAsync())) return
  await setItem(KEY_REVIEW_ASKED, version)
  await StoreReview.requestReview()
}
