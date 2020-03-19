import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import BaseTask from "./BaseTask"

export class Cloze extends BaseTask {
	public readonly type: string = "cloze"
	public readonly isTraining: boolean = false
	public contents: AsyncIterableWrapper<ClozeContent>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* from() {
			for await (const content of contents) {
				yield new ClozeContent(content.content)
			}
		}

		this.contents = AsyncIterableWrapper.fromAsyncIterable(from())
	}
}

class ClozeContent {
	constructor(
		protected content: string
	) {}

	public getContentParts(): {
		inputId: string,
		content: string
	}[] {
		const inputRegex = new RegExp(/W*##(\d)##W*/, "gm")
		const matches = this.content.match(inputRegex)
		const parts = this.content.split(inputRegex)

		return matches.map((match, index) => {
			return {
				inputId: match,
				content: parts[index]
			}
		})
	}
}
