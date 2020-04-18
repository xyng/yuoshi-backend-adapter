import {
	AbstractRequestAdapter,
	NSCourseAdapter,
	NSUserAdapter,
	AsyncIterableWrapper, BackendAdapterInterface,
} from "@xyng/yuoshi-backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import Course = NSCourseAdapter.Course
import User = NSUserAdapter.User
import BackendAdapter from "../BackendAdapter"

type Membership = User<{
	permission: "dozent" | "tutor" | "autor"
	group: number
	date: Date
}>

export const mapCourseData = (backendAdapter: BackendAdapter<any>) => {
	return async (data: any): Promise<NSCourseAdapter.Course> => {
		return {
			id: data.id,
			title: data.attributes.title,
			description: data.attributes.description,
			lecturers: await backendAdapter.courseAdapter
				.getMemberships(data.id, "dozent")
				.getWrapped(),
			packages: await backendAdapter.packageAdapter
				.getPackagesForCourse(data.id)
				.getWrapped()
		}
	}
}

export default class CourseAdapter<
	RequestBackendConfigType
> extends NSCourseAdapter.AbstractCourseAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getCourses(user_id: string): Paginator<Course, RequestBackendConfigType> {
    	return new Paginator<Course, RequestBackendConfigType>(
    		config => {
    			return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/users/${user_id}/courses`, config)
			},
			mapCourseData(this.backendAdapter as BackendAdapter<RequestBackendConfigType>)
		)
	}

	getMemberships(course_id: string, permission?: string): Paginator<Membership, RequestBackendConfigType> {
		return new Paginator<Membership, RequestBackendConfigType>(
    		config => {
    			if (permission) {
    				config = this.requestAdapter.mergeConfig(config, {
						params: {
							filter: {
								permission
							}
						}
					})
				}

    			return this.requestAdapter.getAuthorized(
    				`plugins.php/argonautsplugin/courses/${course_id}/memberships`,
					config
				)
			},
			async (membership): Promise<Membership> => {
    			return {
    				...(await this.backendAdapter.userAdapter.getInfo(membership.relationships.user.data.id)),
					misc: {
    					permission: membership.attributes.permission,
						group: membership.attributes.group,
						date: new Date(membership.attributes.date),
					}
				}
			}
		)
	}
}
