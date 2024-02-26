---
outline: deep
---

# json2csv

[json2csv](https://github.com/juanjoDiaz/json2csv) Fast and highly configurable JSON to CSV converter.

- 🚀 Efficient and lightweight processing.
- 📋 Compatible with both standard JSON and NDJSON.
- 📈 Scales seamlessly with stream processing for large datasets.
- 🎛️ Allows automatic field discovery, underscore-like selectors, custom data getters, and default values for missing fields.
- 🔄 Provides flexibility for custom data transformations.
- 📊 Customizable formatting options for CSV cells.
- 🛠️ Highly customizable with support for custom quotation marks, delimiters, end-of-line values, etc.
- 🧊 Automatically escapes special characters like new lines and quotes.
- 🗂️ Ability to handle data with or without headers.
- 🔤 Supports encoding and decoding of Unicode characters.
- 🖨️ Presents data in a visually pleasing table format when printed to the standard output.

## Installation

### Step 1: Install
<div class="tip custom-block" style="padding-top: 8px">

Install pergel nuxt module. [here](../../../guide/nuxt-installation.md)

</div>


### Step 2: Configuration

```ts twoslash [nuxt.config.ts]
// https://nuxt.com/docs/api/configuration-nuxt-config#projects
export default defineNuxtConfig({
  modules: [
    'pergel/nuxt',
  ],
  pergel: {
    projects: {
      changeName: { // [!code focus]
        json2csv: true, // [!code focus]
        // ... other modules
      } // [!code focus]
    },
  },
})
```

<!-- automd:changeName -->

::: tip changeName
`changeName` is the name of your project. Please change it to your project name.
:::

<!-- /automd -->

### Step 3: Generate Type and Pergel folders/files

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

### Step 4: Install Dependencies/DevDependencies

Auto install dependencies and devDependencies for the project.

::: code-group

```sh [pnpm]
$ pnpm pergel install
```

```sh [npm]
$ npm pergel install
```

```sh [yarn]
$ yarn pergel install
```

```sh [bun]
$ bun pergel install
```

:::