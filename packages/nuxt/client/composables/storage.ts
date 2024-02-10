import { toRefs } from '@vueuse/core'
import { watch } from 'vue'

interface NuxtDevToolsOptions {
  showSidebar: boolean
  showHelpButtons: boolean
  tabs: string[]
}

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

const windowSize = useWindowSize()

export const splitScreenAvailable = computed(() => windowSize.width.value > 1080)

// const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: true })

// const uiOptions = ref(await rpc.getOptions('ui'))
const uiOptionsRefs = toRefs({
  showHelpButtons: true,
  showSidebar: true,
  tabs: [],
} as NuxtDevToolsOptions)

watch(uiOptionsRefs.tabs, async (options) => {
  localStorage.setItem('pergel-devtools-settings', JSON.stringify(options))
}, {
  deep: true,
})

// watch(uiOptions, async (options) => {
//   rpc.updateOptions('ui', options)
// }, { deep: true, flush: 'post' })

// Migrate settings from localStorage to devtools options. TODO: remove in next major release
if (localStorage.getItem('pergel-devtools-settings')) {
  Object.assign({}, JSON.parse(localStorage.getItem('pergel-devtools-settings')!))
  localStorage.removeItem('pergel-devtools-settings')
}
else {
  localStorage.setItem('pergel-devtools-settings', JSON.stringify(uiOptionsRefs))
}

export function useDevToolsUIOptions() {
  return uiOptionsRefs
}
