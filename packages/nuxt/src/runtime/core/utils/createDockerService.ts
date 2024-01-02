import defu from 'defu'
import type { ComposeSpecification } from '../../../types/compose-spec-type'
import type { NuxtPergel } from '../types'

export function createDockerService(nuxt: NuxtPergel, options: ComposeSpecification) {
  nuxt._pergel.composeTemplates ??= {}
  nuxt._pergel.composeTemplates = defu(nuxt._pergel.composeTemplates, {
    ...options,
  })
}
