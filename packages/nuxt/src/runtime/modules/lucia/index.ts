import { createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import type { LuciaModuleOptions, ResolvedLuciaModuleOptions } from './types'
import { setupDrizzle } from './drizzle'

export default definePergelModule<ResolvedLuciaModuleOptions>({
  meta: {
    name: 'lucia',
    version: '0.0.1',
    dependencies(options) {
      const [driver, db] = options.driver.split(':')
      const defaultData = {
        lucia: '^3.0.0-beta.13',
        oslo: '^0.25.1',
      }

      switch (driver) {
        case 'drizzle': {
          switch (db) {
            case 'postgre': {
              return {
                ...defaultData,
                '@lucia-auth/adapter-drizzle': '1.0.0-beta.0',
                '@lucia-auth/adapter-postgresql': '3.0.0-beta.8',
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
      const [driver, db] = options.driver.split(':')

      if (driver === 'drizzle')
        return 'drizzle'

      return []
    },
  },
  defaults(options) {
    const [driver, db] = options.nuxt._pergel._module.options.driver.split(':')

    return {
      driver: 'drizzle:postgre',
      rootOptions: options as unknown as LuciaModuleOptions,
    }
  },
  async setup({ nuxt }) {
    const resolver = createResolver(import.meta.url)
    const projectName = nuxt._pergel._module.projectName
    const moduleName = nuxt._pergel._module.moduleName

    const [driver, db] = nuxt._pergel._module.options.driver.split(':')

    if (driver === 'drizzle')
      setupDrizzle(db, resolver)

    nuxt._pergel.contents.push({
      moduleName,
      projectName,
      content: /* ts */`
          function lucia() {
            return {
              use: useNitroJson2CSV,
            }
          }
        `,
      resolve: /* ts */`
            lucia: lucia,
        `,
    })
  },
})
