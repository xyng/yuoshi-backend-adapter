import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { NSUserAdapter } from "./AbstractUserAdapter"
import { AbstractPaginator } from "./AbstractPaginator"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper"
import { NSPackageAdapter } from "./AbstractPackageAdapter"

export namespace NSCourseAdapter {
	import User = NSUserAdapter.User

	export interface Course<T = any> extends DefaultEntity<T> {
		title: string
		description?: string
		lecturers: AsyncIterableWrapper<NSUserAdapter.User>
		packages: AsyncIterableWrapper<NSPackageAdapter.Package>
	}

	export abstract class AbstractCourseAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getCourses(user_id: string): AbstractPaginator<Course, RequestConfigType>
		abstract getMemberships(course_id: string): AbstractPaginator<User, RequestConfigType>
	}
}
