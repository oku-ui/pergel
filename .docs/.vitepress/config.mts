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

  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/pergel-logo-mini.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/pergel-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Pergel | Nuxt & Nitro' }],
    ['meta', { property: 'og:site_name', content: 'Pergel' }],
    ['meta', { property: 'og:image', content: 'https://pergel.oku-ui.com/pergel-og.png' }],
    ['meta', { property: 'og:url', content: 'https://pergel.oku-ui.com' }],
    ['script', { 'src': 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', 'defer': '' }],
    [
      'script',
      {
        'async': true,
        'defer': true,
        'data-domain': 'rapor.vucod.com',
        'src': 'https://plausible.io/js/plausible.js',
      },
    ],
  ],

  appearance: 'dark',

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/oku-ui/pergel' },
      { icon: 'discord', link: 'https://chat.productdevbook.com' },
      { icon: 'twitter', link: 'https://twitter.com/oku_ui' },
    ],
    logo: { src: '/pergel-logo-mini.svg', width: 24, height: 24 },

    editLink: {
      pattern: 'https://github.com/oku-ui/pergel/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 present Oku - oku-ui.com',
    },
  },

  locales: {
    root: { label: 'English', ...en },
    // tr: { label: 'Türkçe', ...tr },
  },
})
