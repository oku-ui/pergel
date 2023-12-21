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
  {
    externals: [
      ...external,
    ],
  },
  {
    entries: [{
      input: './src/runtime/modules/drizzle/templates',
      builder: 'mkdist',
      format: 'cjs',
      ext: 'cjs',
      outDir: './lib/drizzle/schema',
    }, {
      input: './src/runtime/modules/drizzle/templates',
      builder: 'mkdist',
      format: 'esm',
      declaration: true,
      outDir: './lib/drizzle/schema',
    }],
    stub: false,
    declaration: true,
    externals: [
      ...external,
    ],
  },
])
