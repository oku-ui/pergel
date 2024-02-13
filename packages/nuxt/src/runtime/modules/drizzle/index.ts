import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { addServerImportsDir, createResolver, useLogger } from '@nuxt/kit'
import { camelCase } from 'scule'
import { basename } from 'pathe'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import { globsBuilderWatch } from '../../core/utils/globs'
import { createFolderModule } from '../../core/utils/createFolderModule'
import { writeFilePergel } from '../../core/utils/writeFilePergel'
import { generatorFunctionName } from '../../core/utils/generatorNames'
import type { DrizzleConfig, ResolvedDrizzleConfig } from './types'
import { setupPostgres } from './drivers/postgres'
import { copyMigrationFolder } from './core'

const _logger = useLogger('pergel:drizzle')

export default definePergelModule<DrizzleConfig, ResolvedDrizzleConfig>({
  meta: {
    name: 'drizzle',
    version: '0.1.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson

      options.driver ??= 'postgresjs:pg'
      const data = {
        'drizzle-kit': deps['drizzle-kit'],
        'drizzle-orm': deps['drizzle-orm'],
        '@faker-js/faker': deps['@faker-js/faker'],
        'dotenv': deps.dotenv,
      } as Record<string, string>

      if (options.driver === 'postgresjs:pg')
        data.postgres = deps.postgres

      return data
    },
    devDependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      options.driver ??= 'postgresjs:pg'

      const data = {
      } as Record<string, string>

      if (options.driver === 'postgresjs:pg')
        data.pg = deps.pg

      return data
    },
  },
  defaults({ rootOptions, options, nuxt }) {
    const [driverName, driver] = rootOptions.driver?.split(':') ?? ['postgresjs', 'pg']

    const migrationsPath = join(options.serverDir, rootOptions.migrationsPath ?? 'migrations')
    const schemaPath = join(options.serverDir, rootOptions.schemaPath ?? 'schema')
    const seedPaths = join(options.serverDir, rootOptions.seedPaths ?? 'seeds')

    createFolderModule({
      nuxt,
      serverDir: options.serverDir,
      moduleName: options.moduleName,
      projectName: options.projectName,
    })

    return {
      ...options,
      driver: rootOptions.driver ?? 'postgresjs:pg',
      migrationsPath,
      schemaPath,
      seedPaths,
      mergeSchemas: false,
      dir: {
        schema: basename(schemaPath),
        migrations: basename(migrationsPath),
        seeds: basename(seedPaths),
      },
      _driver: {
        name: driverName ?? 'postgresjs',
        driver: driver ?? 'pg',
      } as any,
      studio: true,
      watch: {
        push: true,
        seed: true,
        drop: true,
      },
      devtoolsStatus: true,
    }
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    // Driver setup
    switch (options._driver.name) {
      case 'postgresjs':
        await setupPostgres(nuxt, options)
        // addImportsDir(resolver.resolve('./drivers/postgres'))
        addServerImportsDir(resolver.resolve('./drivers/postgres'))

        break
    }

    useNitroImports(nuxt, {
      presets: [
        {
          from: 'drizzle-orm',
          imports: ([
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
            'asc',
            'desc',
          ] satisfies Array<keyof typeof import('drizzle-orm')>).map(name => ({
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

    if (!existsSync(`${options.serverDir}/index.ts`)) {
      writeFilePergel(
        `${options.serverDir}/index.ts`,
        /* ts */`
        export { ${generatorFunctionName(options.projectName, 'DrizzleStorage')} } from './storage'
export * as ${generatorFunctionName(options.projectName, 'Tables')} from './schema'
        `,
      )
    }

    const returnDriver = /* ts */`
     ${camelCase(options._driver.name ?? 'postgresjs')}() {
        return {
          connect: connectPostgresJS.bind(ctx),
          client: (getPergelContextModule<'drizzle'>).bind({
            ...ctx,
            moduleName: '${options.moduleName}',
          }),
        }
      },
    `

    // Watch for changes
    nuxt.hook('builder:watch', async (event, path) => {
      const match = globsBuilderWatch(
        nuxt,
        path,
        '.ts',
        'schema',
      )
      if (!match)
        return

      const { projectName, moduleName } = match

      if (projectName) {
        const activeProject = (nuxt._pergel.rootOptions.projects as any)[projectName][moduleName] as DrizzleConfig

        if (!activeProject)
          return

        if (match) {
          if (activeProject.watch?.drop) {
            execSync(
              `pergel module -s=dev:drop -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
            )
            _logger.info(`Drop ${projectName} schema`)
          }

          if (activeProject.watch?.push) {
            execSync(
              `pergel module -s=push -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
            )
            _logger.info(`Pushed ${projectName} schema`)
          }

          if (activeProject.watch?.seed) {
            execSync(
              `pergel module -s=dev:seed -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
            )
            _logger.info(`Seeded ${projectName} schema`)
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
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function drizzle() {
            return {
              ${returnDriver}
              tables: ${camelCase(`${options.projectName}-Tables`)},
            }
          }
        `,
      resolve: /* ts */`
          drizzle: drizzle,
        `,
    })
  },

})
