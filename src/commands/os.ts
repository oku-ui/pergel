import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'OS',
    description: 'Auto install OS programs',
    version: '0.0.1',
  },
  async run({ args }) {
    console.log('init', args)
  },
})
