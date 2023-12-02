---
title: Pnpm
description: Pnpm is a fast, disk space efficient package manager for JavaScript.
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Pnpm
    icon: i-ph-link
    to: https://pnpm.io/
---

# What is Pnpm?

Pnpm is a fast, disk space efficient package manager for JavaScript.

It performs well in every major benchmark and supports a wide variety of configurations. It is used by millions of projects around the world and has been in development since 2016. It is a drop-in replacement for npm.

Pnpm uses hard links and symlinks to save one version of a module only ever once on a disk. When using npm or Yarn for example, if you have 100 projects using the same version of lodash, you will have 100 copies of lodash on disk. With pnpm, lodash will be saved in a single place on the disk and a hard link will put it into the node_modules where it should be installed.


## Install Pnpm

You can install the Pnpm program with [Pergel](/pergel/getting-started).

To make sure that Pnpm is installed correctly, run the following command: `pnpm --version`


## Pnpm vs Npm

| Feature | Pnpm | Npm |
| --- | --- | --- |
| Disk space usage | 1x | 3x |
| Network traffic | 1x | 3x |
| Installation speed | 1x | 3x |
| Update speed | 1x | 3x |
| Node.js version | 10+ | 10+ |
| Node.js version | 10+ | 10+ |

## Pnpm vs Yarn

| Feature | Pnpm | Yarn |
| --- | --- | --- |
| Disk space usage | 1x | 2x |
| Network traffic | 1x | 2x |
| Installation speed | 1x | 2x |
| Update speed | 1x | 2x |
| Node.js version | 10+ | 10+ |


## Pnpm Commands

::code-group
```sh [terminal]
pnpm install <pkg>​             # install a package
pnpm install                   # install all dependencies
pnpm update                    # update all dependencies
pnpm run start                 # run the `start` script
pnpm build ./index.tsx         # bundle a project for browsers
pnpm test                      # run tests
pnpm exec cowsay "Hello, world!"   # execute a package
```
::

## Pnpm Config

::code-group
```sh [terminal]
pnpm config set <key> <value>   # set a config
pnpm config get <key>           # get a config
pnpm config delete <key>        # delete a config
pnpm config list                # list all configs
```
::

## Pnpm Help

::code-group
```sh [terminal]
pnpm help <command>             # show help for a pnpm command
pnpm help <command> <subcommand> # show help for a pnpm subcommand
```
::

## Pnpm Init

::code-group
```sh [terminal]
pnpm init                       # create a new package.json file
```
::

## Pnpm Install

::code-group
```sh [terminal]
pnpm install <pkg>​             # install a package
pnpm install                   # install all dependencies
pnpm update                    # update all dependencies
```
::

## Pnpm Install Options

| Option | Description |
| --- | --- |
| -P, --save-prod | Package will appear in your dependencies. This is the default unless -D or -O are present. |
| -D, --save-dev | Package will appear in your devDependencies. |
| -O, --save-optional | Package will appear in your optionalDependencies. |
| -E, --save-exact | Saved dependencies will be configured with an exact version rather than using npm's default semver range operator. |
| -B, --save-bundle | Saved dependencies will also be added to your bundleDependencies list. |
| -g, --global | Install the package globally |
| -D, --save-dev | Package will appear in your devDependencies. |

## Pnpm Install Examples

::code-group
```sh [terminal]
pnpm install lodash
pnpm install lodash --save-prod
pnpm install lodash --save-dev
pnpm install lodash --save-optional
pnpm install lodash --save-exact
pnpm install lodash --save-bundle
pnpm install lodash --global
```
::

## Pnpm Update

::code-group
```sh [terminal]
pnpm update                    # update all dependencies
```
::

## Pnpm Run

::code-group
```sh [terminal]
pnpm run start                 # run the `start` script
pnpm run build                 # run the `build` script
pnpm run test                  # run the `test` script
```
::


## Create Web Server in Pnpm

::code-group
```sh [terminal]
mkdir my-project
cd my-project
pnpm init
pnpm install express
```
```sh [index.js]
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```
```sh [terminal]
node index.js
```
::
