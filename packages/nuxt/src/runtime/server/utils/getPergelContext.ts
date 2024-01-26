import type { H3Event } from 'h3'

export function getPergelContext(this: {
  projectName: string
  moduleName?: string
}, params: {
  event: H3Event
}) {
  if (!params.event.context.pergelContext)
    return {}

  if (this.projectName && this.moduleName)
    return (params.event.context.pergelContext as any)[this.projectName][this.moduleName] ?? {}

  if (this.projectName)
    return params.event.context.pergelContext[this.projectName] ?? {}
}
