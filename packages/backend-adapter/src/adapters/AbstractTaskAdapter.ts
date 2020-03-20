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

export namespace NSTaskAdapter {
	export interface Task<T = any> extends DefaultEntity<T> {
		title: string
		description?: string
		image?: string
		type: string
		isTraining: boolean
		credits?: number
	}

	export abstract class AbstractTaskAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		protected mapTaskToType(task: DefaultBaseTaskConstructData, type?: string) {
			switch (type) {
				case "survey":
					return new Survey(task)
				case "multi":
					return new Multi(task)
				case "drag":
					return new Drag(task)
				case "cloze":
					return new Cloze(task)
				case "tag":
					return new Tag(task)
				case "Memory":
					return new Memory(task)
				case "Card":
					return new Card(task)
				default:
					if (!type || type.length === 0 && task.isTraining) {
						return new Training(task)
					}
					throw new Error("Unknown Task type given");
			}
		}

		abstract getTasksForPackage(package_id: string, sequence?: number): AbstractPaginator<ReturnType<AbstractTaskAdapter<RequestConfigType, AuthenticationHandler>['mapTaskToType']>, any>
	}
}
