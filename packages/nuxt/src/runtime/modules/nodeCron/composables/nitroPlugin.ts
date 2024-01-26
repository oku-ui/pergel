import consola from 'consola'
import cron from 'node-cron'
import type { getTasks, schedule, validate } from 'node-cron'
import type { NitroApp } from 'nitropack'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'

interface EveryCronTime {
  seconds: (number: number, handleDate: (result: string) => void) => void
  minutes: (number: number, handleDate: (result: string) => void) => void
  hours: (number: number, handleDate: (result: string) => void) => void
  days: (number: number, handleDate: (result: string) => void) => void
  weeks: (number: number, handleDate: (result: string) => void) => void
  months: (number: number, handleDate: (result: string) => void) => void
  thirtyMinutes: (handleDate: (result: string) => void) => void
}

interface CronType {
  schedule: typeof schedule
  getTasks: typeof getTasks
  validate: typeof validate
  every: EveryCronTime
}

interface NodeCronConfig {
  setup: (cron: CronType, nitroApp: Promise<NitroApp> | NitroApp) => void | Promise<void>
  onError?: (err: Error | undefined) => void | Promise<void>
  config?: {
    log: boolean
  }
}

export function defineNitroPergelNodeCronPlugin(
  { setup, onError, config }: NodeCronConfig,
) {
  return defineNitroPlugin(async (_nitro) => {
    try {
      if (import.meta.prerender) {
        if (config?.log)
          consola.info('[server/plugins/node-cron.ts] Skipping node-cron, don\'t run in build context')
        return
      }

      if (config?.log)
        consola.info('[server/plugins/node-cron.ts] Starting node-cron and running once now...')

      await setup({
        schedule: cron.schedule,
        getTasks: cron.getTasks,
        validate: cron.validate,
        every: {
          seconds: everySeconds,
          minutes: everyMinutes,
          hours: everyHours,
          days: everyDays,
          weeks: everyWeeks,
          months: everyMonths,
          thirtyMinutes: everyThirtyMinutes,

        },
      }, _nitro)
    }
    catch (error: any) {
      if (onError)
        await onError(error)
    }
  })
}

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

function everySeconds(seconds: number = 1, handleDate: (result: string) => void) {
  cron.schedule(`*/${seconds} * * * * *`, () => handleDate(new Date().toISOString()))
}

function everyMinutes(minutes: number, handleDate: (result: string) => void) {
  cron.schedule(`*/${minutes} * * * *`, () => handleDate(new Date().toISOString()))
}

function everyThirtyMinutes(handleDate: (result: string) => void) {
  cron.schedule(`*/30 * * * *`, () => handleDate(new Date().toISOString()))
}

function everyHours(hours: number, handleDate: (result: string) => void) {
  cron.schedule(`0 */${hours} * * *`, () => handleDate(new Date().toISOString()))
}

function everyDays(days: number, handleDate: (result: string) => void) {
  cron.schedule(`0 0 */${days} * *`, () => handleDate(new Date().toISOString()))
}

function everyMonths(number: number, handleDate: (result: string) => void) {
  cron.schedule(`*/${number} *`, () => handleDate(new Date().toISOString()))
}

function everyWeeks(number: number, handleDate: (result: string) => void) {
  const _day = 7 * number
  cron.schedule(`*/${_day} * *`, () => handleDate(new Date().toISOString()))
}
