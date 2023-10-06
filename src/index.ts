import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'Pergel',
    version: '0.0.1',
    description: 'Pergel CLI',
  },
  subCommands: {
    os: () => import('./commands/os').then(m => m.default),
  },
  run({ args }) {

  },
})

runMain(main)
