import slugifyFunc from 'slugify'
import { useRuntimeConfig } from '#imports'

export function useSlugify() {
  const { slugify } = useRuntimeConfig().public as {
    slugify: {
      default?: Parameters<typeof slugifyFunc>[1]
      extends?: Parameters<typeof slugifyFunc['extend']>[0]
    }
  }
  if (typeof slugify.extends === 'object' && Object.keys(slugify.extends).length)
    slugifyFunc.extend(slugify.extends)

  return (string: string, options?: Parameters<typeof slugifyFunc>[1]) =>
    slugifyFunc(string, { ...typeof slugify.default === 'object' ? slugify.default : {}, ...typeof options === 'object' ? options : {} })
}
