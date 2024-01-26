import { camelCase } from 'scule'
import type { H3Event } from 'h3'

export function getPergelContext(this: {
  projectName: string
  moduleName: string
}, params: {
  event: H3Event
}) {
  const mergedProjectName = camelCase(`${this.moduleName}-${this.projectName}`)
  return params.event.context.pergelContext[mergedProjectName]
}
