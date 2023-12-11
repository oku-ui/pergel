<script lang="ts" setup>
// import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

import { rpc } from '../composables/rpc'

// import { options } from '../composables/state'

// const client = useDevtoolsClient()

// async function getOptions() {
//   options.value = await rpc.value?.getOptions()
//   console.warn(client.value, 'client')
// }

const projects = ref()
const selectedTabProject = ref()
const modules = ref()
const selectedTabModule = ref()

const started = ref(false)

async function getModules() {
  modules.value = await rpc.value?.getProjectModules(selectedTabProject.value)
}

onMounted(async () => {
  projects.value = await rpc.value?.getProjects()
  selectedTabProject.value = projects.value[0]
  getModules()
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex">
      <template v-for="project in projects" :key="project.id">
        <button
          class="px-4 py-2 r base"
          :class="{ 'border-b': project !== selectedTabProject }"
          @click="() => {
            selectedTabProject = project
            selectedTabModule = null
            started = false
          }"
        >
          {{ project }}
        </button>
      </template>
    </div>
    <div class="flex">
      <template v-for="module in modules" :key="module.id">
        <button
          class="px-4 py-2 r base"
          @click="() => {
            selectedTabModule = module
            started = true
          }"
        >
          {{ module }}
        </button>
      </template>
    </div>
    <NPanelGrids v-if="!started" class="h-full">
      Pergel - oku-ui.com
    </NPanelGrids>

    <AssetS3 v-if="selectedTabModule === 'S3'" :selected-tab-project="selectedTabProject" />
  </div>
</template>
