// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
  ],
  ssr: false,
  pergel: {
    projects: {
      changeName: {
        capacitor: {
          capacitorConfig: {
            appName: 'My App',
            appId: 'com.example.app',
            webDir: 'www',
            plugins: {
              SplashScreen: {
                launchShowDuration: 0,
              },
            },
          },
          ios: true,
        },
      },
    },
  },
})
