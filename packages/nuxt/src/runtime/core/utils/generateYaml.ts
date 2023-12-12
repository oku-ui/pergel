import { writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { ResolvedPergelOptions } from '../types'

export function generateReadmeYaml(data: {
  nuxt: Nuxt
  options: ResolvedPergelOptions
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

  writeFileSync(data.options.resolvedOptions.resolveDir.readmeDir, jsonToYaml(readmeYaml))
}

export function generateProjectReadme(
  nuxt: Nuxt,
  options: ResolvedPergelOptions<any>,
  data: (
    ctx: {
      addCommentBlock: (commentBlock: string) => Record<string, any>
      moduleName: string
    }
  ) => Record<string, any>,
  customName?: string,
) {
  const projectName = options.resolvedModule.projectName
  const moduleName = customName || options.resolvedModule.name
  const uuid = () => Math.random().toString(36).substring(7)

  const addCommentBlock = (commentBlock: string) => ({
    [`comment-block-${uuid()}`]: commentBlock,
  })

  nuxt._pergel.readmeYaml[projectName] = defu(nuxt._pergel.readmeYaml[projectName], {
    [moduleName]: {
      // [`comment-block-${uuid()}`]: `${moduleName} Variables`,
      ...data(
        {
          addCommentBlock,
          moduleName,
        },
      ),
    },
  })
}