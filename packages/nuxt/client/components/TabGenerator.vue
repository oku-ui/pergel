<script lang="ts" setup>
import { Button } from '~/components/ui/button'

interface Props {
  moduleName: string
  projectName: string
}

export interface TabState {
  activeTab: string
  tabs: string[]
  secondaryContext: object
}

export interface TabStateInject {
  tabState: Ref<TabState>
  projectName: string
  moduleName: string
  saveSecondaryContext: (data: object) => void
  getSecondaryContext: () => object
}

const props = defineProps<Props>()

const tabState = ref<TabState>({
  activeTab: 'add',
  tabs: [],
  secondaryContext: {},
})
const tabs = useLocalStorage(`pergel-tabs-${props.projectName}-${props.moduleName}`, tabState)

const selectProject = ref()

function selectModule(module: string) {
  const mergeProjectName = selectProject.value ? `${selectProject.value}.${module}` : module
  const item = tabs.value
  if (!item) {
    tabState.value = {
      activeTab: 'add',
      tabs: [],
      secondaryContext: {},
    }
  }

  if (item && !item.tabs.includes(mergeProjectName))
    tabState.value.tabs = [...item.tabs, mergeProjectName]

  tabState.value.activeTab = mergeProjectName
}

function clickRemoveTab(tab: string) {
  // remove object in secondaryContext
  const secondaryContext = tabState.value.secondaryContext
  delete secondaryContext[tab as keyof object]
  tabState.value.secondaryContext = secondaryContext

  const tabs = tabState.value.tabs

  const tabIndex = tabs.indexOf(tab)

  if (tabIndex === -1)
    return

  tabState.value.tabs.splice(tabIndex, 1)

  if (tabState.value.tabs.length === 0) {
    tabState.value.activeTab = 'add'
    tabState.value.tabs = []
    return
  }

  const currentTabIndex = tabs.indexOf(tabState.value.activeTab)

  if (currentTabIndex === -1 || currentTabIndex === tabIndex) {
    const previousTabIndex = Math.max(0, tabIndex - 1)
    tabState.value.activeTab = tabs[previousTabIndex]
  }
}

function saveSecondaryContext(data: object) {
  tabState.value.secondaryContext = Object.assign(tabState.value.secondaryContext, data)
}

function getSecondaryContext() {
  return tabState.value.secondaryContext
}

provide('tabState', computed(() => {
  return {
    tabState,
    projectName: props.projectName,
    moduleName: props.moduleName,
    saveSecondaryContext,
    getSecondaryContext,
  }
}))
</script>

<template>
  <div class="flex max-h-[50px] min-h-[50px] items-center border-b pl-2 pr-4">
    <div class="flex">
      <div v-for="tab in tabs.tabs" :key="tab" class="relative flex w-fit items-center">
        <Button
          :variant="tabState.activeTab === tab ? 'secondary' : 'outline'" @click="() => {
            tabState.activeTab = tab
          }"
        >
          {{ tab }}
        </Button>
        <Button
          class="-ml-4 mr-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-red-400 p-0"
          variant="ghost" @click="clickRemoveTab(tab)"
        >
          x
        </Button>
      </div>

      <Button
        :variant="tabState.activeTab === 'add' ? 'default' : 'outline'" @click="() => {
          tabState.activeTab = 'add'
        }"
      >
        Add
      </Button>
    </div>
  </div>
  <slot :select-module="selectModule" />
</template>
