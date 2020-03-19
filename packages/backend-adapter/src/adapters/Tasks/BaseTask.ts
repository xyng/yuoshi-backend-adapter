import { NSTaskAdapter } from "../AbstractTaskAdapter"
import Task = NSTaskAdapter.Task
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import TaskContent = NSTaskContentAdapter.TaskContent
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"

export interface BaseTaskConstructData {
	id: string,
	title: string,
	description?: string,
	image?: string,
	credits?: number,
	contents: AsyncIterableWrapper<TaskContent>
}

export default abstract class BaseTask implements Task {
	public readonly id: string
	public readonly title: string
	public readonly description: string | undefined
	public readonly image: string | undefined
	public readonly credits: number | undefined

	public readonly abstract type
	public readonly abstract isTraining

	constructor(data: BaseTaskConstructData) {
		this.id = data.id
		this.title = data.title
		this.description = data.description
		this.image = data.image
		this.credits = data.credits

		this.init(data.contents)
	}

	protected abstract init(contents: AsyncIterableWrapper<TaskContent>): void
}
