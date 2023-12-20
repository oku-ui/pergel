import { existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { addImportsDir, addServerImportsDir, addTemplate, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import type { ResolvedDrizzleConfig } from './types'
import { setupPostgres } from './drivers/postgres'
import { copyMigrationFolder } from './core'

export default definePergelModule<ResolvedDrizzleConfig>({
  meta: {
    name: 'drizzle',
    version: '0.0.1',
    dependencies: {
      'drizzle-kit': '^0.20.4',
      'drizzle-orm': '^0.29.0',
      'postgres': '^3.4.3',
    },
  },
  defaults({ nuxt }) {
    const rootOptions = nuxt._pergel._module.options

    const [driverName, driver] = rootOptions.driver?.split(':') ?? ['postgresjs', 'pg']

    return {
      driver: rootOptions.driver ?? 'postgresjs:pg',
      migrationsPaths: resolve(nuxt._pergel._module.moduleDir, rootOptions.migrationsPaths ?? 'migrations'),
      schemaPaths: resolve(nuxt._pergel._module.moduleDir, rootOptions.schemaPaths ?? 'schema'),
      seedPaths: resolve(nuxt._pergel._module.moduleDir, rootOptions.seedPaths ?? 'seeds'),
      mergeSchemas: false,
      _driver: {
        name: driverName ?? 'postgresjs',
        driver: driver ?? 'pg',
      } as any,
    }
  },
  async setup({ nuxt }) {
    const projectName = nuxt._pergel._module.projectName
    const moduleOptions = nuxt._pergel._module
    const resolver = createResolver(import.meta.url)

    if (!existsSync(moduleOptions.options.schemaPaths))
      mkdirSync(moduleOptions.options.schemaPaths, { recursive: true })

    if (!existsSync(moduleOptions.options.migrationsPaths))
      mkdirSync(moduleOptions.options.migrationsPaths, { recursive: true })

    if (!existsSync(moduleOptions.options.seedPaths))
      mkdirSync(moduleOptions.options.seedPaths, { recursive: true })

    // Driver setup
    switch (moduleOptions.options._driver.name) {
      case 'postgresjs':
        await setupPostgres(nuxt)
        break
    }

    nuxt.options.alias[`${projectName}/drizzle/schema`] = resolve(
      nuxt.options.rootDir,
      moduleOptions.options.schemaPaths,
    )

    nuxt.options.nitro.alias ??= {}
    nuxt.options.nitro.alias[`${projectName}/drizzle/schema`] = resolve(
      nuxt.options.rootDir,
      moduleOptions.options.schemaPaths,
    )

    const template = addTemplate({
      filename: join(nuxt._pergel._module.dir.module, 'index.ts'),
      write: true,
      getContents: () => /* ts */`// Pergel Drizzle Schema - oku-ui.com
       export * from '${join(moduleOptions.options.schemaPaths)}'
    `,
    })

    addImportsDir(resolver.resolve('./drivers/postgres'))
    addServerImportsDir(resolver.resolve('./drivers/postgres'))

    useNitroImports(nuxt, {
      presets: [
        {
          from: template.dst,
          imports: [
            {
              as: `tables${projectName}`,
              name: '*',
            },
          ],
        },
        {
          from: 'drizzle-orm',
          imports: [
            'eq',
            'ne',
            'gt',
            'gte',
            'lt',
            'lte',
            'isNull',
            'isNotNull',
            'inArray',
            'notInArray',
            'exists',
            'notExists',
            'between',
            'notBetween',
            'like',
            'ilike',
            'notLike',
            'not',
            'and',
            'or',
            'arrayContains',
            'arrayContained',
            'arrayOverlaps',
            'sql',
          ].map(name => ({
            name,
            as: moduleOptions.options.autoImportPrefix?.filters
              ? `${moduleOptions.options.autoImportPrefix?.filters}${name}`
              : name,
            priority: 1,
            meta: {
              description: `Drizzle ORM ${name}`,
              docsUrl: `https://orm.drizzle.team/docs/operators#${name}`,
            },
          })),
        },
      ],
    })

    copyMigrationFolder(nuxt)

    const returnDriver = /* ts */`
      ${moduleOptions.options._driver.name ?? 'postgresjs'}() {
        return {
          connect: connect${moduleOptions.options._driver.name ?? 'postgresjs'},
        }
      },
    `

    nuxt._pergel.contents.push({
      moduleName: 'drizzle',
      projectName,
      content: /* ts */`
          function drizzle() {
            return {
              ${returnDriver}
              schema: tables${projectName},
            }
          }
        `,
      resolve: /* ts */`
          drizzle: drizzle,
        `,
    })
  },

})
