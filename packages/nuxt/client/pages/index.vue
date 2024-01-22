<script lang="ts" setup>
import {
  OkuTabs,
  OkuTabsContent,
  OkuTabsList,
  OkuTabsTrigger,
} from '@oku-ui/tabs'

import { rpc } from '../composables/rpc'

const projects = ref()
const totalModules = ref()

onMounted(async () => {
  projects.value = await rpc.value?.getProjects()
  totalModules.value = await rpc.value?.getTotalModules()
})

const tabs = ref<string[]>([])
const selectedTab = ref('add')
</script>

<template>
  <div class="flex size-full flex-col">
    <OkuTabs
      v-model="selectedTab"
      class="flex size-full flex-col"
      default-value="add"
      @change="() => {
        console.warn(selectedTab, 'selectedTab')
      }"
    >
      <OkuTabsList
        class="flex"
        aria-label="Manage your account"
      >
        <template v-if="tabs && tabs.length">
          <OkuTabsTrigger
            v-for="tab in tabs"
            :key="tab"
            class="flex h-[30px] max-w-fit flex-1 cursor-default select-none items-center justify-center px-3 text-[10px] leading-none text-gray-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-gray-500 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-gray-400 dark:data-[state=active]:text-gray-400"
            :value="tab"
          >
            {{ tab }}

            <button
              class="i-ph-x ml-1 size-3 dark:text-white"
              @click="() => {
                tabs.splice(tabs.indexOf(tab), 1)
                selectedTab = tabs[tabs.length - 1]
              }"
            />
          </OkuTabsTrigger>
        </template>
        <OkuTabsTrigger
          class="flex h-[30px] max-w-fit flex-1 cursor-default select-none items-center justify-center px-3 text-[10px] leading-none text-gray-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-blue-500 data-[state=active]:text-blue-900 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-blue-500 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-blue-400 dark:data-[state=active]:text-blue-400
           "
          value="add"
        >
          <div class="i-ph-plus size-3 dark:text-white" />
        </OkuTabsTrigger>
      </OkuTabsList>
      <OkuTabsContent
        v-if="projects"
        class="flex size-full grow flex-col rounded-b-md p-5 outline-none dark:bg-gray-950"
        value="add"
      >
        <template
          v-if="projects"
        >
          <NSectionBlock
            v-for="project in Object.keys(projects)"
            :key="project"
            icon="carbon-plug"
            :text="project"
            :description="`Active modules: ${projects.length ?? 0}/${(totalModules && totalModules.length) ?? 0}`"
          >
            <div class="grid grid-cols-4 gap-6">
              <template
                v-for="module in Object.keys(projects[project])"
                :key="module.id"
              >
                <button
                  class="h-10 w-full rounded-md bg-gray-600 text-white"
                  @click="() => {
                    tabs.push(`${project}.${module}`)
                    selectedTab = `${project}.${module}`
                  }"
                >
                  {{ module }}
                </button>
              </template>
            </div>
          </NSectionBlock>
        </template>
      </OkuTabsContent>

      <OkuTabsContent
        v-for="tab in tabs"
        :key="tab"
        :value="tab"
        class="flex size-full grow flex-col rounded-b-md outline-none dark:bg-gray-950"
      >
        <ModulesAssetS3
          v-if="tab.includes('.S3')"
          :project-name="tab.split('.')[0]"
        />
        <ModulesGraphqlYoga
          v-if="tab.includes('.graphqlYoga')"
          :project-name="tab.split('.')[0]"
        >
        </ModulesGraphqlYoga>
        <ModulesDrizzle
          v-if="tab.includes('.drizzle')"
          :project-name="tab.split('.')[0]"
        >
        </ModulesDrizzle>
      </OkuTabsContent>
    </OkuTabs>
  </div>
</template>
