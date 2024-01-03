// nuxt.config.d.ts

// import type { AnimationBuilder, Mode, PlatformConfig, SpinnerTypes, TabButtonLayout } from '@ionic/core'

interface IonicConfig {
  // actionSheetEnter?: AnimationBuilder
  // actionSheetLeave?: AnimationBuilder
  // alertEnter?: AnimationBuilder
  // alertLeave?: AnimationBuilder
  // animated?: boolean
  // backButtonDefaultHref?: string
  // backButtonIcon?: string
  // backButtonText?: string
  // innerHTMLTemplatesEnabled?: boolean
  // hardwareBackButton?: boolean
  // infiniteLoadingSpinner?: SpinnerTypes
  // loadingEnter?: AnimationBuilder
  // loadingLeave?: AnimationBuilder
  // loadingSpinner?: SpinnerTypes
  // menuIcon?: string
  // menuType?: string
  // modalEnter?: AnimationBuilder
  // modalLeave?: AnimationBuilder
  // mode?: Mode
  // navAnimation?: AnimationBuilder
  // pickerEnter?: AnimationBuilder
  // pickerLeave?: AnimationBuilder
  // platform?: PlatformConfig
  // popoverEnter?: AnimationBuilder
  // popoverLeave?: AnimationBuilder
  // refreshingIcon?: string
  // refreshingSpinner?: SpinnerTypes
  // sanitizerEnabled?: boolean
  // spinner?: SpinnerTypes
  // statusTap?: boolean
  // swipeBackEnabled?: boolean
  // tabButtonLayout?: TabButtonLayout
  // toastDuration?: number
  // toastEnter?: AnimationBuilder
  // toastLeave?: AnimationBuilder
  // toggleOnOffLabels?: boolean
}
interface NuxtIonicModuleOptions {
  integrations?: {
    /**
     * Default: true
     * Disable to take full control of meta tags.
     */
    meta: true | boolean

    /**
     * Default: true
     * Disable to take full control of icon generation, manifest and service worker installation.
     */
    pwa: true | boolean

    /**
     * Default: true
     * Disable to configure Ionic Router yourself.
     */
    router: true | boolean

    /**
     * Default: true
     * Disable to stop icons from being auto-imported.
     */
    icons: true | boolean
  }
  css?: {
    /**
     * Default: true
     * Disable to import these CSS files manually: @ionic/vue/css/core.css
     */
    core: true | boolean

    /**
     * Default: true
     * Disable to import these CSS files manually:
     * @ionic/vue/css/normalize.css
     * @ionic/vue/css/structure.css
     * @ionic/vue/css/typography.css
     */
    basic: true | boolean

    /**
     * Default: false
     * Enable to add extra Ionic CSS utilities:
     * @ionic/vue/css/padding.css
     * @ionic/vue/css/float-elements.css
     * @ionic/vue/css/text-alignment.css
     * @ionic/vue/css/text-transformation.css
     * @ionic/vue/css/flex-utils.css
     * @ionic/vue/css/display.css
     */
    utilies: false | boolean
  }
  config?: IonicConfig
}
export interface IonicInterface {
  appName: string
  capacitorConfig: CapacitorConfig
  ionic?: NuxtIonicModuleOptions
}
export interface ResolvedIonicInterface {
  appName: string
  capacitorConfig: CapacitorConfig
  ionic?: NuxtIonicModuleOptions

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
