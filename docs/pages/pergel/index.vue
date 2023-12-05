<script setup lang="ts">
const title = '1:1 Radix UI components for Vue'
const desc = 'Unstyled, accessible components for building high‑quality design systems and web apps in React.Unstyled, accessible components for building high‑quality design systems and web apps in Vue.'

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description: desc,
  ogDescription: desc,
  ogImage: 'https://oku-ui.com/primitives-og-image.png',
  twitterImage: 'https://oku-ui.com/primitives-og-image.png',
})
</script>

<template>
  <div>
    <span class="gradient" />

    <ULandingHero orientation="horizontal" class="!py-18 md:py-0 md:!pt-32 relative" :ui="{ container: 'flex lg:gap-4' }">
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
          to="/getting-started/ssr"
          title="System Setup"
          icon="i-ph-computer-tower-duotone"
          description="Automatic installation of required software on your computer"
        />
        <ULandingCard
          to="/getting-started/i18n"
          title="Auth"
          icon="i-solar-globus-bold-duotone"
          description="Authentication and authorization system"
        />
        <ULandingCard
          to="/components/html"
          title="Mobile App"
          icon="i-solar-smartphone-line-duotone"
          description="Ionic + Capacitor mobile application"
        />
        <ULandingCard
          to="/integrations/mailersend"
          title="Integrations"
          icon="i-solar-plug-line-duotone"
          description="Simple institution cli service with important libraries for the project"
        />
        <ULandingCard
          to="/getting-started/devtools"
          title="Web App"
          icon="i-ph-browser-duotone"
          description="Website with initial settings prepared."
        />
        <ULandingCard
          to="/components/tailwind"
          title="Tailwind CSS"
          icon="i-ph-palette-duotone"
          description="Nuxt 3 layer structures and components"
        />
        <ULandingCard
          to="/components/tailwind"
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
