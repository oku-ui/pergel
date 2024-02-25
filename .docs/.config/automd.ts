import type { Config } from 'automd'

export default <Config>{
  input: [
    'nuxt/**/*.md',
  ],
  // generators: {
  //   file: defineGenerator({
  //     name: 'test',
  //     generate(ctx) {
  //       console.log(ctx)
  //       return {
  //         contents: 'Hello, world!',
  //       }
  //     },
  //   }),
  // },
}
