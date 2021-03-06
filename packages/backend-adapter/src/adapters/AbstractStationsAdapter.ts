import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { AbstractPaginator } from "./AbstractPaginator"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper"
import { NSTaskAdapter } from "./AbstractTaskAdapter"

export namespace NSStationsAdapter {
	export interface Station<T = any> extends DefaultEntity<T> {
		title: string
		slug: string
		description?: string
		tasks: AsyncIterableWrapper<NSTaskAdapter.TaskTypeMap>
	}
	export abstract class AbstractStationsAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getStationsForPackage(package_id: string): AbstractPaginator<Station, any>
		abstract getStationsForLearningObjective(learningObjective_id: string): AbstractPaginator<Station, any>
	}
}
