<script lang="ts" setup>
import { rpc } from '../composables/rpc'
import { Button } from '~/components/ui/button'

const projects = ref()
const totalModules = ref()

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
</script>

<template>
  <div>
    <div
      class="flex max-h-[50px] min-h-[50px] items-center border-b pl-2 pr-4"
    >
      <Button
        variant="outline"
      >
        Add
      </Button>
    </div>
    <div class="py-6">
      <HomeProjectsBox
        v-model="selectProject"
        :projects="projects ? Object.keys(projects) : undefined"
        @update:model-value="console.log"
      >
        <HomeProjectLists
          v-if="getProjects"
          :project="getProjects"
        >
        </HomeProjectLists>
      </HomeProjectsBox>
    </div>
  </div>
</template>

<!-- <template>
  <div class="flex size-full flex-col">
    <TabsRoot
      v-model="selectedTab"
      class="flex size-full flex-col"
      default-value="add"
    >
      <TabsList
        class="flex"
        aria-label="Manage your account"
      >
        <template v-if="tabs && tabs.length">
          <TabsTrigger
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
      </TabsContent>

      <TabsContent
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
      </TabsContent>
    </TabsRoot>
  </div>
</template> -->
