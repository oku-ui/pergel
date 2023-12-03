import { defineConfig } from 'bumpp'

export default defineConfig({
  noVerify: true,
  commit: 'version(nuxt): release %s',
  push: false,
  tag: false,
})
