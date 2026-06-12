// Tiny persistent key-value helper + "first open of the day" launch logic.
// Uses AsyncStorage when available, falling back to localStorage on web and
// an in-memory map otherwise — so it never throws, it just degrades.

import type { LaunchState } from '../store/app';

type KVStore = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

let asyncStorage: KVStore | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  asyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  asyncStorage = null;
}

const memory = new Map<string, string>();

function webStorage(): Storage | null {
  try {
    const ls = (globalThis as { localStorage?: Storage }).localStorage;
    return ls ?? null;
  } catch {
    return null;
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (asyncStorage) {
    try {
      return await asyncStorage.getItem(key);
    } catch {
      // fall through to the next backend
    }
  }
  const ls = webStorage();
  if (ls) return ls.getItem(key);
  return memory.get(key) ?? null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (asyncStorage) {
    try {
      await asyncStorage.setItem(key, value);
      return;
    } catch {
      // fall through to the next backend
    }
  }
  const ls = webStorage();
  if (ls) {
    ls.setItem(key, value);
    return;
  }
  memory.set(key, value);
}

// ─── Launch state ─────────────────────────────────────────────────────────────

const KEY_WELCOME_COMPLETE = 'pp:welcome-complete';
const KEY_LAST_OPEN_DATE = 'pp:last-open-date';

/** Local calendar date as YYYY-MM-DD. */
export function todayKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/**
 * Boot routing: no completed welcome → 'new'; otherwise 'returning'.
 */
export async function resolveLaunchState(): Promise<LaunchState> {
  const welcomeComplete = await getItem(KEY_WELCOME_COMPLETE);
  return welcomeComplete ? 'returning' : 'new';
}

/** Stamp today so subsequent opens this day route straight to the tabs. */
export async function markOpenedToday(): Promise<void> {
  await setItem(KEY_LAST_OPEN_DATE, todayKey());
}

/** Called when the welcome flow finishes: also counts as today's open. */
export async function markWelcomeComplete(): Promise<void> {
  await setItem(KEY_WELCOME_COMPLETE, '1');
  await markOpenedToday();
}

// ─── Editor onboarding ──────────────────────────────────────────────────────────

const KEY_EDITOR_TIPS_SEEN = 'pp:editor-tips-seen';

export async function hasSeenEditorTips(): Promise<boolean> {
  return (await getItem(KEY_EDITOR_TIPS_SEEN)) === '1';
}

export async function markEditorTipsSeen(): Promise<void> {
  await setItem(KEY_EDITOR_TIPS_SEEN, '1');
}
