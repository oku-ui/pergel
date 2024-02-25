# CLI Installation

### Prerequisites

- [Node.js](https://nodejs.org/) version 20.11 or higher.
- [PNPM](https://pnpm.io/) is recommended.

<div class="tip custom-block" style="padding-top: 8px">

Skip More CLU Configuration [here](../cli/cli-config).

</div>

## Installation

::: code-group

```sh [pnpm]
$ pnpm install -g pergel
```

```sh [npm]
$ npm install -g pergel
```

```sh [yarn]
$ yarn install -g pergel
```

```sh [bun]
$ bun install -g pergel
```

:::


### Usage

Global only the following commands are available for use. The other help you see is also valid for Nuxt and Nitro project. We do not recommend calling globally there.

1. Help

```sh
$ pergel --help
```

2. Init

```sh
$ pergel os
```

::: info
Success! You have installed Pergel. Now you can start your project with Pergel.
More CLI Configuration [here](../cli/cli-config).
:::