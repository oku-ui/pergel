import { vConfetti } from '@neoconfetti/vue'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((app) => {
  // Register the directive
  app.vueApp.directive('confetti', vConfetti)
})
