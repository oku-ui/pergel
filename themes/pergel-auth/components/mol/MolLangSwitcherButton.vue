<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger
      :class="cn(
        $attrs.class ?? '',
      )"
    >
      <AtomIcon dynamic name="i-ph-globe-bold" class="h-4 w-4" />
      {{ locale.value }}
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent>
      <UiDropdownMenuLabel>
        Languages
      </UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem
        v-for="locale in availableLocales" :key="locale.code"
        @click.prevent.stop="setLocale(locale.code)"
      >
        {{ locale.name }}
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
