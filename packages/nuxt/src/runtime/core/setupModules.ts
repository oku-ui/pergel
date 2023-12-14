import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import consola from 'consola'
import type { PergelModule, ResolvedPergelOptions } from './types'
import { generatePergelTemplate } from './utils/generatePergelTemplate'
import { firstLetterUppercase } from './utils'

export async function setupModules(data: {
  resolver: Resolver
  nuxt: Nuxt
  options: ResolvedPergelOptions
}) {
  const projects = data.options.rootOptions.projects
  const modulesMap = new Map<string, PergelModule<any>>()

  for await (const [projectKey, modules] of Object.entries(projects)) {
    for await (const [moduleKey, moduleValue] of Object.entries(modules)) {
      if (typeof moduleValue === 'boolean' && moduleValue === false)
        continue

      if (
        (typeof moduleValue === 'object' && moduleValue === null)
        || (typeof moduleValue === 'object' && !moduleValue)
      )
        continue

      if (typeof moduleValue === 'string' && moduleValue === '')
        continue
      modulesMap.set(`${projectKey}/${moduleKey}`, moduleValue as any)
    }
  }

  const modulesArray = Array.from(modulesMap)

  data.options._contents = []

  for await (const m of modulesArray) {
    const [projectname, moduleName] = m[0].split('/')

    data.options.resolvedModule.name = moduleName
    data.options.resolvedModule.projectName = projectname

    data.options.resolvedModule.projectDir = join(data.options.resolvedOptions.resolveDir.pergelRoot, projectname)
    data.options.resolvedModule.moduleDir = join(data.options.resolvedOptions.resolveDir.pergelRoot, projectname, moduleName)
    data.options.resolvedModule.typeName = `${firstLetterUppercase(projectname)}${firstLetterUppercase(moduleName)}`

    data.options.resolvedModule.templateDir.project = join(data.options.resolvedOptions.dir.pergel, projectname)
    data.options.resolvedModule.templateDir.module = join(data.options.resolvedOptions.dir.pergel, projectname, moduleName)

    data.options.resolvedModule.dir.project = join(data.options.resolvedOptions.dir.pergel, projectname)
    data.options.resolvedModule.dir.module = join(data.options.resolvedOptions.dir.pergel, projectname, moduleName)
    data.options.resolvedModule.dir.projectModule = join(projectname, moduleName)

    const selectedModule = data.nuxt._pergel.modules.find(module => module === moduleName)

    if (Array.isArray(m) && selectedModule) {
      let pergelModule: PergelModule

      try {
        const getIndexExt = () => {
          const datas = readdirSync(data.resolver.resolve(join('runtime', 'modules', moduleName)))
          const indexExt = datas.find(file => file.includes('index') && !file.includes('.d.'))
          if (!indexExt)
            throw new Error(`Module ${moduleName} does not have index file`)

          return indexExt
        }
        const indexPath = getIndexExt()

        pergelModule = await import(
          data.resolver.resolve(join('runtime', 'modules', moduleName, indexPath))
        ).then(m => m.default).catch((res) => {
          consola.error(`Module ${moduleName} failed to import`)
          consola.error(res)
        })
      }
      catch (error) {
        consola.error(`Module ${moduleName} failed to import`)
        throw error
      }

      // Throw error if input is not a function
      if (typeof pergelModule !== 'function')
        throw new TypeError(`Nuxt module should be a function: ${pergelModule}`)

      const resolvedModule = await pergelModule(data.options, data.nuxt)

      if (resolvedModule === false /* setup aborted */ || resolvedModule === undefined /* setup failed */ || typeof resolvedModule === 'string' /* setup failed */) {
        consola.error(`Module ${moduleName} failed to setup`)
        continue
      }
    }
  }

  for (const item of data.options._contents) {
    if (!item.projectName || !item.moduleName) {
      throw new Error(`Project name or module name is missing in
${JSON.stringify(item).replace(/"/g, '')}
      `)
    }
  }

  generatePergelTemplate({
    nuxt: data.nuxt,
    options: data.options,
  })
}
