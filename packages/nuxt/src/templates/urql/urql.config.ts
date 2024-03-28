import type { NuxtPergel } from '../../runtime/core/types/nuxtModule'

export default function (data: {
  projectName: string
  projectNameCamelCaseWithPergel: string
  nuxt: NuxtPergel
  driver: 'graphqlYoga'
}) {
  return /* TS */ `import { fetchExchange } from '@urql/core'
import { cacheExchange } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
import type { GraphCacheConfig } from '#${data.projectName}/client/graphqlYoga/generated/client'
import schema from '#${data.projectName}/client/graphqlYoga/generated/urqlIntrospection'
import { useRequestHeaders } from '#app'

export default ${data.projectNameCamelCaseWithPergel}UrqlClient((ssr) => {
  const exchanges = [ssr, fetchExchange]

  if (import.meta.client) {
    // configure urql graphcache with codegen types
    const cacheConfig: GraphCacheConfig = {
      schema,
      keys: {
        // Country: (data) => data.code ?? null,
      },
      resolvers: {
        Query: {
          // country: (_, args) => ({ __typename: "Country", code: args.code.toString() }),
        },
      },
      storage: makeDefaultStorage(),
    }
    // insert cache exchange
    exchanges.unshift(cacheExchange(cacheConfig))
  }

  const headers = useRequestHeaders(['cookie', 'authorization'])

  return {
    exchanges,
    fetchOptions: () => ({ headers }),
  }
})
`
}
