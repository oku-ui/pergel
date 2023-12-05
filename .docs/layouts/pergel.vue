<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

interface Link {
  label: string
  to: string
  target?: string
  icon?: string
}

defineProps<{
  links: Link[]
}>()

const route = useRoute()

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => {
  if (route.path.startsWith('/pergel'))
    return nav!.value.find(item => item._path === '/pergel')?.children

  return nav!.value.filter(item => !item._path.startsWith('/pergel')) as NavItem[] | undefined
})
</script>

<template>
  <HeaderPergel />
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <UNavigationTree
              :multiple="false"
              default-open
              :links="mapContentNavigation(navigation!)
              "
            />
          </UAside>
        </template>
        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
