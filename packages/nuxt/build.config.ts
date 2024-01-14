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
  '@egoist/tailwindcss-icons',
  'drizzle',
  'oslo',
  'lucia',
  '@lucia-auth/adapter-drizzle',
  '@lucia-auth/adapter-postgresql',
  'fsevents',
  'node:path',
  'node:fs',
  'node:http',
  'node:child_process',
  'node:stream',
  'node:url',
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
