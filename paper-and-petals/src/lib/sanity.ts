import { createClient } from '@sanity/client'

// No token: the app only reads published documents from the public dataset.
// Never add one here — anything bundled into the app can be extracted.
export const sanity = createClient({
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID ?? 'cv53e819',
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})
