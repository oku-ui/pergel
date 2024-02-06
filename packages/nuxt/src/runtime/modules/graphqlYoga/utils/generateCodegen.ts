import { join, resolve } from 'node:path'
import { addTemplate } from '@nuxt/kit'
import consola from 'consola'
import { buildTime } from '../utils'
import { useNitroImports, useNuxtImports } from '../../../core/utils/useImports'
import type { ResolvedGraphQLYogaConfig } from '../types'
import type { NuxtPergel } from '../../../core/types/nuxtModule'
import { addTemplatePergel, updateTemplatePergel } from '../../../core/utils/addTemplatePergel'
import { useCodegen } from './codegen'

export async function loadGraphQLFiles(
  {
    rootDir,
    schemaDir,
    documentDir,
  }:
  {
    rootDir: string
    schemaDir: string
    documentDir: string
  },
) {
  const { loadSchemaFiles, loadDocumentsFiles, writeSchema } = useCodegen()

  const schema = await loadSchemaFiles(schemaDir, {
    cwd: rootDir,
    // TODO: Support user config
  })

  const loadDocument = await loadDocumentsFiles(documentDir, {
    cwd: rootDir,
  })

  const printSchema = await writeSchema(schema!, resolve(rootDir, 'schema.graphql'))

  return {
    schema,
    loadDocument,
    printSchema,
  }
}

