import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appName: 'Pergel App',
  appId: 'com.example.app',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
}

export default config
