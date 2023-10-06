import { defineCommand, runMain } from 'citty'
import packageJson from '../package.json'

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
  },
  run({ args }) {
    console.warn('Pergel CLI')
    if (args.version)
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      console.warn('Pergel CLI version:', this.meta.version)
  },
})

runMain(main)
