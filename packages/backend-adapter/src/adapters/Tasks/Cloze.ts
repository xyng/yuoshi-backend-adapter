import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"
import { matchImage, matchInput, parseContentMultiple } from "../../helpers/parseContent"

export class StaticCloze extends StaticBaseTask<StaticClozeContent[]> {
	readonly type: string = "cloze"
	readonly isTraining: boolean = false

	public contents: StaticClozeContent[]

	protected init(contents: StaticClozeContent[]): void {
		this.contents = contents
	}

	protected getContents(): StaticClozeContent[] {
		return this.contents;
	}
}

export class Cloze extends AsyncBaseTask<StaticCloze> {
	public readonly type: string = "cloze"
	public readonly isTraining: boolean = false
	public contents: AsyncIterableWrapper<ClozeContent>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* from() {
			for await (const content of contents) {
				yield new ClozeContent(content.id, content.content)
			}
		}

		this.contents = AsyncIterableWrapper.fromAsyncIterable(from())
	}

	async getStatic(): Promise<StaticCloze> {
		return new StaticCloze({
			...this,
			contents: await this.contents.map((content) => {
				return {
					id: content.id,
					parts: content.getContentParts(),
				}
			}).toArray()
		});
	}

	createAnswer(clozes: {
		id: string,
		inputs: Map<InputID, string>
	}[]): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			contents: clozes.map((cloze) => {
				return {
					content_id: cloze.id,
					value: Object.fromEntries(Array.from(cloze.inputs.entries()).map(([key, val]) => {
						return [`input-${key}`, val]
					}))
				}
			})
		};
	}
}

type InputID = string & { readonly brand: unique symbol };

class ClozeContent {
	constructor(
		public id: string,
		protected content: string
	) {}

	public getContentParts() {
		return parseContentMultiple(this.content, [matchImage, matchInput]).map(match => {
			return {
				id: match.id as InputID,
				name: match.name,
				content: match.content
			}
		})
	}
}

interface StaticClozeContent {
	id: string
	parts: ReturnType<ClozeContent['getContentParts']>
}
