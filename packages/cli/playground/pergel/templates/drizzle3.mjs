import { defineDownload } from 'pergel/core'

export default defineDownload({
  branch: 'main',
  file: {
    dir: 'packages/nuxt',
    path: [{
      fileName: 'package.json',
      outputFileName: 'package2.json',
    }],
  },
})
