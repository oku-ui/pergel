import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ionic.example.com',
  appName: 'MyApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
