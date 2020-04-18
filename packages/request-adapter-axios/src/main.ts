import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"
import {
	RequestError,
	NetworkError,
	RequestAdapterConfiguration,
	RequestResponseType, AbstractRequestAdapter, AuthenticationHandlerInterface,
} from "@xyng/yuoshi-backend-adapter"

import URLSearchParams from "@ungap/url-search-params/cjs"

type ConfigType = RequestAdapterConfiguration<AxiosRequestConfig>

export default class RequestAdapterAxios<AuthenticationHandler extends AuthenticationHandlerInterface>
	extends AbstractRequestAdapter<AxiosRequestConfig, AuthenticationHandler> {
	private instance: AxiosInstance

	constructor(
		authenticationHandler: AuthenticationHandler,
		config?: ConfigType
	) {
		super(authenticationHandler, config);

		this.instance = axios.create()
	}

	setBaseUrl(base: string): void {
		this.config.config = this.config.config || {}

		this.config.config.baseURL = base
	}

	private static makeAxiosConfig(
		config?: ConfigType
	): AxiosRequestConfig | undefined {
		if (!config) {
			return
		}

		const { config: axiosConfig = {} } = config

		let params: typeof axiosConfig.params
		if (config.params instanceof URLSearchParams) {
			params = {}

			config.params.forEach((val, key) => {
				params[key] = val
			})
		} else {
			params = {
				...config.params,
			}
		}

		return {
			...axiosConfig,
			headers: {
				...axiosConfig.headers,
				...config.headers,
			},
			params: {
				...axiosConfig.params,
				...params,
			},
			baseURL: config.base,
		}
	}

	protected async _handleRequest(
		type: "get" | "post" | "put" | "delete",
		action: string,
		data?: any,
		config?: ConfigType
	): Promise<RequestResponseType> {
		const reqConfig = {
			...RequestAdapterAxios.makeAxiosConfig(config),
			method: type,
			url: action,
			data,
		}

		try {
			return await this.instance.request(reqConfig)
		} catch (e) {
			if (!e.isAxiosError) {
				throw e
			}

			const { response, request } = e as AxiosError

			if (!response) {
				throw new NetworkError({
					headers: request.headers,
					params: request.params,
					data: request.data,
				}, e.message)
			}

			const { status, statusText } = response

			throw new RequestError(status, {
				base: reqConfig.baseURL,
				url: reqConfig.url,
				headers: request.headers || reqConfig.headers,
				params: request.params || reqConfig.params,
				data: request.data || reqConfig.data,
			}, {
				headers: response.headers,
				data: response.data,
				status: status,
				statusText: statusText,
			}, e.message)
		}
	}

	protected _mergeConfig(old?: AxiosRequestConfig, config?: AxiosRequestConfig): AxiosRequestConfig | undefined {
		return {
			...old,
			...config,
		};
	}
}
