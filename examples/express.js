const Webhook = require('../dist/commercelayer-webhooks.cjs')
const app = require('express')()

// Parse the body as a raw string when the content type is application/vnd.api+json
const middleware = require('body-parser').text({
  type: 'application/vnd.api+json',
})

// Use the middleware only for this route
app.post('/webhooks', middleware, async (req, res) => {
  const { topic, resource } = await Webhook.handle(req, process.env.WEBHOOK_SECRET)
  
  res.send({
    topic,
    resource,
  })
})

const server = app.listen(process.env.PORT)

module.exports = {
  start() {
    return Promise.resolve(server)
  },
  stop() {
    return Promise.resolve(server.close())
  }
}
