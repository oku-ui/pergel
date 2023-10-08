import { execSync } from 'node:child_process'
import { join } from 'node:path'

export interface ProgramList {
  label: string
  value: string
  path: string
  dependencies: string[]
  isActive: () => Promise<boolean>
}

export function programList(root: string) {
  const programLists: ProgramList[] = [
    {
      label: 'Git',
      value: 'git',
      path: join(root, 'os', 'linux', 'programs', 'git.sh'),
      isActive: async () => {
        return isActive('git --version')
      },
      dependencies: [],
    },
    {
      label: 'wget',
      value: 'wget',
      path: join(root, 'os', 'linux', 'programs', 'wget.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('wget --version')
      },
    },
    {
      label: 'gdebi',
      value: 'gdebi',
      path: join(root, 'os', 'linux', 'programs', 'gdebi.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('gdebi --version')
      },
    },
    {
      label: 'curl',
      value: 'curl',
      path: join(root, 'os', 'linux', 'programs', 'curl.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('curl --version')
      },
    },
    {
      label: 'jq',
      value: 'jq',
      path: join(root, 'os', 'linux', 'programs', 'jq.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('jq --version')
      },
    },
    {
      label: 'nvm',
      value: 'nvm',
      path: join(root, 'os', 'linux', 'programs', 'nvm.sh'),
      dependencies: [
        'wget',
      ],
      isActive: async () => {
        return false
      },
    },
    {
      label: 'pnpm',
      value: 'pnpm',
      path: join(root, 'os', 'linux', 'programs', 'pnpm.sh'),
      dependencies: [
        'curl',
      ],
      isActive: async () => {
        return isActive('pnpm --version')
      },
    },
    {
      label: 'google chrome',
      value: 'google-chrome',
      path: join(root, 'os', 'linux', 'programs', 'chrome.sh'),
      dependencies: [
        'wget',
      ],
      isActive: async () => {
        return false
      },
    },
    {
      label: 'github desktop',
      value: 'github-desktop',
      path: join(root, 'os', 'linux', 'programs', 'github-desktop.sh'),
      dependencies: [
        'wget',
        'curl',
        'jq',
        'gdebi',
      ],
      isActive: async () => {
        return isActive('dpkg -s github-desktop')
      },
    },
    {
      label: 'vscode',
      value: 'vscode',
      path: join(root, 'os', 'linux', 'programs', 'vscode.sh'),
      dependencies: [
        'wget',
      ],
      isActive: async () => {
        return isActive('code --version')
      },
    },

  ]
  return programLists
}

function isActive(command: string) {
  let isInstalled = false
  try {
    const data = execSync(command, { encoding: 'utf-8' })
    if (data.length > 3)
      isInstalled = true
  }
  catch (error) {
    isInstalled = false
  }
  return isInstalled
}
