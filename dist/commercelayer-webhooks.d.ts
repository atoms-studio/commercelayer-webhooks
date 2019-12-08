declare module 'SignatureVerificationError' {
	/**
	 * Handle invalid signatures errors
	 *
	 */
	export default class SignatureVerificationError extends Error {
	    /**
	     * Signature sent by the webhook
	     */
	    signature: string;
	    /**
	     * Webhook body sent by the webhook
	     */
	    body: string;
	    /**
	     * VerificationError constructor
	     * @param signature
	     * @param body
	     */
	    constructor(signature: string, body: string);
	}

}
declare module 'interfaces' {
	export const SIGNATURE_HEADER = "x-commercelayer-signature";
	export const TOPIC_HEADER = "x-commercelayer-topic";
	export interface WebhookHeaders {
	    [key: string]: string;
	}
	export interface WebhookRequest {
	    headers: WebhookHeaders;
	    body?: any;
	    rawBody?: any;
	    payload?: any;
	}
	export interface WebhookArguments {
	    signature: string;
	    topic: string;
	    body: string;
	}
	export interface CommerceLayerResource {
	    [key: string]: any;
	}
	export interface WebhookResult {
	    resource: CommerceLayerResource | CommerceLayerResource[];
	    topic: string;
	}

}
declare module 'utils' {
	import { CommerceLayerResource, WebhookArguments, WebhookHeaders, WebhookRequest } from 'interfaces';
	/**
	 * Parse the request, returning body, signature and topic
	 * @param request
	 */
	export const parseRequest: (request: WebhookRequest) => WebhookArguments;
	/**
	 * Find the request headers based on the request type
	 * @param request
	 * @returns Headers of the request
	 */
	export const getHeaders: (request: WebhookRequest) => WebhookHeaders;
	/**
	 * Get the request body
	 * @param request
	 */
	export const getBody: (request: WebhookRequest) => string;
	/**
	 * Deserialize a JSON:API payload
	 * @param payload The payload sent by the webhook
	 */
	export const deserialize: (payload: string | {
	    [key: string]: any;
	}) => Promise<CommerceLayerResource | CommerceLayerResource[]>;
	/**
	 * Verify the signature sent by the webhook
	 * @param secret The secret used to generate the signature
	 * @param signature The signature sent by the webhook
	 * @param message The message sent by the webhook
	 */
	export const verifySignature: (secret: string, signature: string, message: string) => boolean;

}
declare module 'index' {
	import { SIGNATURE_HEADER, TOPIC_HEADER, WebhookRequest, WebhookResult } from 'interfaces';
	import SignatureVerificationError from 'SignatureVerificationError';
	import { verifySignature } from 'utils'; const handle: (request: WebhookRequest, secret?: string, verify?: boolean) => Promise<WebhookResult>;
	export { SignatureVerificationError, handle, verifySignature, SIGNATURE_HEADER, TOPIC_HEADER, };

}
