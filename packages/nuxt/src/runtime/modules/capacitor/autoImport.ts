import { isPackageExists } from 'local-pkg'
import type { UnimportPluginOptions } from 'unimport/unplugin'
import type { NuxtPergel } from '../../core/types/nuxtModule'
import { useNuxtImports } from '../../core/utils/useImports'
import type { ResolvedCapacitorOptions } from './types'

export function autoImportCapacitorPlugins(params: {
  nuxt: NuxtPergel
  options: ResolvedCapacitorOptions
}) {
  const presets: UnimportPluginOptions['presets'] = []

  if (params.options.plugins.official.actionSheet && isPackageExists('@capacitor/action-sheet')) {
    presets.push({
      from: '@capacitor/action-sheet',
      imports: [
        {
          name: 'ActionSheet',
          as: 'CapacitorActionSheet',
          from: '@capacitor/action-sheet',
        },
        {
          name: 'ActionSheetButtonStyle',
          as: 'CapacitorActionSheetButtonStyle',
          from: '@capacitor/action-sheet',
        },
        {
          name: 'ActionSheetOptionStyle',
          as: 'CapacitorActionSheetOptionStyle',
          from: '@capacitor/action-sheet',
        },
      ] as {
        name: keyof typeof import('@capacitor/action-sheet')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.appLauncher && isPackageExists('@capacitor/app-launcher')) {
    presets.push({
      from: '@capacitor/app-launcher',
      imports: [
        {
          name: 'AppLauncher',
          as: 'CapacitorAppLauncher',
          from: '@capacitor/app-launcher',
        },
      ] as {
        name: keyof typeof import('@capacitor/app-launcher')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.backgroundRunner && isPackageExists('@capacitor/background-runner')) {
    presets.push({
      from: '@capacitor/background-runner',
      imports: [
        {
          name: 'BackgroundRunner',
          as: 'CapacitorBackgroundRunner',
          from: '@capacitor/background-runner',
        },
      ] as {
        name: keyof typeof import('@capacitor/background-runner')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.browser && isPackageExists('@capacitor/browser')) {
    presets.push({
      from: '@capacitor/browser',
      imports: [
        {
          name: 'Browser',
          as: 'CapacitorBrowser',
          from: '@capacitor/browser',
        },
      ] as {
        name: keyof typeof import('@capacitor/browser')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.camera && isPackageExists('@capacitor/camera')) {
    presets.push({
      from: '@capacitor/camera',
      imports: [
        {
          name: 'Camera',
          as: 'CapacitorCamera',
          from: '@capacitor/camera',
        },
      ] as {
        name: keyof typeof import('@capacitor/camera')
        as: string
        from: string
      }[],
    })
  }

  if (presets.length > 0) {
    useNuxtImports(params.nuxt, {
      presets,
    })
  }
}
