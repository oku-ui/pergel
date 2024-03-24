import consola from 'consola'
import type { AndroidGradleInjectType } from '@trapezedev/project'
import { addFeature, addMetaData, addPermission, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'googleMaps',
    version: '0.0.1',
  },
  async android(project, _ctx, options) {
    const file = project?.getAndroidManifest()
    await file?.load()

    consola.log('googleMaps')

    if (!file)
      return

    addPermission(file, 'android.permission.ACCESS_COARSE_LOCATION')
    addPermission(file, 'android.permission.ACCESS_FINE_LOCATION')

    const variablesGradle = await project?.getGradleFile('variables.gradle')

    if (typeof options.plugins.official.googleMaps === 'object')
      addMetaData(file, 'com.google.android.geo.API_KEY', options.plugins.official.googleMaps.api_key, 'manifest/application')

    // BUG: gradle inseretion not workoing on nuxt prepare
    await variablesGradle?.insertProperties(
      {
        ext: {},
      },
      [{
        googleMapsPlayServicesVersion: '18.2.0',
        googleMapsUtilsVersion: '3.8.2',
        googleMapsKtxVersion: '5.0.0',
        googleMapsUtilsKtxVersion: '5.0.0',
        kotlinxCoroutinesVersion: '1.7.3',
        androidxCoreKTXVersion: '1.12.0',
        kotlin_version: '1.9.10',
      }],
      'variable' as AndroidGradleInjectType.Variable,
    )
  },
  async ios(project, { build, target }, options) {
    const file = await project?.getInfoPlist(target.name, build.name)

    if (!file)
      return

    if (typeof options.plugins.official.googleMaps !== 'object')
      return

    await project?.updateInfoPlist(target.name, build.name, {
      NSLocationAlwaysUsageDescription: options.plugins.official.googleMaps?.info.NSLocationAlwaysUsageDescription || 'Privacy - Location Always Usage Description',
      NSLocationWhenInUseUsageDescription: options.plugins.official.googleMaps?.info.NSLocationWhenInUseUsageDescription || 'Privacy - Location When In Use Usage Description',
    })
  },
})
