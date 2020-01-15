import {
	RequestAdapterConfiguration,
	RequestAdapterInterface,
	RequestResponseType
} from "../interfaces/RequestAdapterInterface"

import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"

type ValidRequestTypes = "get" | "post" | "put" | "delete"

export abstract class AbstractRequestAdapter<T, AuthenticationHandler extends AuthenticationHandlerInterface> implements RequestAdapterInterface<T> {
	abstract setBaseUrl(base: string): void

	protected abstract _handleRequest(
		type: ValidRequestTypes,
		action: string,
		data?: any,
		config?: RequestAdapterConfiguration<T>
	): Promise<RequestResponseType>
	protected abstract _mergeConfig(old?: T, config?: T): T | undefined

	protected constructor(
		protected authenticationHandler: AuthenticationHandler,
		protected config: RequestAdapterConfiguration<T> = {}
	) {}

	mergeConfig(
		old: RequestAdapterConfiguration<T>,
		config?: RequestAdapterConfiguration<T>
	): RequestAdapterConfiguration<T> {
		if (!config) {
			return old
		}

		return {
			...old,
			...config,
			auth: config.auth === undefined ? old.auth : config.auth,
			base: config.base || old.base,
			config: this._mergeConfig(old.config, config.config),
			headers: {
				...old.headers,
				...config.headers,
			},
			params: {
				...old.params,
				...config.params,
			},
		}
	}

	setDefaultRequestConfig(config: RequestAdapterConfiguration<T>): void {
		this.config = this.mergeConfig(this.config, config)
	}
	getDefaultRequestConfig(): Promise<RequestAdapterConfiguration<T>> {
		// TODO: is a deep clone necessary?
		return Promise.resolve(this.config)
	}

	handleRequest(
		type: ValidRequestTypes,
		action: string,
		config?: RequestAdapterConfiguration<T>,
		data?: any
	): Promise<RequestResponseType> {
		config = this.mergeConfig(this.config, config)

		if (!config.auth) {
			return this._handleRequest(type, action, data, config)
		}

		// prepend baseurl if action is relative
		// use url helper otherwise
		const url = action.match(/^http(s)?:\/\//) ?
			new URL(action, config.base).href
			: `${config.base || ""}/${action}`

		const {
			data: authenticatedData,
			config: authenticatedConfig
		} = this.authenticationHandler.getAuthenticationForRequest(type, url, data)

		config = this.mergeConfig(config, authenticatedConfig)

		return this._handleRequest(type, action, authenticatedData || data, config)
	}

	handleRequestAuthorized(
		type: ValidRequestTypes,
		action: string,
		config?: RequestAdapterConfiguration<T>,
		data?: any
	) {
		return this.handleRequest(
			type,
			action,
			{
				...config,
				auth: true,
			},
			data
		)
	}

	delete(action: string, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequest("delete", action, config);
	}

	deleteAuthorized(action: string, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequestAuthorized("delete", action, config);
	}

	get(action: string, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequest("get", action, config);
	}

	getAuthorized(action: string, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequestAuthorized("get", action, config);
	}

	post(action: string, data: any, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequest("post", action, config, data);
	}

	postAuthorized(action: string, data: any, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequestAuthorized("post", action, config, data);
	}

	put(action: string, data: any, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequest("put", action, config, data);
	}

	putAuthorized(action: string, data: any, config?: RequestAdapterConfiguration<T>): Promise<RequestResponseType> {
		return this.handleRequestAuthorized("put", action, config, data);
	}
}
