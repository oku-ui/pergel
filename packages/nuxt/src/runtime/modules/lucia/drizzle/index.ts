import { type Resolver, addServerImportsDir } from '@nuxt/kit'

export function setupDrizzle(
  db: string,
  resolver: Resolver,
) {
  switch (db) {
    case 'postgre': {
      addServerImportsDir(resolver.resolve('./drizzle/composables/postgre'))
      break
    }
    default: {
      throw new Error('Unsupported driver')
    }
  }
}
