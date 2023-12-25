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
    getProject(name: string) {
      return projects[name] as any
    },
    getProjectModules(name: string) {
      return Object.keys(projects[name])
    },
    getModuleOptions({ projectName, moduleName }) {
      const data = ((options.projects as any)[projectName as any])[moduleName as any]
      return data
    },
    async reset() {
      const ws = await ctx.wsServer
      ws.send('nuxt-pergel:reset')
    },
  }
}
