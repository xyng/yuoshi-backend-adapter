import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { AbstractPaginator } from "./AbstractPaginator"

import { DefaultBaseTaskConstructData } from "./Tasks/BaseTask"

import TaskFactory from "./Tasks/TaskFactory"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper"

export namespace NSTaskAdapter {
	export enum TaskTypeName {
		SURVEY = "survey",
		MULTI = "multi",
		DRAG = "drag",
		CLOZE = "cloze",
		TAG = "tag",
		MEMORY = "memory",
		CARD = "card",
		TRAINING = "training",
		TEXT = "text",
	}

	export type TaskTypeMap = ReturnType<
		AbstractTaskAdapter<any, any>["mapTaskToType"]
	>

	export type ApiTask = DefaultBaseTaskConstructData & {
		type: TaskTypeName
	}

	export abstract class AbstractTaskAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		protected mapTaskToType(
			task: DefaultBaseTaskConstructData,
			type: TaskTypeName
		) {
			return TaskFactory.getTask(type, task)
		}

		async getNextTask(
			package_id: string
		): Promise<TaskTypeMap | undefined> {
			const data = await this._getNextTask(package_id)
			if (!data) {
				return
			}

			return this.mapTaskToType(data, data.type)
		}

		async getTask(task_id: string): Promise<TaskTypeMap | undefined> {
			const data = await this._getTask(task_id)
			if (!data) {
				return
			}

			return this.mapTaskToType(data, data.type)
		}

		getTasksForPackage(
			package_id: string,
			sequence?: number
		): AsyncIterableWrapper<TaskTypeMap> {
			return this._getTasksForPackage(package_id, sequence)
				.getWrapped()
				.map(item => {
					return this.mapTaskToType(item, item.type)
				})
		}

		abstract _getTasksForPackage(
			package_id: string,
			sequence?: number
		): AbstractPaginator<ApiTask, any>
		protected abstract _getNextTask(
			package_id: string
		): Promise<ApiTask | undefined>
		protected abstract _getTask(
			task_id: string
		): Promise<ApiTask | undefined>
	}
}
