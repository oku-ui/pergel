import type { XmlFile } from '@trapezedev/project'
import type { TrapezedPlugins } from '../types'

export function trapezedPlugins(options: TrapezedPlugins) {
  return options
}

export function asyncFunc(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function addQueries(
  file: XmlFile,
) {
  if (file.find('manifest/queries')?.length === 0) {
    file.injectFragment('manifest', `
<queries>
  <!-- queries -->
</queries>
`.trim())
  }
}

export function addIntentFilter(
  file: XmlFile,
  path: string,
) {
  if (file.find(`${path}/intent-filter`)?.length === 0) {
    file.injectFragment(path, `
<intent-filter>
    <!-- intent-filter -->
</intent-filter>
`.trim())
  }
}

export function addIntentFilterItem(
  file: XmlFile,
  path: string,
  where: string,
  item: string,
) {
  if (file.find(`${path}/${where}[@${item}]`)?.length === 0) {
    file.injectFragment(path, `
      <${where} ${item} />
      `.trim())
    return
  }

  if (file.find(`${path}/${where}[@${item}]`)?.length) {
    file.replaceFragment(`${path}/${where}[@${item}]`, `
      <${where} ${item} />
      `.trim())
  }
}

/*
        <service android:name="com.google.android.gms.metadata.ModuleDependencies"
            android:enabled="false"
            android:exported="false"
            tools:ignore="MissingClass">
            <intent-filter>
                <action android:name="com.google.android.gms.metadata.MODULE_DEPENDENCIES" />
            </intent-filter>
            <meta-data android:name="photopicker_activity:0:required" android:value="" />
        </service>
*/

export async function addMiddleService(
  file: XmlFile,
  item: string,
) {
  if (file.find(`manifest/application/service[@${item}]`)?.length === 0) {
    file.injectFragment('manifest/application', `
      <service ${item}>
        <!-- service -->
      </service>
      `.trim())
  }
}

export function addServiceAttribute(
  file: XmlFile,
  where: string,
  item: Record<string, string>,
) {
  if (file.find(`manifest/application/service[@${where}]`)?.length)
    file.setAttrs(`manifest/application/service[@${where}]`, item)
}

/** 'manifest/queries' + 'package'(autoadd) */
export function addPackage(
  file: XmlFile,
  where: string,
  packageKey: string,
  packageValue: string,
) {
  if (file.find(`${where}/package[@${packageKey}]`)?.length) {
    file.replaceFragment(`${where}/package[@${packageKey}]`, `
      <package ${packageKey}="${packageValue}" />
      `.trim())
    return
  }

  if (file.find(`${where}/package[@${packageKey}="${packageValue}"]`)?.length === 0) {
    file.injectFragment(where, `
      <package ${packageKey}="${packageValue}" />
  `.trim())
  }
}

export function addPermission(
  file: XmlFile,
  permission: string,
) {
  if (file.find('Permissions') && file.find(`manifest/uses-permission[@android:name="${permission}"]`)?.length === 0) {
    file.injectFragment('manifest', `<uses-permission android:name="${permission}" />
`.trim())
  }
}

export function addFeature(
  file: XmlFile,
  feature: string,
) {
  if (file.find('Permissions') && file.find(`manifest/uses-feature[@android:name="${feature}"]`)?.length === 0) {
    file.injectFragment('manifest', `<uses-feature android:name="${feature}" />
`.trim())
  }
}
