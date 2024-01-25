import type internal from 'node:stream'
import type { H3Event } from 'h3'
import type { AsyncParser, ParserOptions, StreamParserOptions } from '@json2csv/node'

export interface SetResponseCsv {
  event: H3Event
  csv: string | true
  filename?: string
}

export interface CsvNodeOpts {
  opts?: ParserOptions<object, object> | undefined
  asyncOpts?: StreamParserOptions | undefined
  transformOpts?: internal.TransformOptions | undefined
}

export interface NodeJsonParameters {
  data: Parameters<InstanceType<typeof AsyncParser>['parse']>[0]
  opts: CsvNodeOpts
}
