import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"

interface TagContent {
	id: string,
	tag: string
}

export class StaticTag extends StaticBaseTask<TagContent[]> {
	public readonly isTraining: boolean = false
	public readonly type: string = "tag"
	public contents: TagContent[]

	protected init(contents: TagContent[]): void {
		this.contents = contents
	}

}

export class Tag extends AsyncBaseTask<StaticTag> {
	public readonly type: string = "tag"
	public readonly isTraining: boolean = false
	public contents: AsyncIterableWrapper<TagContent>

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

	async getStatic(): Promise<StaticTag> {
		return new StaticTag({
			...this,
			contents: await this.contents.toArray(),
		});
	}
}
