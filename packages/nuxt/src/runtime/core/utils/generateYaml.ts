import defu from 'defu'
import type { NuxtPergel, ResolvedPergelOptions } from '../types/nuxtModule'
import { writeFilePergel } from './writeFilePergel'

// export function generateReadmeYaml(data: {
//   nuxt: NuxtPergel
// }) {
//   const readmeYaml = JSON.stringify(data.nuxt._pergel.readmeYaml)

//   function jsonToYaml(jsonString: string): string {
//     const json = JSON.parse(jsonString)
//     let yamlString = ''

//     function parseObject(obj: Record<string, any>, indent: number): void {
//       let comments = ''
//       for (const [key, value] of Object.entries(obj)) {
//         if (key.includes('comment-block')) {
//           // Handle comments
//           yamlString += `${' '.repeat(indent * 2)}# ${value}\n`
//         }
//         else {
//           if (key !== 'comment-right')
//             yamlString += ' '.repeat(indent * 2)

//           if (typeof value === 'object' && value !== null) {
//             yamlString += `${key}:\n`
//             parseObject(value, indent + 1)
//           }
//           else {
//             if (key === 'comment-right') {
//               comments = value
//             }
//             else {
//               yamlString += comments ? `${key}: ${value} # ${comments}\n` : `${key}: ${value}\n`
//               comments = ''
//             }
//           }
//         }
//       }
//     }

//     parseObject(json, 0)

//     return yamlString
//   }

//   data.nuxt._pergel.exitPergelFolder && writeFilePergel(
//     `${data.nuxt._pergel.pergelDir}/README.yaml`,
//     jsonToYaml(readmeYaml),
//   )
// }

export function generateProjectReadme(input:
{
  nuxt: NuxtPergel
  projectName: string
  moduleName: string
  data: (
    ctx: {
      addCommentBlock: (commentBlock: string) => Record<string, any>
      moduleName: string
    }
  ) => ResolvedPergelOptions['readmeJson'][string][string]
},
) {
  const addCommentBlock = (commentBlock: string) => ({
    [`comment-block`]: commentBlock,
  })

  input.nuxt._pergel.readmeJson ??= {}
  input.nuxt._pergel.readmeJson[input.projectName] = defu(input.nuxt._pergel.readmeJson[input.projectName], {
    [input.moduleName]: {
      ...input.data(
        {
          addCommentBlock,
          moduleName: input.moduleName,
        },
      ),
    },
  })
}

export function generateReadmeJson(data: {
  nuxt: NuxtPergel
}) {
  const readmeJson = JSON.stringify(data.nuxt._pergel.readmeJson, null, 2)

  data.nuxt._pergel.exitPergelFolder && writeFilePergel(
    `${data.nuxt._pergel.pergelDir}/README.json`,
    readmeJson,
  )
}

export function generateMergedPackageJson(data: {
  nuxt: NuxtPergel
}) {
  const mergedPackageJson: {
    [key: string]: {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      scripts?: Record<string, string>
      roots?: Record<string, any>
      patched?: {
        pnpm?: {
          patchedDependencies: {
            [key: string]: string
          }
        }
      }
      [key: string]: any
    }
  } = {}

  for (const projectName of Object.keys(data.nuxt._pergel.readmeJson)) {
    mergedPackageJson.projectName ??= {}
    mergedPackageJson[projectName] = {}

    const project = data.nuxt._pergel.readmeJson[projectName]

    for (const moduleName of Object.keys(project)) {
      const module = project[moduleName]
      if (module.packageJson?.dependencies) {
        mergedPackageJson[projectName].dependencies ??= {}
        mergedPackageJson[projectName].dependencies = defu(mergedPackageJson[projectName].dependencies, module.packageJson.dependencies)
      }

      if (module.packageJson?.devDependencies) {
        mergedPackageJson[projectName].devDependencies ??= {}
        mergedPackageJson[projectName].devDependencies = defu(mergedPackageJson[projectName].devDependencies, module.packageJson.devDependencies)
      }

      if (module.packageJson?.patches) {
        mergedPackageJson[projectName].patches ??= {}
        mergedPackageJson[projectName].patches = defu(mergedPackageJson[projectName].patches, module.packageJson.patches)
      }

      if (module.scripts) {
        mergedPackageJson[projectName].scripts ??= {}
        mergedPackageJson[projectName].scripts = defu(mergedPackageJson[projectName].scripts, module.scripts)
      }

      if (module.roots) {
        mergedPackageJson[projectName].roots ??= {}
        mergedPackageJson[projectName].roots = defu(mergedPackageJson[projectName].roots, module.roots)
      }
    }

    mergedPackageJson[projectName] = {
      ...mergedPackageJson[projectName]?.scripts ? { scripts: mergedPackageJson[projectName].scripts } : {},
      ...mergedPackageJson[projectName]?.dependencies ? { dependencies: mergedPackageJson[projectName].dependencies } : {},
      ...mergedPackageJson[projectName]?.devDependencies ? { devDependencies: mergedPackageJson[projectName].devDependencies } : {},
      ...mergedPackageJson[projectName]?.roots ? { ...mergedPackageJson[projectName].roots } : {},
      ...mergedPackageJson[projectName]?.patches ? { patches: mergedPackageJson[projectName].patches } : {},
    }
  }

  data.nuxt._pergel.exitPergelFolder && writeFilePergel(
    `${data.nuxt._pergel.pergelDir}/merged-package.json`,
    JSON.stringify(mergedPackageJson, null, 2),
  )
}
