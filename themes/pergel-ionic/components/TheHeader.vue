<script setup lang="ts">
defineProps({
  fullName: String,
  avatar: String,
  size: {
    type: String,
    validator: (value: string) => ['xs', 'lg'].includes(value),
    default: 'lg',
  },
})
</script>

<template>
  <div>
    <div :class="size === 'lg' ? 'h-52' : 'h-20'" class=" w-full">
      <img src="/assets/patterns/bgPattern.svg" class="h-full w-full rounded-t-lg">
    </div>
    <div class="-mt-20 flex flex-col items-center">
      <img src="/assets/images/profile.jpg" class="w-24 rounded-full border-4 border-white">
      <div class="mt-2 flex items-center space-x-2">
        <p class="text-2xl">
          {{ fullName }}
        </p>
        <span class="rounded-full bg-blue-500 p-1" title="Verified">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>
