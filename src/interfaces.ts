export const SIGNATURE_HEADER = 'x-commercelayer-signature'
export const TOPIC_HEADER = 'x-commercelayer-topic'

export interface WebhookHeaders {
  [key: string]: string
}

export interface WebhookRequest {
  headers: WebhookHeaders,
  body?: any,
  rawBody?: any,
  payload?: any,
}

export interface WebhookArguments {
  signature: string,
  topic: string,
  body: string,
}

export interface CommerceLayerResource {
  [key: string]: any,
}

export interface WebhookResult {
  resource: CommerceLayerResource | CommerceLayerResource[],
  topic: string,
}
