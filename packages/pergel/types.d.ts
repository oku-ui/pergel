import type { DefinePergel } from '@pergel/cli/types'

export { definePergel } from '@pergel/cli/core'

export * from './dist/index'
declare global {
  const definePergel: DefinePergel
}
