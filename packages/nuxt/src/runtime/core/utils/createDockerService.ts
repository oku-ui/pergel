import defu from 'defu'
import type { ComposeSpecification } from '../../../moduleTypes/compose-spec-type'
import type { NuxtPergel } from '../types/nuxtModule'

export function createDockerService(nuxt: NuxtPergel, projectName: string, options: ComposeSpecification) {
  nuxt._pergel.composeTemplates ??= {}
  nuxt._pergel.composeTemplates[projectName] ??= {}
  nuxt._pergel.composeTemplates[projectName] = defu(nuxt._pergel.composeTemplates[projectName], {
    name: 'pergel',
    version: '0.0.0',
    ...options,
  }) as ComposeSpecification
}
