import { camelCase, pascalCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const serviceFunctionName = camelCase(`${data.projectName}-GraphQLService`)
  const serviceInterfaceName = pascalCase(`${data.projectName}-GraphQLService`)
  return /* TS */ `export { ${serviceFunctionName} } from './services'
export type { ${serviceInterfaceName} } from './services'
`
}
