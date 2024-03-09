<script setup lang="ts">
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
</script>

<template>
  <header class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <!-- <MainNav />
        <MobileNav /> -->
      <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <nav class="flex items-center">
          <NuxtLink
            to="/auth/login"
          >
            <div
              :class="cn(
                buttonVariants({
                  variant: 'ghost',
                }),
              )"
            >
              Login
              <span class="sr-only">Twitter</span>
            </div>
          </NuxtLink>
          <NuxtLink
            to="/auth/login"
          >
            <div
              :class="cn(
                buttonVariants({
                  variant: 'ghost',
                }),
              )"
            >
              Register
              <span class="sr-only">Twitter</span>
            </div>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>
