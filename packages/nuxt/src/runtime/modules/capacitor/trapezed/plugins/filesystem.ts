import { AppDelegateAdditionalCode, addFeature, addPermission, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'fileSystem',
    version: '0.0.1',
  },
  async android(project) {
    const file = project?.getAndroidManifest()
    await file?.load()

    if (!file)
      return

    addPermission(file, 'android.permission.READ_EXTERNAL_STORAGE')
    addPermission(file, 'android.permission.WRITE_EXTERNAL_STORAGE')
  },
  async ios(project, { build, target }, options) {
    const file = await project?.getInfoPlist(target.name, build.name)

    if (!file)
      return

    if (typeof options.plugins.official.filesystem !== 'object')
      return

    await project?.updateInfoPlist(target.name, build.name, {
      UIFileSharingEnabled: options.plugins.official.filesystem?.UIFileSharingEnabled || 'Application supports iTunes file sharing',
      LSSupportsOpeningDocumentsInPlace: options.plugins.official.filesystem?.LSSupportsOpeningDocumentsInPlace || 'Supports opening documents in place',
    })
  },
})
