import { createHmac } from 'crypto'
import { Server } from 'http'
import { Serializer } from 'jsonapi-serializer'
import { SIGNATURE_HEADER, TOPIC_HEADER } from '../src/interfaces'
import WebhookPayload from './e2e/payload'
const fetch = require('node-fetch')

export const topic = 'orders.place'

export const createSignature = (secret: string, message: string) => {
  return createHmac('sha256', secret).update(message).digest('base64')
}

export const createMessage = (message: {[key: string]: any}) => {
  const DataSerializer = new Serializer('data', {
    attributes: ['title', 'subTitle'],
    keyForAttribute: 'camelCase',
  })

  return DataSerializer.serialize(message)
}

export const closeConnection = (server: Server) => {
  return new Promise((resolve) => {
    server.close()

    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export const sendWebhook = () => {
  const body = getWebhookBody()

  return fetch(`http://localhost:${process.env.PORT}/webhooks`, {
    body,
    headers: {
      [SIGNATURE_HEADER]: createSignature(process.env.WEBHOOK_SECRET, body),
      [TOPIC_HEADER]: topic,
      'Content-Type': 'application/vnd.api+json',
    },
    method: 'POST',
  }).then((res: any) => res.json())
}

const getWebhookBody = (): string => {
  return JSON.stringify(WebhookPayload)
}
