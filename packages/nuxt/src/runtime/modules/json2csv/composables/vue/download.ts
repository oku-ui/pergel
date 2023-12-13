/**
 * @example
 * ```ts
 * await useFetch('/api/csvDownload', {
    method: 'get',
    onResponse({ response }) {
      download(response._data, 'form.csv')
    },
  })
 * ```
 * @param data
 * @param filename
 */
function download(data: any, filename: string) {
  const defaultMimeType = 'application/octet-stream'
  const blob = new Blob([data], { type: defaultMimeType })
  const blobURL = window.URL.createObjectURL(blob)

  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)

  if (typeof tempLink.download === 'undefined')
    tempLink.setAttribute('target', '_blank')

  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

export function usePergelJsonCsv() {
  return {
    download,
  }
}
