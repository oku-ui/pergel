import { addPackage, addQueries, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'appLauncher',
    version: '0.0.1',
  },
  async android(project, ctx) {
    const file = project?.getAndroidManifest()
    await file?.load()

    if (!file)
      return

    addQueries(file)
    addPackage(file, 'manifest/queries', 'android:name', ctx.packageName)
  },
})
