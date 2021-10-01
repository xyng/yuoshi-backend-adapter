import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"

export namespace NSFilesAdapter {
	export interface File<T = any> extends DefaultEntity<T> {
		id: string
		mime_type: string
		name: string
		user_id: string
	}

	export abstract class AbstractFilesAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getFileById(file_id: string): Promise<File | any>
	}
}
