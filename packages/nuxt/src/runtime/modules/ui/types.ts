import type { CollectionNames, IconsPluginOptions } from '@egoist/tailwindcss-icons'

export interface UIOptions {
  brand?: 'pergel'
  packages?: {
    /**
     * @default ['ph', 'carbon']
     */
    tailwindIcon?: CollectionNames[] | 'all' | IconsPluginOptions
    tailwindcss?: boolean
    colorMode?: boolean
    notivue?: boolean
    radixVue?: boolean
    nuxtIcon?: boolean
    zod?: boolean
    veeValidate?: boolean
    i18n?: boolean
  }
}

export interface ResolvedUIOptions {
  brand: string
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
  }
}
