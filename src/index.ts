import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'Pergel',
    version: '0.0.1',
    description: 'Pergel CLI',
  },
  subCommands: {
    os: () => import('./commands/os').then(m => m.default),
    upgrade: () => import('./commands/upgrade').then(m => m.default),
  },
  run() {
    console.warn('Pergel CLI')
    console.warn('Use --help to see all commands')
  },
})

runMain(main)
