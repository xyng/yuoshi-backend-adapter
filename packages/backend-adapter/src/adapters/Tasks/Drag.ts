import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest
import BaseTask from "./BaseTask"

export class Drag extends BaseTask {
	public readonly type: string = "drag"
	public readonly isTraining: boolean = false
	public categories: AsyncIterableWrapper<{
		id: string,
		title: string
	}>
	public statements: AsyncIterableWrapper<{
		id: string,
		category_id: string,
		text: string
	}>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* iterateCategories() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					yield {
						id: quest.id,
						title: quest.question,
					}
				}
			}
		}

		this.categories = AsyncIterableWrapper.fromAsyncIterable(
			iterateCategories()
		)

		async function* iterateStatements() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					for await (const answer of quest.answers) {
						yield {
							id: answer.id,
							category_id: quest.id,
							text: answer.content,
						}
					}
				}
			}
		}

		this.statements = AsyncIterableWrapper.fromAsyncIterable(
			iterateStatements()
		)
	}
}
