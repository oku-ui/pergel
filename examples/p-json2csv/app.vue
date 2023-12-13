<script setup lang="ts">
async function exportCSV() {
  await useFetch('/api/csvDownload', {
    method: 'get',
    onResponse({ response }) {
      const { download } = usePergelJson2Csv()

      download(response._data, 'form.csv')
    },
  })
}
</script>

<template>
  <div>
    <button @click="exportCSV">
      Download CSV
    </button>
  </div>
</template>
