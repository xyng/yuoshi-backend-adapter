import * as qs from "querystring"

import type * as OAuthType from "oauth-1.0a"

import { createHmac } from "crypto"

import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { RequestAdapterConfiguration } from "../interfaces/RequestAdapterInterface"
import { AbstractRequestAdapter } from "./AbstractRequestAdapter"

const OAuth = require("oauth-1.0a")

interface Credentials {
	key: string
	secret: string
}

interface OAuthAppConfig {
	consumer: {
		key: string
		secret: string
	},
	endpoints: {
		request_token: string
		access_token: string
		authorize: string
		callback: string
	}
}
interface OAuthUserConfig {
	key: string
	secret: string
}

export class OAuth1AuthenticationHandler implements AuthenticationHandlerInterface {
	private oauth: OAuthType
	constructor(
		protected config: OAuthAppConfig,
		protected getUserConfig: () => OAuthUserConfig,
		oauthConfig: {
			signature_method: "PLAINTEXT" | "HMAC-SHA1"
			hash_function: (base_string: string, key: string) => string
		},
	) {
		this.oauth = new OAuth({
			consumer: {
				key: config.consumer.key,
				secret: config.consumer.secret,
			},
			signature_method: "HMAC-SHA1",
			hash_function: (base_string, key) => {
				return createHmac('sha1', key)
					.update(base_string)
					.digest('base64')
			},
			...oauthConfig,
		})
	}

	getAuthenticationForRequest<T>(
		method: string,
		action: string,
		config: RequestAdapterConfiguration<T>,
		data?: any
	): {
		data?: any;
		config?: RequestAdapterConfiguration<T>
	} {
		const userAuthInfo = this.getUserConfig()

		let paramString: string;

		const { params } = config
		if (params instanceof URLSearchParams) {
			paramString = params.toString()
		} else if (typeof params === "object") {
			paramString = Object.entries(params).reduce((acc, [ param, value ]) => {
				const pair = `${param}=${value}`
				return acc + (acc.length ? "&" : "") + pair
			}, "")
		}

		paramString = paramString ? `?${paramString}` : ""

		const { Authorization } = this.oauth.toHeader(
			this.oauth.authorize({
				url: `${action}${paramString}`,
				method,
				data,
			}, userAuthInfo)
		)

		return {
			config: {
				headers: {
					Authorization,
				}
			}
		}
	}

	async getRequestToken(
		requestAdapter: AbstractRequestAdapter<any, any>,
	): Promise<{
		oauth_callback_confirmed: string
		oauth_token: string
		oauth_token_secret: string
		xoauth_token_ttl: string
		url: string
	}> {
		const { Authorization } = this.oauth.toHeader(
			this.oauth.authorize({
				url: this.config.endpoints.request_token,
				method: "post",
			})
		)

		const { data } = await requestAdapter.post(this.config.endpoints.request_token, undefined, {
			headers: {
				Authorization
			}
		})

		const {
			oauth_callback_confirmed,
			oauth_token,
			oauth_token_secret,
			xoauth_token_ttl,
		} = qs.parse(data) as any

		const url = new URL(this.config.endpoints.authorize)
		url.searchParams.set("oauth_token", oauth_token)
		url.searchParams.set("oauth_callback", this.config.endpoints.callback)

		return {
			oauth_callback_confirmed: oauth_callback_confirmed,
			oauth_token: oauth_token,
			oauth_token_secret: oauth_token_secret,
			xoauth_token_ttl: xoauth_token_ttl,
			url: url.href,
		}
	}

	async exchangeTokens(
		requestAdapter: AbstractRequestAdapter<any, any>,
		temp_credentials: Credentials,
		oauth_verifier: string
	): Promise<{
		oauth_token: string
		oauth_token_secret: string
	}> {
		const { Authorization } = this.oauth.toHeader(
			this.oauth.authorize({
				url: this.config.endpoints.access_token,
				method: "post",
			}, temp_credentials)
		)

		const { data } = await requestAdapter.post(this.config.endpoints.access_token, undefined, {
			headers: {
				Authorization: `${Authorization}, oauth_verifier="${oauth_verifier}"`
			}
		})

		return qs.parse(data) as any
	}
}
