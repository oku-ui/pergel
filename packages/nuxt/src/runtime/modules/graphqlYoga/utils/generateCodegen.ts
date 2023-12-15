// TODO: Clean this file
import { join, resolve } from 'node:path'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate, updateTemplates } from '@nuxt/kit'
import consola from 'consola'
import { buildTime } from '../utils'
import type { ResolvedPergelOptions } from '../../../core/types'
import { useNuxtImports } from '../../../core/utils/useImports'
import { useCodegen } from './codegen'

export async function loadGraphQLFiles(
  options: ResolvedPergelOptions,
) {
  const root = options.resolvedOptions.resolveDir.root
  const { loadSchemaFiles, loadDocumentsFiles, writeSchema } = useCodegen()

  const schema = await loadSchemaFiles(options.moduleOptions.schema, {
    cwd: root,
    // TODO: Kullaniciya ayarlari gonderebilmesini sagla. ve burayi degistirmesini sagla.
  })

  const loadDocument = await loadDocumentsFiles(options.moduleOptions.documents, {
    cwd: root,
  })

  const printSchema = await writeSchema(schema!, resolve(root, 'schema.graphql'))

  return {
    schema,
    loadDocument,
    printSchema,
  }
}

interface GenerateCodegenOptions {
  nuxt: Nuxt
  options: ResolvedPergelOptions
  type: 'server' | 'client' | 'all'
}

export async function useGenerateCodegen(data: GenerateCodegenOptions) {
  const projectName = data.options.resolvedModule.projectName
  const projectModulePath = data.options.resolvedModule.dir.projectModule
  const projectNameCapitalized = projectName.charAt(0).toUpperCase() + projectName.slice(1)

  const clientTypesTemplateName = join(projectModulePath, 'client.ts')
  const serverFileName = join(projectModulePath, 'server.ts')
  const schemaFilename = join(projectModulePath, 'schema.mjs')
  const schemaFilenameTs = join(projectModulePath, 'schema.ts')
  const contextFilename = join(projectModulePath, 'context.ts')
  const urqlIntrospectionFileName = join(projectModulePath, 'urqlIntrospection.ts')

  const { client, server } = useCodegen()

  const { printSchema, schema, loadDocument } = await loadGraphQLFiles(data.options)

  if (!schema) {
    consola.warn('Schema not found')
    return
  }

  data.nuxt.options.nitro.alias ??= {}
  data.nuxt.options.alias ??= {}

  // GraphQL Schema
  const printSchemaFile = addTemplate({
    filename: `./pergel/${schemaFilename}`,
    write: true,
    async getContents() {
      return `export const schema = \`${printSchema}\``
    },
  })

  data.nuxt.options.alias[`${projectModulePath}/schema`] = printSchemaFile.dst
  data.nuxt.options.nitro.alias[`${projectModulePath}/schema`] = printSchemaFile.dst

  // Create types in build dir
  const { dst: typeDecSchema } = addTemplate({
    filename: `./pergel/${schemaFilenameTs}`,
    write: true,
    getContents() {
      return `declare module '${projectModulePath}/schema' {
  const schema: string
}`
    },
  })

  // Add types to `nuxt.d.ts`
  data.nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: typeDecSchema })
  })

  // GraphQL Context Type
  const contextType = addTemplate({
    filename: `./pergel/${contextFilename}`,
    write: true,
    async getContents() {
      return `
import type { H3Event } from 'h3'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { YogaInitialContext } from 'graphql-yoga'

export interface ${projectNameCapitalized}Context extends YogaInitialContext {
  res: ServerResponse
  req: IncomingMessage
  event: H3Event
}
`
    },
  })

  data.nuxt.options.nitro.alias[`${projectModulePath}/context`] = contextType.dst
  data.nuxt.options.alias[`${projectModulePath}/context`] = contextType.dst

  // GraphQL Server
  const serverTypes = addTemplate({
    filename: `./pergel/${serverFileName}`,
    write: true,
    async getContents() {
      const { finish } = buildTime()

      try {
        consola.info(`Generating types server for ${projectName} in ${finish().duration}ms`)
        const type = await server.typescriptResolvers(schema, {
          useTypeImports: true,
          contextType: `${contextType.dst}#${projectNameCapitalized}Context`,
        })
        return type
      }
      catch (error) {
        consola.warn('error', error)
        return ''
      }
    },
  })

  data.nuxt.options.alias[`${projectModulePath}/server`] = serverTypes.dst
  data.nuxt.options.nitro.alias[`${projectModulePath}/server`] = serverTypes.dst

  // GraphQL Urql Introspection
  const urqlInptospection = addTemplate({
    filename: `./pergel/${urqlIntrospectionFileName}`,
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

  data.nuxt.options.alias[`${projectModulePath}/urqlIntrospection`] = urqlInptospection.dst
  data.nuxt.options.nitro.alias[`${projectModulePath}/urqlIntrospection`] = urqlInptospection.dst

  // GraphQL Client
  const clientTypes = addTemplate({
    filename: `./pergel/${clientTypesTemplateName}`,
    write: true,
    async getContents() {
      const { finish } = buildTime()

      try {
        if (loadDocument) {
          const data = await client.generateTypedDocumentNode(schema, loadDocument, {
            useTypeImports: true,
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

  data.nuxt.options.alias[`${projectModulePath}/client`] = clientTypes.dst
  data.nuxt.options.nitro.alias[`${projectModulePath}/client`] = clientTypes.dst

  // Add imports to nitro
  data.nuxt.options.nitro.imports = {
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

  useNuxtImports(data.nuxt, {
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

  if (data.type === 'server') {
    await updateTemplates({
      filter: template => template.filename === schemaFilename,
    })
  }

  if (data.type === 'client') {
    await updateTemplates({
      filter: (template) => {
        return template.filename === clientTypes.filename
      },
    })
  }

  if (data.type === 'all') {
    await updateTemplates({
      filter: (template) => {
        return template.filename === clientTypes.filename
      },
    })
    await updateTemplates({
      filter: template => template.filename === schemaFilename,
    })
    await updateTemplates({
      filter: template => template.filename === serverFileName,
    })
    await updateTemplates({
      filter: template => template.filename === urqlIntrospectionFileName,
    })
  }
}
