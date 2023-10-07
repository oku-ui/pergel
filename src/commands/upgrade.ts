import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'Pergel Upgrade',
    description: 'Upgrade Pergel CLI',
    version: '0.0.1',
  },
  async run() {
    console.warn('Please wait...')
    execSync('npm i -g pergel@latest --force', { stdio: 'inherit' })
    console.warn('Done! ✅')
  },
})
