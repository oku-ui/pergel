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
