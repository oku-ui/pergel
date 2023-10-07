import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'
import { intro, multiselect, select } from '@clack/prompts'
import shell from 'shelljs'
import { getDirname } from '../utils'
import type { ProgramList } from '../../os/linux/programs'
import { programList } from '../../os/linux/programs'

export default defineCommand({
  meta: {
    name: 'OS',
    description: 'Auto install OS programs',
    version: '0.0.1',
  },
  async run() {
    const __dirname = getDirname(import.meta.url)
    const root = join(__dirname, '..')
    const programLists = programList(root)

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
          options: [
            {
              value: 'all',
              label: 'All',
              hint: 'If you select this, all programs will be installed',
            },
            ...programLists.map(i => ({
              value: i.label,
              label: i.label,
            })),
          ],
        }) as string[]

        if (selectPrograms.length > 0) {
          const programs: ProgramList[] = []

          if (selectPrograms.includes('all')) {
            programs.push(...programLists)
          }
          else {
            for await (const program of selectPrograms)
              programs.push(programLists.find(i => i.label === program)!)
          }

          for await (const program of programs) {
            try {
              if (program.dependencies.length > 0) {
                for await (const dependency of program.dependencies) {
                  try {
                    execSync(`sh ${programLists.find(i => i.label === dependency)!.path}`)
                    console.warn(`-- Dependency: ${dependency} installed`)
                  }
                  catch (error) {
                    console.error(`❌ ${dependency} not installed`)
                  }
                }
              }

              shell.exec(`sh ${resolve(program.path)}`)
              console.warn(`✅ ${program.label} installed`)
            }
            catch (error) {
              console.error(`❌ ${program.label} not installed`)
            }
          }
        }
      }
    }
  },
})
