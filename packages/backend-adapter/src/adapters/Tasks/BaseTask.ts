import { NSTaskAdapter } from "../AbstractTaskAdapter"
import Task = NSTaskAdapter.Task
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import TaskContent = NSTaskContentAdapter.TaskContent
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"

interface BaseTaskConstructData<T> {
	id: string,
	title: string,
	description?: string,
	image?: string,
	credits?: number,
	isTraining?: boolean,
	contents: T
}

export type DefaultBaseTaskConstructData = BaseTaskConstructData<AsyncIterableWrapper<TaskContent>>

export abstract class StaticBaseTask<T> implements Task {
	public readonly id: string
	public readonly title: string
	public readonly description: string | undefined
	public readonly image: string | undefined
	public readonly credits: number | undefined

	public readonly abstract type: string
	public readonly abstract isTraining: boolean

	constructor(data: BaseTaskConstructData<T>) {
		this.id = data.id
		this.title = data.title
		this.description = data.description
		this.image = data.image
		this.credits = data.credits

		this.init(data.contents)
	}

	protected abstract init(contents: T): void
}

export abstract class AsyncBaseTask<T> extends StaticBaseTask<AsyncIterableWrapper<TaskContent>> {
	public abstract getStatic(): Promise<T>;
}
