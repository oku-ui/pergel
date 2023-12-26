import { addComponentsDir, addImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'

export default definePergelModule({
  meta: {
    name: 'ui',
    version: '0.0.0',
    dependencies: {
      '@pergel/module-ui': '^0.0.0',
    },
  },
  defaults: {},
  async setup({ nuxt, moduleOptions }) {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('components', 'atom'),
      prefix: 'Atom',
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
