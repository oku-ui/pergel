import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ResolvedDrizzleConfig } from '../../types'

import { createDrizzleConfig } from '../../defaults/postgresjs'
import type { NuxtPergel } from '../../../../core/types'
import { generateModuleRuntimeConfig } from '../../../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../../../core/utils/generateYaml'

export async function setupPostgres(nuxt: NuxtPergel<ResolvedDrizzleConfig>) {
  const module = nuxt._pergel._module
  const projectName = module.projectName
  const { driver, name } = module.options._driver

  const { env } = generateModuleRuntimeConfig(nuxt, {
    url: '',
    host: '', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: '', // Name of database to connect to
    user: '', // Username of database user
    password: '', // Password of database user
    ssl: false, // Use SSL
  }, false, name)

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

  createDrizzleConfig({ schemaPaths: nuxt._pergel._module.options.schemaPaths })

  generateProjectReadme(nuxt, ({ addCommentBlock }) => ({
    ...addCommentBlock('Script Commands'),
    scripts: {
      migrate: `drizzle-kit generate:${name} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      generate: `drizzle-kit generate:${name} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      push: `drizzle-kit push:${name} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      drop: `drizzle-kit drop --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
      up: `drizzle-kit up:${name} --config=${nuxt._pergel._module.dir.module}/drizzle.config.js`,
    },
    cli: {
      // TODO: delete cli -b
      migrate: `pergel orm -s=migrate -p=${projectName}`,
      push: `pergel orm -s=push -p=${projectName}`,
    },
  }))
}
