import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const graphqlService = camelCase(`${data.projectName}-Graphql`)

  return /* TS */ `import { initGraphQLTada } from 'gql.tada'
import type {
  introspection,
} from './graphql-env.d.ts'

export const ${graphqlService} = initGraphQLTada<{
  introspection: introspection
  scalars: {
    DateTime: string
    JSON: any
    Cursor: string
    ID: string
  }
}>()

export type {
  FragmentOf,
  ResultOf,
  VariablesOf,
} from 'gql.tada'

export { readFragment } from 'gql.tada'
`
}
