import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { useLogger } from '@nuxt/kit'
import { resolve } from 'pathe'
import { consola } from 'consola'
import type { NuxtPergel } from '../../core/types'
import type { ResolvedDrizzleConfig } from './types'

export async function copyMigrationFolder(
  nuxt: NuxtPergel<ResolvedDrizzleConfig>,
) {
  /**
   * Public Assets
   */
  nuxt.hooks.hook('nitro:build:public-assets', (nitroCtx) => {
    try {
      const logger = useLogger('pergel:drizzle')

      const outDir = resolve(nitroCtx.options.output.dir, nuxt._pergel._module.dir.module, 'migrations')

      if (!existsSync(outDir))
        mkdirSync(outDir, { recursive: true })

      const resolvedDrizzleMigrationsPaths = resolve(nuxt._pergel._module.options.migrationsPaths)

      logger.info(`Copying drizzle migrations folder to ${resolvedDrizzleMigrationsPaths}`)

      if (existsSync(resolvedDrizzleMigrationsPaths)) {
        cpSync(resolvedDrizzleMigrationsPaths, outDir, {
          recursive: true,
        })
      }
      else { consola.error(`Drizzle migrations folder not found: ${resolvedDrizzleMigrationsPaths}`) }
    }
    catch (error) {
      consola.error(error)
    }
  })
}
