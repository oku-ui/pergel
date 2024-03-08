import { addPermission, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'camera',
    version: '0.0.1',
  },
  async android(project) {
    const file = project?.getAndroidManifest()
    await file?.load()

    if (!file)
      return

    addPermission(file, 'android.permission.READ_MEDIA_IMAGES')
    addPermission(file, 'android.permission.READ_EXTERNAL_STORAGE')
    addPermission(file, 'android.permission.WRITE_EXTERNAL_STORAGE')
  },
  async ios(project, { build, target }, options) {
    let infoPlist: typeof options.plugins.official.camera = {}

    // eslint-disable-next-line style/max-statements-per-line
    if (typeof options.plugins.official.camera !== 'boolean') { infoPlist = options.plugins.official.camera }
    else {
      infoPlist = {
        NSCameraUsageDescription: 'Your camera will be used to take pictures and record video',
        NSPhotoLibraryUsageDescription: 'Your photo library will be used to select images and videos',
        NSMicrophoneUsageDescription: 'Your microphone will be used to record audio',
      }
    }

    await project?.updateInfoPlist(target.name, build.name, infoPlist)
  },
})
