export default eventHandler({
  onRequest: [
    changeNameLuciaRequest,
  ],
  handler: (event) => {
    return event.context.user || null
  },
})
