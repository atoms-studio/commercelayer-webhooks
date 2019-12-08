import { SIGNATURE_HEADER, TOPIC_HEADER, WebhookRequest, WebhookResult } from './interfaces'
import SignatureVerificationError from './SignatureVerificationError'
import { deserialize, parseRequest, verifySignature } from './utils'

const handle = async (request: WebhookRequest, secret: string = '', verify: boolean = true): Promise<WebhookResult> => {
  const { body, signature, topic } = parseRequest(request)

  if (verify && !verifySignature(secret, signature, body)) {
    throw new SignatureVerificationError(signature, body)
  }

  const resource = await deserialize(body)
  return {
    resource,
    topic,
  }
}

export {
  SignatureVerificationError,
  handle,
  verifySignature,
  SIGNATURE_HEADER,
  TOPIC_HEADER,
}
