import { join, resolve } from 'node:path'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { relative } from 'pathe'
import type { NuxtPergel } from '../../../core/types'
import { matchGlobs } from '../utils'
import type { ResolvedGraphqlConfig } from '../types'
import { useGenerateCodegen } from './generateCodegen'

export function generateGraphQLTemplate(data: {
  nuxt: NuxtPergel<ResolvedGraphqlConfig>
}) {
  const module = data.nuxt._pergel._module
  const { codegen, documents, schema } = module.options

  // 'pergel/[projectName]/[moduleName]

  function globsServerClient(path: string) {
    const absolutePath = resolve(data.nuxt.options.rootDir, path)
    const relativePath = relative(data.nuxt.options.rootDir, path)

    const { projectName, moduleName } = relativePath.match(/pergel\/(?<projectName>[^\/]+)\/(?<moduleName>[^\/]+)/)?.groups ?? {}

    const serverFolder = matchGlobs(absolutePath, [join('**', schema, '**', `*${codegen.server.extension}`)])
    const clientFolder = matchGlobs(absolutePath, [join('**', documents, '**', `*${codegen.client.extension}`)])

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

  if (!existsSync(schema))
    mkdirSync(schema, { recursive: true })

  if (!existsSync(documents))
    mkdirSync(documents, { recursive: true })

  if (readdirSync(schema).length === 0)
    writeFileSync(join(schema, 'book.graphql'), schemaTemplate)

  if (readdirSync(documents).length === 0)
    writeFileSync(join(documents, 'book.graphql'), documentsTemplate)

  useGenerateCodegen({
    nuxt: data.nuxt,
    type: 'all',
    moduleDir: module.dir.module,
    projectName: module.projectName,
    schemaDir: schema,
    documentDir: documents,
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
        schemaDir: schema,
        documentDir: documents,
      })
    }
    else {
      if (clientFolder || serverFolder) {
        await useGenerateCodegen({
          nuxt: data.nuxt,
          type: 'all',
          moduleDir: join('pergel', projectName, moduleName),
          projectName,
          schemaDir: schema,
          documentDir: documents,
        })
      }
    }
  })
}
