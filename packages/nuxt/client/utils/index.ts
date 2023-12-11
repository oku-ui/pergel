// @credit: https://github.com/harlan-zw/nuxt-og-image/blob/main/client/app.vue
// @credit: https://github.com/vueuse/vueuse/blob/main/packages/math/utils.ts

import type { MaybeRefOrGetter } from 'vue'
import { computed, ref, toValue } from 'vue'

import { joinURL, withBase } from 'ufo'

export type MaybeComputedRefArgs<T> = MaybeRefOrGetter<T>[] | [MaybeRefOrGetter<MaybeRefOrGetter<T>[]>]

export const refreshTime = ref(Date.now())
export const globalRefreshTime = ref(Date.now())

export const description = ref<string | null>(null)
export const hostname = window.location.host
export const path = ref('/')
export const query = ref()
export const base = ref('/')

export const host = computed(() => withBase(base.value, `${window.location.protocol}//${hostname}`))

export function devtoolsUrl(...args: MaybeComputedRefArgs<string>) {
  return computed(() => {
    return joinURL(host.value, ...toValueArgsFlat(args))
  })
}

export function toValueArgsFlat<T>(args: MaybeComputedRefArgs<T>): T[] {
  return args
    .flatMap((i: any) => {
      const v = toValue(i)
      if (Array.isArray(v))
        return v.map(i => toValue(i))
      return [v]
    })
}
