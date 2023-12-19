// TODO: Clean this file
import { join, resolve } from 'node:path'
import { addTemplate, updateTemplates } from '@nuxt/kit'
import consola from 'consola'
import { buildTime } from '../utils'
import type { NuxtPergel } from '../../../core/types'
import { useNuxtImports } from '../../../core/utils/useImports'
import type { GraphQLYogaConfig } from '../types'
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
    // TODO: Kullaniciya ayarlari gonderebilmesini sagla. ve burayi degistirmesini sagla.
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
  projectName,
  type,
  moduleDir,
  schemaDir,
  documentDir,
  moduleDTS,
}: {
  nuxt: NuxtPergel<GraphQLYogaConfig>
  projectName: string
  moduleDir: string
  type: 'server' | 'client' | 'all'
  schemaDir: string
  documentDir: string
  moduleDTS: {
    name: string
    path: string
  }
}) {
  const clientTypesTemplateName = join(moduleDir, 'client.ts')
  const serverFileName = join(moduleDir, 'server.ts')
  const schemaFilename = join(moduleDir, 'schema.mjs')
  const schemaFilenameTs = join(moduleDir, 'schema.ts')
  const urqlIntrospectionFileName = join(moduleDir, 'urqlIntrospection.ts')

  const { client, server } = useCodegen()

  const { printSchema, schema, loadDocument } = await loadGraphQLFiles({
    rootDir: nuxt.options.rootDir,
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
    filename: schemaFilename,
    write: true,
    async getContents() {
      return `export const schema = \`${printSchema}\``
    },
  })

  nuxt.options.alias[`${moduleDir}/schema`] = printSchemaFile.dst
  nuxt.options.nitro.alias[`${moduleDir}/schema`] = printSchemaFile.dst

  // Create types in build dir
  const { dst: typeDecSchema } = addTemplate({
    filename: schemaFilenameTs,
    write: true,
    getContents() {
      return `declare module '${moduleDir}/schema' {
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
    filename: serverFileName,
    write: true,
    async getContents() {
      const { finish } = buildTime()

      try {
        consola.info(`Generating types server for ${projectName} in ${finish().duration}ms`)
        const type = await server.typescriptResolvers(schema, {
          useTypeImports: true,
          contextType: `${moduleDTS.path}#${moduleDTS.name}`,
        })
        return type
      }
      catch (error) {
        consola.warn('error', error)
        return ''
      }
    },
  })

  nuxt.options.alias[`${moduleDir}/server`] = serverTypes.dst
  nuxt.options.nitro.alias[`${moduleDir}/server`] = serverTypes.dst

  // GraphQL Urql Introspection
  const urqlInptospection = addTemplate({
    filename: urqlIntrospectionFileName,
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

  nuxt.options.alias[`${moduleDir}/urqlIntrospection`] = urqlInptospection.dst
  nuxt.options.nitro.alias[`${moduleDir}/urqlIntrospection`] = urqlInptospection.dst

  // GraphQL Client
  const clientTypes = addTemplate({
    filename: clientTypesTemplateName,
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

  nuxt.options.alias[`${moduleDir}/client`] = clientTypes.dst
  nuxt.options.nitro.alias[`${moduleDir}/client`] = clientTypes.dst

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
      filter: template => template.filename === schemaFilename,
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
