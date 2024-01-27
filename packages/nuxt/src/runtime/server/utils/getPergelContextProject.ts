import type { H3Event } from 'h3'
import type { PergelH3ContextItem } from '../../modules'
import type { ProjectName } from '#pergel/types'

export function getPergelContextProject(this: {
  projectName: string
}, params: {
  event: H3Event
}): PergelH3ContextItem | undefined {
  if (!params.event.context.pergelContext)
    return {}

  if (this.projectName)
    return params.event.context.pergelContext[this.projectName as ProjectName] ?? {}
}
