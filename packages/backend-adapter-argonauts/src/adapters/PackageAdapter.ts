import { AsyncIterableWrapper, NSPackageAdapter } from "@xyng/backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

export default class PackageAdapter<
	RequestBackendConfigType
> extends NSPackageAdapter.AbstractPackageAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getPackagesForCourse(course_id: string): Paginator<NSPackageAdapter.Package, any> {
		return new Paginator<NSPackageAdapter.Package, RequestBackendConfigType>(
    		config => {
				return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/courses/${course_id}/packages`, config)
			},
			(data) => {
    			return {
    				id: data.id as string,
					title: data.attributes.title as string,
					description: data.attributes.description as string | undefined,
					tasks: AsyncIterableWrapper.fromAsyncIterable(this.backendAdapter.taskAdapter.getTasksForPackage(data.id))
				}
			}
		);
	}
}
