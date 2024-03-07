import { camelCase, pascalCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const storage = camelCase(`${data.projectName}-DrizzleStorage`)
  const tables = camelCase(`${data.projectName}-Tables`)
  return /* TS */ `export { ${storage} } from './storage'
export * as ${tables} from './schema'
`
}
