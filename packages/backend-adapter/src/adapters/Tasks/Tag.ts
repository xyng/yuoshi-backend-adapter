import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

interface TagContent {
	id: string,
	tag: string
}

class StaticTag extends StaticBaseTask<TagContent[]> {
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
							category_id: quest.id,
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

	createAnswer(answers: {
		category_id: string,
		answer_id: string,
	}[]): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			answers: answers.map((answer) => {
				return {
					quest_id: answer.category_id,
					answer_id: answer.answer_id
				}
			})
		};
	}
}
