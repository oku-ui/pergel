import { defineCommand } from 'citty'
import consola from 'consola'

export default defineCommand({
  meta: {
    name: 'Pergel Upgrade',
    description: 'Upgrade Pergel CLI',
    version: '0.0.2',
  },
  async run() {
    // execSync('npm i -g pergel@latest --force', { stdio: 'inherit' })
    consola.info('Please run one of the following commands:')
    consola.info('npm i -g pergel@latest --force')
    consola.info('yarn global add pergel@latest --force')
    consola.info('pnpm i -g pergel@latest --force')
    console.warn('Done! ✅')
  },
})
