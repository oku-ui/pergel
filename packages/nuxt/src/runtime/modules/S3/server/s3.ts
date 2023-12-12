import { defineEventHandler, getRouterParam } from 'h3'
import { useS3 } from '../composables/useS3'

export default defineEventHandler(async (event) => {
  const projectName = getRouterParam(event, 'projectName')
  const { listAllObjects } = await useS3.call(null as any, {
    projectName: projectName as any,
  }, event)
  const listAll = await listAllObjects()
  return listAll
})
