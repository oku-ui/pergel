<script setup lang="ts">
interface AuthFormProps {
  title: string
  description?: {
    label: string
    to?: string
    text?: string
  }
}

withDefaults(defineProps<AuthFormProps>(), {
  title: 'Signin',
})
</script>

<template>
  <div class="mt-20 pb-60 lg:p-8">
    <div class="mx-auto flex w-full flex-col justify-center space-y-6">
      <div class="mb-6 flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ title }}
        </h1>
        <p v-if="description" class="text-muted-foreground text-sm">
          {{ description.label }}
          <NuxtLink v-if="description.to" :to="description.to" class="hover:text-primary underline underline-offset-4">
            {{ description.text }}
          </NuxtLink>
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>
