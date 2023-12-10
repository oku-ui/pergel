import { defineBuildConfig } from 'unbuild'

import pkg from './package.json'

const external = [
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  ...Object.keys(pkg.peerDependencies || {}),
]
export default defineBuildConfig({
  entries: [
    { input: 'src/core/', outDir: 'dist/core' },
  ],
  // explicitly externalize consola since Nuxt has it
  externals: [
    'consola',
    '@pergel/graphql',
    '@apollo/sandbox',
    '#pergel',
    'h3',
    'pathe',
    'scule',
    'unimport',
    'defu',
    ...external,
  ],
})
