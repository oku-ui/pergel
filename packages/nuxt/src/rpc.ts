import type { DevtoolsServerContext, Modules, ServerFunctions } from './runtime/core/types'

export function setupRPC(ctx: DevtoolsServerContext): ServerFunctions {
  const options = ctx.options
  const projects = options.projects
  return {
    getOptions() {
      return options
    },
    getProjects() {
      return Object.keys(projects)
    },
    getProject(name: string) {
      return projects[name]
    },
    getProjectModules(name: string) {
      return Object.keys(projects[name])
    },
    // TODO: fix type
    getProjectModule(projectName: string, moduleName: keyof Modules) {
      return projects[projectName][moduleName] as unknown as Modules[keyof Modules]
    },
    async reset() {
      const ws = await ctx.wsServer
      ws.send('nuxt-pergel:reset')
    },
  }
}
