import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest
import BaseTask from "./BaseTask"

export class Survey extends BaseTask {
	public readonly type: string = "survey"
	public readonly isTraining: boolean = false
	public contents: AsyncIterableWrapper<TaskContentQuest>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* from() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					yield quest
				}
			}
		}

		this.contents = AsyncIterableWrapper.fromAsyncIterable(from())
	}
}
