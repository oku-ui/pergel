import consola from 'consola'
import type { PergelOptions } from '../types'

export async function checkOptions(
  options: PergelOptions,
) {
  let status = true

  // project1, newProject, etc.
  const projectNames = Object.keys(options.projects)

  if (projectNames.length === 0) {
    consola.error('No projects found in pergel config')
    status = false
  }

  return {
    status,
  }
}
