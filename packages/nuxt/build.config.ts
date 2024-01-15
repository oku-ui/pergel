import { defineBuildConfig } from 'unbuild'

// import pkg from './package.json'
//   ...Object.keys(pkg.peerDependencies || {}),

export const external = [
  'consola',
  '@pergel/graphql',
  '@apollo/sandbox',
  'graphql-yoga',
  '#pergel',
  '#imports',
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
  'fsevents',
  'node:path',
  'node:fs',
  'node:http',
  'node:child_process',
  'node:stream',
  'node:url',
  'typescript',
  'fsevents',
  'node:url',
  'node:buffer',
  'node:path',
  'node:child_process',
  'node:process',
  'node:path',
  'node:os',
]
export default defineBuildConfig([
  // Auto preset
  {
    externals: [
      ...external,
    ],
    rollup: {
      inlineDependencies: true,
    },
    outDir: './dist',
    failOnWarn: false,
  },
])
