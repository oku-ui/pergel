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
      label: 'snap',
      value: 'snap',
      path: join(root, 'os', 'linux', 'programs', 'snap.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('snap --version')
      },
    },
    {
      label: 'brew',
      value: 'brew',
      path: join(root, 'os', 'linux', 'programs', 'brew.sh'),
      dependencies: [
        'curl',
      ],
      isActive: async () => {
        return isActive('brew --version')
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
      label: 'unzip',
      value: 'unzip',
      path: join(root, 'os', 'linux', 'programs', 'unzip.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('which unzip')
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
      label: 'bun',
      value: 'bun',
      path: join(root, 'os', 'linux', 'programs', 'bun.sh'),
      dependencies: [
        'curl',
        'unzip',
      ],
      isActive: async () => {
        return isActive('bun --version')
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
    {
      label: 'docker desktop',
      value: 'docker-desktop',
      path: join(root, 'os', 'linux', 'programs', 'docker-desktop.sh'),
      dependencies: [
        'curl',
      ],
      isActive: async () => {
        return isActive('dpkg -s docker-desktop')
      },
    },
    {
      label: 'beekeeper studio',
      value: 'beekeeper-studio',
      path: join(root, 'os', 'linux', 'programs', 'beekeeper-studio.sh'),
      dependencies: [],
      isActive: async () => {
        return isActive('dpkg -s beekeeper-studio')
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
