import fs from 'node:fs/promises'
import path from 'node:path'
import { useNuxt } from '@nuxt/kit'
import { addFeature, addPermission, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'backgroundRunner',
    version: '0.0.1',
  },
  async android(project, _ctx) {
    const file = project?.getAndroidManifest()
    await file?.load()

    if (!file)
      return

    addPermission(file, 'android.permission.ACCESS_COARSE_LOCATION')
    addPermission(file, 'android.permission.ACCESS_FINE_LOCATION')
    addFeature(file, 'android.hardware.location.gps')
  },
  async ios() {
    const filePath = '/ios/App/App/AppDelegate.swift'
    const additionalCode = `
        BackgroundRunnerPlugin.registerBackgroundTask()
        BackgroundRunnerPlugin.handleApplicationDidFinishLaunching(launchOptions: launchOptions)
    `

    try {
      const rootDir = useNuxt().options.rootDir
      const fullPath = path.join(rootDir, filePath)

      let fileContent = await fs.readFile(fullPath, 'utf8')

      const startIndex = fileContent.indexOf('func application')
      const endIndex = fileContent.indexOf('}', startIndex)

      if (fileContent.includes(additionalCode.trim()))
        return

      if (startIndex !== -1 && endIndex !== -1) {
        const returnIndex = fileContent.indexOf('return true', startIndex)

        if (returnIndex !== -1) {
          fileContent = fileContent.slice(0, returnIndex) + additionalCode + fileContent.slice(returnIndex)

          await fs.writeFile(fullPath, fileContent, 'utf8')
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
