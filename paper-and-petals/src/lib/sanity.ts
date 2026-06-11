import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID ?? 'cv53e819',
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN,
})
