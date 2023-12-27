import { join } from 'node:path'
import { addComponent, addComponentsDir, addImports, addImportsDir, createResolver, defineNuxtModule, installModule, useLogger } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'
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
      '@pergel/module-ui': '^0.0.2',
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
          // import('@tailwindcss/container-queries'),
        ],
        content: {
          files: [
            resolver.resolve(join('brands', selectBrand, 'components/**/*.{vue,mjs,ts}')),
            resolver.resolve(join('brands', selectBrand, 'pages/**/*.{vue,mjs,ts}')),
          ],
        },
      },
    })
    await installModule('notivue/nuxt')
    await installModule('radix-vue/nuxt')

    nuxt.options.css.push('notivue/notifications.css')
    nuxt.options.css.push('notivue/animations.css')
  },
})
