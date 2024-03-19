import type { CapacitorConfig } from '@capacitor/cli'
import type { IosTarget, IosTargetBuildConfiguration, MobileProject } from '@trapezedev/project'
import type { NuxtPergel } from '../../core/types/nuxtModule'

export interface TrapezedPlugins {
  meta: {
    name: string
    version: string
  }
  ios?: (
    project: MobileProject['ios'],
    context: {
      build: IosTargetBuildConfiguration
      target: IosTarget
      packageName: string
      appName: string
    },
    options: ResolvedCapacitorOptions,
    nuxt: NuxtPergel
  ) => void
  // Resorces: 'https://developer.android.com/guide/topics/manifest/manifest-intro'
  android?: (
    project: MobileProject['android'],
    context: {
      packageName: string
      appName: string
    },
    options: ResolvedCapacitorOptions,
    nuxt: NuxtPergel
  ) => void
}

export interface ResolvedCapacitorOptions {
  capacitorConfig: CapacitorConfig
  ios: boolean
  android: boolean
  plugins: {
    official: {
      actionSheet: boolean
      appLauncher: boolean
      backgroundRunner: boolean | {
        label: string
        src: string
        event: string
        repeat: boolean
        interval: number
        autoStart: boolean
      }
      browser: boolean
      camera: boolean | {
        NSCameraUsageDescription?: string
        NSPhotoLibraryUsageDescription?: string
        NSMicrophoneUsageDescription?: string
      }
      clipboard: boolean
      app: {
        CFBundleURLSchemes: string[]
      }
      device: boolean
    }
    community: {
      revenuecat: boolean
    }
  }
  trapeze?: true | {
    ios?: (
      project: MobileProject['ios'],
      context: {
        build: IosTargetBuildConfiguration
        target: IosTarget
      }
    ) => void
    android?: (project: MobileProject['android']) => void
    version: {
      android?: {
        versionCode: number
        versionName: string
      }
      ios?: {
        build: number
        version: string
      }
    }
  }
}

export interface CapacitorOptions {
  /**
   * This key capacitor.config.ts is used to configure Capacitor.
   */
  capacitorConfig?: CapacitorConfig
  /**
   * This key capacitor.config.ts is used to configure Capacitor.
   * @default false
   */
  ios?: boolean
  /**
   * This key capacitor.config.ts is used to configure Capacitor.
   * @default false
   */
  android?: boolean

  /**
   * Configure your mobile apps with confidence.
   * @link https://trapeze.dev
   */
  trapeze?: true | {
    ios?: (
      project: MobileProject['ios'],
      context: {
        build: IosTargetBuildConfiguration
        target: IosTarget
      }
    ) => void
    android?: (project: MobileProject['android']) => void
    version: {
      android?: {
        versionCode: number
        versionName: string
      }
      ios?: {
        build: number
        version: string
      }
    }
  }

  plugins?: {
    official?: {
      actionSheet?: boolean
      appLauncher?: boolean
      backgroundRunner?: boolean | {
        label: string
        src: string
        event: string
        repeat: boolean
        interval: number
        autoStart: boolean
      }
      browser?: boolean
      camera?: boolean | {
        /**
         * Your camera will be used to take pictures and record video
         */
        NSCameraUsageDescription?: string
        /**
         * Your photo library will be used to select images and videos
         */
        NSPhotoLibraryUsageDescription?: string
        /**
         * Your microphone will be used to record audio
         */
        NSMicrophoneUsageDescription?: string
      }
      app?: {
        CFBundleURLSchemes?: string[]
      }
      clipboard?: boolean
      CapacitorCookies?: {
        enable: boolean
      }
      device?: boolean
    }
    community?: {
      revenuecat?: boolean
    }
  }
}

export interface CapacitorModuleRuntimeConfig {
  /** set the target device to run the app on */
  runTargetIOSSimulator?: string

  /** set the target emulator to run the app on */
  runTargetAndroidEmulator?: string

  /** set the scheme of the iOS project */
  runScheme?: string
}
