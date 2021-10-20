import { AsyncIterableWrapper, NSLearningObjectiveAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

export default class LearningObjectiveAdapter<
	RequestBackendConfigType
	> extends NSLearningObjectiveAdapter.AbstractLearningObjectiveAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
	> {
	getLearningObjectivesForPackage(package_id: string): Paginator<NSLearningObjectiveAdapter.LearningObjective, any> {
		return new Paginator<NSLearningObjectiveAdapter.LearningObjective, RequestBackendConfigType>(
			config => {
				return this.requestAdapter.getAuthorized(`/learning_objectives_packages/${package_id}`, config)
			},
			data => {
				return {
					id: data.id as string,
					title: data.attributes.title,
					description: data.attributes.description,
					image: data.attributes.image as string,
				}
			}
		)
	}
}
