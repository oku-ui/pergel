import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const version = process.argv[2]

const folders = readdirSync('./').filter(f => f.startsWith('p-'))

// package json update "@pergel/nuxt" change new version
for await (const folder of folders) {
  // get package json
  const _folder = resolve(`./${folder}`)
  const packageJson = JSON.parse(readFileSync(`${_folder}/package.json`, 'utf8'))
  // change version
  packageJson.dependencies['@pergel/nuxt'] = version
  // write package json
  writeFileSync(`./${folder}/package.json`, JSON.stringify(packageJson, null, 2), 'utf8')
}

execSync('pnpm install', { stdio: 'inherit' })

for await (const folder of folders)
  execSync(`cd ${folder} && pnpm nuxt prepare && pergel install`, { stdio: 'inherit' })
