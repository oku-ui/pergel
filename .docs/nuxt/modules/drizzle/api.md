---
outline: deep
---

# API

### Aliases

- `#changeName/server/drizzle`
- `#changeName/server/drizzle/storage`
- `#changeName/server/drizzle/schema`

<!-- automd:changeName -->

::: tip changeName
`changeName` is the name of your project. Please change it to your project name.
:::

<!-- /automd -->

## API 

```ts twoslash [nuxt.config.ts] {2,5}
export default defineNuxtConfig({
  modules: [
    'pergel/nuxt',
  ],
  pergel: {
    projects: {
      changeName: {
        drizzle: {
          autoImportPrefix: {
            filters: '',
          },
          driver: 'postgresjs:pg',
          studio: false,
        }, 
      } 
    },
  },
})
```

### autoImportPrefix

- Type: `object`

#### autoImportPrefix.filters

- Type: `string`
- Default: `null`

Same `or`, `and` imports are automatically added server. Bu filters example `hello` will be `helloOr` and `helloAnd`.

### driver

- Type: `postgresjs:pg` | `mysqljs:mysql`(Not ready yet) | `mssql`(Not ready yet) | `sqlite3`(Not ready yet) ... more
- Default: `postgresjs:pg`

### studio

- Type: `boolean`
- Default: `true`

Drizzle Studio is a visual query builder for your database. It is a tool that allows you to manage your database in a more organized way.

