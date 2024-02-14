import { accessSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

async function isExists(path: string) {
  try {
    accessSync(path)
    return true
  }
  catch {
    return false
  }
};

export async function writeFilePergel(filePath: string, data: any) {
  try {
    const _dirname = dirname(filePath)
    const exist = await isExists(_dirname)
    if (!exist)
      mkdirSync(_dirname, { recursive: true })

    writeFileSync(filePath, data, 'utf8')
  }
  catch (err: any) {
    throw new Error(err)
  }
}
