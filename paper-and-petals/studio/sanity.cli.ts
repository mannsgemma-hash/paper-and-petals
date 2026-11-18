import { defineCliConfig } from 'sanity/cli'

// Used by the `sanity` command (dev, deploy). `npm run deploy` publishes the
// Studio to https://paperandpetals.sanity.studio so collections can be edited
// from any browser, iPad included — sign-in is your Sanity account, and only
// members of this project can see or change anything.
// If the hostname is taken, choose another here; redeploy after schema changes.
export default defineCliConfig({
  api: {
    projectId: 'cv53e819',
    dataset: 'production',
  },
  studioHost: 'paperandpetals',
})
