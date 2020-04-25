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
	getAuthenticationForRequest<Config, Data, ExtendedData extends Data>(method: string, action: string, config: RequestAdapterConfiguration<Config>, data?: Data): {
		data?: ExtendedData,
		config?: RequestAdapterConfiguration<Config>
	}
}
