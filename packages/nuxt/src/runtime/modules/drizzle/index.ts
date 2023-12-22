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

export default definePergelModule<ResolvedDrizzleConfig>({
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
  defaults({ nuxt }) {
    const rootOptions = nuxt._pergel._module.options

    const [driverName, driver] = rootOptions.driver?.split(':') ?? ['postgresjs', 'pg']

    return {
      driver: rootOptions.driver ?? 'postgresjs:pg',
      migrationsPath: resolve(nuxt._pergel._module.moduleDir, rootOptions.migrationsPath ?? 'migrations'),
      schemaPath: resolve(nuxt._pergel._module.moduleDir, rootOptions.schemaPath ?? 'schema'),
      seedPaths: resolve(nuxt._pergel._module.moduleDir, rootOptions.seedPaths ?? 'seeds'),
      mergeSchemas: false,
      _driver: {
        name: driverName ?? 'postgresjs',
        driver: driver ?? 'pg',
      } as any,
      studio: true,
    }
  },
  async setup({ nuxt }) {
    const projectName = nuxt._pergel._module.projectName
    const moduleOptions = nuxt._pergel._module
    const resolver = createResolver(import.meta.url)

    if (!existsSync(moduleOptions.options.schemaPath))
      mkdirSync(moduleOptions.options.schemaPath, { recursive: true })

    if (!existsSync(moduleOptions.options.migrationsPath))
      mkdirSync(moduleOptions.options.migrationsPath, { recursive: true })

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
      moduleOptions.options.schemaPath,
    )

    nuxt.options.nitro.alias ??= {}
    nuxt.options.nitro.alias[`${projectName}/drizzle/schema`] = resolve(
      nuxt.options.rootDir,
      moduleOptions.options.schemaPath,
    )

    addImportsDir(resolver.resolve('./drivers/postgres'))
    addServerImportsDir(resolver.resolve('./drivers/postgres'))

    useNitroImports(nuxt, {
      presets: [
        {
          from: `${nuxt._pergel._module.options.schemaPath}`,
          imports: [
            {
              as: `tables${pascalCase(projectName)}`,
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
     ${camelCase(moduleOptions.options._driver.name ?? 'postgresjs')}() {
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
              activeProject.dev?.cli ?? `pergel orm -s=push -p=${projectName}`,
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

    nuxt._pergel.contents.push({
      moduleName: 'drizzle',
      projectName,
      content: /* ts */`
          function drizzle() {
            return {
              ${returnDriver}
              schema: tables${pascalCase(projectName)},
            }
          }
        `,
      resolve: /* ts */`
          drizzle: drizzle,
        `,
    })
  },

})
