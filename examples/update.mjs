import { execSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

const version = process.argv[2]

const folders = readdirSync('./').filter(f => f.startsWith('p-'))

// package json update "@pergel/nuxt"
for await (const folder of folders)
  execSync(`cd ${folder} && pnpm install @pergel/nuxt@${version} -w && pnpm nuxt prepare && pergel install -w`, { stdio: 'inherit' })
