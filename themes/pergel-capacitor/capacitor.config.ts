import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appName: 'My App',
  appId: 'com.example.app',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
}

export default config
