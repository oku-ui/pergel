import { toRefs } from '@vueuse/core'

interface DevToolsFrameState {
  showSidebar: boolean
  showHelpButtons: boolean
}

interface NuxtDevToolsOptions {
  showSidebar: boolean
  showHelpButtons: boolean
}

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

const windowSize = useWindowSize()

export const splitScreenAvailable = computed(() => windowSize.width.value > 1080)

// const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: true })

// const uiOptions = ref(await rpc.getOptions('ui'))
const uiOptionsRefs = toRefs({
  showHelpButtons: true,
  showSidebar: true,
} as NuxtDevToolsOptions)

// watch(uiOptions, async (options) => {
//   rpc.updateOptions('ui', options)
// }, { deep: true, flush: 'post' })

// Migrate settings from localStorage to devtools options. TODO: remove in next major release
if (localStorage.getItem('pergel-devtools-settings')) {
  Object.assign({}, JSON.parse(localStorage.getItem('pergel-devtools-settings')!))
  localStorage.removeItem('pergel-devtools-settings')
}

export function useDevToolsUIOptions() {
  return uiOptionsRefs
}
