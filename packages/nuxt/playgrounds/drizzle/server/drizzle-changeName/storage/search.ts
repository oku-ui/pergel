import consola from 'consola'
import type { Column } from 'drizzle-orm'
import { asc, desc } from 'drizzle-orm'
import type { API } from './types'

const logger = consola.withDefaults({
  tag: 'search',
})

async function globalSearch(this: API, params: {
  text?: string
  tableName: string
}) {
  const search = params?.text || ''

  const columKeys = {
    username: changeNameTables.user.username,
    email: changeNameTables.user.email,
    id: changeNameTables.user.id,
    name: changeNameTables.user.name,
  }

  const tables = {
    user: changeNameTables.user,
  }

  const scopeTags = {
    '=': (key: Column, value: string) => eq(key, value),
    '!=': (key: Column, value: string) => ne(key, value),
    '>': (key: Column, value: string) => gt(key, value),
    '>=': (key: Column, value: string) => gte(key, value),
    '<': (key: Column, value: string) => lt(key, value),
    '<=': (key: Column, value: string) => lte(key, value),
    '<like>': (key: Column, value: string) => like(key, `%${value}%`),
    '<ilike>': (key: Column, value: string) => ilike(key, `%${value}%`),
    'OR': (...args: any[]) => or(...args),
    'AND': (...args: any[]) => and(...args),
    'asc': (key: Column) => asc(key),
    'desc': (key: Column) => desc(key),
  }

  const scopeTagsArray = ['OR', 'AND', '<like>', '<ilike>', '>=', '<=', '>', '<', '!=', '=']

  // If unSearch is not imported, you can use the following code: nuxt.config.ts -> pergel.projectname.box.unSearch = true

  const { config } = await unSearch({
    search,
    columKeys,
    default: {
      filterText: Object.keys(columKeys).map((key) => {
        return {
          column: columKeys[key as keyof typeof columKeys],
          filter: '<ilike>',
          key,
        }
      }),
    },
    scopeTagsArray,
    scopeTags,
  })

  const searchDatas = this.db
    .select()
    .from(tables[params.tableName as keyof typeof tables])
    .where(
      or(
        ...config._data?.wheres ?? [],
      ),
    )
    .orderBy(
      ...config._data?.orderBy ?? [],
    )

  if (!searchDatas) {
    logger.error(':login - Invalid credentials')
    throw new Error('Invalid credentials')
  }

  return await searchDatas
}

export function search({ db }: API) {
  return {
    global: globalSearch.bind({ db }),
    logger,
  }
}
