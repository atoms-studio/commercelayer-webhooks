const path = require('path')
import { sendWebhook, topic } from '../helpers'
import WebhookPayload from './payload'
import ServerlessRuntime from './serverless-runner'

const examples: any = [
  ['express.js'],
  ['fastify.js'],
  ['aws-lambda.js'],
]

const serverless = [
  'aws-lambda.js',
  'azure-function.js',
]

describe('e2e', () => {

  test.each(examples)('%p', async (exampleName: string) => {
    const module = path.resolve(__dirname, '..', '..', 'examples', exampleName)
    const example = require(module)
    const isServerless = serverless.includes(exampleName)

    if (isServerless) {
      ServerlessRuntime.setHandler(example)
      await ServerlessRuntime.start()
    } else {
      await example.start()
    }

    const response = await sendWebhook()

    expect(response.topic).toBe(topic)
    expect(response.resource).toHaveProperty('id')
    expect(response.resource).toHaveProperty('shippingAddress')
    expect(response.resource).toHaveProperty('billingAddress')
    expect(response.resource).toHaveProperty('lineItems')
    expect(response.resource.id).toBe(WebhookPayload.data.id)
    expect(response.resource.shippingAddress.name).toBe(WebhookPayload.included[0].attributes.name)
    expect(response.resource.billingAddress.name).toBe(WebhookPayload.included[1].attributes.name)
    expect(response.resource.lineItems.length).toBe(
      WebhookPayload.included
        .filter((included) => included.type === 'line_items').length,
    )

    if (isServerless) {
      await ServerlessRuntime.stop()
    } else {
      await example.stop()
    }
  }, 10000)

})
