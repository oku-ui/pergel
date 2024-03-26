import { relative, resolve, join } from 'node:path'
import { execSync } from 'node:child_process'
import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { camelCase } from 'scule'
import { basename } from 'pathe'
import defu from 'defu'
import consola from 'consola'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import { globsBuilderWatch } from '../../core/utils/globs'
import { createFolderModule } from '../../core/utils/createFolderModule'
import { generateModuleRuntimeConfig, generateModuleRuntimeConfigEnv } from '../../core/utils/moduleRuntimeConfig'
import type { DrizzleConfig, DrizzleRuntimeConfig, ResolvedDrizzleConfig } from './types'
import { setupPostgres } from './drivers/postgres'
import { copyMigrationFolder } from './core'

const logger = consola.create({}).withTag('drizzle')

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
      devtoolsStatus: true,
    }
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    const envData = generateModuleRuntimeConfig<DrizzleRuntimeConfig>(nuxt, options, {
      drop: 'process', // Drop database before migration
      seed: 'process', // Seed database after migration
      migrate: 'process', // Migrate database
      push: 'process', // Push database after migration
      mode: 'process', // Development mode || 'production'
    }, true)

    generateModuleRuntimeConfigEnv(nuxt, options, {
      drop: true, // Drop database before migration
      push: true, // Push database after migration
      seed: true, // Seed database after migration
      migrate: true, // Migrate database
      mode: 'dev', // Development mode || 'production'
      default: {
        drop: true, // Drop database before migration
        push: true, // Push database after migration
        seed: true, // Seed database after migration
        migrate: true, // Migrate database
        mode: 'dev', // Development mode || 'production'
      },
    })

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

    copyMigrationFolder(nuxt, options)

    if (nuxt.options.dev) {
    // Watch for changes
      nuxt.hook('builder:watch', async (event, path) => {
        path = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, path))
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

          const config = defu({
            drop: activeProject.watch?.drop ?? envData.runtimeConfig?.drop,
            push: activeProject.watch?.push ?? envData.runtimeConfig?.push,
            seed: activeProject.watch?.seed ?? envData.runtimeConfig?.seed,
            mode: envData.runtimeConfig?.mode ?? 'dev',
          }, {
            drop: true,
            push: true,
            seed: true,
            ssl: true,
            mode: 'dev',
          })

          if (config.mode !== 'dev') {
            consola.info('Drizzle, skipping drop, push and seed')
            return
          }

          if (match && config.mode === 'dev') {
            if (config.drop) {
              execSync(
              `pergel module -s=dev:drop -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
              )
              logger.info(`Drop ${projectName} schema`)
            }

            if (config.push) {
              execSync(
              `pergel module -s=push -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
              )
              logger.info(`Pushed ${projectName} schema`)
            }

            if (config.seed) {
              execSync(
              `pergel module -s=dev:seed -p=${projectName} -m=${moduleName}`,
              {
                stdio: 'inherit',
                cwd: nuxt.options.rootDir,
              },
              )
              logger.info(`Seeded ${projectName} schema`)
            }
          }
        }
      })
    }

    // Auto import
    switch (options._driver.name) {
      case 'postgresjs':
        useNitroImports(nuxt, {
          presets: [
            {
              from: 'postgres',
              imports: [
                'PostgresError',
              ] satisfies Array<keyof typeof import('postgres')>,
            },
          ],
        })
        break
    }

    const returnDriver = /* ts */`
     ${camelCase(options._driver.name ?? 'postgresjs')}() {
        return {
          connect: postgresJSClient.bind(ctx),
          context: (getPergelContextModule<'drizzle'>).bind({
            ...ctx,
            moduleName: '${options.moduleName}',
          }),
        }
      },
    `

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
