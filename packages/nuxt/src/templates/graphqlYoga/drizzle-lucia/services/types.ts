export default function (data: {
  projectName: string
}) {
  return /* TS */ `import type { GraphqlYogaContext } from '#${data.projectName}/server/graphqlYoga/types'

export interface API {
  context: GraphqlYogaContext
}
`
}
