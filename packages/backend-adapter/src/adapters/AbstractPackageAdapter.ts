import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { NSUserAdapter } from "./AbstractUserAdapter"
import { AbstractPaginator } from "./AbstractPaginator"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper"
import { NSStationsAdapter } from "./AbstractStationsAdapter"

export namespace NSPackageAdapter {
	export interface Package<T = any> extends DefaultEntity<T> {
		title: string
		slug: string
		playable: boolean
		description?: string
		stations: AsyncIterableWrapper<NSStationsAdapter.Station>
	}

	export abstract class AbstractPackageAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getPackagesForCourse(course_id: string): AbstractPaginator<Package, any>
	}
}
