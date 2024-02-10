<script lang="ts" setup>
import type { PergelModuleNames } from '../../../src/runtime/core/types/nuxtModule'
import type { ResolvedGraphQLYogaConfig } from '../../../src/runtime/modules/graphqlYoga/types'
import { rpc } from '../../composables/rpc'
import type { TabStateInject } from '../TabGenerator.vue'

const props = defineProps<{
  projectName: string
}>()

const emits = defineEmits<Emits>()
const tabStateInject = inject('tabState') as Ref<TabStateInject>

let tabs = reactive<{
  [key in string]: {
    name: string
    view: {
      src: string
    }
  }
}>({})

type Emits = {
  selectedModule: [string]
}

const moduleOptions = ref<ResolvedGraphQLYogaConfig>()

onMounted(async () => {
  await getModuleOptions({
    projectName: props.projectName,
    module: 'drizzle',
  }) as any
})

tabs = tabStateInject?.value.getSecondaryContext() as any

async function getModuleOptions({ projectName, module }: { projectName: string, module: PergelModuleNames }) {
  const data = await rpc.value?.getModuleOptions({
    moduleName: module,
    projectName,
  })
  moduleOptions.value = JSON.parse(JSON.stringify(data))
}

function clickPlugin(input: {
  name: string
  endpoint: string
}, external?: boolean) {
  // @ts-ignore
  if (external) {
    return window.open(input.endpoint, '_blank')
  }
  else {
    tabs[input.name] = {
      name: input.name,
      view: {
        src: input.endpoint,
      },
    }
    tabStateInject.value.saveSecondaryContext(tabs)

    emits('selectedModule', input.name)
  }
}
</script>

<template>
  <div
    v-if="moduleOptions && tabStateInject?.tabState.value.activeTab === 'add'"
    class="flex size-full grow flex-col rounded-b-md p-5 outline-none dark:bg-gray-950" value="add"
  >
    <template v-if="moduleOptions.plugins">
      <NSectionBlock
        v-for="plugin in Object.keys(moduleOptions.plugins)" :key="plugin" icon="carbon-plug" :text="plugin"
        description="Active modules"
      >
        <div class="grid grid-cols-3 gap-6">
          <div>
            <NButton class="h-10 w-full rounded-md bg-gray-600 text-white" @click="clickPlugin(plugin)">
              Open Tab
            </NButton>
          </div>
          <div>
            <NButton class="h-10 w-full rounded-md bg-gray-600 text-white" @click="clickPlugin(plugin, true)">
              Open External Tab
            </NButton>
          </div>
        </div>
      </NSectionBlock>
    </template>
    <NSectionBlock icon="carbon-plug" text="Plugins" description="Active modules">
      <div class="grid grid-cols-3 gap-6">
        <div>
          <NButton
            class="h-10 w-full rounded-md bg-gray-600 text-white" @click="clickPlugin({
              name: 'drizzle-studio',
              endpoint: 'https://local.drizzle.studio/?port=3105',
            })"
          >
            Open Tab
          </NButton>
        </div>
        <div>
          <NButton
            class="h-10 w-full rounded-md bg-gray-600 text-white" @click="clickPlugin({
              name: 'drizzle-studio',
              endpoint: 'https://local.drizzle.studio/?port=3105',
            }, true)"
          >
            Open External Tab
          </NButton>
        </div>
      </div>
    </NSectionBlock>
  </div>

  <template v-for="tab in Object.values(tabs)">
    <div
      v-if="tab.view.src && tabStateInject?.tabState.value?.activeTab === tab.name" :key="tab.name" :value="tab.name"
      class="flex size-full grow flex-col rounded-b-md outline-none dark:bg-gray-950"
    >
      <IframeView
        class="flex grow flex-col rounded-b-md outline-none dark:bg-gray-950" :tab="{
          name: `${tab.name}graphqlYoga`,
          view: {
            src: tab.view.src,
          },
        }"
      />
    </div>
  </template>
</template>
