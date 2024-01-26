import { camelCase } from 'scule'
import type { H3Event } from 'h3'

export function getPergelContext(this: {
  projectName: string
  moduleName: string
}, event: H3Event) {
  const mergedProjectName = camelCase(`${this.moduleName}-${this.projectName}`)
  return event.context.globalModuleContext[mergedProjectName]
}
