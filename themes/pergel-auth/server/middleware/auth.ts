import { auth } from '#pergel/changeName/lucia'

export default pergelChangeName().lucia().definePergelNitroMiddleware({
  lucia: auth,
})
