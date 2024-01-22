import { vConfetti } from '@neoconfetti/vue'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((app) => {
  // Register the directive
  app.vueApp.directive('confetti', vConfetti)
})
