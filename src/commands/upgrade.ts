import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'
import packageJson from '../../package.json'

export default defineCommand({
  meta: {
    name: 'Pergel Upgrade',
    description: 'Upgrade Pergel CLI',
    version: '0.0.1',
  },
  async run() {
    const githubRelease = execSync('curl -s https://api.github.com/repos/oku-ui/pergel/releases/latest').toString()

    const githubReleaseJson = JSON.parse(githubRelease)
    const githubReleaseVersion = githubReleaseJson.tag_name.replace('v', '')

    if (githubReleaseVersion !== packageJson.version) {
      console.warn(`New version available: ${githubReleaseVersion}`)
      console.warn('Please wait...')
      execSync('npm i -g pergel@latest', { stdio: 'inherit' })
      console.warn('Done! ✅')
    }
    else {
      console.warn('Already up to date!')
    }
  },
})
