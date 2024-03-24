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

  if (params.options.plugins.official.appLauncher && isPackageExists('@capacitor/app')) {
    presets.push({
      from: '@capacitor/app',
      imports: [
        {
          name: 'App',
          as: 'CapacitorApp',
          from: '@capacitor/app',
        },
      ] as {
        name: keyof typeof import('@capacitor/app')
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
        {
          name: 'CameraResultType',
          as: 'CapacitorCameraResultType',
          from: '@capacitor/camera',
        },
        {
          name: 'CameraSource',
          as: 'CapacitorCameraSource',
          from: '@capacitor/camera',
        },
        {
          name: 'CameraDirection',
          as: 'CapacitorCameraDirection',
          from: '@capacitor/camera',
        },
      ] as {
        name: keyof typeof import('@capacitor/camera')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.clipboard && isPackageExists('@capacitor/clipboard')) {
    presets.push({
      from: '@capacitor/clipboard',
      imports: [
        {
          name: 'Clipboard',
          as: 'CapacitorClipboard',
          from: '@capacitor/clipboard',
        },
      ] as {
        name: keyof typeof import('@capacitor/clipboard')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.device && isPackageExists('@capacitor/device')) {
    presets.push({
      from: '@capacitor/device',
      imports: [
        {
          name: 'Device',
          as: 'CapacitorDevice',
          from: '@capacitor/device',
        },
      ] as {
        name: keyof typeof import('@capacitor/device')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.dialog && isPackageExists('@capacitor/dialog')) {
    presets.push({
      from: '@capacitor/dialog',
      imports: [
        {
          name: 'Dialog',
          as: 'CapacitorDialog',
          from: '@capacitor/dialog',
        },
      ] as {
        name: keyof typeof import('@capacitor/dialog')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.filesystem && isPackageExists('@capacitor/filesystem')) {
    presets.push({
      from: '@capacitor/filesystem',
      imports: [
        {
          name: 'Directory',
          as: 'CapacitorFSDirectory',
          from: '@capacitor/filesystem',
        },
        {
          name: 'Encoding',
          as: 'CapacitorFSEncoding',
          from: '@capacitor/filesystem',
        },
        {
          name: 'Filesystem',
          as: 'CapacitorFSFilesystem',
          from: '@capacitor/filesystem',
        },
        {
          name: 'FilesystemDirectory',
          as: 'CapacitorFSFilesystemDirectory',
          from: '@capacitor/filesystem',
        },
        {
          name: 'FilesystemEncoding',
          as: 'CapacitorFSFilesystemEncoding',
          from: '@capacitor/filesystem',
        },
      ] as {
        name: keyof typeof import('@capacitor/filesystem')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.geolocation && isPackageExists('@capacitor/geolocation')) {
    presets.push({
      from: '@capacitor/geolocation',
      imports: [
        {
          name: 'Geolocation',
          as: 'CapacitorGeolocation',
          from: '@capacitor/geolocation',
        },
      ] as {
        name: keyof typeof import('@capacitor/geolocation')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.googleMaps && isPackageExists('@capacitor/google-maps')) {
    presets.push({
      from: '@capacitor/google-maps',
      imports: [
        {
          name: 'GoogleMap',
          as: 'CapacitorGoogleMap',
          from: '@capacitor/google-maps',
        },
        {
          name: 'LatLngBounds',
          as: 'CapacitorLatLngBounds',
          from: '@capacitor/google-maps',
        },
        {
          name: 'MapType',
          as: 'CapacitorMapType',
          from: '@capacitor/google-maps',
        },
      ] as {
        name: keyof typeof import('@capacitor/google-maps')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.haptics && isPackageExists('@capacitor/haptics')) {
    presets.push({
      from: '@capacitor/haptics',
      imports: [
        {
          name: 'Haptics',
          as: 'CapacitorHaptics',
          from: '@capacitor/haptics',
        },
        {
          name: 'HapticsImpactStyle',
          as: 'CapacitorHapticsImpactStyles',
          from: '@capacitor/haptics',
        },
        {
          name: 'HapticsNotificationType',
          as: 'CapacitorHapticsNotificationType',
          from: '@capacitor/haptics',
        },
        {
          name: 'ImpactStyle',
          as: 'CapacitorImpactStyle',
          from: '@capacitor/haptics',
        },
        {
          name: 'NotificationType',
          as: 'CapacitorNotificationType',
          from: '@capacitor/haptics',
        },
      ] as {
        name: keyof typeof import('@capacitor/haptics')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.keyboard && isPackageExists('@capacitor/keyboard')) {
    presets.push({
      from: '@capacitor/keyboard',
      imports: [
        {
          name: 'Keyboard',
          as: 'CapacitorKeyboard',
          from: '@capacitor/keyboard',
        },
        {
          name: 'KeyboardResize',
          as: 'CapacitorKeyboardResize',
          from: '@capacitor/keyboard',
        },
        {
          name: 'KeyboardStyle',
          as: 'CapacitorKeyboardStyle',
          from: '@capacitor/keyboard',
        },
      ] as {
        name: keyof typeof import('@capacitor/keyboard')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.localNotifications && isPackageExists('@capacitor/local-notifications')) {
    presets.push({
      from: '@capacitor/local-notifications',
      imports: [
        {
          name: 'LocalNotifications',
          as: 'CapacitorLocalNotifications',
          from: '@capacitor/local-notifications',
        },
        {
          name: 'Weekday',
          as: 'CapacitorWeekday',
          from: '@capacitor/local-notifications',
        },
      ] as {
        name: keyof typeof import('@capacitor/local-notifications')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.motion && isPackageExists('@capacitor/motion')) {
    presets.push({
      from: '@capacitor/motion',
      imports: [
        {
          name: 'Motion',
          as: 'CapacitorMotion',
          from: '@capacitor/motion',
        },
      ] as {
        name: keyof typeof import('@capacitor/motion')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.network && isPackageExists('@capacitor/network')) {
    presets.push({
      from: '@capacitor/network',
      imports: [
        {
          name: 'Network',
          as: 'CapacitorNetwork',
          from: '@capacitor/network',
        },
      ] as {
        name: keyof typeof import('@capacitor/network')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.preferences && isPackageExists('@capacitor/preferences')) {
    presets.push({
      from: '@capacitor/preferences',
      imports: [
        {
          name: 'Preferences',
          as: 'CapacitorPreferences',
          from: '@capacitor/preferences',
        },
      ] as {
        name: keyof typeof import('@capacitor/preferences')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.pushNotifications && isPackageExists('@capacitor/push-notifications')) {
    presets.push({
      from: '@capacitor/push-notifications',
      imports: [
        {
          name: 'PushNotifications',
          as: 'CapacitorPushNotifications',
          from: '@capacitor/push-notifications',
        },
      ] as {
        name: keyof typeof import('@capacitor/push-notifications')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.screenOrientation && isPackageExists('@capacitor/screen-orientation')) {
    presets.push({
      from: '@capacitor/screen-orientation',
      imports: [
        {
          name: 'ScreenOrientation',
          as: 'CapacitorScreenOrientation',
          from: '@capacitor/screen-orientation',
        },
      ] as {
        name: keyof typeof import('@capacitor/screen-orientation')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.screenReader && isPackageExists('@capacitor/screen-reader')) {
    presets.push({
      from: '@capacitor/screen-reader',
      imports: [
        {
          name: 'ScreenReader',
          as: 'CapacitorScreenReader',
          from: '@capacitor/screen-reader',
        },
      ] as {
        name: keyof typeof import('@capacitor/screen-reader')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.share && isPackageExists('@capacitor/share')) {
    presets.push({
      from: '@capacitor/share',
      imports: [
        {
          name: 'Share',
          as: 'CapacitorShare',
          from: '@capacitor/share',
        },
      ] as {
        name: keyof typeof import('@capacitor/share')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.splashScreen && isPackageExists('@capacitor/splash-screen')) {
    presets.push({
      from: '@capacitor/splash-screen',
      imports: [
        {
          name: 'SplashScreen',
          as: 'CapacitorSplashScreen',
          from: '@capacitor/splash-screen',
        },
      ] as {
        name: keyof typeof import('@capacitor/splash-screen')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.statusBar && isPackageExists('@capacitor/status-bar')) {
    presets.push({
      from: '@capacitor/status-bar',
      imports: [
        {
          name: 'Animation',
          as: 'CapacitorAnimation',
          from: '@capacitor/status-bar',
        },
        {
          name: 'StatusBar',
          as: 'CapacitorStatusBar',
          from: '@capacitor/status-bar',
        },
        {
          name: 'StatusBarAnimation',
          as: 'CapacitorStatusBarAnimation',
          from: '@capacitor/status-bar',
        },
        {
          name: 'StatusBarStyle',
          as: 'CapacitorStatusBarStyle',
          from: '@capacitor/status-bar',
        },
        {
          name: 'Style',
          as: 'CapacitorStyle',
          from: '@capacitor/status-bar',
        },
      ] as {
        name: keyof typeof import('@capacitor/status-bar')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.textZoom && isPackageExists('@capacitor/text-zoom')) {
    presets.push({
      from: '@capacitor/text-zoom',
      imports: [
        {
          name: 'TextZoom',
          as: 'CapacitorTextZoom',
          from: '@capacitor/text-zoom',
        },
      ] as {
        name: keyof typeof import('@capacitor/text-zoom')
        as: string
        from: string
      }[],
    })
  }

  if (params.options.plugins.official.toast && isPackageExists('@capacitor/toast')) {
    presets.push({
      from: '@capacitor/toast',
      imports: [
        {
          name: 'Toast',
          as: 'CapacitorToast',
          from: '@capacitor/toast',
        },
      ] as {
        name: keyof typeof import('@capacitor/toast')
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
