import { DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"

export namespace NSFileAdapter {
	export abstract class AbstractFileAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getFile(file_id: string): Promise<string>
	}
}
