import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

class StaticCard extends StaticBaseTask<string> {
	readonly isTraining: boolean = false
	readonly type: string = "card"

	public topic: string

	protected init(contents: string): void {
		this.topic = contents
	}
}

export class Card extends AsyncBaseTask<StaticCard> {
	public readonly isTraining: boolean = false
	public readonly type: string = "card"
	public topic: Promise<string>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		this.topic = contents.first().then(content => {
			return content.content
		})
	}

	async getStatic(): Promise<StaticCard> {
		return new StaticCard({
			...this,
			contents: await this.topic
		});
	}
}
