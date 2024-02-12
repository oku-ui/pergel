<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      :class="cn(
        $attrs.class ?? '',
      )"
    >
      <AtomIcon dynamic name="i-ph-globe-bold" class="size-4" />
      <span
        class="ml-2"
      >
        {{ locale }}
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>
        Languages
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="locale in availableLocales" :key="locale.code"
        @click.prevent.stop="setLocale(locale.code)"
      >
        {{ locale.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
