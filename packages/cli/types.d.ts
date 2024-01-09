/// <reference types="nitropack" />

// eslint-disable-next-line antfu/no-import-dist
import type { DefinePergel } from './dist/types'

export * from './dist/index'

declare global {
  const definePergel: DefinePergel
}
