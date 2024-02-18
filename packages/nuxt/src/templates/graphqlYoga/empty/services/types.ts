export default function (data: {
  projectName: string
}) {
  return /* TS */ `import type { GraphqlYogaContext } from 'pergel/${data.projectName}/types'

export interface API {
  context: GraphqlYogaContext
}
`
}
