import { addIntentFilter, addIntentFilterItem, trapezedPlugins } from '../utils'

export default trapezedPlugins({
  meta: {
    name: 'app',
    version: '0.0.1',
  },
  async android(project) {
    const file = project?.getAndroidManifest()
    await file?.load()

    if (!file)
      return

    addIntentFilter(file)
    addIntentFilterItem(file, 'action', 'android:name="android.intent.action.VIEW"')
    addIntentFilterItem(file, 'category', 'android:name="android.intent.category.DEFAULT"')
    addIntentFilterItem(file, 'category', 'android:name="android.intent.category.BROWSABLE"')
    addIntentFilterItem(file, 'data', 'android:scheme="@string/custom_url_scheme"')
  },
})
