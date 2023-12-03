import { defineConfig } from 'bumpp'

export default defineConfig({
  noVerify: true,
  commit: 'version(cli): release %s',
  push: false,
  tag: false,
})
