import { defineBuildConfig } from 'unbuild'

import pkg from './package.json'

export const external = [
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
  },
])
