import { createHmac } from 'crypto';
import { Deserializer } from 'jsonapi-serializer';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const SIGNATURE_HEADER = 'x-commercelayer-signature';
const TOPIC_HEADER = 'x-commercelayer-topic';

/**
 * Handle invalid signatures errors
 *
 */
class SignatureVerificationError extends Error {
    /**
     * VerificationError constructor
     * @param signature
     * @param body
     */
    constructor(signature, body) {
        super('Signature mismatch');
        /**
         * Signature sent by the webhook
         */
        this.signature = '';
        /**
         * Webhook body sent by the webhook
         */
        this.body = '';
        Object.setPrototypeOf(this, SignatureVerificationError.prototype);
        this.signature = signature;
        this.body = body;
    }
}

/**
 * Parse the request, returning body, signature and topic
 * @param request
 */
const parseRequest = (request) => {
    const headers = getHeaders(request);
    return {
        body: getBody(request) || '',
        signature: headers[SIGNATURE_HEADER] || '',
        topic: headers[TOPIC_HEADER] || '',
    };
};
/**
 * Find the request headers based on the request type
 * @param request
 * @returns Headers of the request
 */
const getHeaders = (request) => {
    return request.headers || {};
};
/**
 * Get the request body
 * @param request
 */
const getBody = (request) => {
    if ('payload' in request) { // Hapi
        return request.payload;
    }
    else if ('rawBody' in request) { // Koa, Azure request
        return request.rawBody;
    }
    else if ('body' in request) { // Express, Restify, Fastify, AWS Lambda, Google Cloud
        return request.body;
    }
    return '';
};
/**
 * Deserialize a JSON:API payload
 * @param payload The payload sent by the webhook
 */
const deserialize = (payload) => {
    const deserializer = new Deserializer({
        keyForAttribute: 'camelCase',
    });
    let json = payload;
    if (typeof payload === 'string') {
        json = JSON.parse(payload);
    }
    return deserializer.deserialize(json);
};
/**
 * Verify the signature sent by the webhook
 * @param secret The secret used to generate the signature
 * @param signature The signature sent by the webhook
 * @param message The message sent by the webhook
 */
const verifySignature = (secret, signature, message) => {
    return createHmac('sha256', secret).update(message).digest('base64') === signature;
};

const handle = (request, secret = '', verify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, signature, topic } = parseRequest(request);
    if (verify && !verifySignature(secret, signature, body)) {
        throw new SignatureVerificationError(signature, body);
    }
    const resource = yield deserialize(body);
    return {
        resource,
        topic,
    };
});

export { SIGNATURE_HEADER, SignatureVerificationError, TOPIC_HEADER, handle, verifySignature };
