import shuffle from "lodash/shuffle"

import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"
import { matchImage, matchInput, parseContentMultiple } from "../../helpers/parseContent"

type ClozeAnswerInput = {
	id: string,
	inputs: Map<InputID, string>
}[]

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

export class Cloze extends AsyncBaseTask<StaticCloze, ClozeAnswerInput> {
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
					values: shuffle(content.getValues()),
				}
			}).toArray()
		});
	}

	createAnswer(clozes: ClozeAnswerInput): NSUserTaskSolution.UserTaskSolutionModel {
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

	public getValues() {
		return parseContentMultiple(this.content, [matchInput]).map(match => {
			return {
				id: match.id as InputID,
				name: match.name,
				content: match.content
			}
		}).map(({ id }) => {
			return id
		})
	}


	public getContentParts() {
		const rawParts = parseContentMultiple(this.content, [matchImage, matchInput]).map(match => {
			return {
				id: match.id as InputID,
				name: match.name,
				content: match.content
			}
		})

		const parts = [];
		let i = 0;
		for (const part of rawParts) {
			parts.push({
				...rawParts,
				id: i
			})

			i++;
		}

		return parts
	}
}

interface StaticClozeContent {
	id: string
	parts: ReturnType<ClozeContent['getContentParts']>
}
