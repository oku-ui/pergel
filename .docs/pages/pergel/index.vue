<script setup lang="ts">
const title = 'Oku Pergel'
const desc = 'Full Stack Nuxt, Nitro and Vue Modules. Pergel is a full stack Nuxt application. It contains the necessary toolkits for a software developer and a fast, clean, tested toolkit. Authentication, authorization, user management, role management, and more'

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description: desc,
  ogDescription: desc,
  ogImage: 'https://oku-ui.com/pergel-og-image.png',
  twitterImage: 'https://oku-ui.com/pergel-og-image.png',
})
</script>

<template>
  <div>
    <span class="gradient" />

    <ULandingHero orientation="horizontal" class="!py-18 relative md:py-0 md:!pt-32" :ui="{ container: 'flex lg:gap-4' }">
      <!-- <div class="hidden lg:block relative w-[500px]">
        <Illustration class="h-[480px]" />
      </div> -->
      <template #title>
        <span class="text-primary-400">Pergel</span> is a full stack Nuxt application.
      </template>
      <template #description>
        It contains the necessary toolkits for a software developer and a fast, clean, tested toolkit. Authentication, authorization, user management, role management, and more.
      </template>
      <template #links>
        <UButton to="/pergel/getting-started" icon="i-ph-rocket-launch-duotone" size="xl">
          Read the Docs
        </UButton>
      </template>
    </ULandingHero>

    <ULandingSection>
      <template #title>
        Powerful, flexible, and extensible <br><span class="text-primary-400"> Nuxt Application.</span>
      </template>
      <UPageGrid>
        <ULandingCard
          to="/pergel/cli"
          title="CLI"
          icon="i-ph-terminal-duotone"
          description="Automatic installation and configuration with CLI"
        />
        <ULandingCard
          to="/pergel/nuxt"
          title="Nuxt Modules"
          icon="i-simple-icons-nuxtdotjs"
          description="S3, GraphQL, Drizzle, and more"
        />
        <ULandingCard
          to="/pergel/nitro"
          title="Nitro"
          icon="i-ph-lightning-duotone"
          description="Simple institution cli service with important libraries for the project"
        />
        <ULandingCard
          to="/#"
          title="...more"
          icon="i-ph-palette-duotone"
          description="Much more in the future"
        />
      </UPageGrid>
    </ULandingSection>
  </div>
</template>

<style scoped>
.gradient {
  position: fixed;
  top: 25vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, #eec264 0%, rgba(0, 220, 130, 0) 100%);
  filter: blur(180px);
  opacity: 0.6;
  z-index: -1;
}
</style>
