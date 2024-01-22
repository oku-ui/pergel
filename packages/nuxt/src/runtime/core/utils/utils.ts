/**
 * Reformat source code for improved readability by adding appropriate newlines and indentation.
 */
export function reformatSourceCode(sourceCode: string): string {
  const lines = sourceCode.split('\n')
  let indentLevel = 0
  let result = ''

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    const lastLine = lines[index - 1]?.trim()

    if (!trimmedLine)
      return

    if (trimmedLine.startsWith('return') && !lastLine?.endsWith('{'))
      result += '\n'

    if (trimmedLine.startsWith('function'))
      result += '\n'

    if (trimmedLine.startsWith('//') || trimmedLine === '') {
      result += `${trimmedLine}\n`
      return
    }

    if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']'))
      indentLevel--

    result += `${'  '.repeat(Math.max(indentLevel, 0))}${trimmedLine}\n`

    if (trimmedLine.endsWith('{') || trimmedLine.endsWith('['))
      indentLevel++
  })

  return result
}

/**
 * Capitalize the first letter of a string
 */
export function firstLetterUppercase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
