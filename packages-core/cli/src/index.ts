import { runMain as _runMain, defineCommand } from 'citty'
import packageJson from '../package.json'

export { definePergel, definePergelLoadConfig } from './core'

const main = defineCommand({
  meta: {
    name: 'Pergel',
    version: packageJson.version,
    description: 'Pergel CLI',
  },
  args: {
    version: {
      alias: 'v',
      description: 'Show version',
    },
  },
  subCommands: {
    os: () => import('./commands/os').then(m => m.default),
    upgrade: () => import('./commands/upgrade').then(m => m.default),
    init: () => import('./commands/init').then(m => m.default),
    install: () => import('./commands/install').then(m => m.default),
    module: () => import('./commands/module').then(m => m.default),
    download: () => import('./commands/download').then(m => m.default),
  },
  run({ args }) {
    if (args.version)
      console.warn('Pergel CLI version:', packageJson.version)
  },
})

export const runMain = () => _runMain(main)
