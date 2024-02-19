import { existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { createResolver } from '@nuxt/kit'
import { globbySync } from 'globby'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import { createFolderModule } from '../../core/utils/createFolderModule'
import { writeFilePergel } from '../../core/utils/writeFilePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { LuciaModuleOptions, LuciaRuntimeConfig, ResolvedLuciaModuleOptions } from './types'
import { setupDrizzle } from './drizzle'
import { oauthLists } from './arcticLists'

export default definePergelModule<LuciaModuleOptions, ResolvedLuciaModuleOptions>({
  meta: {
    name: 'lucia',
    version: '0.3.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      const [driver, db] = options.driver.split(':')
      const defaultData = {
        'lucia': deps.lucia,
        'oslo': deps.oslo,
        '@lucia-auth/oauth': deps['@lucia-auth/oauth'],
        'arctic': deps.arctic,
      }

      switch (driver) {
        case 'drizzle': {
          switch (db) {
            case 'postgre': {
              return {
                ...defaultData,
                '@lucia-auth/adapter-drizzle': deps['@lucia-auth/adapter-drizzle'],
                '@lucia-auth/adapter-postgresql': deps['@lucia-auth/adapter-postgresql'],
              }
            }
            default: {
              throw new Error('Unsupported driver')
            }
          }
        }
        default: {
          throw new Error('Unsupported driver')
        }
      }
    },

    waitModule(options) {
      const [driver, _db] = options.driver.split(':')

      if (driver === 'drizzle')
        return ['drizzle']

      return undefined
    },
    dts: true,
  },
  defaults({ nuxt, rootOptions, options }) {
    createFolderModule({
      nuxt,
      serverDir: options.serverDir,
      moduleName: options.moduleName,
      projectName: options.projectName,
    })

    return {
      ...options,
      driver: rootOptions.driver ?? 'drizzle:postgre',
      oauth: rootOptions.oauth ?? ['github'],
    }
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    const [driver, db] = options.driver.split(':')

    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.exclude ??= []
    nuxt.options.vite.optimizeDeps.exclude.push('oslo')

    const _setupDrizzle = {
      use: '',
    }

    const reducedOAuthConfig = options.oauth.reduce((acc, provider) => {
      (acc as any)[provider] = oauthLists[provider]
      return acc
    }, {}) as LuciaRuntimeConfig

    generateModuleRuntimeConfig<LuciaRuntimeConfig>(nuxt, options, {
      ...reducedOAuthConfig,
    })

    if (driver === 'drizzle') {
      const { driver } = setupDrizzle(db, resolver)
      _setupDrizzle.use = driver

      if (!existsSync(resolve(options.serverDir, 'index.ts'))) {
        const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, '**/*')), {
          onlyFiles: true,
        })

        for (const file of files) {
          const readFile = await nuxt._pergel.jitiDyanmicImport(file)
          if (readFile) {
            const fileData = readFile({
              projectName: options.projectName,
              nuxt,
            })
            const fileName = basename(file)

            writeFilePergel(resolve(options.serverDir, fileName), fileData)
          }
        }
      }
    }

    useNitroImports(nuxt, {
      presets: [
        {
          from: 'oslo/password',
          imports: [
            'Argon2id',
            'Bcrypt',
            'Scrypt',
          ] as Array<keyof typeof import('oslo/password')>,
        },
        {
          from: resolver.resolve('server/middleware'),
          imports: [
            'onRequestLucia',
          ],
        },
      ],
    })

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function lucia() {
            return {
              use: ${_setupDrizzle.use},
              onRequestLucia: onRequestLucia,
            }
          }
        `,
      resolve: /* ts */`
            lucia: lucia,
        `,
    })
  },
})
