import AuthenticationHandlerInterface from "./AuthenticationHandlerInterface"

export interface RequestAdapterConfiguration<RequestBackendConfigType> {
	base?: string
	headers?: {
		[key: string]: string
	}
	params?:
		| {
				[key: string]: any
		  }
		| URLSearchParams
	auth?: boolean
	config?: RequestBackendConfigType
	responseType?: "blob" | undefined
}

export interface RequestType extends Omit<RequestAdapterConfiguration<never>, "auth"> {
	url?: string
	data?: any
}

export interface RequestResponseType {
	headers: any
	data: any
	status: number
	statusText: string
}

export class NetworkError extends Error {
	public name = "NetworkError"

	constructor(public request: RequestType, message?: string) {
		super(message);
	}
}

export class RequestError extends Error {
	public name = "RequestError"

	constructor(
		public status: number,
		public request: RequestType,
		public response: RequestResponseType,
		message?: string
	) {
		super(message)
	}
}

/**
 * RequestAdapter
 */
export interface RequestAdapterInterface<RequestBackendConfigType> {
	getDefaultRequestConfig(): Promise<
		RequestAdapterConfiguration<RequestBackendConfigType>
	>
	setDefaultRequestConfig(
		config: RequestAdapterConfiguration<RequestBackendConfigType>
	): void

	/**
	 * Set basepath for Adapter.
	 * All requests will be relative to this path
	 *
	 * @param base
	 */
	setBaseUrl(base: string): void

	/**
	 * GET-Request
	 *
	 * @param action
	 * @param config
	 *
	 * @throws RequestError if server response is an error response
	 */
	get(
		action: string,
		config?: RequestAdapterConfiguration<RequestBackendConfigType>
	): Promise<RequestResponseType>

	/**
	 * DELETE-Request
	 *
	 * @param action
	 * @param config
	 *
	 * @throws RequestError if server response is an error response
	 */
	delete(
		action: string,
		config?: RequestAdapterConfiguration<RequestBackendConfigType>
	): Promise<RequestResponseType>

	/**
	 * POST-Request
	 *
	 * @param action
	 * @param data
	 * @param config
	 *
	 * @throws RequestError if server response is an error response
	 */
	post(
		action: string,
		data: any,
		config?: RequestAdapterConfiguration<RequestBackendConfigType>
	): Promise<RequestResponseType>

	/**
	 * PUT-Request
	 *
	 * @param action
	 * @param data
	 * @param config
	 *
	 * @throws RequestError if server response is an error response
	 */
	put(
		action: string,
		data: any,
		config?: RequestAdapterConfiguration<RequestBackendConfigType>
	): Promise<RequestResponseType>
}

