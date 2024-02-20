import { join } from 'node:path'
import { cpSync } from 'node:fs'
import { defineBuildConfig } from 'unbuild'

import pkgBox from '../box/package.json'
import graphql from '../graphql/package.json'
import s3 from '../s3/package.json'
import rootPackage from './package.json'

export const external = [
  '#pergel',
  '#pergel/types',
  '@pergel/cli/types',
  // 'fsevents',
  // 'node:path',
  // 'node:fs',
  // 'node:http',
  // 'node:child_process',
  // 'node:stream',
  // 'node:url',
  '#pergel-useGlobalContext',
  '#pergel-usePergelState',
  // '@pergel/module-box',
  ...Object.keys(pkgBox.dependencies),
  ...Object.keys(graphql.dependencies),
  ...Object.keys(s3.dependencies),
  ...Object.keys(rootPackage.dependencies),
  ...Object.keys(rootPackage.devDependencies),
]
export default defineBuildConfig([
  {
    externals: [
      ...external,
    ],
    failOnWarn: false,
    hooks: {
      'build:done': () => {
        cpSync(
          join(__dirname, 'src', 'templates'),
          join(__dirname, 'dist', 'templates'),
          {
            recursive: true,
          },
        )
        cpSync('../../patches', './dist/patches', { recursive: true })
      },
    },
  },
])
