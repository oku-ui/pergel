/**
 * @credit https://github.com/unjs/nitro/blob/main/src/scan.ts
 * @github unjs/nitro
 */

import { globby } from 'globby'
import { join, relative } from 'pathe'
import type { Pergel } from './types'

export const GLOB_SCAN_PATTERN = '**/*'
type FileInfo = { path: string, fullPath: string }

async function scanDir(
  pergel: Pergel,
  dir: string,
  folderName?: string,
): Promise<FileInfo[]> {
  const fileNames = await globby(join(folderName ?? '', GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    ignore: pergel.options.ignore,
    absolute: true,
  })

  return fileNames
    .map((fullPath) => {
      return {
        fullPath,
        path: relative(join(dir, folderName ?? ''), fullPath),
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

async function scanFiles(pergel: Pergel, folderName?: string): Promise<FileInfo[]> {
  const files = await Promise.all(
    pergel.options.scanDirs.map(dir => scanDir(pergel, dir, folderName)),
  ).then(r => r.flat())
  return files
}

export async function scanAnyFiles(pergel: Pergel, folderName?: string): Promise<string[]> {
  const files = await scanFiles(pergel, folderName)
  return files.map(f => f.fullPath)
}
