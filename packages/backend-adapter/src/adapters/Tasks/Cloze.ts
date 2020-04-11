import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"
import parseContent from "../../helpers/parseContent"

export class StaticCloze extends StaticBaseTask<ClozeContent[]> {
	readonly type: string = "cloze"
	readonly isTraining: boolean = false

	public contents: ClozeContent[]

	protected init(contents: ClozeContent[]): void {
		this.contents = contents
	}

	protected getContents(): ClozeContent[] {
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
			contents: await this.contents.toArray()
		});
	}

	createAnswer(clozes: {
		cloze_id: string,
		inputs: {
			input_id: string,
			value: string
		}[]
	}[]): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			contents: clozes.map((cloze) => {
				return {
					content_id: cloze.cloze_id,
					value: JSON.stringify(cloze.inputs)
				}
			})
		};
	}
}

class ClozeContent {
	constructor(
		public id: string,
		protected content: string
	) {}

	public getContentParts(): {
		inputId?: string,
		content: string
	}[] {
		return parseContent(this.content, "##").map(match => {
			return {
				inputId: match.id,
				content: match.content
			}
		})
	}
}
