import { setSubscriberInfo } from './revenuecat'

export interface SubscriberInput {
  name: string
  email?: string
  /** True only if the person ticked the marketing-consent box. */
  marketingConsent: boolean
}

/**
 * Records a new sign-up for the mailing list / win-back audience on the
 * person's RevenueCat profile — the one place this is kept. Export from
 * RevenueCat (filtered to marketing_consent = true) before any mailing.
 */
export function captureSubscriber(input: SubscriberInput): void {
  const name = input.name.trim()
  const email = input.email?.trim().toLowerCase() || undefined
  setSubscriberInfo({ email, name: name || undefined, marketingConsent: input.marketingConsent })
}
