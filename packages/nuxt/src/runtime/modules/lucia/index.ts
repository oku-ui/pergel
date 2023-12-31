import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { addModuleDTS } from '../../core/utils/addModuleDTS'
import { useNitroImports } from '../../core/utils/useImports'
import type { LuciaModuleOptions, ResolvedLuciaModuleOptions } from './types'
import { setupDrizzle } from './drizzle'

export default definePergelModule<LuciaModuleOptions, ResolvedLuciaModuleOptions>({
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
                '@lucia-auth/adapter-drizzle': '^1.0.0-beta.4',
                '@lucia-auth/adapter-postgresql': '^3.0.0-beta.8',
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
  defaults({ rootOptions }) {
    // const [driver, db] = rootOptions.driver.split(':')

    return {
      driver: rootOptions.driver ?? 'drizzle:postgre',
    }
  },
  async setup({ nuxt, moduleOptions, options }) {
    const resolver = createResolver(import.meta.url)

    const [driver, db] = options.driver.split(':')

    const _setupDrizzle = {
      use: '',
    }

    if (driver === 'drizzle') {
      const { driver } = setupDrizzle(db, resolver)
      _setupDrizzle.use = driver

      if (!existsSync(`${moduleOptions.moduleDir}/index.ts`)) {
        const projectName = `pergel${moduleOptions.firstLetterProjectName}`
        writeFileSync(
          `${moduleOptions.moduleDir}/index.ts`,
          /* ts */`
import { session, user } from '#pergel/${moduleOptions.projectName}/drizzle/schema'

const connect = await ${projectName}().drizzle().postgresjs().connect({})

export const auth = ${projectName}().lucia().use({
  db: connect,
  options: { },
  session,
  user,
})
        `,
        )
      }
    }

    if (!existsSync(join(nuxt.options.serverDir, 'middleware', 'auth.ts'))) {
      mkdirSync(join(nuxt.options.serverDir, 'middleware'), { recursive: true })

      writeFileSync(
        join(nuxt.options.serverDir, 'middleware', 'auth.ts'),
        /* ts */`
import { auth } from '#pergel/${moduleOptions.projectName}/lucia'

export default pergel${moduleOptions.firstLetterProjectName}().lucia().definePergelNitroMiddleware({
  lucia: auth,
})
        `,
      )
    }

    useNitroImports(nuxt, {
      presets: [
        {
          from: 'oslo/password',
          imports: [
            'Argon2id',
            'Bcrypt',
            'Scrypt',
          ],
        },
        {
          from: resolver.resolve('server/middleware'),
          imports: [
            'definePergelNitroMiddleware',
          ],
        },
      ],
    })

    addModuleDTS({
      pergelFolderTemplate: /* ts */`
import type { Session, User } from '#pergel/${moduleOptions.projectName}/drizzle/schema'
import type { auth } from '#pergel/${moduleOptions.projectName}/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth
  }
  interface DatabaseUserAttributes extends Omit<User, 'id'> {}

  interface DatabaseSessionAttributes {
  }
}

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
  }
}
      `,
      nuxt,
      moduleName: moduleOptions.moduleName,
      projectName: moduleOptions.projectName,
      interfaceNames: [],
      moduleOptions,
    })

    nuxt._pergel.contents.push({
      moduleName: moduleOptions.moduleName,
      projectName: moduleOptions.projectName,
      content: /* ts */`
          function lucia() {
            return {
              use: ${_setupDrizzle.use},
              definePergelNitroMiddleware: definePergelNitroMiddleware,
            }
          }
        `,
      resolve: /* ts */`
            lucia: lucia,
        `,
    })
  },
})
