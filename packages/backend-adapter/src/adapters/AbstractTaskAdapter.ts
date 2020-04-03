import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { AbstractPaginator } from "./AbstractPaginator"

import { DefaultBaseTaskConstructData } from "./Tasks/BaseTask"

import { Survey } from "./Tasks/Survey"
import { Multi } from "./Tasks/Multi"
import { Drag } from "./Tasks/Drag"
import { Cloze } from "./Tasks/Cloze"
import { Tag } from "./Tasks/Tag"
import { Memory } from "./Tasks/Memory"
import { Card } from "./Tasks/Card"
import { Training } from "./Tasks/Training"
import TaskFactory from "./Tasks/TaskFactory"

export namespace NSTaskAdapter {
	export interface Task<T = any> extends DefaultEntity<T> {
		title: string
		description?: string
		image?: string
		type: string
		isTraining: boolean
		credits?: number
	}

	export enum TaskTypeName {
		SURVEY = "survey",
		MULTI = "multi",
		DRAG = "drag",
		CLOZE = "cloze",
		TAG = "tag",
		MEMORY = "memory",
		CARD = "card",
		TRAINING = "training"
	}

	type TaskTypeMap = ReturnType<AbstractTaskAdapter<any, any>['mapTaskToType']>

	export abstract class AbstractTaskAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		protected mapTaskToType(task: DefaultBaseTaskConstructData, type: TaskTypeName) {
			return TaskFactory.getTask(type, task)
		}

		abstract getTasksForPackage(package_id: string, sequence?: number): AbstractPaginator<TaskTypeMap, any>
		abstract getNextTask(package_id: string): Promise<TaskTypeMap|undefined>
		abstract getTask(task_id: string): Promise<TaskTypeMap|undefined>
	}
}
