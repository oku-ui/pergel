import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'
import { intro, multiselect, select } from '@clack/prompts'
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
    }) as string

    const whichDo = await select({
      message: 'What do you want to do?',
      options: [
        {
          label: 'Install programs',
          value: 'install-program',
        },
        {
          label: 'Uninstall programs',
          value: 'uninstall-program',
        },
      ],
    }) as string

    if (selectOS === 'linux') {
      if (whichDo === 'install-program') {
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
              const data = await program.isActive()
              if (!data) {
                if (program.dependencies.length > 0) {
                  for await (const dependency of program.dependencies) {
                    try {
                      execSync(`sh ${programLists.find(i => i.label === dependency)!.path} install`)
                      console.warn(`-- Dependency: ${dependency} installed`)
                    }
                    catch (error) {
                      console.error(`❌ ${dependency} not installed`)
                    }
                  }
                }
                execSync(`sh ${resolve(program.path)} install`, { stdio: 'inherit' })
                console.warn(`✅ ${program.label} installed`)
              }
              else {
                console.warn(`✅ ${program.label} is already installed`)
              }
            }
            catch (error) {
              console.error(`❌ ${program.label} not installed`)
            }
          }
        }
      }
      else if (whichDo === 'uninstall-program') {
        const selectPrograms = await multiselect({
          message: 'select programs',
          options: [
            ...programLists.map(i => ({
              value: i.label,
              label: i.label,
            })),
          ],
        }) as string[]

        if (selectPrograms.length > 0) {
          const programs: ProgramList[] = []

          for await (const program of selectPrograms)
            programs.push(programLists.find(i => i.label === program)!)

          for await (const program of programs) {
            try {
              const data = await program.isActive()
              console.warn(data, 'uninstall')
              if (data) {
                execSync(`sh ${resolve(program.path)} uninstall`, { stdio: 'inherit' })
                console.warn(`✅ ${program.label} uninstalled`)
              }
              else {
                console.warn(`✅ ${program.label} is not installed`)
              }
            }
            catch (error) {
              console.error(`❌ ${program.label} not uninstalled`)
            }
          }
        }
      }
    }
  },
})
