import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"

class StaticMulti extends StaticBaseTask<TaskContentQuest[]> {
	public readonly isTraining: boolean = false
	public readonly type: string = "multi"
	public contents: TaskContentQuest[]

	protected init(contents: TaskContentQuest[]): void {
		this.contents = contents
	}
}

export class Multi extends AsyncBaseTask<StaticMulti> {
	public readonly type: string = "multi"
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

	async getStatic(): Promise<StaticMulti> {
		return new StaticMulti({
			...this,
			contents: await this.contents.toArray(),
		});
	}
}
