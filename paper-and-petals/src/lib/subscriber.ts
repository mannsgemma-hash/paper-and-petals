import { supabase } from './supabase'
import { setSubscriberInfo } from './revenuecat'

export interface SubscriberInput {
  name: string
  email?: string
  /** True only if the person ticked the marketing-consent box. */
  marketingConsent: boolean
}

/**
 * Records a new sign-up for the mailing list / win-back audience.
 *
 * RevenueCat is the source of truth (it's always live and is what campaign
 * tools read), so we always set the profile attributes there. Supabase gives
 * you a durable list you own, but it's written best-effort: a paused or
 * misconfigured project must never block someone from entering the app.
 *
 * Requires a `subscribers` table in Supabase (see the SQL in the PR notes) with
 * a unique `email`; without it the Supabase half simply no-ops.
 */
export async function captureSubscriber(input: SubscriberInput): Promise<void> {
  const name = input.name.trim()
  const email = input.email?.trim().toLowerCase() || undefined

  setSubscriberInfo({ email, name: name || undefined, marketingConsent: input.marketingConsent })

  if (!email) return
  try {
    await supabase.from('subscribers').upsert(
      {
        email,
        name: name || null,
        marketing_consent: input.marketingConsent,
        source: 'welcome',
      },
      { onConflict: 'email', ignoreDuplicates: true },
    )
  } catch {
    // Best-effort: never surface a storage error during onboarding.
  }
}
