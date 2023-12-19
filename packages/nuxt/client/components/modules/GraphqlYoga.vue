<script lang="ts" setup>
import {
  OkuTabs,
  OkuTabsContent,
  OkuTabsList,
  OkuTabsTrigger,
} from '@oku-ui/tabs'

import { rpc } from '../../composables/rpc'
import type { ModuleName, ResolvedGraphQLYogaConfig } from '../../../src/runtime/core/types'

const props = defineProps<{
  projectName: string
}>()

const tabs = reactive<{
  [key in string]: {
    name: string
    view: {
      src: string
    }
  }
}>({})
const selectedTab = ref('add')

const moduleOptions = ref<ResolvedGraphQLYogaConfig>()

onMounted(async () => {
  await getModuleOptios({
    projectName: props.projectName,
    module: 'graphqlYoga',
  }) as any
})

async function getModuleOptios({ projectName, module }: { projectName: string, module: ModuleName }) {
  const data = await rpc.value?.getModuleOptions({
    moduleName: module,
    projectName,
  })
  moduleOptions.value = JSON.parse(JSON.stringify(data))
}

function clickPlugin(plugin: string, external?: boolean) {
  const _plugin = moduleOptions?.value?.plugins?.[plugin]
  if (external) {
    return window.open(devtoolsUrl(_plugin.endpoint).value, '_blank')
  }
  else {
    tabs[plugin] = {
      name: plugin,
      view: {
        src: devtoolsUrl(_plugin.endpoint).value,
      },
    }
    selectedTab.value = plugin
  }
}
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <OkuTabs
      v-model="selectedTab"
      class="flex h-full w-full flex-col overflow-scroll"
      default-value="add"
      @change="() => {
        console.warn(selectedTab, 'selectedTab')
      }"
    >
      <OkuTabsList
        class="flex"
        aria-label="Manage your account"
      >
        <template v-if="tabs">
          <OkuTabsTrigger
            v-for="tab in Object.values(tabs)"
            :key="tab.name"
            class="flex h-[30px] max-w-fit flex-1 cursor-default select-none items-center justify-center px-3 text-[10px] leading-none text-gray-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-gray-500 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-gray-400 dark:data-[state=active]:text-gray-400"
            :value="tab.name"
          >
            {{ tab.name }}
            <button
              class="i-ph-x h-3 w-3 dark:text-white"
              @click="() => {
                delete tabs[tab.name]
                selectedTab = 'add'
              }"
            >
            </button>
          </OkuTabsTrigger>
        </template>
        <OkuTabsTrigger
          class="flex h-[30px] max-w-fit flex-1 cursor-default select-none items-center justify-center px-3 text-[10px] leading-none text-gray-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-blue-500 data-[state=active]:text-blue-900 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-blue-500 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-blue-400 dark:data-[state=active]:text-blue-400
           "
          value="add"
        >
          <div class="i-ph-plus h-3 w-3 dark:text-white" />
        </OkuTabsTrigger>
      </OkuTabsList>
      <OkuTabsContent
        v-if="moduleOptions"
        class="flex h-full w-full grow flex-col rounded-b-md p-5 outline-none dark:bg-gray-950"
        value="add"
      >
        <template
          v-if="moduleOptions.plugins"
        >
          <NSectionBlock
            v-for="plugin in Object.keys(moduleOptions.plugins)"
            :key="plugin"
            icon="carbon-plug"
            :text="plugin"
            description="Active modules"
          >
            <div class="grid grid-cols-3 gap-6">
              <div>
                <NButton
                  class="h-10 w-full rounded-md bg-gray-600 text-white"
                  @click="clickPlugin(plugin)"
                >
                  Open Tab
                </NButton>
              </div>
              <div>
                <NButton
                  class="h-10 w-full rounded-md bg-gray-600 text-white"
                  @click="clickPlugin(plugin, true)"
                >
                  Open External Tab
                </NButton>
              </div>
            </div>
          </NSectionBlock>
        </template>
      </OkuTabsContent>
      <OkuTabsContent
        v-for="tab in Object.values(tabs)"
        :key="tab.name"
        :value="tab.name"
        class="flex h-full w-full grow flex-col rounded-b-md outline-none dark:bg-gray-950"
      >
        <IframeView
          v-if="tab.view.src"
          class="flex h-full w-full grow flex-col rounded-b-md outline-none dark:bg-gray-950"
          :tab="{
            name: `${tab.name}graphqlYoga`,
            view: {
              // src: 'http://localhost:3000/api/graphql',
              src: tab.view.src,
            },
          }"
        />
      </OkuTabsContent>
    </OkuTabs>
  </div>
</template>
