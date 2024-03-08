import type { XmlFile } from '@trapezedev/project'
import type { TrapezedPlugins } from '../types'

export function trapezedPlugins(options: TrapezedPlugins) {
  return options
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
) {
  if (file.find('manifest/application/activity/intent-filter')?.length === 0) {
    file.injectFragment('manifest', `
<intent-filter>
    <!-- intent-filter -->
</intent-filter>
`.trim())
  }
}

export function addIntentFilterItem(
  file: XmlFile,
  where: string,
  item: string,
) {
  if (file.find(`manifest/application/activity/intent-filter/${where}[@${item}]`)?.length === 0) {
    file.injectFragment('manifest/application/activity/intent-filter', `
      <${where} ${item} />
      `.trim())
    return
  }

  if (file.find(`manifest/application/activity/intent-filter/${where}[@${item}]`)?.length) {
    file.replaceFragment(`manifest/application/activity/intent-filter/${where}[@${item}]`, `
      <${where} ${item} />
      `.trim())
  }
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
