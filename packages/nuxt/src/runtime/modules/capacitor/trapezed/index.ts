import type { MobileProjectConfig } from '@trapezedev/project'
import { MobileProject } from '@trapezedev/project'
import type { NuxtPergel } from '../../../core/types/nuxtModule'
import type { ResolvedCapacitorOptions, TrapezedPlugins } from '../types'

const plugins = {
  appLauncher: () => import('./plugins/appLauncher'),
}

export async function trapezedRun(params: {
  nuxt: NuxtPergel
  options: ResolvedCapacitorOptions
}) {
  const config: MobileProjectConfig = {
    ios: {
      path: 'ios/App',
    },
    android: {
      path: 'android',
    },
    projectRoot: params.nuxt.options.rootDir,
  }

  const project = new MobileProject(params.nuxt.options.rootDir, config)
  await project.load()

  const version = {
    ios: {
      build: 1,
      version: '0.0.0',
    },
    android: {
      versionCode: 1,
      versionName: '0.0.0',
    },
  }

  version.ios = typeof params.options.trapeze === 'object' && params.options.trapeze.version.ios ? params.options.trapeze.version.ios : version.ios
  version.android = typeof params.options.trapeze === 'object' && params.options.trapeze.version.android ? params.options.trapeze.version.android : version.android

  const app_name = params.options.capacitorConfig.appName ?? 'My App'
  const package_name = params.options.capacitorConfig.appId ?? 'com.example.app'

  if (project.ios && params.options.ios) {
    const getTargets = project.ios.getTargets()
    for await (const target of getTargets ?? []) {
      for await (const build of target.buildConfigurations) {
        project.ios.setBundleId(target.name, build.name, package_name)
        await project.ios.setDisplayName(target.name, build.name, app_name)
        await project.ios.setVersion(target.name, build.name, version.ios.version)
        await project.ios.setBuild(target.name, build.name, version.ios.build)

        if (params.options.plugins.official) {
          for await (const selectPlugin of Object.keys(params.options.plugins.official)) {
            if (!params.options.plugins.official[selectPlugin as keyof typeof params.options.plugins.official])
              continue

            for await (const plugin of Object.keys(plugins)) {
              const pluginModule = await (plugins as any)[plugin]().then((m: any) => m.default).catch(() => null) as TrapezedPlugins
              if (pluginModule.meta && pluginModule.meta.name === selectPlugin)
                typeof pluginModule.ios === 'function' && pluginModule.ios(project.ios, { build, target })
            }
          }
        }

        if (params.options.plugins.community) {
          for await (const selectPlugin of Object.keys(params.options.plugins.community)) {
            if (!params.options.plugins.community[selectPlugin as keyof typeof params.options.plugins.community])
              continue

            for await (const plugin of Object.keys(plugins)) {
              const pluginModule = await (plugins as any)[plugin]().then((m: any) => m.default).catch(() => null) as TrapezedPlugins
              if (pluginModule.meta && pluginModule.meta.name === selectPlugin)
                typeof pluginModule.ios === 'function' && pluginModule.ios(project.ios, { build, target })
            }
          }
        }

        // user custom config
        if (
          typeof params.options.trapeze === 'object'
          && typeof params.options.trapeze.ios === 'function'
        )
          params.options.trapeze.ios(project.ios, { build, target })
      }
    }
  }

  if (project.android && params.options.android) {
    const file = project.android?.getAndroidManifest()
    await file.load()

    await project.android.setPackageName(package_name)
    await project.android.setVersionName(version.android.versionName)
    await project.android.setVersionCode(version.android.versionCode)

    if (params.options.plugins.official) {
      for await (const selectPlugin of Object.keys(params.options.plugins.official)) {
        if (!params.options.plugins.official[selectPlugin as keyof typeof params.options.plugins.official])
          continue

        for await (const plugin of Object.keys(plugins)) {
          const pluginModule = await (plugins as any)[plugin]().then((m: any) => m.default).catch(() => null) as TrapezedPlugins
          if (pluginModule.meta && pluginModule.meta.name === selectPlugin)
            typeof pluginModule.android === 'function' && pluginModule.android(project.android, { packageName: package_name, appName: app_name })
        }
      }
    }

    if (params.options.plugins.community) {
      for await (const selectPlugin of Object.keys(params.options.plugins.community)) {
        if (!params.options.plugins.community[selectPlugin as keyof typeof params.options.plugins.community])
          continue

        for await (const plugin of Object.keys(plugins)) {
          const pluginModule = await (plugins as any)[plugin]().then((m: any) => m.default).catch(() => null) as TrapezedPlugins
          if (pluginModule.meta && pluginModule.meta.name === selectPlugin)
            typeof pluginModule.android === 'function' && pluginModule.android(project.android, { packageName: package_name, appName: app_name })
        }
      }
    }

    // user custom config
    if (
      typeof params.options.trapeze === 'object'
      && typeof params.options.trapeze.android === 'function'
    )
      params.options.trapeze.android(project.android)
  }

  await project.commit()
}
