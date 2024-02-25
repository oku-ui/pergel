# Nuxt Installation

### Prerequisites

- [Node.js](https://nodejs.org/) version 20.11 or higher.
- [VSCode](https://code.visualstudio.com/) is recommended, along with the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar).
- [PNPM](https://pnpm.io/) is recommended.

<div class="tip custom-block" style="padding-top: 8px">

Skip More Nuxt Configuration [here](../nuxt/nuxt-config).

</div>

## Installation

::: code-group

```sh [pnpm]
$ pnpm add -D pergel
```

```sh [npm]
$ npm add -D pergel
```

```sh [yarn]
$ yarn add -D pergel
```

```sh [bun]
$ bun add -D pergel
```

:::


### Setup Wizard

Get started with Pergel by running the following command: 
This will create a `pergel.ts` file in your project `.config` folder.

::: code-group

```sh [pnpm]
$ pnpm pergel init
```

```sh [npm]
$ npm pergel init
```

```sh [yarn]
$ yarn pergel init
```

```sh [bun]
$ bun pergel init
```

:::


### Usage

1. Go to `nuxt.config.ts` and add the following code:

```ts twoslash [nuxt.config.ts] {4}
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'pergel/nuxt',
  ],
})
```

2. The prepare command creates a .nuxt directory in your application and generates types.

::: code-group

```sh [pnpm]
$ pnpm nuxt prepare
```

```sh [npm]
$ npm nuxt prepare
```

```sh [yarn]
$ yarn nuxt prepare
```

```sh [bun]
$ bun nuxt prepare
```

:::

3. Crete project with the following command:


```ts twoslash [nuxt.config.ts] {6-13}
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'pergel/nuxt',
  ],
  pergel: {
    projects: {
      // changeName -> Please change this to your project name camelCase
      changeName: {
        // ...modules and options
      }
    }
  },
})
```

4. Generates types and `pergel` folder upgrade.


::: code-group

```sh [pnpm]
$ pnpm nuxt prepare
```

```sh [npm]
$ npm nuxt prepare
```

```sh [yarn]
$ yarn nuxt prepare
```

```sh [bun]
$ bun nuxt prepare
```

:::

::: info
Success! You have installed Pergel. Now you can start your project with Pergel.
More Nuxt Configuration [here](../nuxt/nuxt-config).
:::
