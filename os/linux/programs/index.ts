import { join } from 'node:path'

export interface ProgramList {
  label: string
  value: string
  path: string
  dependencies: string[]
}

export function programList(root: string) {
  const programLists: ProgramList[] = [
    {
      label: 'Git',
      value: 'git',
      path: join(root, 'os', 'linux', 'programs', 'git.sh'),
      dependencies: [],
    },
    {
      label: 'wget',
      value: 'wget',
      path: join(root, 'os', 'linux', 'programs', 'wget.sh'),
      dependencies: [],
    },
    {
      label: 'curl',
      value: 'curl',
      path: join(root, 'os', 'linux', 'programs', 'curl.sh'),
      dependencies: [],
    },
    {
      label: 'nvm',
      value: 'nvm',
      path: join(root, 'os', 'linux', 'programs', 'nvm.sh'),
      dependencies: [
        'wget',
      ],
    },
  ]
  return programLists
}
