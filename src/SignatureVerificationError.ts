/**
 * Handle invalid signatures errors
 *
 */
export default class SignatureVerificationError extends Error {
  /**
   * Signature sent by the webhook
   */
  public signature: string = ''

  /**
   * Webhook body sent by the webhook
   */
  public body: string = ''

  /**
   * VerificationError constructor
   * @param signature
   * @param body
   */
  constructor(signature: string, body: string) {
    super('Signature mismatch')
    Object.setPrototypeOf(this, SignatureVerificationError.prototype)

    this.signature = signature
    this.body = body
  }

}
