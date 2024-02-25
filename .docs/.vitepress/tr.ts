import { createRequire } from 'node:module'
import { type DefaultTheme, defineConfig } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('pergel/package.json')

export const tr = defineConfig({
  lang: 'tr-TR',
  description: 'Full Stack Nuxt or Nitro Application. It contains the necessary toolkits for a software developer and a fast, clean, tested toolkit.',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/nuxt/': { base: '/nuxt/', items: sidebarReference() },
    },

    editLink: {
      pattern: 'https://github.com/oku-ui/pergel/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Oku',
    },
  },
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guide',
      link: '/guide/what-is-pergel',
      activeMatch: '/guide/',
    },
    {
      text: 'Nuxt',
      link: '/nuxt/nuxt-config',
      activeMatch: '/nuxt/',
    },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/oku-ui/pergel/blob/main/CHANGELOG.md',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/oku-ui/pergel/blob/main/.github/contributing.md',
        },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        {
          text: 'What is Pergel',
          link: 'what-is-pergel',
        },
        {
          text: 'Getting Started',
          link: 'getting-started',
        },
        // { text: 'Routing', link: 'routing' },
        // { text: 'Deploy', link: 'deploy' },
      ],
    },
  ]
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Nuxt',
      items: [
        { text: 'Nuxt Config', link: 'nuxt-config' },
        {
          text: 'Default Theme',
          base: '/reference/default-theme',
          items: [
            { text: 'Overview', link: 'config' },
          ],
        },
      ],
    },
  ]
}
