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
    version: '0.2.0',
    dependencies(options) {
      const [driver, db] = options.driver.split(':')
      const defaultData = {
        lucia: '^3.0.1',
        oslo: '^1.0.3',
      }

      switch (driver) {
        case 'drizzle': {
          switch (db) {
            case 'postgre': {
              return {
                ...defaultData,
                '@lucia-auth/adapter-drizzle': '^1.0.0',
                '@lucia-auth/adapter-postgresql': '^3.0.0',
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
import { session, user } from '#${options.projectName}/server/drizzle/schema'

const connect = await ${options.projectNameCamelCaseWithPergel}()
.drizzle()
.postgresjs()
.connect({
  event: false
})

export const ${options.generatorFunctionName('Auth')} = ${options.projectNameCamelCaseWithPergel}()
.lucia()
.use({
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
        /* ts */`export default ${options.projectNameCamelCaseWithPergel}().lucia().definePergelNitroMiddleware({
  lucia: ${options.generatorFunctionName('Auth')},
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
          ] as Array<keyof typeof import('oslo/password')>,
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
import type { Session, User } from '#${options.projectName}/server/drizzle/schema'
import type { ${options.generatorFunctionName('Auth')} } from '#${options.projectName}/server/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof ${options.generatorFunctionName('Auth')}
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
