const Webhook = require('../dist/commercelayer-webhooks.cjs')

module.exports = async function(event, context) {
  const { topic, resource } = await Webhook.handle(event, process.env.WEBHOOK_SECRET)
  
  return {
    topic,
    resource,
  }
}
