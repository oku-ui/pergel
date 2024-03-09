<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  char: string | null
  isActive: boolean
  isFocused: boolean
  animateIdx?: number
}>()

const willAnimateChar = computed(() => props.animateIdx !== undefined && props.animateIdx < 2)
const willAnimateCaret = computed(() => props.animateIdx === 2)
</script>

<template>
  <div
    :class="cn(
      'relative w-10 md:w-20 h-14 md:h-28 text-[2rem] md:text-[4rem] flex items-center justify-center border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md transition-all [transition-duration:300ms] outline outline-0 outline-accent-foreground/20',
      'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
      {
        'outline-4 outline-accent-foreground': isActive,
      },
    )"
  >
    <div
      :class="cn('duration-1000', {
        'lg:opacity-0 lg:animate-fade-in': willAnimateChar,
        'lg:[animation-delay:1.5s]': animateIdx === 0,
        'lg:[animation-delay:2s]': animateIdx === 1,
      })"
    >
      <div v-if="char">
        {{ char }}
      </div>
    </div>

    <div
      v-if="isActive && char === null"
      :class="cn({
        'lg:opacity-0 lg:animate-fade-in': willAnimateCaret,
      })"
    >
      <!-- Fake Caret -->
      <div class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center [animate-delay:inherit]">
        <div class="h-8 w-px bg-white md:h-16 md:w-0.5" />
      </div>
    </div>
  </div>
</template>
