import { auth } from '#test/lucia'

export default pergelTest().lucia().definePergelNitroMiddleware({
  lucia: auth,
})
