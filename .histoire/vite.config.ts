/// <reference types="histoire" />

import { resolve } from 'node:path'
import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  histoire: {
    plugins: [
      { name: 'builtin:tailwind-tokens' },
      HstVue(),
    ],
    setupFile: './setup.ts',
    storyMatch: [resolve(rootDir, '../packages/nuxt/.story/**/*.vue')],
    outDir: './dist',
    tree: {
      groups: [
        { title: 'Auth', include: _file => true },
      ],
    },
  },

  server: {
    fs: {
      allow: ['..'],
    },
  },
})
