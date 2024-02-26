import { type Config, defineGenerator } from 'automd'

export default <Config>{
  input: [
    'nuxt/**/*.md',
    'guide/**/*.md',
  ],
  generators: {
    changeName: defineGenerator({
      name: 'test',
      generate() {
        const data = `::: tip changeName
\`changeName\` is the name of your project. Please change it to your project name.
:::`
        return {

          contents: data,
        }
      },
    }),
  },
}
