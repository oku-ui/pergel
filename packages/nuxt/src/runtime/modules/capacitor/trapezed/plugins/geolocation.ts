import consola from 'consola'
import type { AndroidGradleInjectType } from '@trapezedev/project'
import { addFeature, addPermission, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'geolocation',
    version: '0.0.1',
  },
  async android(project) {
    const file = project?.getAndroidManifest()
    await file?.load()

    if (!file)
      return

    addPermission(file, 'android.permission.ACCESS_COARSE_LOCATION')
    addPermission(file, 'android.permission.ACCESS_FINE_LOCATION')
    addFeature(file, 'android.hardware.location.gps')

    const variablesGradle = await project?.getGradleFile('variables.gradle')

    // BUG: gradle inseretion not workoing on nuxt prepare
    await variablesGradle?.insertProperties(
      {
        ext: {},
      },
      [{ playServicesLocationVersion: '21.1.0' }],
      'variable' as AndroidGradleInjectType.Variable,
    )
  },
  async ios(project, { build, target }, options) {
    const file = await project?.getInfoPlist(target.name, build.name)

    if (!file)
      return

    if (typeof options.plugins.official.geolocation !== 'object')
      return

    await project?.updateInfoPlist(target.name, build.name, {
      NSLocationWhenInUseUsageDescription: options.plugins.official.geolocation?.NSLocationWhenInUseUsageDescription || 'Privacy - Location When In Use Usage Description',
    })
  },
})
