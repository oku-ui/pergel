// import type { AnimationBuilder, Mode, PlatformConfig, SpinnerTypes, TabButtonLayout } from '@ionic/core'
import type { CapacitorConfig } from '@capacitor/cli'

export interface ResolvedCapacitorOptions {
  capacitorConfig: CapacitorOptions
}

export interface CapacitorOptions {
  /**
   * This key capacitor.config.ts is used to configure Capacitor.
   */
  capacitorConfig: CapacitorConfig
}
