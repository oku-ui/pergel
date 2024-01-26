import { defineEventHandler, getRouterParam } from 'h3'
import { usePergelS3 } from '../composables/useS3'

export default defineEventHandler(async (event) => {
  const projectName = getRouterParam(event, 'projectName')
  const { listAllObjects } = await usePergelS3.call(null as any, {
    event,
    pergel: {
      projectName: projectName as any,
    },
  })
  const listAll = await listAllObjects()
  return listAll
})
