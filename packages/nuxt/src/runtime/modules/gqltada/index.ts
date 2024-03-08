import { existsSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'
import { camelCase } from 'scule'
import { globbySync } from 'globby'
import { definePergelModule } from '../../core/definePergel'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import { writeFilePergel } from '../../core/utils/writeFilePergel'
import { useNuxtImports } from '../../core/utils/useImports'
import type { GQLTadaOptions, ResolvedGQLTadaOptions } from './types'

export default definePergelModule<GQLTadaOptions, ResolvedGQLTadaOptions>({
  meta: {
    name: 'gqltada',
    version: '0.0.1',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        'gql.tada': deps['gql.tada'],
      }
    },
    devDependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@0no-co/graphqlsp': deps['@0no-co/graphqlsp'],
      }
    },
  },
  defaults: {
  },
  async setup({ nuxt, options }) {
    const { projectName, moduleName } = options

    nuxt.options.typescript.tsConfig ??= {}
    nuxt.options.typescript.tsConfig.compilerOptions ??= []
    nuxt.options.typescript.tsConfig.compilerOptions.plugins ??= []
    nuxt.options.typescript.tsConfig.compilerOptions.plugins.push({
      name: '@0no-co/graphqlsp',
      schema: relative(
        nuxt.options.buildDir,
        join(nuxt.options.serverDir, `${camelCase(`${options.projectName}-schema`)}.graphql`),
      ),
      tadaOutputLocation: relative(
        nuxt.options.buildDir,
        join(options.rootModuleDir, 'graphql-env.d.ts'),
      ),
      template: camelCase(`${options.projectName}-GraphQL`),
    })

    if (!existsSync(resolve(options.rootModuleDir, 'index.ts'))) {
      const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, 'root', '**/*')), {
        onlyFiles: true,
      })

      for (const file of files) {
        const readFile = await nuxt._pergel.jitiDyanmicImport(file)
        if (readFile) {
          const fileData = readFile({
            projectName: options.projectName,
            nuxt,
          })
          const fileName = basename(file)

          writeFilePergel(resolve(options.rootModuleDir, fileName), fileData)
        }
      }
    }

    useNuxtImports(nuxt, {
      presets: [
        {
          type: true,
          imports: [
            'FragmentOf',
            'ResultOf',
            'VariablesOf',
          ],
          from: 'gql.tada',
        },
        {
          imports: [
            'readFragment',
            'initGraphQLTada',
          ] as Array<keyof typeof import('gql.tada')>,
          from: 'gql.tada',
        },
      ],
    })

    generateProjectReadme({
      nuxt,
      projectName,
      moduleName,
      data() {
        return {
          vscode: {
            'typescript.tsdk': 'node_modules/typescript/lib',
            'typescript.enablePromptUseWorkspaceTsdk': true,
          },
        }
      },
    })
  },
})
