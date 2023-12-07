import { createSharedComposable } from '@vueuse/core'

function _useNavigation() {
  const headerLinks = computed(() => {
    const route = useRoute()

    return [
      {
        label: 'Pergel',
        icon: 'i-ph-book-bookmark-duotone',
        to: '/pergel',
        search: false,
        children: [
          {
            label: 'Get Started',
            description: 'Learn how to get started with Nuxt.',
            icon: 'i-ph-rocket-launch-duotone',
            to: '/pergel/getting-started',
            active: route.path.startsWith('/pergel/getting-started'),
          },
          {
            label: 'CLI',
            description: 'Learn how to use the Pergel CLI.',
            icon: 'i-ph-terminal-duotone',
            to: '/pergel/cli',
            active: route.path.startsWith('/pergel/cli'),
          },
          {
            label: 'Nuxt',
            description: 'Learn Nuxt modules and how to use them.',
            icon: 'i-simple-icons-nuxtdotjs',
            to: '/pergel/nuxt',
            active: route.path.startsWith('/pergel/nuxt'),
          },
          {
            label: 'Nitro',
            description: 'Learn about the Pergel Nitro framework.',
            icon: 'i-ph-lightning-duotone',
            to: '/pergel/nitro',
            active: route.path.startsWith('/pergel/nitro'),
          },
          {
            label: 'Directory Structure',
            description: 'Learn about the Pergel Nitro framework.',
            icon: 'i-ph-folder-notch-open-duotone',
            to: '/pergel/directory-structure',
            active: route.path.startsWith('/pergel/directory-structure'),
          },
          {
            label: 'Examples',
            description: 'Discover and explore official and community examples.',
            icon: 'i-ph-app-window-duotone',
            to: '/pergel/examples',
            active: route.path.startsWith('/pergel/examples'),
          },
          {
            label: 'Community',
            description: 'Find answers and support from the community.',
            icon: 'i-ph-chats-teardrop-duotone',
            to: '/pergel/community',
            active: route.path.startsWith('/pergel/community'),
          },
        ],
      },
      {
        label: 'Projects',
        icon: 'i-ph-folder-open-duotone',
        to: '/',
        search: false,
      },
    ]
  })

  return {
    headerLinks,

  }
}

export const useNavigation = createSharedComposable(_useNavigation)
