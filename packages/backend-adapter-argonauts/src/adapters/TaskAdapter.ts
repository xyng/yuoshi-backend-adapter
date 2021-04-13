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

	resolveIncluded(data: any, entity: { type: string; id: string }, multiple: boolean = true) {
		const results = data.included.filter(e => {
			return e.type === entity.type && e.id === entity.id
		})
		if (!multiple) {
			return results[0]
		}
		return results
	}

	async _getPrevTask(station_id: string, current_task_id: string): Promise<ApiTask | undefined> {
		const {
			data: { data },
		} = await this.requestAdapter.getAuthorized(
			`/stations/${station_id}/prevTask/${current_task_id}?include=solutions.content_solutions.quest_solutions.answers`
		)

		if (!data) {
			return undefined
		}
		const solution = this.resolveIncluded(data, data.relationships?.solution.data, true)
		const content_solution = this.resolveIncluded(data, solution?.relationships?.content_solution.data)
		const quest_solution = this.resolveIncluded(data, content_solution?.relationships?.quest_solution.data)
		const answers = this.resolveIncluded(data, quest_solution?.relationships?.answers.data)

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
			solution: {
				...solution,
				content_solution: {
					...content_solution,
					quest_solution: {
						...quest_solution,
						answers,
					},
				},
			},
		}
	}

	async _getNextTask(station_id: string): Promise<ApiTask | undefined> {
		const {
			data: { data },
		} = await this.requestAdapter.getAuthorized(
			`/stations/${station_id}/nextTask?include=solutions.content_solutions.quest_solutions.answers`
		)

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
