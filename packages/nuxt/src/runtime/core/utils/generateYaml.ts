import { writeFileSync } from 'node:fs'
import defu from 'defu'
import type { NuxtPergel } from '../types/nuxtModule'

export function generateReadmeYaml(data: {
  nuxt: NuxtPergel
}) {
  const readmeYaml = JSON.stringify(data.nuxt._pergel.readmeYaml)

  function jsonToYaml(jsonString: string): string {
    const json = JSON.parse(jsonString)
    let yamlString = ''

    function parseObject(obj: Record<string, any>, indent: number): void {
      let comments = ''
      for (const [key, value] of Object.entries(obj)) {
        if (key.includes('comment-block')) {
          // Handle comments
          yamlString += `${' '.repeat(indent * 2)}# ${value}\n`
        }
        else {
          if (key !== 'comment-right')
            yamlString += ' '.repeat(indent * 2)

          if (typeof value === 'object' && value !== null) {
            yamlString += `${key}:\n`
            parseObject(value, indent + 1)
          }
          else {
            if (key === 'comment-right') {
              comments = value
            }
            else {
              yamlString += comments ? `${key}: ${value} # ${comments}\n` : `${key}: ${value}\n`
              comments = ''
            }
          }
        }
      }
    }

    parseObject(json, 0)

    return yamlString
  }

  data.nuxt._pergel.exitPergelFolder && writeFileSync(
    `${data.nuxt._pergel.pergelDir}/README.yaml`,
    jsonToYaml(readmeYaml),
  )
}

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
  ) => Record<string, any>
},
) {
  const uuid = () => Math.random().toString(36).substring(7)

  const addCommentBlock = (commentBlock: string) => ({
    [`comment-block-${uuid()}`]: commentBlock,
  })

  input.nuxt._pergel.readmeYaml[input.projectName] = defu(input.nuxt._pergel.readmeYaml[input.projectName], {
    [input.moduleName]: {
      // [`comment-block-${uuid()}`]: `${moduleName} Variables`,
      ...input.data(
        {
          addCommentBlock,
          moduleName: input.moduleName,
        },
      ),
    },
  })
}
