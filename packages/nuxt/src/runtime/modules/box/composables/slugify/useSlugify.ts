import slugifyFunc from 'slugify'

export function useSlugify() {
  const { slugify } = useRuntimeConfig().public
  if (Object.keys(slugify.extends).length)
    slugifyFunc.extend(slugify.extends)

  return (string: string, options?: Parameters<typeof slugifyFunc>[1]) =>
    slugifyFunc(string, { ...typeof slugify.default === 'object' ? slugify.default : {}, ...typeof options === 'object' ? options : {} })
}
