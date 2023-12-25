import { cpSync, existsSync, lstatSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { useLogger } from '@nuxt/kit'
import { consola } from 'consola'
import type { NuxtPergel } from '../../core/types'

export async function copyMigrationFolder(
  nuxt: NuxtPergel,
) {
  /**
   * Public Assets
   */
  nuxt.hooks.hook('nitro:build:public-assets', (nitroCtx) => {
    try {
      const logger = useLogger('pergel:drizzle')

      for (const [projectName, modules] of Object.entries(nuxt._pergel.activeModules)) {
        for (const [moduleName, _module] of Object.entries(modules)) {
          if (moduleName === 'drizzle') {
            const outDir = resolve(nitroCtx.options.output.dir, 'pergel', projectName, moduleName, 'migrations')
            const folderDir = resolve(nitroCtx.options.rootDir, 'pergel', projectName, moduleName, 'migrations')
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
