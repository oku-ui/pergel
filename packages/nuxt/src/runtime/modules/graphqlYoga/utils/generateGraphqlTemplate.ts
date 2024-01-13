import { join, resolve } from 'node:path'
import { existsSync, writeFileSync } from 'node:fs'
import { relative } from 'pathe'
import type { NuxtPergel } from '../../../core/types'
import { matchGlobs } from '../utils'
import type { ResolvedGraphQLYogaConfig } from '../types'
import { addModuleDTS } from '../../../core/utils/addModuleDTS'
import { useGenerateCodegen } from './generateCodegen'

export function generateGraphQLTemplate(data: {
  nuxt: NuxtPergel
  options: ResolvedGraphQLYogaConfig
}) {
  const { codegen, dir } = data.options

  function globsServerClient(path: string) {
    const absolutePath = resolve(data.nuxt.options.rootDir, path)
    const relativePath = relative(data.nuxt.options.rootDir, path)

    const { projectName, moduleName } = relativePath.match(/pergel\/(?<projectName>[^\/]+)\/(?<moduleName>[^\/]+)/)?.groups ?? {}

    const serverFolder = matchGlobs(absolutePath, [join('**', dir.schema, '**', `*${codegen.server.extension}`)])
    const clientFolder = matchGlobs(absolutePath, [join('**', dir.document, '**', `*${codegen.client.extension}`)])

    return {
      serverFolder,
      clientFolder,
      projectName,
      moduleName,
    }
  }

  const schemaTemplate = `type Query {
  book(id: ID!): Book!
  books: [Book!]!
}

type Book {
  id: ID!
  name: String!
  email: String!
  password: String!
  createdAt: String!
  updatedAt: String
}
    `

  const documentsTemplate = `query book {
  book(id: 1) {
    id
    name
  }
}
    `

  if (!existsSync(data.options.schemaDir))
    writeFileSync(join(data.options.schemaDir, 'book.graphql'), schemaTemplate)

  if (!existsSync(data.options.documentDir))
    writeFileSync(join(data.options.documentDir, 'book.graphql'), documentsTemplate)

  addModuleDTS({
    template: /* ts */`
import type { H3Event } from 'h3'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { YogaInitialContext } from 'graphql-yoga'

export interface GraphqlYogaContext extends YogaInitialContext {
  res: ServerResponse
  req: IncomingMessage
  event: H3Event
}
      `,
    moduleName: data.options.moduleName,
    projectName: data.options.projectName,
    nuxt: data.nuxt,
    interfaceNames: ['GraphqlYogaContext'],
    dir: data.options.serverDir,
  })

  useGenerateCodegen({
    nuxt: data.nuxt,
    type: 'all',
    moduleDir: data.options.dir.document,
    projectName: data.options.projectName,
    schemaDir: dir.schema,
    documentDir: dir.document,
    moduleDTS: {
      name: 'GraphqlYogaContext',
      path: `pergel/${data.options.projectName}/types`,
    },
  })

  data.nuxt.hook('builder:watch', async (event, path) => {
    const { serverFolder, clientFolder, moduleName, projectName } = globsServerClient(path)
    // return
    if (serverFolder) {
      // If change server, and update schema.graphql and after update client auto. Maybe change this in future.
      await useGenerateCodegen({
        nuxt: data.nuxt,
        type: 'server',
        moduleDir: join('pergel', projectName, moduleName),
        projectName,
        schemaDir: dir.schema,
        documentDir: dir.document,
        moduleDTS: {
          name: 'GraphqlYogaContext',
          path: `pergel/${data.options.projectName}/types`,
        },
      })
    }
    else {
      if (clientFolder || serverFolder) {
        await useGenerateCodegen({
          nuxt: data.nuxt,
          type: 'all',
          moduleDir: join('pergel', projectName, moduleName),
          projectName,
          schemaDir: dir.schema,
          documentDir: dir.document,
          moduleDTS: {
            name: 'GraphqlYogaContext',
            path: `pergel/${data.options.projectName}/types`,
          },
        })
      }
    }
  })
}
