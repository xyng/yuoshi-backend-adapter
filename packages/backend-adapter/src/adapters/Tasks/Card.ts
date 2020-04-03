import { AsyncBaseTask, BaseTaskConstructData, StaticBaseTask } from "./BaseTask"
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

export class StaticCard extends StaticBaseTask<string> {
	readonly isTraining: boolean = false
	readonly type: string = "card"

	public topic: string

	protected init(contents: string): void {
		this.topic = contents
	}

	protected getContents(): string {
		return this.topic;
	}
}

export class Card extends AsyncBaseTask<StaticCard> {
	public readonly isTraining: boolean = false
	public readonly type: string = "card"
	public topic: Promise<{
		topic_id: string,
		value: string
	}>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		this.topic = contents.first().then(content => {
			return {
				topic_id: content.id,
				value: content.content
			}
		})
	}

	async getStatic(): Promise<StaticCard> {
		return new StaticCard({
			...this,
			contents: (await this.topic).value
		});
	}

	createAnswer(content: {
		topic_id: string,
		content: string,
	}): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			contents: [{
				content_id: content.topic_id,
				value: content.content
			}]
		}
	}
}
