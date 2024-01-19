import { minimatch } from 'minimatch'
import { join } from 'pathe'

export function matchGlobs(filepath: string, globs: string[]) {
  for (const glob of globs) {
    if (minimatch(join(filepath), glob)) {
      return {
        glob,
        status: true,
      }
    }
  }
  return false
}

export function buildTime() {
  const start = Date.now()
  return {
    finish() {
      return {
        duration: Date.now() - start,
      }
    },
  }
}
