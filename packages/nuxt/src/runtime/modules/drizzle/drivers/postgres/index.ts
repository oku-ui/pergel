import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { startSubprocess } from '@nuxt/devtools-kit'
import { createResolver } from '@nuxt/kit'
import type { ResolvedDrizzleConfig } from '../../types'

import { createDrizzleConfig } from '../../defaults/postgresjs'
import type { NuxtPergel } from '../../../../core/types'
import { generateModuleRuntimeConfig } from '../../../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../../../core/utils/generateYaml'

export async function setupPostgres(nuxt: NuxtPergel<ResolvedDrizzleConfig>) {
  const _resolver = createResolver(import.meta.url)
  const module = nuxt._pergel._module
  const projectName = module.projectName
  const { driver } = module.options._driver

  const { env } = generateModuleRuntimeConfig(nuxt, {
    url: '',
    host: '', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: '', // Name of database to connect to
    user: '', // Username of database user
    password: '', // Password of database user
    ssl: false, // Use SSL
    drop: false, // Drop database before migration
    seed: false, // Seed database after migration
  }, false, 'pg')

  // Config generation
  const drizzleConfig = /* ts */`// Pergel Drizzle ${projectName} Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: '${nuxt._pergel._module.dir.module}/schema/index.ts',
  out: '${nuxt._pergel._module.dir.module}/migrations',
  ${driver === 'pg' ? `driver: '${driver}',` : ''}
  dbCredentials: process.env.${env.url}
    ? {
        connectionString: process.env.${env.url},
      }
    : {
        host: process.env.${env.host},
        port: process.env.${env.port},
        database: process.env.${env.database},
        user: process.env.${env.user},
        password: process.env.${env.password},
        ssl: process.env.${env.ssl},
      },
}
`

  if (!existsSync(nuxt._pergel._module.moduleDir))
    mkdirSync(nuxt._pergel._module.moduleDir, { recursive: true, mode: 0o777 })

  if (!existsSync(resolve(nuxt._pergel._module.moduleDir, 'drizzle.config.js'))) {
    writeFileSync(resolve(nuxt._pergel._module.moduleDir, 'drizzle.config.js'), drizzleConfig, {
      mode: 0o777,
      encoding: 'utf8',
    })
  }

  // Seed generation
  if (!existsSync(resolve(nuxt._pergel._module.moduleDir, 'seeds')))
    mkdirSync(resolve(nuxt._pergel._module.moduleDir, 'seeds'), { recursive: true, mode: 0o777 })

  if (!existsSync(resolve(nuxt._pergel._module.moduleDir, 'seeds/index.ts'))) {
    const readFile = await import(_resolver.resolve('./seed/index.ts')).then(m => m.default).catch(() => null)
    if (readFile) {
      const file = readFile({
        env: {
          dbUrl: env.url,
          dbDrop: env.drop,
          dbSeed: env.seed,
        },
        migrationDir: `${nuxt._pergel._module.options.migrationsPath}`,
      })
      writeFileSync(resolve(nuxt._pergel._module.moduleDir, 'seeds/index.ts'), file, {
        mode: 0o777,
        encoding: 'utf8',
      })
    }
  }

  if (!existsSync(resolve(nuxt._pergel._module.moduleDir, 'seeds/seed1.ts'))) {
    const readFile = await import(_resolver.resolve('./seed/seed1.ts')).then(m => m.default).catch(() => null)
    if (readFile) {
      const file = readFile()
      writeFileSync(resolve(nuxt._pergel._module.moduleDir, 'seeds/seed1.ts'), file, {
        mode: 0o777,
        encoding: 'utf8',
      })
    }
  }

  createDrizzleConfig({ schemaPath: nuxt._pergel._module.options.schemaPath })

  if (nuxt.options.dev) {
    const subprocess = startSubprocess({
      command: 'drizzle-kit',
      args: ['studio', '--port', '3105', `--config=${nuxt._pergel._module.moduleDir}/drizzle.config.js`],
      cwd: nuxt.options.rootDir,
      env: {
        ...process.env,
      },
    }, {
      id: `drizzle-kit-${projectName}`,
      name: `drizzle-kit ${projectName}`,
    })

    subprocess.getProcess().stdout?.on('data', (data) => {
    // eslint-disable-next-line no-console
      console.log(` sub: ${data.toString()}`)
    })

    process.on('exit', () => {
      subprocess.terminate()
    })
  }

  generateProjectReadme(nuxt, ({ addCommentBlock }) => ({
    ...addCommentBlock('Script Commands'),
    scripts: {
      migrate: `drizzle-kit generate:${driver} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      generate: `drizzle-kit generate:${driver} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      push: `drizzle-kit push:${driver} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      drop: `drizzle-kit drop --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      up: `drizzle-kit up:${driver} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      studio: `drizzle-kit studio --port 3105 --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      seed: `tsx ${nuxt._pergel._module.dir.module}/seeds/index.ts`,
    },
    cli: {
      migrate: `pergel orm -s=migrate -p=${projectName}`,
      push: `pergel orm -s=push -p=${projectName}`,
      drop: `pergel orm -s=drop -p=${projectName}`,
      up: `pergel orm -s=up -p=${projectName}`,
      generate: `pergel orm -s=generate -p=${projectName}`,
      studio: `pergel orm -s=studio -p=${projectName}`,
      seed: `pergel orm -s=seed -p=${projectName}`,
    },
  }))
}
