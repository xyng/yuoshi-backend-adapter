import {
	AbstractRequestAdapter,
	NSCourseAdapter,
	NSUserAdapter,
	AsyncIterableWrapper
} from "@xyng/backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import UserAdapter from "./UserAdapter"

import Course = NSCourseAdapter.Course
import User = NSUserAdapter.User
import BackendAdapter from "../BackendAdapter"

type Membership = User<{
	permission: "dozent" | "tutor" | "autor"
	group: number
	date: Date
}>

const getLecturersForCourse = (courseAdapter: CourseAdapter<any>, userAdapter: UserAdapter<any>) => async (course_id: string): Promise<AsyncIterableWrapper<NSUserAdapter.User>> => {
	const iterator = AsyncIterableWrapper.fromAsyncIterable(courseAdapter.getMemberships(course_id));

	return iterator.filter((item) => {
		return item.misc.permission === "dozent"
	})
}

export const mapCourseData = (courseAdapter: CourseAdapter<any>, userAdapter: UserAdapter<any>) => {
	const getLecturers = getLecturersForCourse(courseAdapter, userAdapter)
	return async (data: any): Promise<NSCourseAdapter.Course> => {
		return {
			id: data.id,
			title: data.attributes.title,
			description: data.attributes.description,
			lecturers: await getLecturers(data.id)
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
			mapCourseData(this, this.backendAdapter.userAdapter)
		)
	}

	getMemberships(course_id: string): Paginator<Membership, RequestBackendConfigType> {
		return new Paginator<Membership, RequestBackendConfigType>(
    		config => {
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
