import type { DevtoolsServerContext, ServerFunctions } from './runtime/core/types'

export function setupRPC(ctx: DevtoolsServerContext): ServerFunctions {
  const options = ctx.nuxt._pergel
  const projects = options.projects

  return {
    getOptions() {
      return options
    },
    getProjects() {
      return projects
    },
    getTotalModules() {
      return options.modules
    },
    getActiveModules() {
      return options.activeModules
    },
    getProject(name: string) {
      return projects[name] as any
    },
    getProjectModules(name: string) {
      return Object.keys(projects[name])
    },
    getModuleOptions({ projectName, moduleName }) {
      return ((options.activeModules as any)[projectName as any])[moduleName as any]
    },
    async reset() {
      const ws = await ctx.wsServer
      ws.send('nuxt-pergel:reset')
    },
  }
}
