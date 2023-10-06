import { join } from 'node:path'
import { getDirname } from '../../../utils'

export interface ProgramList {
  label: string
  value: string
  path: string
  dependencies: string[]
}

const __dirname = getDirname(import.meta.url)
export const programLists: ProgramList[] = [
  {
    label: 'Git',
    value: 'git',
    path: join(__dirname, 'git.sh'),
    dependencies: [],
  },
  {
    label: 'wget',
    value: 'wget',
    path: join(__dirname, 'wget.sh'),
    dependencies: [],
  },
  {
    label: 'curl',
    value: 'curl',
    path: join(__dirname, 'curl.sh'),
    dependencies: [],
  },
  {
    label: 'nvm',
    value: 'nvm',
    path: join(__dirname, 'nvm.sh'),
    dependencies: [
      'wget',
    ],
  },
]
