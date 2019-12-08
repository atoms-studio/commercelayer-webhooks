import { handle, SIGNATURE_HEADER, SignatureVerificationError, TOPIC_HEADER } from '../../src/index'
import { WebhookRequest } from '../../src/interfaces'
import { createMessage, createSignature } from '../helpers'

describe('index', () => {

  test('handle webhook with invalid signature', async () => {
    const secret = 'secret'
    const message = JSON.stringify(await createMessage({
      subTitle: 'Subtitle04',
      title: 'Title01',
    }))

    const signature = createSignature(secret, message)
    const topic = 'topic'

    const req: WebhookRequest = {
      body: message,
      headers: {
        [SIGNATURE_HEADER]: signature,
        [TOPIC_HEADER]: topic,
      },
    }

    await expect(handle(req, 'bad secret')).rejects.toThrow(SignatureVerificationError)
  })

  test('handle webhook without validating signature', async () => {
    const secret = 'secret'
    const message = JSON.stringify(await createMessage({
      subTitle: 'Subtitle04',
      title: 'Title01',
    }))

    const signature = createSignature(secret, message)
    const topic = 'topic'

    const req: WebhookRequest = {
      body: message,
      headers: {
        [SIGNATURE_HEADER]: signature,
        [TOPIC_HEADER]: topic,
      },
    }

    const result = await handle(req, 'bad secret', false)
    expect(result).toHaveProperty('resource')
    expect(result).toHaveProperty('topic')
    expect(result.resource).toHaveProperty('title')
    expect(result.resource).toHaveProperty('subTitle')
    expect(result.topic).toBe(topic)
  })

  test('handle webhook validating signature', async () => {
    const secret = 'secret'
    const message = JSON.stringify(await createMessage({
      subTitle: 'Subtitle04',
      title: 'Title01',
    }))

    const signature = createSignature(secret, message)
    const topic = 'topic'

    const req: WebhookRequest = {
      body: message,
      headers: {
        [SIGNATURE_HEADER]: signature,
        [TOPIC_HEADER]: topic,
      },
    }

    const result = await handle(req, secret)
    expect(result).toHaveProperty('resource')
    expect(result).toHaveProperty('topic')
    expect(result.resource).toHaveProperty('title')
    expect(result.resource).toHaveProperty('subTitle')
    expect(result.topic).toBe(topic)
  })

  test('handle webhook with message on payload property', async () => {
    const secret = 'secret'
    const message = JSON.stringify(await createMessage({
      subTitle: 'Subtitle04',
      title: 'Title01',
    }))

    const signature = createSignature(secret, message)
    const topic = 'topic'

    const req: WebhookRequest = {
      headers: {
        [SIGNATURE_HEADER]: signature,
        [TOPIC_HEADER]: topic,
      },
      payload: message,
    }

    const result = await handle(req, secret)
    expect(result).toHaveProperty('resource')
    expect(result).toHaveProperty('topic')
    expect(result.resource).toHaveProperty('title')
    expect(result.resource).toHaveProperty('subTitle')
    expect(result.topic).toBe(topic)
  })

  test('handle webhook with message on rawBody property', async () => {
    const secret = 'secret'
    const message = JSON.stringify(await createMessage({
      subTitle: 'Subtitle04',
      title: 'Title01',
    }))

    const signature = createSignature(secret, message)
    const topic = 'topic'

    const req: WebhookRequest = {
      headers: {
        [SIGNATURE_HEADER]: signature,
        [TOPIC_HEADER]: topic,
      },
      rawBody: message,
    }

    const result = await handle(req, secret)
    expect(result).toHaveProperty('resource')
    expect(result).toHaveProperty('topic')
    expect(result.resource).toHaveProperty('title')
    expect(result.resource).toHaveProperty('subTitle')
    expect(result.topic).toBe(topic)
  })

  test('prioritizes message on rawBody than body', async () => {
    const secret = 'secret'
    const message = JSON.stringify(await createMessage({
      subTitle: 'Subtitle04',
      title: 'Title01',
    }))

    const signature = createSignature(secret, message)
    const topic = 'topic'

    const req: WebhookRequest = {
      body: {
        asd: 'asd',
      },
      headers: {
        [SIGNATURE_HEADER]: signature,
        [TOPIC_HEADER]: topic,
      },
      rawBody: message,
    }

    const result = await handle(req, secret)
    expect(result).toHaveProperty('resource')
    expect(result).toHaveProperty('topic')
    expect(result.resource).toHaveProperty('title')
    expect(result.resource).toHaveProperty('subTitle')
    expect(result.topic).toBe(topic)
  })

})
