import BaseTask from "./BaseTask"
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

export class Card extends BaseTask {
	public readonly isTraining: boolean = false
	public readonly type: string = "card"
	public topic: Promise<string>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		this.topic = contents.first().then(content => {
			return content.content
		})
	}
}
