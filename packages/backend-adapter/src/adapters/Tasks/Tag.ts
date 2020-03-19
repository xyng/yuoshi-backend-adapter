import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest
import BaseTask from "./BaseTask"

export class Tag extends BaseTask {
	public readonly type: string = "tag"
	public readonly isTraining: boolean = false
	public contents: AsyncIterableWrapper<{
		id: string,
		tag: string
	}>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* from() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					for await (const answer of quest.answers) {
						yield {
							id: answer.id,
							tag: answer.content,
						}
					}
				}
			}
		}

		this.contents = AsyncIterableWrapper.fromAsyncIterable(from())
	}
}
