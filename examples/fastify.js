const fastify = require('fastify')()
const Webhook = require('../dist/commercelayer-webhooks.cjs')

fastify.addContentTypeParser(
  'application/vnd.api+json',
  { parseAs: 'string' },
  function (req, body, done) {
    done(null, body)
  }
)

fastify.post('/webhooks', async (req, reply) => {
  const { topic, resource } = await Webhook.handle(req, process.env.WEBHOOK_SECRET)
  
  return {
    topic,
    resource,
  }
})

module.exports = {
  start() {
    return fastify.listen(process.env.PORT)
  },
  stop() {
    return fastify.close()
  }
}
