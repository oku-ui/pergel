import { join } from 'node:path'
import { cpSync, existsSync } from 'node:fs'
import { definePergelModule } from '../../core/definePergel'
import type { RenovateConfig, ResolvedRenovateConfig } from './types'

export default definePergelModule<RenovateConfig, ResolvedRenovateConfig>({
  meta: {
    name: 'renovate',
    version: '0.1.0',
  },
  defaults: {
  },
  async setup({ nuxt }) {
    if (!existsSync(join(nuxt.options.rootDir, 'renovate.json')))
      cpSync(join(nuxt._pergel.pergelModuleRoot, 'templates', 'renovate.json'), join(nuxt.options.rootDir, 'renovate.json'))
  },
})
