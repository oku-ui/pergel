import { send, setResponseHeader } from 'h3'
import type { SetResponseCsv } from '../../types'

export async function setResponseCsv(data: SetResponseCsv) {
  const date = new Date()

  setResponseHeader(data.event, 'Content-Type', 'text/csv')
  setResponseHeader(
    data.event,
    'Content-Disposition',
    `attachment; filename="${data.filename ?? `csv-${date.getTime()}.csv`}"`,
  )

  await send(data.event, data.csv, 'text/csv')
}
