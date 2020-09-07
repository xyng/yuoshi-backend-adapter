import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

type TextContent = {
	id: string
	title: string
	content: string
}

type TextAnswerInput = {
	topic_id: string
	value: string
}[]

export class StaticText extends StaticBaseTask<TextContent[]> {
	readonly isTraining: boolean = false
	readonly type: string = "Text"

	public topics: TextContent[]

	protected init(contents: TextContent[]): void {
		this.topics = contents
	}

	protected getContents(): TextContent[] {
		return this.topics
	}
}

export class Text extends AsyncBaseTask<StaticText, TextAnswerInput> {
	public readonly isTraining: boolean = false
	public readonly type: string = "Text"
	public topics: AsyncIterableWrapper<TextContent>

	protected init(
		contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>
	): void {
		this.topics = contents.map(content => {
			return {
				id: content.id,
				title: content.title,
				content: content.content,
			}
		})
	}

	async getStatic(): Promise<StaticText> {
		return new StaticText({
			...this,
			contents: await this.topics.toArray(),
		})
	}

	createAnswer(
		contents: TextAnswerInput
	): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			contents: contents.map(content => {
				return {
					content_id: content.topic_id,
					value: content.value,
				}
			}),
		}
	}
}
