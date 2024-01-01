import { join } from 'node:path'
import { addComponent, addComponentsDir, addImports, addImportsDir, addLayout, createResolver, extendPages, installModule } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'

import type { IconsPluginOptions } from '@egoist/tailwindcss-icons'
import type { ModuleOptions } from '@nuxtjs/i18n'
import consola from 'consola'
import { definePergelModule } from '../../core/definePergel'
import { useNuxtImports } from '../../core/utils/useImports'
import { writeDownloadTemplate } from '../../core/utils/createDownloadTemplate'
import type { ResolvedUIOptions, UIOptions } from './types'

const logger = consola.create({
  defaults: {
    tag: 'pergel:ui',
  },
})

export default definePergelModule<UIOptions, ResolvedUIOptions>({
  meta: {
    name: 'ui',
    version: '0.0.1',
    dependencies: {
      '@pergel/module-ui': '^0.0.5',
    },
  },
  defaults: {
    packages: {
      colorMode: true,
      notivue: true,
      nuxtIcon: true,
      radixVue: true,
      tailwindIcon: ['ph', 'carbon'],
      tailwindcss: true,
      veeValidate: true,
      zod: true,
      i18n: true,
      pinia: true,
    },
    default: {
      components: true,
      composables: true,
      lang: true,
      style: true,
      layouts: true,
      pages: true,
    },
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    if (options.default !== false) {
      if (options.default.components) {
        addComponentsDir({
          path: resolver.resolve(join('default', 'components')),
          watch: false,
        })
      }

      if (options.default.layouts) {
        addLayout({
          src: resolver.resolve(join('default', 'layouts', 'default.vue')),
        })
        addLayout({
          src: resolver.resolve(join('default', 'layouts', 'auth.vue')),
        })
      }

      if (options.default.pages) {
        extendPages((pages) => {
          pages.push({
            file: resolver.resolve(join('default', 'pages', 'auth', 'login.vue')),
            path: '/auth/login',
          })
          pages.push({
            file: resolver.resolve(join('default', 'pages', 'auth', 'signup.vue')),
            path: '/auth/signup',
          })
          pages.push({
            file: resolver.resolve(join('default', 'pages', 'auth', 'reset-password.vue')),
            path: '/auth/reset-password',
          })
          pages.push({
            file: resolver.resolve(join('default', 'pages', 'auth', 'privacy-policy.vue')),
            path: '/auth/privacy-policy',
          })
          pages.push({
            file: resolver.resolve(join('default', 'pages', 'auth', 'terms-of-service.vue')),
            path: '/auth/terms-of-service',
          })
        })
      }

      if (options.default.composables)
        addImportsDir(resolver.resolve(join('default', 'composables')))

      if (options.default.style)
        nuxt.options.css.push(resolver.resolve(join('default', 'style', 'style.css')))

      nuxt.options.alias['#pergel/ui'] = resolver.resolve(join('default'))
      nuxt.options.alias['#pergel/ui/*'] = resolver.resolve(join('default', '*'))
    }

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

      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/zod',
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
        ],
      })
    }

    if (options.packages.notivue) {
      await installModule('notivue/nuxt')
      nuxt.options.css.push('notivue/notifications.css')
      nuxt.options.css.push('notivue/animations.css')
    }

    if (options.packages.radixVue)
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

      const form = await import('@tailwindcss/forms')
      const aspect = await import('@tailwindcss/aspect-ratio')
      const typography = await import('@tailwindcss/typography')
      const tailwindcssAnimate = await import('tailwindcss-animate')

      await installModule('@nuxtjs/tailwindcss', {
        exposeConfig: true,
        config: {
          darkMode: 'class',
          plugins: [
            form,
            aspect,
            typography,
            tailwindcssAnimate,
          // import('@tailwindcss/container-queries'),
          ],
          content: {
            files: [
              resolver.resolve(join('default', '**/*.{vue,mjs,ts}')),
            ],
          },
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
        },
      })
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

    writeDownloadTemplate(
      nuxt,
      'auth-pages',
      {
        branch: 'main',
        folder: [{
          dir: 'packages/nuxt/playground/pages/auth',
          output: 'pages/auth',
        }],
      },
    )
  },

})
