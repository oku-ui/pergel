// import type { AnimationBuilder, Mode, PlatformConfig, SpinnerTypes, TabButtonLayout } from '@ionic/core'

export interface ResolvedCapacitorConfig {
  appName: string
  defaultCss: boolean
  themeCss: boolean
  capacitorConfig: CapacitorOptions
}

export interface CapacitorOptions {
  android?: {
    // Android özel konfigürasyon değerleri eklenebilir
  }
  appId: string
  appName: string
  bundler?: string
  cliVersion?: string
  domain?: string
  electron?: {
    // Electron özel konfigürasyon değerleri eklenebilir
  }
  hostname?: string
  ios?: {
    // iOS özel konfigürasyon değerleri eklenebilir
  }
  npmClient?: string
  plugins?: {
    // Capacitor eklentileri için konfigürasyon değerleri eklenebilir
  }
  webDir?: string
}
