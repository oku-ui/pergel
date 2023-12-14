import { join, resolve } from 'node:path'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { ResolvedPergelOptions } from '../../../core/types'
import { matchGlobs } from '../utils'
import type { ResolvedGraphqlConfig } from '../types'
import { useGenerateCodegen } from './generateCodegen'

export function generateGraphQLTemplate(data: {
  nuxt: Nuxt
  options: ResolvedPergelOptions<ResolvedGraphqlConfig>
}) {
  const { codegen, documents, schema } = data.options.moduleOptions
  function globsServerClient(path: string) {
    const absolutePath = resolve(data.nuxt.options.rootDir, path)

    const serverFolder = matchGlobs(absolutePath, [join('**', schema, '**', `*${codegen.server.extension}`)])
    const clientFolder = matchGlobs(absolutePath, [join('**', documents, '**', `*${codegen.client.extension}`)])

    return {
      serverFolder,
      clientFolder,
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
    options: data.options,
    type: 'all',
  })

  data.nuxt.hook('builder:watch', async (event, path) => {
    const { serverFolder, clientFolder } = globsServerClient(path)
    if (serverFolder) {
      // If change server, and update schema.graphql and after update client auto. Maybe change this in future.
      await useGenerateCodegen({
        nuxt: data.nuxt,
        options: data.options,
        type: 'server',
      })
    }
    else {
      if (clientFolder || serverFolder) {
        await useGenerateCodegen({
          nuxt: data.nuxt,
          options: data.options,
          type: 'all',
        })
      }
    }
  })
}
