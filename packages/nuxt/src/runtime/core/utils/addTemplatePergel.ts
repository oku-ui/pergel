import { accessSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { join, relative } from 'pathe'
import { useNuxt } from '@nuxt/kit'

export function addTemplatePergel(input: {
  filename: string
  write: boolean
  getContents: () => string | Promise<string>
  where: 'server' | 'client' | 'pergel'
}) {
  const nuxt = useNuxt()
  const serverDir = nuxt.options.serverDir
  const clientDir = nuxt.options.rootDir
  const pergelDir = nuxt._pergel.pergelDir

  const dir = {
    server: serverDir,
    client: join(clientDir, 'pergel'),
    pergel: pergelDir,
  }[input.where]

  if (!dir)
    throw new Error(`Unknown where: ${input.where}`)

  if (input.write) {
    nuxt._pergel.functionTemplates ??= []
    nuxt._pergel.functionTemplates.push({
      filename: input.filename,
      dir: relative(join(nuxt.options.rootDir), dir),
      getContents: input.getContents,
      writeDir: `${dir}/${input.filename}`,
    })
  }

  return {
    filename: input.filename,
    relateveDir: relative(join(nuxt.options.rootDir), dir),
    dir: `${dir}/${input.filename}`,
    write: input.write,
    getContents: input.getContents,
  }
}

export async function updateTemplatePergel(input: {
  filter: (template: string) => boolean
}) {
  const nuxt = useNuxt()
  const templates = nuxt._pergel.functionTemplates

  if (!templates)
    throw new Error('No templates found')

  const templatesFileNames = templates.map(template => template.filename)

  const findTemplate = templatesFileNames.find(input.filter)

  if (!findTemplate)
    throw new Error('No matching template found')

  const templateToUpdate = templates.find(template => template.filename === findTemplate)

  if (templateToUpdate?.dir) {
    const { writeDir, getContents } = templateToUpdate

    const contents = await getContents()
    writeFilePergel(writeDir, contents)
  }

  return templateToUpdate // Return the updated template if needed
}

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
    const dirname = path.dirname(filePath)
    const exist = await isExists(dirname)
    if (!exist)
      mkdirSync(dirname, { recursive: true })

    writeFileSync(filePath, data, 'utf8')
  }
  catch (err: any) {
    throw new Error(err)
  }
}
