import { type Resolver, addServerImports } from '@nuxt/kit'

export function setupDrizzle(
  db: string,
  resolver: Resolver,
) {
  let driver = ''
  switch (db) {
    case 'postgre': {
      addServerImports([{
        from: resolver.resolve('./drizzle/composables/postgre'),
        name: 'useLuciaDrizzlePostgre',
      }])
      driver = `useLuciaDrizzlePostgre`
      break
    }
    default: {
      throw new Error('Unsupported driver')
    }
  }
  return {
    driver,
  }
}
