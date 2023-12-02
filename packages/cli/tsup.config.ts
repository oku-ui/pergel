import type { Options } from 'tsup'

import pkg from './package.json'

const external = [
  ...Object.keys(pkg.dependencies || {}),
]

export default <Options>{
  entryPoints: [
    'src/index.ts',
    'src/core.ts',
  ],
  outDir: 'dist',
  target: 'esnext',
  format: ['esm'],
  clean: true,
  dts: true,
  external,
}
