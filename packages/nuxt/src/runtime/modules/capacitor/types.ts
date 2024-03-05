import type { CapacitorConfig } from '@capacitor/cli'
import type { IosTarget, IosTargetBuildConfiguration, MobileProject } from '@trapezedev/project'

export interface ResolvedCapacitorOptions {
  capacitorConfig: CapacitorConfig
  ios: boolean
  android: boolean
  plugins: {
    official: {
      actionSheet: boolean
      appLauncher: boolean
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
