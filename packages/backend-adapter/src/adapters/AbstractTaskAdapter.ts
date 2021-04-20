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
	}

	export type TaskTypeMap = ReturnType<AbstractTaskAdapter<any, any>["mapTaskToType"]>

	export type ApiTask = DefaultBaseTaskConstructData & {
		type: TaskTypeName
	}

	export abstract class AbstractTaskAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		protected mapTaskToType(task: DefaultBaseTaskConstructData, type: TaskTypeName) {
			return TaskFactory.getTask(type, task)
		}

		async getNextTask(package_id, station_id: string, start: boolean = true): Promise<TaskTypeMap | undefined> {
			const data = await this._getNextTask(package_id, station_id)
			if (!data) {
				return
			}

			if (start) {
				await this._startTask(data.id)
			}

			return this.mapTaskToType(data, data.type)
		}

		async getPrevTask(station_id: string, current_task_id: string, start: boolean = false): Promise<TaskTypeMap | undefined> {
			const data = await this._getPrevTask(station_id, current_task_id)
			if (!data) {
				return
			}

			if (start) {
				await this._startTask(data.id)
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

		getTasksForStation(stations_id: string, sequence?: number): AsyncIterableWrapper<TaskTypeMap> {
			return this._getTasksForStation(stations_id, sequence)
				.getWrapped()
				.map(item => {
					return this.mapTaskToType(item, item.type)
				})
		}

		abstract _getTasksForStation(station_id: string, sequence?: number): AbstractPaginator<ApiTask, any>
		protected abstract _getNextTask(package_id, station_id: string): Promise<ApiTask | undefined>
		protected abstract _getPrevTask(station_id: string, current_task_id: string): Promise<ApiTask | undefined>
		protected abstract _getTask(task_id: string): Promise<ApiTask | undefined>
		protected abstract _startTask(task_id: string): Promise<void>
	}
}
