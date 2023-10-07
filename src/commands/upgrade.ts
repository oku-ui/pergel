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
    console.warn('Please wait...')
    execSync('npm i -g pergel@latest', { stdio: 'inherit' })
    console.warn('Done! ✅')
  },
})
