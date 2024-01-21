// import type { AnimationBuilder, Mode, PlatformConfig, SpinnerTypes, TabButtonLayout } from '@ionic/core'
import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export interface IonicInterface extends PergelModuleOptions {
  appName: string
  defaultCss: boolean
  themeCss: boolean
  capacitorConfig?: CapacitorConfig

}
export interface ResolvedIonicInterface extends ResolvedPergelModuleOptions {
  appName: string
  defaultCss: boolean
  themeCss: boolean
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
