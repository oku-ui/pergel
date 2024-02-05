import { writeFileSync } from 'node:fs'
import type { LoadSchemaOptions, LoadTypedefsOptions, UnnormalizedTypeDefPointer } from '@graphql-tools/load'
import { loadDocumentsSync, loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import type { Types } from '@graphql-codegen/plugin-helpers'
import type { GraphQLSchema } from 'graphql'
import { codegen } from '@graphql-codegen/core'
import { parse, printSchema } from 'graphql'
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations'
import { plugin as typescriptOperationsPlugin } from '@graphql-codegen/typescript-operations'
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript'
import type { TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node'
import { plugin as typedDocumentNode } from '@graphql-codegen/typed-document-node'
import type { Source } from '@graphql-tools/utils'
import * as typescriptPlugin from '@graphql-codegen/typescript'
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers'
import * as urqlIntrospectionPlugin from '@graphql-codegen/urql-introspection'
import consola from 'consola'

export type CodegenClientConfig = TypeScriptPluginConfig & TypeScriptDocumentsPluginConfig & TypeScriptTypedDocumentNodesConfig

export type CodegenServerConfig = TypeScriptPluginConfig & typescriptResolversPlugin.TypeScriptResolversPluginConfig

async function loadSchemaFiles(schemaPointers: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[], data: Partial<LoadSchemaOptions> = {}) {
  let result: GraphQLSchema | undefined
  try {
    result = loadSchemaSync(schemaPointers, {
      ...data,
      loaders: [
        new GraphQLFileLoader(),
        ...((data.loaders || []) as any[]),
      ],
    })
  }
  catch (e: any) {
    if (
      // https://www.graphql-tools.com/docs/documents-loading#no-files-found
      (e.message || '').includes(
        'Unable to find any GraphQL type definitions for the following pointers:',
      )
    ) {
      // Ignore
    }
    else {
      throw e
    }
  }
  return result
}

async function loadDocumentsFiles(pointerOrPointers: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[], data: Partial<LoadTypedefsOptions> = {}) {
  let result: Source[] | undefined
  try {
    result = loadDocumentsSync(pointerOrPointers, {
      ...data,
      loaders: [
        new GraphQLFileLoader(),
        ...((data.loaders || []) as any[]),
      ],
    })
  }
  catch (e: any) {
    if (
      // https://www.graphql-tools.com/docs/documents-loading#no-files-found
      (e.message || '').includes(
        'Unable to find any GraphQL type definitions for the following pointers:',
      )
    ) {
      // Ignore
    }
    else {
      throw e
    }
  }
  return result
}

async function typescriptResolvers(
  schema: GraphQLSchema,
  config: CodegenServerConfig = { },
) {
  // See https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage for more details
  const res = await codegen({
    filename: '',
    schema: parse(printSchema(schema)),
    // TODO: Add support for fragments
    documents: [],
    config,
    plugins: [
      { typescript: {} },
      { typescriptResolvers: {} },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptResolvers: typescriptResolversPlugin,
    },
  }).catch((e) => {
    consola.warn('error', e)
    return ''
  })

  return res
}

async function urqlIntrospection(
  schema: GraphQLSchema,
  config: CodegenClientConfig = {},
) {
  const res = await codegen({
    filename: 'a.ts',
    schema: parse(printSchema(schema)),
    documents: [],
    config,
    plugins: [
      { urqlIntrospection: {} },
    ],
    pluginMap: {
      urqlIntrospection: urqlIntrospectionPlugin,
    },
  }).catch((e) => {
    consola.warn('error', e)
    return ''
  })

  return res
}

async function generateTypedDocumentNode(
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: CodegenClientConfig = {},
) {
  // See https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage for more details
  const res = await codegen({
    // Filename is not used. This is because the typescript plugin returns a string instead of writing to a file.
    filename: 'a.ts',
    schema: parse(printSchema(schema)),
    // TODO: Add support for fragments
    documents,
    config,
    plugins: [
      { typescript: {} },
      { typescriptOperations: {} },
      { typedDocumentNode: {} },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptOperations: {
        plugin: typescriptOperationsPlugin,
      },
      typedDocumentNode: {
        plugin: typedDocumentNode,
      },
    },
  }).catch((e) => {
    consola.warn('error', e)
    return ''
  })

  return res
}

async function writeSchema(schema: GraphQLSchema, path: string) {
  const schemaString = printSchema(schema)

  writeFileSync(path, schemaString, {
    encoding: 'utf-8',
  })
  return schemaString
}

export function useCodegen() {
  return {
    loadSchemaFiles,
    loadDocumentsFiles,
    writeSchema,
    server: {
      urqlIntrospection,
      typescriptResolvers,
    },
    client: {
      generateTypedDocumentNode,
    },
  }
}
