import { defineConfig } from 'vitepress'
import { en } from './en'
import { tr } from './tr'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pergel',
  description: 'A VitePress Site',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

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
    tr: { label: 'Türkçe', ...tr },
  },
})
