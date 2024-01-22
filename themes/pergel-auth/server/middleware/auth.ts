import { auth } from '#changeName/lucia'

export default pergelChangeName().lucia().definePergelNitroMiddleware({
  lucia: auth,
})
