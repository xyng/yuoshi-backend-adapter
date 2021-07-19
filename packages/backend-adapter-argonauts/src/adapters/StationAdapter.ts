import { AsyncIterableWrapper, NSStationsAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

export default class StationsAdapter<RequestBackendConfigType> extends NSStationsAdapter.AbstractStationsAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
> {
	getStationsForPackage(package_id: string): Paginator<NSStationsAdapter.Station, any> {
		return new Paginator<NSStationsAdapter.Station, RequestBackendConfigType>(
			config => {
				return this.requestAdapter.getAuthorized(`/packages/${package_id}/stations`, config)
			},
			data => {
				return {
					id: data.id as string,
					title: data.attributes.title,
					slug: data.attributes.slug,
					description: data.attributes.description,
					tasks: this.backendAdapter.taskAdapter.getTasksForStation(data.id),
				}
			}
		)
	}
	getStationsForLearningObjective(learningObjective_id: string): Paginator<NSStationsAdapter.Station, any> {
		return new Paginator<NSStationsAdapter.Station, RequestBackendConfigType>(
			config => {
				return this.requestAdapter.getAuthorized(`/learning_objective/${learningObjective_id}`, config)
			},
			data => {
				return {
					id: data.id as string,
					title: data.attributes.title,
					slug: data.attributes.slug,
					description: data.attributes.description,
					tasks: this.backendAdapter.taskAdapter.getTasksForStation(data.id),
				}
			}
		)
	}
}
