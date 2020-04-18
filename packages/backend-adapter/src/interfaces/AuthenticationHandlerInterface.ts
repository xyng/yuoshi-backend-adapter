import { RequestAdapterConfiguration } from "./RequestAdapterInterface"

export default interface AuthenticationHandlerInterface {
	/**
	 * Create authenticated body or headers for given request
	 *
	 * @param method
	 * @param action
	 * @param config
	 * @param data
	 */
	getAuthenticationForRequest<T>(method: string, action: string, config: RequestAdapterConfiguration<T>, data?: any): {
		data?: any
		config?: RequestAdapterConfiguration<T>
	}
}
