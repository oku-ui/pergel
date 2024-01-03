import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { startSubprocess } from '@nuxt/devtools-kit'
import type { ResolvedDrizzleConfig } from '../../types'

import { createDrizzleConfig } from '../../defaults/postgresjs'
import type { NuxtPergel, ResolvedModuleOptions } from '../../../../core/types'
import { generateModuleRuntimeConfig } from '../../../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../../../core/utils/generateYaml'
import { createDockerService } from '../../../../core/utils/createDockerService'

export async function setupPostgres(
  nuxt: NuxtPergel,
  options: ResolvedDrizzleConfig,
  moduleOptions: ResolvedModuleOptions,
) {
  const projectName = moduleOptions.projectName
  const moduleName = moduleOptions.moduleName
  const { driver } = options._driver

  const { env } = generateModuleRuntimeConfig(nuxt, moduleOptions, {
    url: 'postgres://postgres:postgres@localhost:5432/postgres',
    host: 'localhost', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: 'postgres', // Name of database to connect to
    user: 'postgres', // Username of database user
    password: 'postgres', // Password of database user
    ssl: false, // Use SSL
    drop: false, // Drop database before migration
    seed: false, // Seed database after migration
  }, false, 'pg')

  // Config generation
  const drizzleConfig = /* ts */`// Pergel Drizzle ${projectName} Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: '${moduleOptions.dir.module}/schema/index.ts',
  out: '${moduleOptions.dir.module}/migrations',
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

  if (!existsSync(moduleOptions.moduleDir))
    mkdirSync(moduleOptions.moduleDir, { recursive: true, mode: 0o777 })

  if (!existsSync(resolve(moduleOptions.moduleDir, 'drizzle.config.js'))) {
    writeFileSync(resolve(moduleOptions.moduleDir, 'drizzle.config.js'), drizzleConfig, {
      mode: 0o777,
      encoding: 'utf8',
    })
  }

  // Seed generation
  if (!existsSync(resolve(options.seedPaths)))
    mkdirSync(resolve(moduleOptions.moduleDir, 'seeds'), { recursive: true, mode: 0o777 })

  if (!existsSync(resolve(options.seedPaths, 'index.ts'))) {
    const readFile = await import('./seed').then(m => m.default).catch(() => null)
    if (readFile) {
      const file = readFile({
        env: {
          dbUrl: env.url,
          dbDrop: env.drop,
          dbSeed: env.seed,
        },
        migrationDir: join(moduleOptions.dir.module, options.dir.migrations),
      })
      writeFileSync(resolve(options.seedPaths, 'index.ts'), file, {
        mode: 0o777,
        encoding: 'utf8',
      })
    }
  }

  if (!existsSync(resolve(options.seedPaths, 'seeds', 'seed1.ts'))) {
    const readFile = await import('./seed/s-seed1').then(m => m.default).catch(() => null)
    if (readFile) {
      const file = readFile()
      writeFileSync(resolve(options.seedPaths, 'seed1.ts'), file)
    }
  }

  createDrizzleConfig({ schemaPath: options.schemaPath })

  if (nuxt.options.dev) {
    const subprocess = startSubprocess({
      command: 'drizzle-kit',
      args: ['studio', '--port', '3105', `--config=${moduleOptions.moduleDir}/drizzle.config.js`],
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

  generateProjectReadme({
    data: ({ addCommentBlock }) => ({
      ...addCommentBlock('Script Commands'),
      scripts: {
        migrate: `drizzle-kit generate:${driver} --config=${moduleOptions.dir.module}/drizzle.config.js`,
        generate: `drizzle-kit generate:${driver} --config=${moduleOptions.dir.module}/drizzle.config.js`,
        push: `drizzle-kit push:${driver} --config=${moduleOptions.dir.module}/drizzle.config.js`,
        drop: `drizzle-kit drop --config=${moduleOptions.dir.module}/drizzle.config.js`,
        up: `drizzle-kit up:${driver} --config=${moduleOptions.dir.module}/drizzle.config.js`,
        studio: `drizzle-kit studio --port 3105 --config=${moduleOptions.dir.module}/drizzle.config.js`,
        seed: `tsx ${moduleOptions.dir.module}/seeds/index.ts`,
      },
      cli: {
        migrate: `pergel module -s=migrate -p=${projectName} -m=${moduleName}`,
        push: `pergel module -s=push -p=${projectName} -m=${moduleName}`,
        drop: `pergel module -s=drop -p=${projectName} -m=${moduleName}`,
        up: `pergel module -s=up -p=${projectName} -m=${moduleName}`,
        generate: `pergel module -s=generate -p=${projectName} -m=${moduleName}`,
        studio: `pergel module -s=studio -p=${projectName} -m=${moduleName}`,
        seed: `pergel module -s=seed -p=${projectName} -m=${moduleName}`,
      },
    }),
    nuxt,
    moduleName,
    projectName,
  })

  createDockerService(nuxt, projectName, {
    services: {
      postgres: {
        image: 'postgres:16-alpine',
        volumes: [
          {
            type: 'volume',
            source: 'pergel-postgres',
            target: '/var/lib/postgresql/data',
          },
        ],
        ports: [
          '5432:5432',
        ],
        environment: {
          POSTGRES_USER: 'postgres',
          POSTGRES_PASSWORD: 'postgres',
          POSTGRES_DB: 'postgres',
        },
      },
    },
    volumes: {
      'pergel-postgres': {},
    },
  })
}
