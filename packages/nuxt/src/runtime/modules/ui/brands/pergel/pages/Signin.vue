<script setup lang="ts">
const { buttonVariants } = useVariants()

</script>

<template>
  <div class="mb-14 md:hidden">
    <AtomImage
      alt="Authentication" width="1280" height="1214" class="block" :image="{
        dark: 'https://images.unsplash.com/photo-1586421483226-7f5e25967f82?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        light: 'https://images.unsplash.com/photo-1559728772-03320cb90044?q=80&w=1766&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      }"
    />
  </div>

  <div
    class="h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <NuxtLink
      to="/auth/signup" :class="cn(
        buttonVariants({ variant: 'ghost' }),
        'absolute right-4 top-4 md:right-8 md:top-8',
      )"
    >
      {{ $t('pergel.signup') }}
    </NuxtLink>
    <div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <img class="mr-2 h-24 w-24" src="https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg" alt="Your Company">
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;This library has saved me countless hours of work and
            helped me deliver stunning designs to my clients faster than
            ever before.&rdquo;
          </p>
          <footer class="text-sm">
            Sofia Davis
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Signin
          </h1>
          <p class="text-muted-foreground text-sm">
            Don't have an account?
            <NuxtLink to="/auth/signup" class="hover:text-primary underline underline-offset-4">
              Signup
            </NuxtLink>
          </p>
        </div>
        <MolUserAuthForm />
        <p class="text-muted-foreground px-8 text-center text-sm">
          By clicking continue, you agree to our
          <NuxtLink to="/auth/terms" class="hover:text-primary underline underline-offset-4">
            Terms of Service
          </NuxtLink>
          and
          <NuxtLink to="/auth/privacy" class="hover:text-primary underline underline-offset-4">
            Privacy Policy
          </NuxtLink>
          .
        </p>
      </div>
    </div>
  </div>
</template>
