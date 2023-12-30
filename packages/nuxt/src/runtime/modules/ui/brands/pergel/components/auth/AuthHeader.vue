<script setup lang="ts">
interface AuthHeaderProps {
  title: string
  link: string
}

withDefaults(defineProps<AuthHeaderProps>(), {
  title: 'Signin',
  link: '/auth/signin',
})

const { buttonVariants } = useVariants()
</script>

<template>
  <div class="absolute right-4 top-4 flex space-x-2 md:right-8 md:top-8">
    <MolColorModeButton
      :class="cn(
        buttonVariants({ variant: 'ghost' }),
        '',
      )"
    />
    <!-- <MolLangSwitcherButton /> -->
    <NuxtLink
      :to="link" :class="cn(
        buttonVariants({ variant: 'ghost' }),
        '',
      )"
    >
      {{ title }}
    </NuxtLink>
  </div>
</template>
