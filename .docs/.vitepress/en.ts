import { createRequire } from 'node:module'
import { type DefaultTheme, defineConfig } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('pergel/package.json')

export const en = defineConfig({
  lang: 'en-US',
  description: 'Full Stack Nuxt or Nitro Application. It contains the necessary toolkits for a software developer and a fast, clean, tested toolkit.',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/nuxt/': { base: '/nuxt/', items: sidebarReference() },
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
        // {
        //   text: 'Changelog',
        //   link: 'https://github.com/oku-ui/pergel/blob/main/CHANGELOG.md',
        // },
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
      ],
    },
    {
      text: 'Installations',
      collapsed: false,
      items: [
        { text: 'Nuxt', link: 'nuxt-installation' },
        { text: 'CLI', link: 'cli-installation' },
        { text: 'Nitro', link: 'nitro-installation' },
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
      ],
    },
    {
      text: 'Modules',
      items: [
        {
          text: 'drizzle',
          base: '/nuxt/modules/drizzle/',
          collapsed: false,
          items: [
            { text: 'Configuration', link: 'configuration' },
            { text: 'Usage', link: 'usage' },
            { text: 'Import', link: 'import' },
            { text: 'API', link: 'api' },
            { text: 'CLI', link: 'cli' },
          ],
        },
        {
          text: 'json2csv',
          base: '/nuxt/modules/json2csv/',
          collapsed: false,
          items: [
            { text: 'Configuration', link: 'configuration' },
            { text: 'Usage', link: 'usage' },
            { text: 'Import', link: 'import' },
            { text: 'API', link: 'api' },
          ],
        },
        {
          text: 'box',
          base: '/nuxt/modules/box/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'bullmq',
          base: '/nuxt/modules/bullmq/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'eslint',
          base: '/nuxt/modules/eslint/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'ionic',
          base: '/nuxt/modules/ionic/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'graphqlYoga',
          base: '/nuxt/modules/graphqlYoga/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'lucia',
          base: '/nuxt/modules/lucia/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'nodeCron',
          base: '/nuxt/modules/nodeCron/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'renovate',
          base: '/nuxt/modules/renovate/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'S3',
          base: '/nuxt/modules/S3/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'ses',
          base: '/nuxt/modules/ses/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'urql',
          base: '/nuxt/modules/urql/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
        {
          text: 'vitest',
          base: '/nuxt/modules/vitest/',
          collapsed: true,
          items: [
            { text: 'Configuration', link: 'configuration' },
          ],
        },
      ],
    },
  ]
}
