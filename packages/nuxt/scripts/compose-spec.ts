import { writeFileSync } from 'node:fs'
import { compileFromFile } from 'json-schema-to-typescript'

// compile from file
compileFromFile('./scripts/compose-spec.json')
  .then(ts => writeFileSync('./src/moduleTypes/compose-spec-type.ts', ts))
