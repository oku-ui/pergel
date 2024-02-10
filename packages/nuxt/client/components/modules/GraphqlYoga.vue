<script lang="ts" setup>
import type { PergelModuleNames } from '../../../src/runtime/core/types/nuxtModule'
import type { ResolvedGraphQLYogaConfig } from '../../../src/runtime/modules/graphqlYoga/types'
import { rpc } from '../../composables/rpc'

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
  await getModuleOptions({
    projectName: props.projectName,
    module: 'graphqlYoga',
  }) as any
})

async function getModuleOptions({ projectName, module }: { projectName: string, module: PergelModuleNames }) {
  const data = await rpc.value?.getModuleOptions({
    moduleName: module,
    projectName,
  })
  console.warn(data, 'data')
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
  <div class="flex size-full flex-col">
    <TabsRoot
      v-model="selectedTab"
      class="flex size-full flex-col overflow-scroll"
      default-value="add"
      @change="() => {
        console.warn(selectedTab, 'selectedTab')
      }"
    >
      <TabsList
        class="flex"
        aria-label="Manage your account"
      >
        <template v-if="tabs">
          <TabsTrigger
            v-for="tab in Object.values(tabs)"
            :key="tab.name"
            class="flex h-[30px] max-w-fit flex-1 cursor-default select-none items-center justify-center px-3 text-[10px] leading-none text-gray-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-gray-500 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-gray-400 dark:data-[state=active]:text-gray-400"
            :value="tab.name"
          >
            {{ tab.name }}
            <button
              class="i-ph-x size-3 dark:text-white"
              @click="() => {
                delete tabs[tab.name]
                selectedTab = 'add'
              }"
            >
            </button>
          </TabsTrigger>
        </template>
        <TabsTrigger
          class="flex h-[30px] max-w-fit flex-1 cursor-default select-none items-center justify-center px-3 text-[10px] leading-none text-gray-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-blue-500 data-[state=active]:text-blue-900 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-blue-500 dark:bg-gray-950 dark:text-gray-200 dark:hover:text-blue-400 dark:data-[state=active]:text-blue-400
           "
          value="add"
        >
          <div class="i-ph-plus size-3 dark:text-white" />
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-if="moduleOptions"
        class="flex size-full grow flex-col rounded-b-md p-5 outline-none dark:bg-gray-950"
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
      </TabsContent>
      <TabsContent
        v-for="tab in Object.values(tabs)"
        :key="tab.name"
        :value="tab.name"
        class="flex size-full grow flex-col rounded-b-md outline-none dark:bg-gray-950"
      >
        <IframeView
          v-if="tab.view.src"
          class="flex size-full grow flex-col rounded-b-md outline-none dark:bg-gray-950"
          :tab="{
            name: `${tab.name}graphqlYoga`,
            view: {
              // src: 'http://localhost:3000/api/graphql',
              src: tab.view.src,
            },
          }"
        />
      </TabsContent>
    </TabsRoot>
  </div>
</template>
