import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import consola from 'consola'
import type { ModuleName, PergelModule } from './types'
import { generatePergelTemplate } from './utils/generatePergelTemplate'
import { firstLetterUppercase } from './utils'

export async function setupModules(data: {
  resolver: Resolver
  nuxt: Nuxt
}) {
  const projects = data.nuxt._pergel.options.projects
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

  data.nuxt._pergel.contents = []

  for await (const m of modulesArray) {
    const [projectName, moduleName] = m[0].split('/') as [string, ModuleName]
    data.nuxt._pergel.projects[projectName] ??= {}
    data.nuxt._pergel.projects[projectName][moduleName] = {
      typeName: `${firstLetterUppercase(projectName)}${firstLetterUppercase(moduleName)}`,
      projectDir: join(data.nuxt._pergel.options.pergelDir, projectName),
      moduleDir: join(data.nuxt._pergel.options.pergelDir, projectName, moduleName),
      dir: {
        project: join(data.nuxt._pergel.dir.pergel, projectName),
        module: join(data.nuxt._pergel.dir.pergel, projectName, moduleName),
        root: join(data.nuxt._pergel.dir.pergel),
      },
      options: {},
    }

    data.nuxt._pergel._module = {
      ...data.nuxt._pergel.projects[projectName][moduleName],
      projectName,
      moduleName,
    }
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

      const resolvedModule = await pergelModule({ nuxt: data.nuxt })

      if (resolvedModule === false /* setup aborted */ || resolvedModule === undefined /* setup failed */ || typeof resolvedModule === 'string' /* setup failed */) {
        consola.error(`Module ${moduleName} failed to setup`)
        continue
      }
    }
  }

  for (const item of data.nuxt._pergel.contents) {
    if (!item.projectName || !item.moduleName) {
      throw new Error(`Project name or module name is missing in
${JSON.stringify(item).replace(/"/g, '')}
      `)
    }
  }

  generatePergelTemplate({
    nuxt: data.nuxt,
  })
}
