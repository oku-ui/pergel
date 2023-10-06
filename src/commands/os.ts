import { defineCommand } from 'citty'
import { intro, multiselect, select } from '@clack/prompts'

export default defineCommand({
  meta: {
    name: 'OS',
    description: 'Auto install OS programs',
    version: '0.0.1',
  },
  async run({ args }) {
    console.clear()
    intro('OS - Pergel')
    const selectOS = await select({
      message: 'select os',
      options: [
        {
          label: 'Linux',
          value: 'linux',
        },
        {
          label: 'Macos',
          value: 'macos',
        },
      ],
    })

    console.log(selectOS)
  },
})
