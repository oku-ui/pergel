// import type { AnimationBuilder, Mode, PlatformConfig, SpinnerTypes, TabButtonLayout } from '@ionic/core'

export interface IonicInterface {
  appName: string
  capacitorConfig: CapacitorConfig

}
export interface ResolvedIonicInterface {
  appName: string
  capacitorConfig: CapacitorConfig
}

export interface CapacitorConfig {
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