export function useGenerateCodegen({
  nuxt,
  options,
  moduleDTS,

}: {
  nuxt: NuxtPergel
  options: ResolvedGraphQLYogaConfig
  moduleDTS: {
    name: string
    path: string
  }
}) {
  const { moduleName, documentDir, schemaDir, projectNameCamelCase, generatorFunctionName } = options
  const clientCombinedName = join(projectNameCamelCase, moduleName)
  const serverCombinedName = `${`${moduleName}-${projectNameCamelCase}`}`

  const dotNuxtPaths = {
    clientTypes: join(clientCombinedName, 'client.ts'),
    serverFile: join(serverCombinedName, 'generated', 'server.ts'),
    schemaFile: join(serverCombinedName, 'generated', 'schema.mjs'),
    schemaFileTS: join(serverCombinedName, 'generated', 'schema.ts'),
    urqlIntrospectionFile: join(clientCombinedName, 'urqlIntrospection.ts'),
  }

  // // GraphQL Schema
  const printSchemaFile = addTemplatePergel({
    filename: dotNuxtPaths.schemaFile,
    write: true,
    where: 'server',
    async getContents() {
      const { printSchema } = await loadGraphQLFiles({
        rootDir: nuxt._pergel.serverDir,
        documentDir,
        schemaDir,
      })
      return `export const schema = \`${printSchema}\``
    },
  })

  nuxt.options.alias[`#${clientCombinedName}/schema`] = printSchemaFile.dir
  nuxt.options.nitro.alias ??= {}
  nuxt.options.nitro.alias[`#${clientCombinedName}/schema`] = printSchemaFile.dir

  //   // Create types in build dir
  const { dst: typeDecSchema } = addTemplate({
    filename: join('pergel', dotNuxtPaths.schemaFileTS),
    write: true,
    getContents() {
      return `declare module '#${clientCombinedName}/schema' {
    const schema: string
  }`
    },
  })

  // // Add types to `nuxt.d.ts`
  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: typeDecSchema })
  })

  // GraphQL Server
  const serverTypes = addTemplatePergel({
    filename: dotNuxtPaths.serverFile,
    write: true,
    where: 'server',
    async getContents() {
      const { finish } = buildTime()

      const { schema } = await loadGraphQLFiles({
        rootDir: nuxt._pergel.serverDir,
        documentDir,
        schemaDir,
      })

      const { server } = useCodegen()

      if (!schema) {
        consola.warn('Schema not found')
        return ''
      }

      try {
        const type = await server.typescriptResolvers(schema, {
          useTypeImports: true,
          contextType: `${moduleDTS.path}#${moduleDTS.name}`,
          ...typeof options.codegen.server.config === 'function'
            ? options.codegen.server.config({
              dir: {
                module: options.serverDir,
                server: nuxt.options.serverDir,
                nuxtModule: options.buildDir,
              },
            })
            : {},
        })
        consola.info(`Type server for ${projectNameCamelCase} in ${finish().duration}ms`)
        return type
      }
      catch (error) {
        consola.warn('error', error)
        return ''
      }
    },
  })

  nuxt.options.alias[`#${clientCombinedName}/server`] = serverTypes.dir
  nuxt.options.nitro.alias ??= {}
  nuxt.options.nitro.alias[`#${clientCombinedName}/server`] = serverTypes.dir

  // GraphQL Urql Introspection
  const urqlIntrospection = addTemplatePergel({
    filename: dotNuxtPaths.urqlIntrospectionFile,
    write: true,
    where: 'client',
    async getContents() {
      const { finish } = buildTime()
      const { schema } = await loadGraphQLFiles({
        rootDir: nuxt._pergel.serverDir,
        documentDir,
        schemaDir,
      })
      const { server } = useCodegen()

      if (!schema) {
        consola.warn('Schema not found')
        return ''
      }

      try {
        const type = await server.urqlIntrospection(schema, {
        })
        consola.info(`Type urqlIntrospection for ${projectNameCamelCase} in ${finish().duration}ms`)
        return type
      }
      catch (error) {
        consola.warn('error', error)
        return ''
      }
    },
  })

  nuxt.options.alias[`#${clientCombinedName}/urqlIntrospection`] = urqlIntrospection.dir
  nuxt.options.nitro.alias ??= {}
  nuxt.options.nitro.alias[`#${clientCombinedName}/urqlIntrospection`] = urqlIntrospection.dir

  // GraphQL Client
  const clientTypes = addTemplatePergel({
    filename: dotNuxtPaths.clientTypes,
    write: true,
    async getContents() {
      const { finish } = buildTime()

      const { schema, loadDocument } = await loadGraphQLFiles({
        rootDir: nuxt._pergel.serverDir,
        documentDir,
        schemaDir,
      })
      const { client } = useCodegen()

      if (!schema) {
        consola.warn('Schema not found')
        return ''
      }

      try {
        if (loadDocument) {
          const data = await client.generateTypedDocumentNode(schema, loadDocument, {
            useTypeImports: true,
            ...typeof options.codegen.client.config === 'function'
              ? options.codegen.client.config({
                dir: {
                  module: options.serverDir,
                  server: nuxt.options.serverDir,
                  nuxtModule: options.buildDir,
                },
              })
              : {},
          })
          consola.info(`Type client for ${projectNameCamelCase} in ${finish().duration}ms`)
          return data
        }
        return ''
      }
      catch (error) {
        consola.log(error)
        return ''
      }
    },
    where: 'client',
  })

  nuxt.options.alias[`#${clientCombinedName}/client`] = clientTypes.dir
  nuxt.options.nitro.alias ??= {}
  nuxt.options.nitro.alias[`#${clientCombinedName}/client`] = clientTypes.dir

  useNitroImports(nuxt, {
    presets: [
      {
        from: clientTypes.dir,
        imports: [
          {
            as: `${generatorFunctionName('GraphQLClient')}`,
            name: '*',
          },
        ],
      },
    ],
  })

  useNuxtImports(nuxt, {
    presets: [
      {
        from: clientTypes.dir,
        imports: [
          {
            as: `${generatorFunctionName('GraphQLClient')}`,
            name: '*',
          },
        ],
      },
    ],
  })

  function updatesFunction(input: {
    type: 'server' | 'client' | 'all'
  }) {
    if (input.type === 'client') {
      updateTemplatePergel({
        filter: (template) => {
          return template === clientTypes.filename
        },
      })

      updateTemplatePergel({
        filter: (template) => {
          return template === urqlIntrospection.filename
        },
      })
    }
    if (input.type === 'server') {
      return updateTemplatePergel({
        filter: (template) => {
          return template === serverTypes.filename
        },
      })
    }

    if (input.type === 'all') {
      updateTemplatePergel({
        filter: (template) => {
          return template === printSchemaFile.filename
        },
      })
    }
  }

  return {
    updatesFunction,
  }
}
