import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { addImportsDir, addServerImportsDir, createResolver, useLogger } from '@nuxt/kit'
import { camelCase, pascalCase } from 'scule'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import { globsBuilderWatch } from '../../core/utils/globs'
import type { DrizzleConfig, ResolvedDrizzleConfig } from './types'
import { setupPostgres } from './drivers/postgres'
import { copyMigrationFolder } from './core'

const _logger = useLogger('pergel:drizzle')

export default definePergelModule<DrizzleConfig, ResolvedDrizzleConfig>({
  meta: {
    name: 'drizzle',
    version: '0.0.1',
    dependencies(options) {
      options.driver ??= 'postgresjs:pg'
      const data = {
        'drizzle-kit': '^0.20.6',
        'drizzle-orm': '^0.29.1',
        '@faker-js/faker': '^8.3.1',
        'dotenv': '^16.3.1',
      } as Record<string, string>

      if (options.driver === 'postgresjs:pg')
        data.postgres = '^3.4.3'

      return data
    },
    devDependencies(options) {
      options.driver ??= 'postgresjs:pg'

      const data = {
      } as Record<string, string>

      if (options.driver === 'postgresjs:pg')
        data.pg = '^8.11.0'

      return data
    },
  },
  defaults({ rootOptions, moduleOptions }) {
    const [driverName, driver] = rootOptions.driver?.split(':') ?? ['postgresjs', 'pg']

    return {
      driver: rootOptions.driver ?? 'postgresjs:pg',
      migrationsPath: resolve(moduleOptions.moduleDir, rootOptions.migrationsPath ?? 'migrations'),
      schemaPath: resolve(moduleOptions.moduleDir, rootOptions.schemaPath ?? 'schema'),
      seedPaths: resolve(moduleOptions.moduleDir, rootOptions.seedPaths ?? 'seeds'),
      mergeSchemas: false,
      dir: {
        schema: rootOptions.schemaPath ?? 'schema',
        migrations: rootOptions.migrationsPath ?? 'migrations',
      },
      _driver: {
        name: driverName ?? 'postgresjs',
        driver: driver ?? 'pg',
      } as any,
      studio: true,
      openFolder: true,
    }
  },
  async setup({ nuxt, options, moduleOptions }) {
    const resolver = createResolver(import.meta.url)

    if (!existsSync(options.schemaPath))
      mkdirSync(options.schemaPath, { recursive: true })

    if (!existsSync(options.migrationsPath))
      mkdirSync(options.migrationsPath, { recursive: true })

    if (!existsSync(options.seedPaths))
      mkdirSync(options.seedPaths, { recursive: true })

    // Driver setup
    switch (options._driver.name) {
      case 'postgresjs':
        await setupPostgres(nuxt, options, moduleOptions)
        break
    }

    nuxt.options.alias[`${moduleOptions.projectName}/drizzle/schema`] = resolve(
      nuxt.options.rootDir,
      options.schemaPath,
    )

    nuxt.options.nitro.alias ??= {}
    nuxt.options.nitro.alias[`${moduleOptions.projectName}/drizzle/schema`] = resolve(
      nuxt.options.rootDir,
      options.schemaPath,
    )

    addImportsDir(resolver.resolve('./drivers/postgres'))
    addServerImportsDir(resolver.resolve('./drivers/postgres'))

    useNitroImports(nuxt, {
      presets: [
        {
          from: `${options.schemaPath}`,
          imports: [
            {
              as: `tables${pascalCase(moduleOptions.projectName)}`,
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
            as: options.autoImportPrefix?.filters
              ? `${options.autoImportPrefix?.filters}${name}`
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
     ${camelCase(options._driver.name ?? 'postgresjs')}() {
        return {
          connect: connectPostgresJS.bind(ctx),
        }
      },
    `

    nuxt.hook('builder:watch', async (event, path) => {
      // TODO: add support module name
      const { match, projectName, moduleName } = globsBuilderWatch(
        nuxt,
        path,
        'drizzle',
        '.ts',
      )

      if (projectName) {
        const activeProject = nuxt._pergel.rootOptions.projects[projectName][moduleName] as DrizzleConfig

        if (!activeProject)
          return

        if (match) {
          if (activeProject.dev?.cli !== false) {
            execSync(
              activeProject.dev?.cli ?? `pergel module -s=push -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
            )
            _logger.info(`Pushed ${projectName} schema`)
          }
        }
      }
    })

    // Auto import
    switch (options._driver.name) {
      case 'postgresjs':
        // TODO: bug https://github.com/unjs/mlly/issues/209
        // useNitroImports(nuxt, {
        //   presets: [
        //     {
        //       from: 'postgres',
        //       imports: [
        //         'PostgresError',
        //       ],
        //     },
        //   ],
        // })
        break
    }

    nuxt._pergel.contents.push({
      moduleName: moduleOptions.moduleName,
      projectName: moduleOptions.projectName,
      content: /* ts */`
          function drizzle() {
            return {
              ${returnDriver}
              schema: tables${pascalCase(moduleOptions.projectName)},
            }
          }
        `,
      resolve: /* ts */`
          drizzle: drizzle,
        `,
    })
  },

})
