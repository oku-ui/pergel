# Contributing

We're so excited you're interested in helping with Oku! We are happy to help you get started, even if you don't have any previous open-source experience :blush:

## New to Open Source?

1. Take a look at [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Where to ask Questions?

1. Check our [Github Issues](https://github.com/oku-ui/pergel/issues) to see if someone has already answered your question.
2. Join our community on [Discord](https://chat.productdevbook.com) and feel free to ask us your questions


### Prerequisites
-   [Min Nodejs 20] & [PNPM >= 8.13.0](https://pnpm.io) installed
-   IDE: [VSCode](https://code.visualstudio.com/download)(recommended) or equivalent IDE

Note: If you have [nvm](https://github.com/nvm-sh/nvm), you can run `nvm i` to install the required version.

### VScode Extensions

-  [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Project Setup

1. Fork the [oku-ui](https://github.com/oku-ui/pergel) repository
2. Install the project dependencies.
   `pnpm install`
3. If you are going to deal with packages in `./packages-core`, you should install pnpm there too. It is different from root. 
   `cd ./packages-core && pnpm install`

### Packages

- [pergel](./packages-core) - CLI and Pergel core packages
- [nuxt module](./packages/nuxt)

## Pull Request

1. Before submitting a pull request make sure all tests have passed
2. Reference the relevant issue or pull request and give a clear description of changes/features added when submitting a pull request
3. Make sure the PR title follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification

## Oku Community

Oku is made possible by a passionate team and a strong community of developers. If you have any questions or would like to get more involved in the Oku community you can check out:

-   [Github Issues](https://github.com/oku-ui/pergel/issues)
-   [Discord](https://chat.productdevbook.com)
-   [Twitter](https://twitter.com/oku_ui)