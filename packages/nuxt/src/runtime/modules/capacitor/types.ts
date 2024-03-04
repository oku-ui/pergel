import type { CapacitorConfig } from '@capacitor/cli'
import type { MobileProject } from '@trapezedev/project'

export interface ResolvedCapacitorOptions {
  capacitorConfig: CapacitorOptions
  ios: boolean
  android: boolean
  plugins: {
    official: {
      actionSheet: boolean
    }
    community: {
      revenuecat: boolean
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
  trapeze?: true | ((project: MobileProject) => Promise<void>)

  plugins?: {
    official?: {
      actionSheet?: boolean
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

  /**
   * Configure your mobile apps with confidence.
   * @link https://trapeze.dev
   */
  trapeze?: true | ((project: MobileProject) => Promise<void>)

}
