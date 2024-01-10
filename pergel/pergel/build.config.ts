import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
  // Auto preset
  {
    outDir: './dist',
    entries: [
      { input: 'src/index', format: 'esm' },
    ],
    declaration: true,
  },
])
