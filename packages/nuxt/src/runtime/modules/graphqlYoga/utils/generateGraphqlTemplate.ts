import { join } from 'node:path'
import { matchGlobs } from '../utils'
import type { ResolvedGraphQLYogaConfig } from '../types'
import type { NuxtPergel } from '../../../core/types/nuxtModule'
import { globsBuilderWatch } from '../../../core/utils/globs'
import { useGenerateCodegen } from './generateCodegen'

export function generateGraphQLTemplate(data: {
  nuxt: NuxtPergel
  options: ResolvedGraphQLYogaConfig
}) {
  const { codegen, dir } = data.options

  const { updatesFunction } = useGenerateCodegen({
    nuxt: data.nuxt,
    options: data.options,
    moduleDTS: {
      name: 'GraphqlYogaContext',
      path: `${join(data.options.projectName, 'server', data.options.moduleName)}/types`,
    },
  })

  if (data.nuxt.options.dev) {
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
        await updatesFunction({
          type: 'server',
        })
      }
      if (clientFolder) {
        await updatesFunction({
          type: 'client',
        })
      }

      await updatesFunction({
        type: 'all',
      })
    })
  }
}
