import { join } from 'node:path'
import { addComponent, addImportsDir, addPlugin, addServerImportsDir, createResolver, extendViteConfig, installModule } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'
import { camelCase } from 'scule'

import type { IconsPluginOptions } from '@egoist/tailwindcss-icons'
import type { ModuleOptions } from '@nuxtjs/i18n'
import consola from 'consola'
import type { ModuleOptions as TailwindCSSOptions } from '@nuxtjs/tailwindcss'
import type { ModuleOptions as GoogleFonts } from '@nuxtjs/google-fonts'
import defu from 'defu'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports, useNuxtImports } from '../../core/utils/useImports'
import { addDownloadTemplate } from '../../core/utils/createDownloadTemplate'
import type { BoxOptions, ResolvedBoxOptions } from './types'

const logger = consola.create({
  defaults: {
    tag: 'pergel:box',
  },
})

export default definePergelModule<BoxOptions, ResolvedBoxOptions>({
  meta: {
    name: 'box',
    version: '0.1.0',
    dependencies: {
      '@pergel/module-box': 'latest',
    },
  },
  defaults: {
    packages: {
      colorMode: false,
      notivue: false,
      nuxtIcon: false,
      radixMode: false,
      tailwindIcon: ['ph', 'carbon'],
      tailwindcss: {
        form: true,
        aspectRatio: true,
        typography: true,
        tailwindcssAnimate: true,
      },
      veeValidate: false,
      zod: false,
      i18n: false,
      pinia: false,
      vueUse: false,
      neoconfetti: false,
      googleFonts: false,
      slugify: false,
      nanoid: false,
      uuid: false,
      unsearch: false,
    },
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    if (options.packages.veeValidate) {
      useNuxtImports(nuxt, {
        presets: [
          {
            imports: [
              'useField',
              'useForm',
              'useFieldArray',
              'useFieldError',
              'useFieldValue',
              'useFormErrors',
              'useFormValues',
              'useIsFieldDirty',
              'useIsFieldTouched',
              'useIsFieldValid',
              'useIsFormDirty',
              'useIsFormTouched',
              'useIsFormValid',
              'useIsSubmitting',
              'useResetForm',
              'useSubmitCount',
              'useSubmitForm',
              'useValidateField',
              'useValidateForm',
            ],
            from: 'vee-validate',
          },
        ],
      })

      const veeValidateComponents = [
        'Field',
        'Form',
        'ErrorMessage',
        'FieldArray',
      ]

      veeValidateComponents.forEach((component) => {
        addComponent({
          name: `Form${component}`,
          export: component,
          filePath: 'vee-validate',
        })
      })

      useNuxtImports(nuxt, {
        presets: [
          {
            imports: ['toFieldValidator', 'toFormValidator', 'toTypedSchema'] as Array<keyof typeof import('@vee-validate/zod')>,
            from: '@vee-validate/zod',
          },
        ],
      })
    }

    if (options.packages.zod) {
      function checkForZod() {
        if (isPackageExists('zod') && !isPackageExists('@vee-validate/zod')) {
          logger.warn(
            'You seem to be using zod, but you have not installed @vee-validate/zod. Please install it to use zod with vee-validate.',
          )
          return true
        }

        if (isPackageExists('@vee-validate/zod') && !isPackageExists('zod')) {
          logger.warn(
            'You seem to be using @vee-validate/zod, but you have not installed zod. Please install it to use zod with vee-validate.',
          )
          return true
        }

        return false
      }

      if (checkForZod())
        return

      useNuxtImports(nuxt, {
        presets: [
          {
            imports: [
              {
                name: 'z',
                as: 'zod',
              },
            ],
            from: 'zod',
          },
          {
            from: 'zod',
            imports: [{
              from: 'zod',
              as: 'Zod',
              name: 'z',
              type: true,
            }],
          },
        ],
      })

      useNitroImports(nuxt, {
        presets: [
          {
            imports: [
              {
                name: 'z',
                as: 'zod',
              },
            ],
            from: 'zod',
          },
          {
            from: 'zod',
            imports: [{
              from: 'zod',
              as: 'Zod',
              name: 'z',
              type: true,
            }],
          },
        ],
      })
    }

    if (options.packages.notivue) {
      await installModule('notivue/nuxt')
      nuxt.options.css.push('notivue/notifications.css')
      nuxt.options.css.push('notivue/animations.css')
    }

    if (options.packages.radixMode)
      await installModule('radix-vue/nuxt')

    if (options.packages.nuxtIcon)
      await installModule('nuxt-icon')

    if (options.packages.colorMode)
      await installModule('@nuxtjs/color-mode', { classSuffix: '' })

    if (options.packages.tailwindcss) {
      const { getIconCollections, iconsPlugin } = await import('@egoist/tailwindcss-icons')
      // First we need to register the module hook
      // @ts-ignore
      nuxt.hook('tailwindcss:config', (tailwindConfig) => {
        if (options.packages.tailwindIcon) {
          tailwindConfig.plugins ??= []
          tailwindConfig.plugins.push(iconsPlugin(Array.isArray(options.packages.tailwindIcon) ? { collections: getIconCollections(options.packages.tailwindIcon) } : typeof options.packages.tailwindIcon === 'object' ? options.packages.tailwindIcon as IconsPluginOptions : {}))
        }
      })

      const plugins = []
      if (typeof options.packages.tailwindcss === 'object') {
        if (options.packages.tailwindcss.form)
          plugins.push(await import('@tailwindcss/forms'))
        if (options.packages.tailwindcss.aspectRatio)
          plugins.push(await import('@tailwindcss/aspect-ratio'))
        if (options.packages.tailwindcss.typography)
          plugins.push(await import('@tailwindcss/typography'))
        if (options.packages.tailwindcss.tailwindcssAnimate)
          plugins.push(await import('tailwindcss-animate'))
      }
      // import('@tailwindcss/container-queries'),

      await installModule('@nuxtjs/tailwindcss', {
        exposeConfig: true,
        viewer: false,
        config: {
          darkMode: 'class',
          plugins,
          content: {
            files: [
              `${nuxt.options.rootDir}/composables/**/*.{vue,js,ts}`,
              `${nuxt.options.rootDir}/components/**/*.{vue,js,ts}`,
              `${nuxt.options.rootDir}/layouts/**/*.{vue,js,ts}`,
              `${nuxt.options.rootDir}/pages/**/*.{vue,js,ts}`,
              `${nuxt.options.rootDir}/assets/**/*.css`,
            ],
          },
          ...options.packages.radixMode
            ? {

                theme: {
                  container: {
                    center: true,
                    padding: '2rem',
                    screens: {
                      '2xl': '1400px',
                    },
                  },
                  extend: {
                    colors: {
                      border: 'hsl(var(--border))',
                      input: 'hsl(var(--input))',
                      ring: 'hsl(var(--ring))',
                      background: 'hsl(var(--background))',
                      foreground: 'hsl(var(--foreground))',
                      primary: {
                        DEFAULT: 'hsl(var(--primary))',
                        foreground: 'hsl(var(--primary-foreground))',
                      },
                      secondary: {
                        DEFAULT: 'hsl(var(--secondary))',
                        foreground: 'hsl(var(--secondary-foreground))',
                      },
                      destructive: {
                        DEFAULT: 'hsl(var(--destructive))',
                        foreground: 'hsl(var(--destructive-foreground))',
                      },
                      muted: {
                        DEFAULT: 'hsl(var(--muted))',
                        foreground: 'hsl(var(--muted-foreground))',
                      },
                      accent: {
                        DEFAULT: 'hsl(var(--accent))',
                        foreground: 'hsl(var(--accent-foreground))',
                      },
                      popover: {
                        DEFAULT: 'hsl(var(--popover))',
                        foreground: 'hsl(var(--popover-foreground))',
                      },
                      card: {
                        DEFAULT: 'hsl(var(--card))',
                        foreground: 'hsl(var(--card-foreground))',
                      },
                    },
                    borderRadius: {
                      lg: 'var(--radius)',
                      md: 'calc(var(--radius) - 2px)',
                      sm: 'calc(var(--radius) - 4px)',
                    },
                    boxShadow: {
                      switch:
                'rgba(0, 0, 0, 0.3) 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 1px 2px',
                    },
                    keyframes: {
                      'accordion-down': {
                        from: { height: 0 },
                        to: { height: 'var(--radix-accordion-content-height)' },
                      },
                      'accordion-up': {
                        from: { height: 'var(--radix-accordion-content-height)' },
                        to: { height: 0 },
                      },
                      'collapsible-down': {
                        from: { height: 0 },
                        to: { height: 'var(--radix-collapsible-content-height)' },
                      },
                      'collapsible-up': {
                        from: { height: 'var(--radix-collapsible-content-height)' },
                        to: { height: 0 },
                      },
                    },
                    animation: {
                      'accordion-down': 'accordion-down 0.2s ease-in-out',
                      'accordion-up': 'accordion-up 0.2s ease-in-out',
                      'collapsible-down': 'collapsible-down 0.2s ease-in-out',
                      'collapsible-up': 'collapsible-up 0.2s ease-in-out',
                    },
                  },
                },
              }
            : {},
        },
      } as Partial<TailwindCSSOptions>)
    }

    if (options.packages.i18n) {
      // First we need to register the module hook
      nuxt.hook('i18n:registerModule', (register) => {
        register({
          // langDir path needs to be resolved
          langDir: resolver.resolve(join('default', 'lang')),
          locales: [
            {
              code: 'en',
              file: 'en.json',
              name: 'English',
            },
            {
              code: 'tr',
              file: 'tr.json',
              name: 'Türkçe',
            },
            {
              code: 'fr',
              file: 'fr.json',
              name: 'Français',
            },
            {
              code: 'zh',
              file: 'zh.json',
              name: '中文',
            },
          ],
        })
      })

      await installModule('@nuxtjs/i18n', {
        strategy: 'no_prefix',
      } as ModuleOptions)
    }

    if (options.packages.pinia)
      await installModule('@pinia/nuxt')

    if (options.packages.vueUse)
      await installModule('@vueuse/nuxt')

    if (options.packages.neoconfetti)
      addPlugin(resolver.resolve('plugins/neoconfetti.ts'))

    if (options.packages.googleFonts) {
      await installModule('@nuxtjs/google-fonts', {
        ...options.packages.googleFonts === 'custom'
          ? {}
          : {
              families: {
                Inter: true,
              },
            },
      } as Partial<GoogleFonts>)
    }

    if (options.packages.slugify) {
      // Public runtimeConfig
      nuxt.options.runtimeConfig.public.slugify = defu(
        nuxt.options.runtimeConfig.public.slugify,
        {
          extend: options.extend,
          defaults: options.defaults,
        },
      )

      // Add Vite configurations
      extendViteConfig((config) => {
        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.include = config.optimizeDeps.include || []
        config.optimizeDeps.include.push('slugify')
      })

      addServerImportsDir(resolver.resolve('./composables/slugify'))
      addImportsDir(resolver.resolve('./composables/slugify'))
    }

    if (options.packages.nanoid) {
      useNuxtImports(nuxt, {
        presets: [
          {
            imports: (['customAlphabet', 'customRandom', 'nanoid', 'random', 'urlAlphabet'] as Array<keyof typeof import('nanoid')>).map(name => ({
              as: name === 'nanoid' ? 'nanoid' : `${camelCase(`nanoid-${name}`)}`,
              name,
            })),
            from: 'nanoid',
          },
        ],
      })

      useNitroImports(nuxt, {
        presets: [
          {
            imports: (['customAlphabet', 'customRandom', 'nanoid', 'random', 'urlAlphabet'] as Array<keyof typeof import('nanoid')>).map(name => ({
              as: `${camelCase(`nanoid-${name}`)}`,
              name,
            })),
            from: 'nanoid',
          },
        ],
      })
    }

    if (options.packages.uuid) {
      useNuxtImports(nuxt, {
        presets: [
          {
            imports: (['v1', 'v3', 'v4', 'v5', 'NIL', 'parse', 'stringify', 'validate', 'version'] as Array<keyof typeof import('uuid')>).map(name => ({
              as: `${camelCase(`uuid-${name}`)}`,
              name,
            })),
            from: 'uuid',
          },
        ],
      })

      useNitroImports(nuxt, {
        presets: [
          {
            imports: (['v1', 'v3', 'v4', 'v5', 'NIL', 'parse', 'stringify', 'validate', 'version'] as Array<keyof typeof import('uuid')>).map(name => ({
              as: `${camelCase(`uuid-${name}`)}`,
              name,
            })),
            from: 'uuid',
          },
        ],
      })
    }

    if (options.packages.unsearch) {
      useNitroImports(nuxt, {
        presets: [
          {
            imports: ['unSearch'] as Array<keyof typeof import('unsearch')>,
            from: 'unsearch',
          },
        ],
      })
    }

    addDownloadTemplate({
      nuxt,
      data: {
        branch: 'main',
        folder: [
          {
            dir: 'themes/pergel-auth/pages/auth',
            output: 'pages/auth',
            forceClean: true,
          },
          {
            dir: 'themes/pergel-auth/components',
            output: 'components',
            forceClean: true,
          },
          {
            dir: 'themes/pergel-auth/layouts',
            output: 'layouts',
            forceClean: true,
          },
          {
            dir: 'themes/pergel-auth/middleware',
            output: 'middleware',
            forceClean: true,
          },
          {
            dir: 'themes/pergel-auth/composables',
            output: 'composables',
            forceClean: true,
          },
          {
            dir: 'themes/pergel-auth/server/api/auth',
            output: 'server/api/auth',
            forceClean: true,
          },
          {
            dir: 'themes/pergel-auth/server/middleware',
            output: 'server/middleware',
            forceClean: true,
          },
        ],
        file: {
          dir: 'themes/pergel-auth',
          // TODO: change path -> paths
          path: [
            {
              fileName: 'app.vue',
              outputFileName: 'app.vue',
              forceClean: true,
            },
            {
              fileName: 'pages/index.vue',
              outputFileName: 'pages/index.vue',
            },
            {
              fileName: 'assets/pergel.css',
              outputFileName: 'assets/pergel.css',
            },
          ],
        },
      },
      version: '0.0.1',
      name: 'official-auth-1',
      write: true,
      readme: {
        moduleName: options.moduleName,
        projectName: options.projectName,
      },
    })
  },

})
