import { addComponent, addComponentsDir, addImports, addImportsDir, createResolver, defineNuxtModule, installModule, logger } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'
import { definePergelModule } from '../../core/definePergel'
import { useNuxtImports } from '../../core/utils/useImports'

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

export default definePergelModule({
  meta: {
    name: 'ui',
    version: '0.0.1',
    dependencies: {
      '@pergel/module-ui': '^0.0.2',
    },
  },
  defaults: {},
  async setup({ nuxt, moduleOptions }) {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('components', 'atom'),
      prefix: 'PergelAtom',
      global: true,
      watch: false,
    })

    addComponentsDir({
      path: resolver.resolve('components', 'form'),
      global: true,
      watch: false,
    })

    addComponentsDir({
      path: resolver.resolve('pages'),
      prefix: 'PergelPage',
      global: true,
      watch: false,
    })

    nuxt.options.alias['#pergel/ui'] = resolver.resolve('./')

    addImportsDir(resolver.resolve('composables'))

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
            resolver.resolve('components/**/*.{vue,mjs,ts}'),
            resolver.resolve('pages/**/*.{vue,mjs,ts}'),
          ],
        },
      },
    })

    // export { Form, Field as FormField } from 'vee-validate'

    // addServerImportsDir(resolver.resolve('./composables'))
    // nuxt._pergel.contents.push({
    //   moduleName: moduleOptions.moduleName,
    //   projectName: moduleOptions.projectName,
    //   content: /* ts */`
    //     function ses() {
    //       return {
    //         use: usePergelSES.bind(ctx),
    //       }
    //     }
    //       `,
    //   resolve: /* ts */`
    //     ses: ses,
    //       `,
    // })
  },
})
