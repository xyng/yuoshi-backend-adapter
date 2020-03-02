import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { NSUserAdapter } from "./AbstractUserAdapter"
import { AbstractPaginator } from "./AbstractPaginator"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper";
import { NSTaskContentAdapter } from "./AbstractTaskContentAdapter"

export namespace NSTaskAdapter {
	import User = NSUserAdapter.User

	export interface Task<T = any> extends DefaultEntity<T> {
		title: string
		description?: string
		image?: string
		type: string
		isTraining: boolean
		credits?: number
		contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>
	}

	export abstract class AbstractTaskAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getTasksForPackage(package_id: string, sequence?: number): AbstractPaginator<Task, any>
	}
}
