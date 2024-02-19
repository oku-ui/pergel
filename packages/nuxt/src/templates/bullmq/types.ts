import type { NuxtPergel } from '../../runtime/core/types/nuxtModule'
import { generatorFunctionName } from '../../runtime/core/utils/generatorNames'

export default function (data: {
  projectName: string
  nuxt: NuxtPergel
}) {
  const typeName = generatorFunctionName(data.projectName, 'BullmqContext', {
    type: true,
  })

  return /* TS */ `declare module '#${data.projectName}/bullmq/types' {
  export interface ${typeName} {
    queueName: 'default' | 'email'
  }
}
`
}
