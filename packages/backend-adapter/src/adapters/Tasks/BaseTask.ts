import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import TaskContent = NSTaskContentAdapter.TaskContent
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"
import UserTaskSolutionModel = NSUserTaskSolution.UserTaskSolutionModel

export interface BaseTaskConstructData<T> {
	id: string,
	title: string,
	description?: string,
	image?: string,
	credits?: number,
	contents: T
}

export type DefaultBaseTaskConstructData = BaseTaskConstructData<AsyncIterableWrapper<TaskContent>>

export abstract class BaseTask<T> {
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

export abstract class StaticBaseTask<T> extends BaseTask<T> {
	protected abstract getContents(): T

	typeName(): string {
		return this.type
	}

	toJSONValue(): BaseTaskConstructData<T> {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			image: this.image,
			credits: this.credits,
			contents: this.getContents(),
		}
	}
}

interface BaseAnswer {
	quest_id: string
	sort?: number
	answer_id?: string
	custom?: string
}

interface CustomAnswer extends BaseAnswer {
	custom: string
	answer_id?: never
}

interface StaticAnswer extends BaseAnswer {
	custom?: never
	answer_id: string
}

type Answer = CustomAnswer | StaticAnswer

type AnswerInput = Answer & {
	content_id: string
}

export abstract class AsyncBaseTask<T, AnswerInputType> extends BaseTask<AsyncIterableWrapper<TaskContent>> {
	public abstract getStatic(): Promise<T>;
	public abstract createAnswer(answer: AnswerInputType): UserTaskSolutionModel

	protected createSolutionFromContentAnswers(
		answers: AnswerInput[]
	): UserTaskSolutionModel {
		const contents: {
			[key: string]: Answer[]
		} = {}

		answers.forEach((answer) => {
			contents[answer.content_id] = contents[answer.content_id] || []

			if (answer.custom) {
				contents[answer.content_id].push({
					sort: answer.sort,
					quest_id: answer.quest_id,
					custom: answer.custom,
				})

				return
			}

			contents[answer.content_id].push({
				sort: answer.sort,
				quest_id: answer.quest_id,
				answer_id: answer.answer_id,
			})
		})

		return {
			task_id: this.id,
			contents: Object
				.entries(contents)
				.map(([key, answers]) => {
					return {
						content_id: key,
						answers,
					}
				})
		}
	}
}
