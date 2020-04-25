import { AbstractRequestAdapter } from "./AbstractRequestAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { BackendAdapterInterface } from "../interfaces/BackendAdapterInterface"

export interface DefaultEntity<T = any> {
	id: string
	misc?: T
}

export class DefaultYuoshiAdapter<
	RequestConfigType,
	AuthenticationHandler extends AuthenticationHandlerInterface
> {
	constructor(
		protected readonly requestAdapter: AbstractRequestAdapter<
			RequestConfigType,
			AuthenticationHandler
		>,
		protected readonly backendAdapter: BackendAdapterInterface<
			RequestConfigType,
			AuthenticationHandler
		>
	) {}
}
