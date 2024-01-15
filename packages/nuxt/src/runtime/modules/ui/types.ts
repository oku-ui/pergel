import type { CollectionNames, IconsPluginOptions } from '@egoist/tailwindcss-icons'

import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export interface UIOptions extends PergelModuleOptions {
  brand?: 'pergel'
  packages?: {
    /**
     * @default ['ph', 'carbon']
     * @see https://github.com/egoist/tailwindcss-icons
     */
    tailwindIcon?: CollectionNames[] | 'all' | IconsPluginOptions

    /**
     * @default true
     * @see https://tailwindcss.nuxtjs.org
     */
    tailwindcss?: boolean

    /**
     * @default true
     * @see https://github.com/nuxt-modules/color-mode
     */
    colorMode?: boolean
    /**
     * @default true
     * @see https://notivuedocs.netlify.app/push-usage/methods.html
     */
    notivue?: boolean

    /**
     * @default true
     * @see https://github.com/radix-vue/radix-vue
     */
    radixVue?: boolean

    /**
     * @default true
     * @see https://github.com/nuxt-modules/icon
     */
    nuxtIcon?: boolean

    /**
     * @default true
     * @see https://github.com/colinhacks/zod
     */
    zod?: boolean

    /**
     * @default true
     * @see https://vee-validate.logaretm.com/v4
     */
    veeValidate?: boolean

    /**
     * @default true
     * @see https://i18n.nuxtjs.org
     */
    i18n?: boolean

    /**
     * @default true
     * @see https://pinia.vuejs.org
     */
    pinia?: boolean
  }

}

export interface ResolvedUIOptions extends ResolvedPergelModuleOptions {
  packages: {
    tailwindIcon?: CollectionNames[] | 'all' | IconsPluginOptions
    tailwindcss?: boolean
    colorMode?: boolean
    notivue?: boolean
    radixVue?: boolean
    nuxtIcon?: boolean
    zod?: boolean
    veeValidate?: boolean
    i18n?: boolean
    pinia?: boolean
  }
}
