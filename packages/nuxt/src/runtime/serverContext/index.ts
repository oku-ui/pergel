import type { H3Event } from 'h3'
import { defineEventHandler } from 'h3'
import { useGlobalContext } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  // globalContext()
  useGlobalContext()
  if (!event.context.globalModuleContext)
    event.context.globalModuleContext = {}
})
