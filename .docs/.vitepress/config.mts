import { defineConfig } from 'vitepress'
import { transformerTwoslash } from 'vitepress-plugin-twoslash'

import { en } from './en'

// import { tr } from './tr'
import {
  nuxtCompilerOptions,
  prepend,
  typeDecorations,
} from './nuxtUtils'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pergel',
  description: 'Pergel is a tailor-made solution for Nuxt or Nitro, providing swift project kickstarts and seamless integration of various modules. Named with a Turkish touch, Pergel maximizes the power of TypeScript, streamlining and accelerating your project development process.',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  markdown: {
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          compilerOptions: {
            lib: ['esnext', 'dom'],
            jsx: 1, // Preserve
            jsxImportSource: 'vue',
            ...nuxtCompilerOptions,
          },
          extraFiles: {
            ...typeDecorations,
            'index.ts': { prepend },
            'index.tsx': { prepend },
          },
        },
      }),
    ],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },

  locales: {
    root: { label: 'English', ...en },
    // tr: { label: 'Türkçe', ...tr },
  },
})
