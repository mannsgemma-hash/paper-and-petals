import { createClient } from '@supabase/supabase-js'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''

function isValidHttpUrl(u: string): boolean {
  try {
    const parsed = new URL(u)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * True only when both env vars were injected into the build.
 *
 * `createClient` throws *synchronously* on an empty or malformed URL/key. The
 * editor is the first screen to import this module, so if the EAS build is
 * missing EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY (a common gotcha — present in a
 * local .env but not injected at build time), that throw would crash the app the
 * moment a journal opens. To stay crash-proof we hand createClient a valid
 * placeholder when unconfigured; callers gate real network calls on this flag so
 * they simply run offline instead of hammering a dead host.
 */
export const supabaseConfigured = isValidHttpUrl(url) && key.length > 0

const safeUrl = supabaseConfigured ? url : 'https://placeholder.supabase.co'
const safeKey = supabaseConfigured ? key : 'placeholder-anon-key'

export const supabase = createClient(safeUrl, safeKey)
