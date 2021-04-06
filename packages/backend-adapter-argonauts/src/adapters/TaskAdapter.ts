import { AsyncIterableWrapper, NSTaskAdapter } from "@xyng/yuoshi-backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import ApiTask = NSTaskAdapter.ApiTask

export default class TaskAdapter<RequestBackendConfigType> extends NSTaskAdapter.AbstractTaskAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
> {
	_getTasksForStation(station_id: string, sequence?: number): Paginator<ApiTask, any> {
		return new Paginator<ApiTask, RequestBackendConfigType>(
			config => {
				config = this.requestAdapter.mergeConfig(config, {
					params: {
						"filter[sequence]": sequence,
					},
				})

				return this.requestAdapter.getAuthorized(`/stations/${station_id}/tasks`, config)
			},
			data => {
				return {
					id: data.id,
					type: data.attributes.kind,
					title: data.attributes.title,
					description: data.attributes.description,
					image: data.attributes.image,
					credits: data.attributes.credits,
					contents: AsyncIterableWrapper.fromAsyncIterable(
						this.backendAdapter.taskContentAdapter.getContentsForTask(data.id)
					),
				}
			}
		)
	}

	async _getNextTask(package_id, station_id: string): Promise<ApiTask | undefined> {
		const {
			data: { data },
		} = await this.requestAdapter.getAuthorized(`/stations/${station_id}/nextTask`)

		if (!data) {
			return undefined
		}

		return {
			id: data.id,
			type: data.attributes.kind,
			title: data.attributes.title,
			description: data.attributes.description,
			image: data.attributes.image,
			credits: data.attributes.credits,
			contents: AsyncIterableWrapper.fromAsyncIterable(
				this.backendAdapter.taskContentAdapter.getContentsForTask(data.id)
			),
		}
	}

	async _getTask(task_id: string): Promise<ApiTask | undefined> {
		const {
			data: { data },
		} = await this.requestAdapter.getAuthorized(`/tasks/${task_id}`)

		if (!data) {
			return undefined
		}

		return {
			id: data.id,
			type: data.attributes.kind,
			title: data.attributes.title,
			description: data.attributes.description,
			image: data.attributes.image,
			credits: data.attributes.credits,
			contents: AsyncIterableWrapper.fromAsyncIterable(
				this.backendAdapter.taskContentAdapter.getContentsForTask(data.id)
			),
		}
	}
}
