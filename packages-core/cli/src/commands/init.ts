import { writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'

const template = `import { definePergel } from 'pergel'

export default definePergel({
  
})
`

export default defineCommand({
  meta: {
    name: 'Pergel Upgrade',
    description: 'Upgrade Pergel CLI',
    version: '0.0.1',
  },
  async run() {
    writeFileSync('pergel.config.ts', template)
  },
})
