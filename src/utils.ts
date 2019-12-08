import { createHmac } from 'crypto'
import { Deserializer } from 'jsonapi-serializer'
import {
  CommerceLayerResource,
  SIGNATURE_HEADER,
  TOPIC_HEADER,
  WebhookArguments,
  WebhookHeaders,
  WebhookRequest,
} from './interfaces'

/**
 * Parse the request, returning body, signature and topic
 * @param request
 */
export const parseRequest = (request: WebhookRequest): WebhookArguments => {
  const headers = getHeaders(request)

  return {
    body: getBody(request) || '',
    signature: headers[SIGNATURE_HEADER] || '',
    topic: headers[TOPIC_HEADER] || '',
  }
}

/**
 * Find the request headers based on the request type
 * @param request
 * @returns Headers of the request
 */
export const getHeaders = (request: WebhookRequest): WebhookHeaders => {
  return request.headers || {}
}

/**
 * Get the request body
 * @param request
 */
export const getBody = (request: WebhookRequest): string => {
  if ('payload' in request) { // Hapi
    return request.payload
  } else if ('rawBody' in request) { // Koa, Azure request
    return request.rawBody
  } else if ('body' in request) { // Express, Restify, Fastify, AWS Lambda, Google Cloud
    return request.body
  }

  return ''
}

/**
 * Deserialize a JSON:API payload
 * @param payload The payload sent by the webhook
 */
export const deserialize = (
  payload: string | { [key: string]: any },
): Promise<CommerceLayerResource|CommerceLayerResource[]> => {
  const deserializer = new Deserializer({
    keyForAttribute: 'camelCase',
  })

  let json = payload
  if (typeof payload === 'string') {
    json = JSON.parse(payload)
  }

  return deserializer.deserialize(json)
}

/**
 * Verify the signature sent by the webhook
 * @param secret The secret used to generate the signature
 * @param signature The signature sent by the webhook
 * @param message The message sent by the webhook
 */
export const verifySignature = (secret: string, signature: string, message: string): boolean => {
  return createHmac('sha256', secret).update(message).digest('base64') === signature
}
