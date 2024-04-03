import { resolve } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { startSubprocess } from '@nuxt/devtools-kit'
import consola from 'consola'

import { DEVTOOLS_UI_PORT } from '../../src/constants'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  modules: [
    /**
     * My module
     */
    '../../src/module',
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
          consola.log(` - drizzle: ${data.toString()}`)
        })
        subprocess.getProcess().stderr?.on('data', (data) => {
          consola.error(` - drizzle: ${data.toString()}`)
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
      changeName: {
        drizzle: true,
        box: {
          packages: {
            unsearch: true,
          },
        },
      },
    },
  },
})
