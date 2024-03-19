import { AppDelegateAdditionalCode, addFeature, addPermission, trapezedPlugins } from '../utils'

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
    // TODO: SDK version check
    addPermission(file, 'android.permission.SCHEDULE_EXACT_ALARM')
  },
  async ios(project, { build, target }, options) {
    await AppDelegateAdditionalCode({
      additionalCode: `import CapacitorBackgroundRunner
`,
      where: {
        startContent: {
          startIndex: 'import UIKit',
          endIndex: '',
        },
        endContent: 'import Capacitor',
      },
      hasChecker: 'import CapacitorBackgroundRunner',
    })

    await AppDelegateAdditionalCode(
      {
        additionalCode: `
        BackgroundRunnerPlugin.registerBackgroundTask() // test1
        BackgroundRunnerPlugin.handleApplicationDidFinishLaunching(launchOptions: launchOptions)
    `,
        where: {
          startContent: {
            startIndex: 'func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {',
            endIndex: '}',
          },
          endContent: 'return true',
        },
        hasChecker: 'BackgroundRunnerPlugin',
      },
    )

    await AppDelegateAdditionalCode({
      additionalCode: `}

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        BackgroundRunnerPlugin.dispatchEvent(event: "remoteNotification", eventArgs: userInfo) { result in
            switch result {
            case .success:
                completionHandler(.newData)
            case .failure:
                completionHandler(.failed)
            }
        }
    `,
      where: {
        startContent: {
          startIndex: `return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)`,
          endIndex: '',
        },
        endContent: '}',
      },
      hasChecker: 'BackgroundRunnerPlugin.dispatchEvent',
    })

    if (typeof options.plugins.official.backgroundRunner !== 'object')
      return

    await project?.updateInfoPlist(target.name, build.name, {
      BGTaskSchedulerPermittedIdentifiers: options.plugins.official.backgroundRunner.label,
    })
  },
})
