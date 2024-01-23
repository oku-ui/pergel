import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { addModuleDTS } from '../../core/utils/addModuleDTS'
import { useNitroImports } from '../../core/utils/useImports'
import { createFolderModule } from '../../core/utils/createFolderModule'
import type { LuciaModuleOptions, ResolvedLuciaModuleOptions } from './types'
import { setupDrizzle } from './drizzle'

export default definePergelModule<LuciaModuleOptions, ResolvedLuciaModuleOptions>({
  meta: {
    name: 'lucia',
    version: '0.0.1',
    dependencies(options) {
      const [driver, db] = options.driver.split(':')
      const defaultData = {
        lucia: '^3.0.0-beta.14',
        oslo: '^0.25.1',
      }

      switch (driver) {
        case 'drizzle': {
          switch (db) {
            case 'postgre': {
              return {
                ...defaultData,
                '@lucia-auth/adapter-drizzle': '^1.0.0-beta.6',
                '@lucia-auth/adapter-postgresql': '^3.0.0-beta.9',
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
    }
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    const [driver, db] = options.driver.split(':')

    const _setupDrizzle = {
      use: '',
    }

    if (driver === 'drizzle') {
      const { driver } = setupDrizzle(db, resolver)
      _setupDrizzle.use = driver

      if (!existsSync(`${options.serverDir}/index.ts`)) {
        writeFileSync(
          `${options.serverDir}/index.ts`,
          /* ts */`
import { session, user } from '#${options.projectName}/drizzle/schema'

const connect = await ${options.projectNameCamelCaseWithPergel}().drizzle().postgresjs().connect({})

export const auth = ${options.projectNameCamelCaseWithPergel}().lucia().use({
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
import { auth } from '#${options.projectName}/lucia'

export default ${options.projectNameCamelCaseWithPergel}().lucia().definePergelNitroMiddleware({
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
        {
          from: `${options.serverDir}`,
          imports: [
            {
              as: `${options.projectNameCamelCase}Auth`,
              name: 'auth',
            },
          ],
        },
      ],
    })

    addModuleDTS({
      pergelFolderTemplate: /* ts */`
import type { Session, User } from '#${options.projectName}/drizzle/schema'
import type { auth } from '#${options.projectName}/lucia'

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
      moduleName: options.moduleName,
      projectName: options.projectName,
      interfaceNames: [],
      dir: options.serverDir,
    })

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
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
