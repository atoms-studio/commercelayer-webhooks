# Commerce Layer webhooks
Verify and parse Commerce Layer webhooks.

## Installation

```bash
npm i commercelayer-webhooks
```
```bash
yarn add commercelayer-webhooks
```

## Usage
Pass the request object along with the secret key provided by the Commerce Layer webhook interface.

```js
const Webhook = require('commercelayer-webhooks')

/**
 * AWS Lambda / Netlify function
 */
module.exports = async function(event, context) {
  const { topic, resource } = await Webhook.handle(event, 'webhook secret')
  // ...handle topic and resource
}

/**
 * Express
 */
app.get('/webhooks', async (req, res) => {
  const { topic, resource } = await Webhook.handle(req, 'webhook secret')
  // ...handle topic and resource
})
```
For more examples with different frameworks, check out the [examples folder](https://github.com/atoms-studio/commercelayer-webhooks/tree/master/examples)

## Signature verification
Signature verification is enabled by default and a `SignatureVerificationError` will be thrown if the verification process fails.
You can catch the error to handle the failure manually.
```js
const Webhook = require('commercelayer-webhooks')

module.exports = async function(event, context) {

  try {
    const { topic, resource } = await Webhook.handle(event, 'webhook secret')
    // ...handle topic and resource
  } catch ((err) => {
    if (error instanceof Webhook.SignatureVerificationError) {
      return {
        status: 400,
        body: error.message,
      }
    }

    // Throw the error again if not a SignatureVerificationError
    throw err
  })
}
```

### Skipping signature verification
You can skip signature verification by passing a third argument as `false` to the handler.

```js
const Webhook = require('commercelayer-webhooks')

module.exports = async function(event, context) {

  const { topic, resource } = await Webhook.handle(event, 'webhook secret', false)
  // ...handle topic and resource
}
```

## API

#### Webhook.handle(request, secret, verify = true)

| Argument | Type    | Description                                                                                                                                                                                                                   |   |   |
|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| request  | Object  | The request object that contains the webhook information. It needs to have a `headers` property containing all the request headers, and at least one of `body`, `rawBody` or `payload` properties containing the webhook payload __as string__. |   |   |
| secret   | String  | The webhook secret found in the Commerce Layer webhook interface.                                                                                                                                                             |   |   |
| verify   | Boolean | Enable or disable signature verification. Defaults to `true`.

The function returns a promise that resolves with the following object:

```js
{
  topic: 'topic sent by the webhook',
  resource: {
    // An object representing a Commerce Layer resource. 
    // The object properties depend on the topic received
  }
}
```

----

#### Webhook.SignatureVerificationError

This is the error thrown when the signature verification fails. It contains the following properties:

| Name      | Type   | Description                                                    |   |   |
|-----------|--------|----------------------------------------------------------------|---|---|
| message   | String | The standard error messsage. It is always "Signature mismatch" |   |   |
| signature | String | The signature sent by the webhook.                             |   |   |
| body      | String | The body sent by the webhook.                                  |   |   |

# Contributing

Please read [CONTRIBUTING.md](https://github.com/atoms-studio/commercelayer-webhooks/blob/master/CONTRIBUTING.md)

# License

[MIT](https://github.com/atoms-studio/commercelayer-webhooks/blob/master/LICENSE)

