import { defineComponent, h } from 'vue'
import { cn } from '@/lib/utils'

export const PageHeader = defineComponent((_, { attrs, slots }) => {
  return () => h('section', {
    class: cn('mx-auto flex max-w-[500px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20', attrs.class as string),
  }, slots.default?.())
})

export const PageHeaderHeading = defineComponent((_, { attrs, slots }) => {
  return () => h('h1', {
    class: cn('text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] max-w-[330px] md:min-w-[540px]', attrs.class as string),
  }, slots.default?.())
})

export const PageHeaderDescription = defineComponent((_, { attrs, slots }) => {
  return () => h('p', {
    class: cn('max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl text-pretty', attrs.class as string),
  }, slots.default?.())
})

export const PageActions = defineComponent((_, { attrs, slots }) => {
  return () => h('div', {
    class: cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10', attrs.class as string),
  }, slots.default?.())
})
