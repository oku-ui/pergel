import { defineBuildConfig } from 'unbuild'

import pkg from './package.json'

const external = [
  'consola',
  '@pergel/graphql',
  '@apollo/sandbox',
  'graphql-yoga',
  '#pergel',
  'h3',
  'pathe',
  'scule',
  'unimport',
  'defu',
  'drizzle-orm',
  'drizzle-kit',
  'postgres',
  // @ts-expect-error
  ...Object.keys(pkg.peerDependencies || {}),
]
export default defineBuildConfig([
  // Auto preset
  {
    externals: [
      ...external,
    ],
    outDir: './dist',
    failOnWarn: false,
  },
  {
    entries: [
      {
        input: './src/runtime/modules/drizzle/templates',
        builder: 'mkdist',
        format: 'cjs',
        ext: 'cjs',
        outDir: 'dist/drizzle/schema',
      },
      {
        input: './src/runtime/modules/drizzle/templates',
        builder: 'mkdist',
        format: 'esm',
        outDir: 'dist/drizzle/schema',
      },
    ],
    failOnWarn: false,
    // TODO: if open all /src/ in export mode, then it will be a problem
    // stub: false,
    declaration: true,
    externals: [
      '@pergel/nuxt/drizzle/schema/pg',
      'drizzle-orm/pg-core',
      ...external,
    ],
  },
])
