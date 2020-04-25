import { AsyncBaseTask, BaseTaskConstructData, StaticBaseTask } from "./BaseTask"
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

type CardContent = {
	id: string,
	title: string,
	content: string
}

type CardAnswerInput = {
	topic_id: string
	value: string
}[]

export class StaticCard extends StaticBaseTask<CardContent[]> {
	readonly isTraining: boolean = false
	readonly type: string = "card"

	public topics: CardContent[]

	protected init(contents: CardContent[]): void {
		this.topics = contents
	}

	protected getContents(): CardContent[] {
		return this.topics;
	}
}

export class Card extends AsyncBaseTask<StaticCard, CardAnswerInput> {
	public readonly isTraining: boolean = false
	public readonly type: string = "card"
	public topics: AsyncIterableWrapper<CardContent>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		this.topics = contents.map((content) => {
			return {
				id: content.id,
				title: content.title,
				content: content.content,
			}
		})
	}

	async getStatic(): Promise<StaticCard> {
		return new StaticCard({
			...this,
			contents: await this.topics.toArray()
		});
	}

	createAnswer(contents: CardAnswerInput): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			contents: contents.map((content) => {
				return {
					content_id: content.topic_id,
					value: content.value
				}
			})
		}
	}
}
