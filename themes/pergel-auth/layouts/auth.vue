<template>
  <AuthLayout
    :logo="{
      dark: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
      light: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-dark.svg',
      alt: 'Your Company',
    }"
  >
    <template v-for="(_, key) in useSlots()" #[key]>
      <slot :name="key" />
    </template>

    <slot />
  </AuthLayout>
</template>
