import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: [
      './server/tests/**',
    ],
  },

  root: './server',
})
