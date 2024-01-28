import { join, resolve } from 'node:path'
import { addTemplate, updateTemplates } from '@nuxt/kit'
import consola from 'consola'
import { buildTime } from '../utils'
import { useNuxtImports } from '../../../core/utils/useImports'
import type { ResolvedGraphQLYogaConfig } from '../types'
import type { NuxtPergel } from '../../../core/types/nuxtModule'
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

export async function useGenerateCodegen({
  nuxt,
  type,
  moduleDTS,
  options,
}: {
  nuxt: NuxtPergel
  options: ResolvedGraphQLYogaConfig
  type: 'server' | 'client' | 'all'
  moduleDTS: {
    name: string
    path: string
  }
}) {
  const { moduleName, projectName, documentDir, schemaDir } = options
  const combinedName = join(projectName, moduleName)

  const dotNuxtPaths = {
    clientTypes: join(combinedName, 'client.ts'),
    serverFile: join(combinedName, 'server.ts'),
    schemaFile: join(combinedName, 'schema.mjs'),
    schemaFileTS: join(combinedName, 'schema.ts'),
    urqlIntrospectionFile: join(combinedName, 'urqlIntrospection.ts'),
  }

  const { client, server } = useCodegen()

  const { printSchema, schema, loadDocument } = await loadGraphQLFiles({
    rootDir: nuxt._pergel.rootDir,
    documentDir,
    schemaDir,
  })

  if (!schema) {
    consola.warn('Schema not found')
    return
  }

  nuxt.options.nitro.alias ??= {}
  nuxt.options.alias ??= {}

  // GraphQL Schema
  const printSchemaFile = addTemplate({
    filename: join('pergel', dotNuxtPaths.schemaFile),
    write: true,
    async getContents() {
      return `export const schema = \`${printSchema}\``
    },
  })

  nuxt.options.alias[`#${combinedName}/schema`] = printSchemaFile.dst
  nuxt.options.nitro.alias[`#${combinedName}/schema`] = printSchemaFile.dst

  // Create types in build dir
  const { dst: typeDecSchema } = addTemplate({
    filename: join('pergel', dotNuxtPaths.schemaFileTS),
    write: true,
    getContents() {
      return `declare module '#${combinedName}/schema' {
  const schema: string
}`
    },
  })

  // Add types to `nuxt.d.ts`
  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: typeDecSchema })
  })

  // GraphQL Server
  const serverTypes = addTemplate({
    filename: join('pergel', dotNuxtPaths.serverFile),
    write: true,
    async getContents() {
      const { finish } = buildTime()

      try {
        consola.info(`Generating types server for ${projectName} in ${finish().duration}ms`)
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
        return type
      }
      catch (error) {
        consola.warn('error', error)
        return ''
      }
    },
  })

  nuxt.options.alias[`#${combinedName}/server`] = serverTypes.dst
  nuxt.options.nitro.alias[`#${combinedName}/server`] = serverTypes.dst

  // GraphQL Urql Introspection
  const urqlInptospection = addTemplate({
    filename: join('pergel', dotNuxtPaths.urqlIntrospectionFile),
    write: true,
    async getContents() {
      const { finish } = buildTime()
      try {
        consola.info(`Generating types server for ${projectName} in ${finish().duration}ms`)
        const type = await server.urqlIntrospection(schema, {
        })
        return type
      }
      catch (error) {
        consola.warn('error', error)
        return ''
      }
    },
  })

  nuxt.options.alias[`#${combinedName}/urqlIntrospection`] = urqlInptospection.dst
  nuxt.options.nitro.alias[`#${combinedName}/urqlIntrospection`] = urqlInptospection.dst

  // GraphQL Client
  const clientTypes = addTemplate({
    filename: join('pergel', dotNuxtPaths.clientTypes),
    write: true,
    async getContents() {
      const { finish } = buildTime()

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
          return data
        }
        consola.info(`Generating types client for ${projectName} in ${finish().duration}ms`)
        return ''
      }
      catch (error) {
        consola.log(error)
        return ''
      }
    },
  })

  nuxt.options.alias[`#${combinedName}/client`] = clientTypes.dst
  nuxt.options.nitro.alias[`#${combinedName}/client`] = clientTypes.dst

  // Add imports to nitro
  nuxt.options.nitro.imports = {
    presets: [
      {
        from: clientTypes.dst,
        imports: [
          {
            as: `${projectName}GraphQLClient`,
            name: '*',
          },
        ],
      },
    ],
  }

  useNuxtImports(nuxt, {
    presets: [
      {
        from: clientTypes.dst,
        imports: [
          {
            as: `${projectName}GraphQLClient`,
            name: '*',
          },
        ],
      },
    ],
  })

  if (type === 'server') {
    await updateTemplates({
      filter: (template) => {
        return template.filename === serverTypes.filename
      },
    })
  }

  if (type === 'client') {
    await updateTemplates({
      filter: (template) => {
        return template.filename === clientTypes.filename
      },
    })
  }

  if (type === 'all') {
    await updateTemplates({
      filter: (template) => {
        return template.filename === clientTypes.filename
      },
    })
    await updateTemplates({
      filter: (template) => {
        return template.filename === dotNuxtPaths.schemaFile
      },
    })
    await updateTemplates({
      filter: (template) => {
        return template.filename === dotNuxtPaths.serverFile
      },
    })
    await updateTemplates({
      filter: (template) => {
        return template.filename === dotNuxtPaths.urqlIntrospectionFile
      },
    })
  }
}
