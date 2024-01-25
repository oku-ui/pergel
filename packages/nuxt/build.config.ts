import { defineBuildConfig } from 'unbuild'

import pkgBox from '../box/package.json'

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
    entries: [
      { input: './src/modules/', outDir: `dist/modules`, ext: 'mjs' },
      { input: './src/core/', outDir: `dist/core`, ext: 'mjs' },
    ],
    externals: [
      ...external,
    ],
    rollup: {
      esbuild: {
        target: 'esnext',
      },
      emitCJS: true,
      cjsBridge: true,
      inlineDependencies: false,
    },
    failOnWarn: false,
  },
])
