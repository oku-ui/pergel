---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Pergel"
  text: "Full Stack Nuxt or Nitro Kit"
  tagline: Full Stack Nuxt or Nitro Application. It contains the necessary toolkits for a software developer and a fast, clean, tested toolkit.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: brand
      text: Nuxt ->
      link: /nuxt/nuxt-config
    - theme: alt
      text: Nitro (Not Ready Yet)
      link: /#
  image:
    src: /pergel-logo-large.webp
    alt: Pergel

features:
  - title: Aboutaaaabbb
    details:  Pergel is a tailor-made solution for Nuxt and Nitro, providing swift project kickstarts and seamless integration of various modules. Named with a Turkish touch, Pergel maximizes the power of TypeScript, streamlining and accelerating your project development process.
  - title: Modular and Packaged Structure
    details: Pergel encompasses the core structure of your project, offering essential modules and packages to kickstart your development journey. This allows you to build the foundational infrastructure for your project with an advanced and modular approach.
  - title: Proactive Module Additions
    details: Pergel is continuously evolving to meet your future needs. We consistently add new modules and packages to keep your projects up-to-date and competitive, ensuring a proactive and future-ready development environment.
  - title: Empowered Development with TypeScript
    details: Pergel seamlessly integrates with TypeScript, providing developers with type safety and the advantages of the compilation process. This results in safer, more readable, and sustainable projects.
  - title: Community-Driven Growth with Feedback
    details: Pergel is a community-centric project. Engage with fellow developers and users to help us make Pergel better and more powerful. Your feedback plays a critical role in making Pergel more user-friendly and functional.
  - title: Join In and Progress
    details: If you're a developer, explore Pergel to enhance your projects. You can also contribute to our community by integrating the structures you use in your projects into Pergel and submitting pull requests.
---


<style>
:root {
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, rgba(255, 165, 0, 0.5) 50%, rgba(255, 127, 0, 0.7)); /* Şeffaf turuncu tonları */

  --vp-home-hero-image-background-image: linear-gradient(-45deg, rgba(255, 165, 0, 0.2) 50%, rgba(255, 127, 0, 0.6) 50%); /* Şeffaf turuncu tonları */
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

</style>