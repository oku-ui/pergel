import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { defineCommand } from 'citty'
import { writeFilePergel } from '../utils/writeFilePergel'

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
    const file = join('.config', 'pergel.ts')

    if (!existsSync(file))
      writeFilePergel(file, template)
  },
})
