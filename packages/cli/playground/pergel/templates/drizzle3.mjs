import { defineDownload } from 'pergel/core'

export default defineDownload({
  branch: 'main',
  file: {
    dir: 'packages/nuxt',
    file: 'package.json',
    output: 'drizzle3.mjs',
  },
})
