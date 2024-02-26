# Nuxt Config

<div class="tip custom-block" style="padding-top: 8px">

If dont install pergel yet, you can install it with [Nuxt Installation](../guide/nuxt-installation).

</div>


## Pergel Options

```ts twoslash [nuxt.config.ts] {6-12}
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'pergel/nuxt',
  ],
  pergel: {
    debug: true, // default: false
    esnext: false,
    projects: {
      // ... 
    },
  },
})
```

## Projects

`changeName` is your project name. You can change it.

```ts twoslash [nuxt.config.ts] {8-12}
// https://nuxt.com/docs/api/configuration-nuxt-config#projects
export default defineNuxtConfig({
  modules: [
    'pergel/nuxt',
  ],
  pergel: {
    projects: {
      changeName: { // [!code focus]
        drizzle: true,
        vitest: true,
        // ... more modules
      }
    },
  },
})
```

::: tip
If you have discovered a better structure, please contact us. We are open to suggestions.

[Twitter](https://twitter.com/oku_ui) | [Discord](https://chat.productdevbook.com) | [GitHub](htts://github.com/oku-ui/pergel/discussions)
:::


### Modules

- [Drizzle](./modules/drizzle/configuration.md)
- [json2csv](./modules/json2csv/configuration.md)