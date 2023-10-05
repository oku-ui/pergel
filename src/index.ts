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
    console.clear()
    console.info(`
Pergel CLI
Usage: pergel [command] [options]

Options:
  -h, --help     Show help
  -v, --version  Show version number

Commands:
 - os          Auto install OS programs
`)
  },
})

runMain(main)
