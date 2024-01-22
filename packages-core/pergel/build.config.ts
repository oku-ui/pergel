import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  outDir: './dist',
  entries: [
    { builder: 'mkdist', input: './src', format: 'esm' },
    { builder: 'mkdist', input: './src', format: 'cjs' },
  ],
  clean: true,
  failOnWarn: false,
  declaration: true,
})
