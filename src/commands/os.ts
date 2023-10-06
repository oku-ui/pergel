import { basename, join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'
import { intro, multiselect, select } from '@clack/prompts'
import { globbySync } from 'globby'
import { exec } from 'shelljs'

export default defineCommand({
  meta: {
    name: 'OS',
    description: 'Auto install OS programs',
    version: '0.0.1',
  },
  async run({ args }) {
    const osLinuxPath = join(__dirname, '..', 'os', 'linux')

    // console.clear()
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

    const whichDo = await multiselect({
      message: 'What do you want to do?',
      options: [
        {
          label: 'Install programs',
          value: 'install',
        },
      ],
    }) as string[]

    if (selectOS === 'linux') {
      if (whichDo.includes('install')) {
        const selectPrograms = await multiselect({
          message: 'select programs',
          options: globbySync(`${osLinuxPath}/programs`).map(i => ({
            value: i,
            label: basename(i).slice(0, -3),
          })),
        }) as string[]

        if (selectPrograms.length > 0) {
          for await (const program of selectPrograms) {
            try {
              exec(`sh ${resolve(program)}`)
              console.warn(`✅ ${basename(program).slice(0, -3)} installed`)
            }
            catch (error) {
              console.error(`❌ ${basename(program).slice(0, -3)} not installed`)
            }
          }
        }
      }
    }
  },
})
