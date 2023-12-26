import type { Config } from 'tailwindcss'
import form from '@tailwindcss/forms'

export default {
  content: [
    '../packages/nuxt/.story/**/*.story.vue',
    '../packages/nuxt/src/runtime/modules/ui/**/*.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    form,
  ],
} satisfies Config
