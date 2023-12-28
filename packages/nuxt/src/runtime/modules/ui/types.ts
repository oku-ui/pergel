import type { CollectionNames, IconsPluginOptions } from '@egoist/tailwindcss-icons'

export interface UIOptions {
  brand?: 'pergel'
  packages: 'all' | {
    tailwindcssIcons?: CollectionNames[] | 'all' | IconsPluginOptions
    tailwindcss?: true
    colorMode?: true
    notivue?: true
    radixVue?: true
    nuxtIcon?: true
    zod?: true
    veeValidate?: true
  }
}

export interface ResolvedUIOptions {
  brand: string
  packages: 'all' | {
    tailwindcssIcons?: CollectionNames[] | 'all' | IconsPluginOptions
    tailwindcss?: true
    colorMode?: true
    notivue?: true
    radixVue?: true
    nuxtIcon?: true
    zod?: true
    veeValidate?: true
  }
}
