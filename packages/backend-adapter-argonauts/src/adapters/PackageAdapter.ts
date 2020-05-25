import { AsyncIterableWrapper, NSPackageAdapter } from "@xyng/yuoshi-backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

export default class PackageAdapter<
	RequestBackendConfigType
> extends NSPackageAdapter.AbstractPackageAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getPackagesForCourse(course_id: string): Paginator<NSPackageAdapter.Package, any> {
		return new Paginator<NSPackageAdapter.Package, RequestBackendConfigType>(
    		config => {
				return this.requestAdapter.getAuthorized(`/courses/${course_id}/packages`, config)
			},
			(data) => {
    			return {
    				id: data.id as string,
					title: data.attributes.title,
					slug: data.attributes.slug,
					playable: data.attributes.playable,
					description: data.attributes.description,
					tasks: this.backendAdapter.taskAdapter
						.getTasksForPackage(data.id)
				}
			}
		);
	}
}
