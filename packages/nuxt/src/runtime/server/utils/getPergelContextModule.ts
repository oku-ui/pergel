import type { H3Event } from 'h3'
import type { PergelContextKeys, PergelH3ContextItem } from '../../modules'
import { getPergelContextProject } from './getPergelContextProject'

export function getPergelContextModule<T extends PergelContextKeys>(this: {
  projectName: string
  moduleName: string
}, params: {
  event: H3Event
}): PergelH3ContextItem[T] {
  const pergelContext = getPergelContextProject.call(this, params)

  if (!pergelContext)
    return

  return pergelContext[this.moduleName as T]
}
