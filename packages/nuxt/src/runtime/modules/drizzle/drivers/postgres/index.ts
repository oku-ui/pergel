import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { startSubprocess } from '@nuxt/devtools-kit'
import { createResolver } from '@nuxt/kit'
import { globbySync } from 'globby'
import type { ResolvedDrizzleConfig } from '../../types'

import type { NuxtPergel } from '../../../../core/types/nuxtModule'
import { generateModuleRuntimeConfig } from '../../../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../../../core/utils/generateYaml'
import { createDockerService } from '../../../../core/utils/createDockerService'
import { writeFilePergel } from '../../../../core/utils/writeFilePergel'

export async function setupPostgres(
  nuxt: NuxtPergel,
  options: ResolvedDrizzleConfig,
) {
  const resolver = createResolver(import.meta.url)
  const projectName = options.projectName
  const moduleName = options.moduleName
  const { driver } = options._driver

  const { env } = generateModuleRuntimeConfig(nuxt, options, {
    url: 'postgres://postgres:postgres@localhost:5432/postgres',
    host: 'localhost', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: 'postgres', // Name of database to connect to
    user: 'postgres', // Username of database user
    password: 'postgres', // Password of database user
    ssl: false, // Use SSL
    drop: false, // Drop database before migration
    seed: false, // Seed database after migration
    migrate: false, // Migrate database
  }, false)

  // Config generation
  const drizzleConfig = /* ts */`// Pergel Drizzle ${projectName} Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: '${options._dir.server}/schema/index.ts',
  out: '${options._dir.server}/migrations',
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

  if (!existsSync(resolve(options.serverDir, 'drizzle.config.js')))
    writeFilePergel(resolve(options.serverDir, 'drizzle.config.js'), drizzleConfig)

  if (!existsSync(resolve(options.serverDir, 'schema'))) {
    mkdirSync(resolve(options.serverDir, 'schema'), { recursive: true })
    cpSync(resolver.resolve(join('templates', 'schema')), resolve(options.serverDir, 'schema'), {
      recursive: true,
    })
  }

  if (!existsSync(resolve(options.serverDir, 'seeds'))) {
    mkdirSync(resolve(options.serverDir, 'seeds'), { recursive: true })

    const files = globbySync(resolver.resolve(join('templates', 'seeds'), '**/*'), {
      onlyFiles: true,
    })

    for (const file of files) {
      const readFile = await import(file).then(m => m.default).catch(() => null)
      if (readFile) {
        const fileData = readFile({
          env: {
            dbUrl: env.url,
            dbDrop: env.drop,
            dbSeed: env.seed,
            dbMigrate: env.migrate,
          },
          migrationDir: join(options.serverDir, options.dir.migrations),
          projectName,
        })
        const fileName = basename(file)

        writeFilePergel(resolve(options.serverDir, 'seeds', fileName), fileData)
      }
    }
  }

  if (!existsSync(resolve(options.serverDir, 'storage'))) {
    mkdirSync(resolve(options.serverDir, 'storage'), { recursive: true })

    const files = globbySync(resolver.resolve(join('templates', 'storage'), '**/*'), {
      onlyFiles: true,
    })

    for (const file of files) {
      const readFile = await import(file).then(m => m.default).catch(() => null)
      if (readFile) {
        const fileData = readFile({
          projectName,
        })
        const fileName = basename(file)

        writeFilePergel(resolve(options.serverDir, 'storage', fileName), fileData)
      }
    }
  }

  if (nuxt.options.dev) {
    const subprocess = startSubprocess({
      command: 'drizzle-kit',
      args: ['studio', '--port', '3105', `--config=${options._dir.server}/drizzle.config.js`],
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
        'migrate': `drizzle-kit generate:${driver} --config=${options._dir.server}/drizzle.config.js`,
        'generate': `drizzle-kit generate:${driver} --config=${options._dir.server}/drizzle.config.js`,
        'push': `drizzle-kit push:${driver} --config=${options._dir.server}/drizzle.config.js`,
        'drop': `drizzle-kit drop --config=${options._dir.server}/drizzle.config.js`,
        'up': `drizzle-kit up:${driver} --config=${options._dir.server}/drizzle.config.js`,
        'studio': `drizzle-kit studio --port 3105 --config=${options._dir.server}/drizzle.config.js`,
        'dev:migration': `tsx ${options._dir.server}/seeds/devMigration.ts`,
        'dev:drop': `tsx ${options._dir.server}/seeds/devDrop.ts`,
        'dev:seed': `tsx ${options._dir.server}/seeds/devSeed.ts`,
      },
      cli: {
        'migrate': `pergel module -s=migrate -p=${projectName} -m=${moduleName}`,
        'push': `pergel module -s=push -p=${projectName} -m=${moduleName}`,
        'drop': `pergel module -s=drop -p=${projectName} -m=${moduleName}`,
        'up': `pergel module -s=up -p=${projectName} -m=${moduleName}`,
        'generate': `pergel module -s=generate -p=${projectName} -m=${moduleName}`,
        'studio': `pergel module -s=studio -p=${projectName} -m=${moduleName}`,
        'dev:migration': `pergel module -s=dev:migration -p=${projectName} -m=${moduleName}`,
        'dev:drop': `pergel module -s=dev:drop -p=${projectName} -m=${moduleName}`,
        'dev:seed': `pergel module -s=dev:seed -p=${projectName} -m=${moduleName}`,
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
          {
            target: 5432,
            published: 5432,
          },
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
