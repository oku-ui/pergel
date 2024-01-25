import type { CollectionNames, IconsPluginOptions } from '@egoist/tailwindcss-icons'
import type slugify from 'slugify'

import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export interface BoxOptions extends PergelModuleOptions {
  packages?: {
    /**
     * @default ['ph', 'carbon']
     * @see https://github.com/egoist/tailwindcss-icons
     */
    tailwindIcon?: CollectionNames[] | 'all' | IconsPluginOptions

    /**
     * @default false
     * @see https://tailwindcss.nuxtjs.org
     */
    tailwindcss?: boolean

    /**
     * @default false
     * @see https://github.com/nuxt-modules/color-mode
     */
    colorMode?: boolean
    /**
     * @default false
     * @see https://notivuedocs.netlify.app/push-usage/methods.html
     */
    notivue?: boolean

    /**
     * @default false
     * @see https://github.com/radix-vue/radix-vue
     */
    radixVue?: boolean

    /**
     * @default false
     * @see https://github.com/nuxt-modules/icon
     */
    nuxtIcon?: boolean

    /**
     * @default false
     * @see https://github.com/colinhacks/zod
     */
    zod?: boolean

    /**
     * @default false
     * @see https://vee-validate.logaretm.com/v4
     */
    veeValidate?: boolean

    /**
     * @default false
     * @see https://i18n.nuxtjs.org
     */
    i18n?: boolean

    /**
     * @default false
     * @see https://pinia.vuejs.org
     */
    pinia?: boolean

    /**
     * @default false
     * @see https://vueuse.org
     */
    vueUse?: boolean

    /**
     * @default false
     * @see https://github.com/PuruVJ/neoconfetti/tree/main/packages/vue
     */
    neoconfetti?: boolean

    /**
     * @default false
     * @see https://google-fonts.nuxtjs.org/
     */
    googleFonts?: boolean | 'custom'

    /**
     * default: false
     * @see https://github.com/simov/slugify
     */
    slugify?: boolean | {
      extend?: {
        [key: string]: any
      }
      defaults?: Parameters<typeof slugify>[1]
    }

    nanoid?: boolean

    uuid?: boolean
  }
}

export interface ResolvedBoxOptions extends ResolvedPergelModuleOptions {
  packages: {
    tailwindIcon: CollectionNames[] | 'all' | IconsPluginOptions
    tailwindcss: boolean
    colorMode: boolean
    notivue: boolean
    radixVue: boolean
    nuxtIcon: boolean
    zod: boolean
    veeValidate: boolean
    i18n: boolean
    pinia: boolean
    vueUse: boolean
    neoconfetti: boolean
    googleFonts: boolean | 'custom'
    slugify: boolean | {
      extend?: {
        [key: string]: any
      }
      defaults?: Parameters<typeof slugify>[1]
    }
    nanoid: boolean
    uuid: boolean
  }
}
