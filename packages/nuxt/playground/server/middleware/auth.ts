import { auth } from '#pergel/test/lucia'

export default pergelTest().lucia().definePergelNitroMiddleware({
  lucia: auth,
})
