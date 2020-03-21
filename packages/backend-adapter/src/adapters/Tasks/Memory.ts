import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

class MemoryItem {
	constructor(
		public readonly id: string,
		protected readonly category_id: string,
		public readonly text: string,
		public readonly image?: string,
	) {}

	isPair(otherItem: MemoryItem) {
		return otherItem.category_id === this.category_id
	}
}

class StaticMemory extends StaticBaseTask<MemoryItem[]> {
	readonly isTraining: boolean = false
	readonly type: string = "memory"

	public items: MemoryItem[]

	protected init(contents: MemoryItem[]): void {
		this.items = contents
	}
}

export class Memory extends AsyncBaseTask<StaticMemory> {
	public readonly type: string = "memory"
	public readonly isTraining: boolean = false
	public items: AsyncIterableWrapper<MemoryItem>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* iterateItems() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					for await (const answer of quest.answers) {
						// TODO: add image
						yield new MemoryItem(answer.id, quest.id, answer.content)
					}
				}
			}
		}

		this.items = AsyncIterableWrapper.fromAsyncIterable(
			iterateItems()
		)
	}

	public async getStatic(): Promise<StaticMemory> {
		return new StaticMemory({
			...this,
			contents: await this.items.toArray()
		});
	}

	createAnswer(
		pairs: {
			a: {
				id: string,
				category_id: string
			},
			b: {
				id: string,
				category_id: string
			}
		}[]
	): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			answers: pairs
				.reduce((current, { a, b }) => {
					// do nothing if the pair is invalid
					if (a.category_id !== b.category_id) {
						return current
					}

					// push both parts of the pair to solution array
					current.push({
						answer_id: a.id,
						quest_id: a.category_id,
					})

					current.push({
						answer_id: b.id,
						quest_id: b.category_id,
					})

					return current
				}, [])
		};
	}
}
