import { vConfetti } from '@neoconfetti/vue'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((app: any) => {
  // Register the directive
  app.vueApp.directive('confetti', vConfetti)
})
