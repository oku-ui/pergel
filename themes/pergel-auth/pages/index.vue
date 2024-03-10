<script setup lang="ts">
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/PageHeader'
import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'

const fadeUpClass = 'lg:motion-safe:opacity-0 lg:motion-safe:animate-fade-up'

definePageMeta({
  middleware: ['user-to-home'],
})
</script>

<template>
  <div class="container relative flex flex-1 flex-col items-center justify-center">
    <SiteHeader />
    <PageHeader>
      <PageHeaderHeading :class="fadeUpClass">
        Stop wasting time building OTP inputs.
      </PageHeaderHeading>

      <Showcase
        :class="cn(
          fadeUpClass,
          'lg:motion-safe:[animation-delay:1000ms]',
        )"
      />

      <PageHeaderDescription
        :class="cn(
          fadeUpClass,
          'lg:motion-safe:[animation-delay:3000ms]',
        )"
      >
        One-time password input component for Vue. Accessible. Unstyled.
        Customizable. Open Source.
      </PageHeaderDescription>

      <PageActions
        :class="cn(
          fadeUpClass,
          'lg:motion-safe:[animation-delay:3000ms]',
        )"
      >
        <div :class="buttonVariants({ variant: 'outline' })">
          <div class="text-muted-foreground pr-1">
            <span class="text-foreground">npm</span> install vue-input-otp
          </div>
        </div>
      </PageActions>
    </PageHeader>
  </div>
</template>
