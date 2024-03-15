import type { LoadSchemaOptions, LoadTypedefsOptions, UnnormalizedTypeDefPointer } from '@graphql-tools/load'
import { loadDocumentsSync, loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import type { PluginFunction, Types } from '@graphql-codegen/plugin-helpers'
import type { GraphQLSchema } from 'graphql'
import { codegen } from '@graphql-codegen/core'
import { parse, printSchema } from 'graphql'
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations'
import { plugin as typescriptOperationsPlugin } from '@graphql-codegen/typescript-operations'
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript'
import type { TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node'
import { plugin as typedDocumentNode } from '@graphql-codegen/typed-document-node'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import type { Source } from '@graphql-tools/utils'
import * as typescriptPlugin from '@graphql-codegen/typescript'
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers'
import * as urqlIntrospectionPlugin from '@graphql-codegen/urql-introspection'
import * as urqlGraphqlCachePlugin from '@graphql-codegen/typescript-urql-graphcache'
import consola from 'consola'
import defu from 'defu'
import {
  CurrencyResolver,
  DateTimeResolver,
  JSONResolver,
  NonEmptyStringResolver,
  UUIDResolver,
} from 'graphql-scalars'
import { writeFilePergel } from '../../../core/utils/writeFilePergel'

const pluginContent: PluginFunction<any> = (_schema, _documents, _config, _info) => {
  return {
    prepend: [
      '// THIS FILE IS GENERATED, DO NOT EDIT!',
      '/* eslint-disable eslint-comments/no-unlimited-disable */',
      '/* tslint:disable */',
      '/* eslint-disable */',
      '/* prettier-ignore */',
      '/* pergel - oku-ui.com/pergel */',
    ],
    content: '',
  }
}

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
  config: CodegenServerConfig,
) {
  const mergeConfig = defu(config, {
    scalars: {
      DateTime: DateTimeResolver.extensions.codegenScalarType as any,
      UUID: UUIDResolver.extensions.codegenScalarType as any,
      JSON: JSONResolver.extensions.codegenScalarType as any,
      JSONObject: JSONResolver.extensions.codegenScalarType as any,
      NonEmptyString: NonEmptyStringResolver.extensions.codegenScalarType as any,
      Currency: CurrencyResolver.extensions.codegenScalarType as any,
      File: {
        input: 'File',
        output: 'File',
      },
      Cursor: {
        input: 'string',
        output: 'string',
      },
    },
    enumsAsTypes: true,
    useTypeImports: true,
    strictScalars: true,
    emitLegacyCommonJSImports: false,
  } as CodegenServerConfig)
  // See https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage for more details
  const res = await codegen({
    filename: '',
    schema: parse(printSchemaWithDirectives(schema)),
    // TODO: Add support for fragments
    documents: [],
    config: mergeConfig,
    plugins: [
      { pluginContent: {} },
      { typescript: {} },
      { typescriptResolvers: {} },
    ],
    pluginMap: {
      pluginContent: {
        plugin: pluginContent,
      },
      typescript: typescriptPlugin,
      typescriptResolvers: typescriptResolversPlugin,
    },
  }).catch((e: any) => {
    consola.warn('error', e)
    return ''
  })

  return res
}

async function urqlIntrospection(
  schema: GraphQLSchema,
  config: CodegenClientConfig,
) {
  const mergeConfig = defu(config, {
    useTypeImports: true,
    includeScalars: true,
  } as CodegenClientConfig)

  const res = await codegen({
    filename: 'a.ts',
    schema: parse(printSchema(schema)),
    documents: [],
    config: mergeConfig,
    plugins: [
      { pluginContent: {} },
      { urqlIntrospection: {} },
    ],
    pluginMap: {
      pluginContent: {
        plugin: pluginContent,
      },
      urqlIntrospection: urqlIntrospectionPlugin,
    },
  }).catch((e: any) => {
    consola.warn('error', e)
    return ''
  })

  return res
}

async function generateTypedDocumentNode(
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: CodegenClientConfig,
) {
  const mergeConfig = defu(config, {
    enumsAsTypes: true,
    useTypeImports: true,
  } as CodegenClientConfig)

  // See https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage for more details
  const res = await codegen({
    // Filename is not used. This is because the typescript plugin returns a string instead of writing to a file.
    filename: 'a.ts',
    schema: parse(printSchema(schema)),
    // TODO: Add support for fragments
    documents,
    config: mergeConfig,
    plugins: [
      { pluginContent: {} },
      { typescript: {} },
      { typescriptOperations: {} },
      { typedDocumentNode: {} },
      { urqlGraphqlCache: {} },
    ],
    pluginMap: {
      pluginContent: {
        plugin: pluginContent,
      },
      typescript: typescriptPlugin,
      typescriptOperations: {
        plugin: typescriptOperationsPlugin,
      },
      typedDocumentNode: {
        plugin: typedDocumentNode,
      },
      urqlGraphqlCache: urqlGraphqlCachePlugin,
    },
  }).catch((e: any) => {
    consola.warn('error', e)
    return ''
  })

  return res
}

async function writeSchema(schema: GraphQLSchema, path: string) {
  const schemaString = printSchema(schema)

  writeFilePergel(path, schemaString)
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
