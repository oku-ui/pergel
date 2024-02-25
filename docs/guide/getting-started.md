# Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version 20.11 or higher.
- [VSCode](https://code.visualstudio.com/) is recommended.
- [PNPM](https://pnpm.io/) is recommended.

## Directory Structure

The Pergel contains a structure like the one below. This structure keeps your project clean in a clean code layout and facilitates communication between modules.

::: tip
If you have discovered a better structure, please contact us. We are open to suggestions.

[Twitter](https://twitter.com/oku_ui) |
[Discord](https://chat.productdevbook.com) |
[GitHub](https://github.com/oku-ui/pergel/discussions)
:::

```
.config/
├─ pergel.ts

.nuxt/
...

pergel/
├─ .vscode/
│  ├─ settings.json
├─ [moduleName-projectName]/
│  ├─ ...
├─ .env.example
├─ merged-package.json
├─ README.json

server/
├─ [moduleName-projectName]/
│  ├─ ...
```

## Installation

<div class="tip custom-block" style="padding-top: 8px">

Nuxt installation guide is [here](./nuxt-installation).

</div>


<div class="tip custom-block" style="padding-top: 8px">

CLI installation guide is [here](./nuxt-installation).

</div>

<div class="tip custom-block" style="padding-top: 8px">

Nitro installation guide is [here](./nuxt-installation). (Not ready yet)

</div>