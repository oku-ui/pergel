import { basename, join, resolve } from 'node:path'
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { pascalCase } from 'scule'

import { globbySync } from 'globby'
import { isPackageExists } from 'local-pkg'
import consola from 'consola'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { writeFilePergel } from '../../core/utils/writeFilePergel'
import type { GraphQLYogaConfig, ResolvedGraphQLYogaConfig } from './types'

// const _logger = useLogger('pergel:graphql:yoga')

export default definePergelModule<GraphQLYogaConfig, ResolvedGraphQLYogaConfig>({
  meta: {
    name: 'graphqlYoga',
    version: '0.4.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@pergel/graphql': deps['@pergel/graphql'],
      }
    },
    dts: true,
  },
  defaults({ rootOptions, options, nuxt }) {
    const documentDir = rootOptions.documentDir ? join(nuxt._pergel.rootDir, rootOptions.documentDir) : join(options.serverDir, 'documents')

    const schemaDir = rootOptions.schemaDir ? join(nuxt._pergel.rootDir, rootOptions.schemaDir) : join(options.serverDir, 'schemas')

    const clientConfigFile = rootOptions.codegen?.client?.configFilePath ? resolve(nuxt._pergel.rootDir, rootOptions.codegen?.client?.configFilePath) : resolve(options.serverDir, 'codegen/client.ts')

    const serverConfigFile = rootOptions.codegen?.server?.configFilePath ? resolve(nuxt._pergel.rootDir, rootOptions.codegen?.server?.configFilePath) : resolve(options.serverDir, 'codegen/server.ts')

    return {
      ...options,
      documentDir,
      schemaDir,
      codegen: {
        client: {
          extension: '.graphql',
          onlyDevelopment: true,
          configFilePath: clientConfigFile,
          config: undefined,
        },
        server: {
          extension: '.graphql',
          onlyDevelopment: true,
          configFilePath: serverConfigFile,
          config: undefined,
        },
      },
      endpoint: '/api/graphql',
      plugins: {
        playground: {
          endpoint: '/api/graphql',
        },
        voyager: {
          endpoint: '/api/graphql/voyager',
          playgroundEndpoint: '/api/graphql',
        },
        sandbox: {
          endpoint: '/api/graphql/sandbox',
          playgroundEndpoint: '/api/graphql',
        },
      },
      yogaConfig: {
        health: '/api/graphql/health',
        ready: '/api/graphql/ready',
      },
      mergeSchemas: false,
      dir: {
        document: basename(documentDir),
        schema: basename(schemaDir),
      },
      devtoolsStatus: true,
    }
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    mkdirSync(options.serverDir, { recursive: true })

    generateModuleRuntimeConfig<ResolvedGraphQLYogaConfig>(nuxt, options, {
      ...options.yogaConfig,
    }, true, false)

    generateModuleRuntimeConfig<ResolvedGraphQLYogaConfig>(nuxt, options, {
      origin: undefined,
      default: {
        origin: 'http://localhost:3000,http://localhost:3001',
      },
    }, true, true)

    addServerImportsDir(resolver.resolve('./composables/**'))

    addServerImportsDir(join(nuxt.options.buildDir, 'pergel', options.projectName, options.moduleName, 'client'))

    useNitroImports(nuxt, {
      presets: [
        {
          from: 'graphql',
          imports: ['GraphQLError'],
        },
        {
          from: join(nuxt.options.buildDir, 'pergel', options.projectName, options.moduleName, 'client'),
          imports: [
            {
              as: `${options.projectName}${pascalCase(options.moduleName)}Document`,
              name: '*',
            },
          ],
        },
        {
          from: 'graphql-relay',
          imports: ['connectionFromArraySlice'],
        },
        {
          from: 'ts-relay-cursor-paging',
          imports: [
            'offsetForArgs',
            {
              type: true,
              name: 'DefaultConnectionArguments',
            },
          ],
        },
        {
          from: 'dataloader',
          imports: [{
            name: 'default',
            as: 'DataLoader',
          }],
        },
      ],
    })

    if (nuxt._pergel.projects[options.projectName]?.drizzle && nuxt._pergel.projects[options.projectName]?.lucia) {
      if (!existsSync(resolve(options.serverDir, 'index.ts'))) {
        const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'drizzle-lucia', 'root', '**/*')), {
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

      if (!existsSync(resolve(options.serverDir, 'documents'))) {
        mkdirSync(resolve(options.serverDir, 'documents'), {
          recursive: true,
        })

        cpSync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'drizzle-lucia', 'documents')), resolve(options.serverDir, 'documents'), {
          recursive: true,
        })
      }

      if (!existsSync(resolve(nuxt.options.serverDir, 'plugins', 'graphqlv1.ts'))) {
        mkdirSync(resolve(nuxt.options.serverDir, 'plugins'), {
          recursive: true,
        })

        const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'drizzle-lucia', 'plugins', '**/*')), {
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

            writeFilePergel(resolve(nuxt.options.serverDir, 'plugins', fileName), fileData)
          }
        }
      }

      if (!existsSync(resolve(options.serverDir, 'schemas'))) {
        mkdirSync(resolve(options.serverDir, 'schemas'), {
          recursive: true,
        })

        cpSync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'drizzle-lucia', 'schemas')), resolve(options.serverDir, 'schemas'), {
          recursive: true,
        })
      }
    }
    else {
      if (!existsSync(resolve(options.serverDir, 'index.ts'))) {
        const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'empty', 'root', '**/*')), {
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

        if (!existsSync(resolve(options.serverDir, 'documents'))) {
          mkdirSync(resolve(options.serverDir, 'documents'), {
            recursive: true,
          })

          cpSync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'empty', 'documents')), resolve(options.serverDir, 'documents'), {
            recursive: true,
          })
        }

        if (!existsSync(resolve(options.serverDir, 'schemas'))) {
          mkdirSync(resolve(options.serverDir, 'schemas'), {
            recursive: true,
          })

          cpSync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'empty', 'schemas')), resolve(options.serverDir, 'schemas'), {
            recursive: true,
          })
        }
      }
    }

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function graphqlYoga() {
            return {
              nitro: () => {
                return {
                  use: (definePergelGraphQLYogaPlugin<GraphqlYogaContext>).bind(ctx)
                }
              },
            }
          }
        `,
      resolve: /* ts */`
            graphqlYoga: graphqlYoga,
        `,
    })

    if (isPackageExists('@pergel/graphql') || existsSync(join(options.serverDir, 'index.ts'))) {
      const data = await import('./utils/generateGraphqlTemplate').catch(() => {
        consola.error('Please `pergel install` run')
        return undefined
      })

      if (data) {
        data.generateGraphQLTemplate({
          nuxt,
          options,
        })
      }
    }
  },
})
