import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ionic.example.com',
  appName: 'MyApp',
  webDir: 'dist',
  server: {
    url: 'localhost:3000',
  },
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'FIT_CENTER',
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'large',
      showSpinner: true,
    },
  },
}

export default config
