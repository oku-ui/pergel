import type { DevtoolsServerContext, ModuleName, Modules, ServerFunctions } from './runtime/core/types'

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
      return projects[name]
    },
    getProjectModules(name: string) {
      return Object.keys(projects[name])
    },
    getNitroPlugins() {
      // TODO: change public runtime config
      return 'asdasd'
    },
    // TODO: fix type
    getProjectModule(projectName: string, moduleName: ModuleName) {
      return projects[projectName][moduleName] as unknown as Modules[keyof Modules]
    },
    async reset() {
      const ws = await ctx.wsServer
      ws.send('nuxt-pergel:reset')
    },
  }
}
