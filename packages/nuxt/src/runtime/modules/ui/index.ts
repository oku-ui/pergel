import { join } from 'node:path'
import { addComponent, addComponentsDir, addImports, addImportsDir, createResolver, installModule, useLogger } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'
import tailwindcssAnimate from 'tailwindcss-animate'
import { definePergelModule } from '../../core/definePergel'
import { useNuxtImports } from '../../core/utils/useImports'

const logger = useLogger('pergel:ui')
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

const brands = ['pergel']

export default definePergelModule({
  meta: {
    name: 'ui',
    version: '0.0.1',
    dependencies: {
      '@pergel/module-ui': '^0.0.5',
    },
  },
  defaults: {},
  async setup({ nuxt }) {
    const resolver = createResolver(import.meta.url)

    const selectBrand = 'pergel'

    if (checkForZod())
      return

    if (!brands.includes(selectBrand))
      return

    addComponentsDir({
      path: resolver.resolve(join('brands', selectBrand, 'components')),
      global: true,
      watch: false,
    })

    addComponentsDir({
      path: resolver.resolve(join('brands', selectBrand, 'pages')),
      global: true,
      watch: false,
    })

    nuxt.options.alias['#pergel/ui'] = resolver.resolve(join('brands', selectBrand))
    nuxt.options.alias['#pergel/ui/*'] = resolver.resolve(join('brands', selectBrand, '*'))

    addImportsDir(resolver.resolve(join('brands', selectBrand, 'composables')))

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
        {
          from: 'zod',
          imports: [
            {
              as: 'zod',
              name: 'z',
            },
          ],
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

    await installModule('notivue/nuxt')
    await installModule('radix-vue/nuxt')
    await installModule('nuxt-icon')
    await installModule('@nuxtjs/color-mode', { classSuffix: '' })

    const form = await import('@tailwindcss/forms')
    const aspect = await import('@tailwindcss/aspect-ratio')
    const typography = await import('@tailwindcss/typography')

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
            resolver.resolve(join('brands', selectBrand, 'components/**/*.{vue,mjs,ts}')),
            resolver.resolve(join('brands', selectBrand, 'pages/**/*.{vue,mjs,ts}')),
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

    nuxt.options.css.push('notivue/notifications.css')
    nuxt.options.css.push('notivue/animations.css')
    nuxt.options.css.push(resolver.resolve(join('brands', selectBrand, 'style', 'style.css')))
  },
})
