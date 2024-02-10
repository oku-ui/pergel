<script lang="ts" setup>
import { rpc } from '../composables/rpc'
import { Button } from '~/components/ui/button'

const projects = ref()
const totalModules = ref()
const tabState = ref<{
  activeTab: string
  tabs: string[]
}>({
  activeTab: 'add',
  tabs: [],
})
const tabs = useLocalStorage('pergel-tabs', tabState)

onMounted(async () => {
  projects.value = await rpc.value?.getProjects() ?? {
    test1: {
      S3: {
        active: true,
      },
      graphqlYoga: {
        active: false,
      },
      drizzle: {
        active: false,
      },
    },
    test2: {
      S3: {
        active: false,
      },
    },
  }
  totalModules.value = await rpc.value?.getTotalModules()
})

const selectProject = ref()

const getProjects = computed(() => {
  return selectProject.value ? projects.value[selectProject.value] : undefined
})

function selectModule(module: string) {
  const mergeProjectName = `${selectProject.value}.${module}`
  const item = tabs.value
  if (!item) {
    tabState.value = {
      activeTab: 'add',
      tabs: [],
    }
  }

  if (item && !item.tabs.includes(mergeProjectName))
    tabState.value.tabs = [...item.tabs, mergeProjectName]

  tabState.value.activeTab = mergeProjectName
}

function clickRemoveTab(tab: string) {
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
</script>

<template>
  <div
    class="flex max-h-[50px] min-h-[50px] items-center border-b pl-2 pr-4"
  >
    <div
      class="flex"
    >
      <div
        v-for="tab in tabs.tabs"
        :key="tab"
        class="relative flex w-fit items-center"
      >
        <Button
          :variant="tabState.activeTab === tab ? 'secondary' : 'outline'"
          @click="() => {
            tabState.activeTab = tab
          }"
        >
          {{ tab }}
        </Button>
        <Button
          class="-ml-4 mr-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-red-400 p-0"
          variant="ghost"
          @click="clickRemoveTab(tab)"
        >
          x
        </Button>
      </div>

      <Button
        :variant="tabState.activeTab === 'add' ? 'default' : 'outline'"

        @click="() => {
          tabState.activeTab = 'add'
        }"
      >
        Add
      </Button>
    </div>
  </div>
  <div
    v-if="tabState.activeTab === 'add'"
    class="py-6"
  >
    <HomeProjectsBox
      v-model="selectProject"
      :projects="projects ? Object.keys(projects) : undefined"
      @update:model-value="console.log"
    >
      <HomeProjectLists
        v-if="getProjects"
        :project="getProjects"
        @select="selectModule"
      >
      </HomeProjectLists>
    </HomeProjectsBox>
  </div>

  <div
    v-else
    class="flex size-full flex-col"
  >
    <!-- <ModulesGraphqlYoga
        v-if=" tabState.activeTab.includes('.graphqlYoga')"
        :project-name=" tabState.activeTab.split('.')[0]"
      >
      </ModulesGraphqlYoga> -->

    <TabGenerator
      v-if="tabState.activeTab.includes('.graphqlYoga')"
      v-slot="{ selectModule }"
      :project-name="tabState.activeTab.split('.')[0]"
      :module-name="tabState.activeTab.split('.')[1]"
    >
      <ModulesGraphqlYoga
        :project-name="tabState.activeTab.split('.')[0]"
        @selected-module="selectModule"
      >
      </ModulesGraphqlYoga>
    </TabGenerator>

    <TabGenerator
      v-if="tabState.activeTab.includes('.drizzle')"
      v-slot="{ selectModule }"
      :project-name="tabState.activeTab.split('.')[0]"
      :module-name="tabState.activeTab.split('.')[1]"
    >
      <ModulesDrizzle
        :project-name="tabState.activeTab.split('.')[0]"
        @selected-module="selectModule"
      >
      </ModulesDrizzle>
    </TabGenerator>

    <TabGenerator
      v-if="tabState.activeTab.includes('.S3')"
      v-slot="{ selectModule }"
      :project-name="tabState.activeTab.split('.')[0]"
      :module-name="tabState.activeTab.split('.')[1]"
    >
      <ModulesAssetS3
        :project-name="tabState.activeTab.split('.')[0]"
        @selected-module="selectModule"
      >
      </ModulesAssetS3>
    </TabGenerator>
  </div>
</template>
