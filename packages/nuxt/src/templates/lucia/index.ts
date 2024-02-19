import type { NuxtPergel } from '../../runtime/core/types/nuxtModule'
import { generatorFunctionName } from '../../runtime/core/utils/generatorNames'

export default function (params: {
  projectName: string
  nuxt: NuxtPergel
}) {
  const pergelProjectName = generatorFunctionName(params.projectName, '', {
    pergel: true,
  })

  return /* TS */ `import { GitHub } from 'arctic'
import { session, user } from '#${params.projectName}/drizzle/schema'

const connect = await ${pergelProjectName}()
.drizzle()
.postgresjs()
.connect({
  event: false
})

export const ${generatorFunctionName(params.projectName, 'Auth')} = ${pergelProjectName}()
.lucia()
.use({
  db: connect,
  options: { },
  session,
  user,
})

export const  ${generatorFunctionName(params.projectName, 'LuciaOnRequest')} = ${pergelProjectName}().lucia().onRequestLucia({
  lucia: ${generatorFunctionName(params.projectName, 'Auth')},
})

const config = useRuntimeConfig()

// nuxt.config.ts lucia.oauth = ['github'] if you want to use github oauth ['github', 'google', ....]
export const github = new GitHub(
  config.${generatorFunctionName(params.projectName, 'Lucia')}.github.clientId,
  config.${generatorFunctionName(params.projectName, 'Lucia')}.github.clientSecret,
)
`
}
