import { join } from 'node:path'
import { matchGlobs } from '../utils'
import type { ResolvedGraphQLYogaConfig } from '../types'
import { addModuleDTS } from '../../../core/utils/addModuleDTS'
import type { NuxtPergel } from '../../../core/types/nuxtModule'
import { globsBuilderWatch } from '../../../core/utils/globs'
import { useGenerateCodegen } from './generateCodegen'

export function generateGraphQLTemplate(data: {
  nuxt: NuxtPergel
  options: ResolvedGraphQLYogaConfig
}) {
  const { codegen, dir } = data.options

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
    options: data.options,
    moduleDTS: {
      name: 'GraphqlYogaContext',
      path: `pergel/${data.options.projectName}/types`,
    },
  })

  if (data.nuxt.options.dev) {
    data.nuxt.hook('nitro:build:before', (nitro) => {
      data.nuxt.hook('builder:watch', async (event, path) => {
        const test = globsBuilderWatch(data.nuxt, path, '.graphql')
        if (!test)
          return

        // TODO: globsBuilderWatch add dynamic function
        const serverFolder = matchGlobs(test.match.filepath, [join('**', dir.schema, '**', `*${codegen.server.extension}`)])
        const clientFolder = matchGlobs(test.match.filepath, [join('**', dir.document, '**', `*${codegen.client.extension}`)])

        // return
        if (serverFolder) {
          // If change server, and update schema.graphql and after update client auto. Maybe change this in future.
          await useGenerateCodegen({
            nuxt: data.nuxt,
            type: 'server',
            options: data.options,
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
              options: data.options,
              moduleDTS: {
                name: 'GraphqlYogaContext',
                path: `pergel/${data.options.projectName}/types`,
              },
            })
          }
        }

        await nitro.hooks.callHook('dev:reload')
      })
    })
  }
}
