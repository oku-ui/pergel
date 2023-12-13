import { AsyncParser } from '@json2csv/node'

import type { PartinalKey } from '../../../core/types'
import type { CsvNodeOpts, NodeJsonParameters, SetResponseCsv } from '../types'
import { setResponseCsv } from './setResponseCsv'

async function nodeCSV(value: NodeJsonParameters) {
  const parser = new AsyncParser(
    value.opts.opts,
    value.opts.asyncOpts,
    value.opts.transformOpts,
  )
  return await parser.parse(value.data).promise() // csv
}

export async function useNitroJson2CSV(value: PartinalKey<NodeJsonParameters, 'opts'>) {
  const defaultOpts: CsvNodeOpts = {
    opts: {},
    asyncOpts: {},
    transformOpts: {},
  }

  const csv = await nodeCSV({
    data: value.data,
    opts: {
      ...defaultOpts,
      ...value.opts,
    },
  })

  return {
    csv,
    /**
     * @example
     * ```ts
     * await setResponseCsv({
     *  event,
     * csv,
     * })
     * ```
     */
    setResponseCsv: (data: SetResponseCsv) => setResponseCsv({
      ...data,
      csv,
    }),
  }
}
