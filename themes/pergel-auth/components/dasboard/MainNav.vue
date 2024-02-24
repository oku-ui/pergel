<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <a
      href="/examples/dashboard"
      class="hover:text-primary text-sm font-medium transition-colors"
    >
      Overview
    </a>
    <a
      href="/examples/dashboard"
      class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
    >
      Customers
    </a>
    <a
      href="/examples/dashboard"
      class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
    >
      Products
    </a>
    <a
      href="/examples/dashboard"
      class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
    >
      Settings
    </a>
  </nav>
</template>
