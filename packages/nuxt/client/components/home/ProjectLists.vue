<script setup lang="ts">
import type { ResolvedPergelOptions } from '../../../src/runtime/core/types/nuxtModule'
import type { ResolvedPergelModuleOptions } from '../../../src/runtime/core/types/module'

interface Props {
  project: ResolvedPergelOptions['projects'][string]
}

const props = withDefaults(defineProps<Props>(), {

})

defineEmits<Emits>()

type Emits = {
  select: [string]
}

function selectModule(module: string) {
  const data = (props.project as any)[module] as ResolvedPergelModuleOptions
  return data
}
</script>

<template>
  <div class="grid grid-cols-3 gap-6">
    <div
      v-for="module in Object.keys(project)"
      :key="module"
      class="flex flex-col"
    >
      <Button
        :disabled="!selectModule(module).devtoolsStatus"
        class="mb-2"
        variant="outline"
        @click="() => $emit('select', module)"
      >
        {{ module }}
      </Button>
    </div>
  </div>
</template>
