import { OAuth1AuthenticationHandler } from "@xyng/yuoshi-backend-adapter"

export class StudipOauthAuthenticationHandler extends OAuth1AuthenticationHandler {
	constructor(
		protected config: ConstructorParameters<typeof OAuth1AuthenticationHandler>[0],
		protected getUserConfig: ConstructorParameters<typeof OAuth1AuthenticationHandler>[1]
	) {
		super(
			config,
			getUserConfig,
			// studip's oauth implementation has problems with nested query-params
			// which again are required for pagination in its api-plugin
			// these problems do not occur when using the plaintext method
			// we should change this as soon as studip can handle nested params
			// while using hmac_sha1 or better.
			{
				signature_method: "PLAINTEXT",
				hash_function: (base_string, key) => key
			}
		)
	}
}
