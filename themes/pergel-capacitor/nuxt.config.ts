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
            appName: 'Pergel App',
            appId: 'com.example.app',
            plugins: {
              SplashScreen: {
                launchShowDuration: 0,
              },
            },
          },
          ios: true,
          android: true,
          trapeze: {
            ios: (project, { build, target }) => {
              project?.setBuildProperty(target.name, build.name, 'IPHONEOS_DEPLOYMENT_TARGET', '15.0')
            },
            version: {
              android: {
                versionCode: 1,
                versionName: '1.0.0',
              },
              ios: {
                build: 1,
                version: '1.0.0',
              },
            },
          },
          plugins: {
            official: {
              actionSheet: true,
              appLauncher: true,
              backgroundRunner: true,
              app: {
                CFBundleURLSchemes: ['pergelapp'],
              },
            },
          },
        },
      },
    },
  },
})
