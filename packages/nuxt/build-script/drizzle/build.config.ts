import { defineBuildConfig } from 'unbuild'

import { external } from '../../build.config'

export default defineBuildConfig([
  {
    entries: [
      {
        input: '../../src/runtime/modules/drizzle/templates',
        builder: 'mkdist',
        format: 'cjs',
        ext: 'cjs',
        outDir: '../../lib/drizzle/schema',
      },
      {
        input: '../../src/runtime/modules/drizzle/templates',
        builder: 'mkdist',
        format: 'esm',
        outDir: '../../lib/drizzle/schema',
      },
    ],
    declaration: true,
    externals: [
      '@pergel/nuxt/drizzle/schema/pg',
      'drizzle-orm/pg-core',
      ...external,
    ],
  },
])
