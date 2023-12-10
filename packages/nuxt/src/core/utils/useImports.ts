import type { ImportsOptions, Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { UnimportPluginOptions } from 'unimport/unplugin'

export function useNitroImports(nuxt: Nuxt, data?: Partial<UnimportPluginOptions>) {
  // Use a closure to maintain state
  nuxt._pergel.nitroImports = defu(nuxt._pergel.nitroImports, {
    ...data,
  })

  function saveNitroImports() {
    if (nuxt.options.nitro.imports !== false) {
      nuxt.options.nitro.imports = defu(nuxt.options.nitro.imports, {
        ...nuxt._pergel.nitroImports,
      } as UnimportPluginOptions) as ImportsOptions
    }
  }

  return {
    saveNitroImports,
  }
}

export function useNuxtImports(nuxt: Nuxt, data?: Partial<ImportsOptions>) {
  // Use a closure to maintain state
  nuxt._pergel.nuxtImports = defu(nuxt._pergel.nuxtImports, {
    ...data,
  })

  function saveNuxtImports() {
    nuxt.options.imports = defu(nuxt.options.imports, {
      ...nuxt._pergel.nuxtImports,
    } as UnimportPluginOptions) as ImportsOptions
  }

  return {
    saveNuxtImports,
  }
}
