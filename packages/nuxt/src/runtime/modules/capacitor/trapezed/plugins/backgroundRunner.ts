import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { addFeature, addPermission, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'backgroundRunner',
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

    // Andorid 13 (API 30) requires this permission for exact alarms
    addPermission(file, 'android.permission.SCHEDULE_EXACT_ALARM')
  },
  async ios(_project, _ctx, _options, nuxt) {
    const filePath = '/ios/App/App/AppDelegate.swift'
    const additionalCode = `
        BackgroundRunnerPlugin.registerBackgroundTask()
        BackgroundRunnerPlugin.handleApplicationDidFinishLaunching(launchOptions: launchOptions)
    `

    try {
      const rootDir = nuxt.options.rootDir
      const fullPath = join(rootDir, filePath)

      let fileContent = await readFile(fullPath, 'utf8')

      const startIndex = fileContent.indexOf('func application')
      const endIndex = fileContent.indexOf('}', startIndex)

      if (fileContent.includes('BackgroundRunnerPlugin'))
        return

      if (startIndex !== -1 && endIndex !== -1) {
        const returnIndex = fileContent.indexOf('return true', startIndex)

        if (returnIndex !== -1) {
          fileContent = fileContent.slice(0, returnIndex) + additionalCode + fileContent.slice(returnIndex)

          await writeFile(fullPath, fileContent, 'utf8')
        }
        else {
          console.error('Error: "return true" statement not found in the "func application" function.')
        }
      }
      else {
        console.error('Error: "func application" function not found in the file.')
      }
    }
    catch (e) {
      console.error(e)
    }
  },
})
