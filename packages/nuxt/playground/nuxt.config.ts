import { resolve } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { startSubprocess } from '@nuxt/devtools-kit'

import { DEVTOOLS_UI_PORT } from '../src/constants'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  modules: [
    /**
     * My module
     */
    '../src/module',
    /**
     * Start a sub Nuxt Server for developing the client
     *
     * The terminal output can be found in the Terminals tab of the devtools.
     */
    defineNuxtModule({
      setup(_, nuxt) {
        if (!nuxt.options.dev)
          return

        const subprocess = startSubprocess(
          {
            command: 'npx',
            args: ['nuxi', 'dev', '--port', DEVTOOLS_UI_PORT.toString()],
            cwd: resolve(__dirname, '../client'),
          },
          {
            id: 'nuxt-pergel:client',
            name: 'Pergel Devtools RPC Client',
          },
        )

        subprocess.getProcess().stdout?.on('data', (data) => {
          // eslint-disable-next-line no-console
          console.log(` sub: ${data.toString()}`)
        })

        process.on('exit', () => {
          subprocess.terminate()
        })
      },
    }),
  ],
  pergel: {
    debug: true,
    projects: {
      test: {
        S3: true,
        nodeCron: true,
        ses: true,
        bullmq: true,
        json2csv: true,
        graphqlYoga: {
          mergeSchemas: true,
        },
        lucia: true,
        drizzle: true,
        box: {
          packages: {
            neoconfetti: true,
          },
        },
      },
      test2: {
        S3: true,
      },
    },
  },
})
