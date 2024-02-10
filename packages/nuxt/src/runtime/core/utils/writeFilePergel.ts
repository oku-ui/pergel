import { access, mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function writeFilePergel(filePath: string, data: any) {
  const _dirname = dirname(filePath)

  try {
    await access(_dirname)
  }
  catch {
    await mkdir(_dirname, { recursive: true })
  }

  await writeFile(filePath, data, 'utf8')
}
