import { AsyncIterableWrapper, NSTaskAdapter } from "@xyng/yuoshi-backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

type TaskTypeMap = ReturnType<TaskAdapter<any>['mapTaskToType']>

export default class TaskAdapter<
	RequestBackendConfigType
> extends NSTaskAdapter.AbstractTaskAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getTasksForPackage(package_id: string, sequence?: number): Paginator<TaskTypeMap, any> {
		return new Paginator<TaskTypeMap, any>((config) => {
			config = this.requestAdapter.mergeConfig(config, {
				params: {
					"filter[sequence]": sequence
				}
			})

			return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/packages/${package_id}/tasks`, config)
		}, (data) => {
			const task = {
				id: data.id,
				title: data.attributes.title,
				description: data.attributes.description,
				image: data.attributes.image,
				credits: data.attributes.credits,
				contents: AsyncIterableWrapper.fromAsyncIterable(
					this.backendAdapter.taskContentAdapter.getContentsForTask(data.id)
				)
			}

			return this.mapTaskToType(task, data.attributes.kind)
		});
	}

	async getNextTask(package_id: string): Promise<TaskTypeMap> {
		const { data: { data } } = await this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/packages/${package_id}/nextTask`)

		if (!data) {
			return undefined;
		}

		return this.mapTaskToType({
			id: data.id,
			title: data.attributes.title,
			description: data.attributes.description,
			image: data.attributes.image,
			credits: data.attributes.credits,
			contents: AsyncIterableWrapper.fromAsyncIterable(
				this.backendAdapter.taskContentAdapter.getContentsForTask(data.id)
			)
		}, data.attributes.kind)
    }
}
