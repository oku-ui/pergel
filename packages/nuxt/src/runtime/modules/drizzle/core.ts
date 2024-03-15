import { cpSync, existsSync, lstatSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { useLogger } from '@nuxt/kit'
import { consola } from 'consola'
import type { NuxtPergel } from '../../core/types/nuxtModule'
import type { ResolvedDrizzleConfig } from './types'

export async function copyMigrationFolder(
  nuxt: NuxtPergel,
  options: ResolvedDrizzleConfig,
) {
  /**
   * Public Assets
   */
  nuxt.hooks.hook('nitro:build:public-assets', (nitroCtx) => {
    try {
      const logger = useLogger('pergel:drizzle')

      for (const [projectName, modules] of Object.entries(nuxt._pergel)) {
        for (const [moduleName, _module] of Object.entries(modules)) {
          if (moduleName === 'drizzle') {
            const outDir = resolve(nitroCtx.options.output.dir, 'pergel', projectName, moduleName, 'migrations')
            const folderDir = resolve(join(options.serverDir, 'migrations'))
            // check folder in files > 0
            const folderSize = lstatSync(folderDir).size

            if (folderSize > 100) {
              if (!existsSync(outDir))
                mkdirSync(outDir, { recursive: true })
              if (!existsSync(outDir))
                mkdirSync(outDir, { recursive: true })

              logger.info(`Copying drizzle migrations folder to ${folderDir}`)

              if (existsSync(folderDir)) {
                cpSync(folderDir, outDir, {
                  recursive: true,
                })
              }
              else {
                consola.error(`Drizzle migrations folder not found: ${folderDir}`)
              }
            }
          }
        }
      }
    }
    catch (error) {
      consola.error(error)
    }
  })
}
