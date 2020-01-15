import { RequestAdapterConfiguration } from "./RequestAdapterInterface"

export default interface AuthenticationHandlerInterface {
	/**
	 * Create authenticated body or headers for given request
	 *
	 * @param method
	 * @param action
	 * @param data
	 */
	getAuthenticationForRequest(method: string, action: string, data?: any): {
		data?: any
		config?: RequestAdapterConfiguration<never>
	}
}
