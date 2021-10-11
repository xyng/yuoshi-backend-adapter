import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { AbstractPaginator } from "./AbstractPaginator"
import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"

export namespace NSFilesAdapter {
	export interface StudipFile<T = any> {
		id: string
		mime_type: string
		name: string
		user_id: string
	}

	export abstract class AbstractFilesAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getFileById(file_id: string): Promise<StudipFile | any>
	}
}
