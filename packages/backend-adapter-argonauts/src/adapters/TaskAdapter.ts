import { AsyncIterableWrapper, NSTaskAdapter } from "@xyng/backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

export default class TaskAdapter<
	RequestBackendConfigType
> extends NSTaskAdapter.AbstractTaskAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getTasksForPackage(package_id: string, sequence?: number): Paginator<NSTaskAdapter.Task, any> {
		return new Paginator<NSTaskAdapter.Task, any>((config) => {
			config = this.requestAdapter.mergeConfig(config, {
				params: {
					"filter[sequence]": sequence
				}
			})

			return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/packages/${package_id}/tasks`, config)
		}, (data): NSTaskAdapter.Task => {
			return {
				id: data.id,
				title: data.attributes.title,
				description: data.attributes.description,
				image: data.attributes.image,
				type: data.attributes.kind,
				isTraining: data.attributes.is_training,
				credits: data.attributes.credits,
				contents: AsyncIterableWrapper.fromAsyncIterable(this.backendAdapter.taskContentAdapter.getContentsForTask(data.id))
			}
		});
	}
}
