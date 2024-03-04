// import type { AnimationBuilder, Mode, PlatformConfig, SpinnerTypes, TabButtonLayout } from '@ionic/core'
import type { CapacitorConfig } from '@capacitor/cli'

export interface ResolvedCapacitorOptions {
  capacitorConfig: CapacitorOptions
  ios: boolean
  android: boolean
  mehmet: string
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
}

export interface CapacitorModuleRuntimeConfig {
  /** the type of the device to run the app on */
  runType: 'ios' | 'android'
  /** set the target device to run the app on */
  runTargetDevice?: string
  /** set the scheme of the iOS project */
  runScheme?: string
}
