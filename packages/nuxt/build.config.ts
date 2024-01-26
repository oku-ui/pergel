import path, { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineBuildConfig } from 'unbuild'

import pkgBox from '../box/package.json'

const version = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf-8'),
).version

const externalBox = Object.keys(pkgBox.dependencies)

export const external = [
  'consola',
  '@pergel/graphql',
  '@apollo/sandbox',
  'graphql-yoga',
  '#pergel',
  '#pergel/types',
  'h3',
  'pathe',
  'scule',
  'unimport',
  'defu',
  'drizzle-orm',
  'drizzle-kit',
  'postgres',
  '@egoist/tailwindcss-icons',
  'drizzle',
  'oslo',
  'lucia',
  '@lucia-auth/adapter-drizzle',
  '@lucia-auth/adapter-postgresql',
  'chokidar',
  '@nuxt/kit',
  '@nuxt/schema',
  'globby',
  'fsevents',
  'node:path',
  'node:fs',
  '@pergel/cli/types',
  'defu',
  'pathe',
  'node:http',
  'node:child_process',
  'node:stream',
  'node:url',
  'slugify',
  'c12',
  '@pergel/module-box',
  ...externalBox,
]
export default defineBuildConfig([
  {
    externals: [
      ...external,
    ],
    rollup: {
      alias: {
        entries: [
          { find: '@/', replacement: path.resolve(__dirname, 'src/') },
        ],
      },
    },
    alias: {
      '@/': path.resolve(__dirname, 'src/'),
    },
    replace: {
      __VERSION__: JSON.stringify(version),
    },
    failOnWarn: false,
  },
])
