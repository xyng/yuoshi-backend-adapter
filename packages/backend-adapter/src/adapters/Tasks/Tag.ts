import AsyncIterableWrapper, { AsyncSingleInterface } from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"
import parseContent from "../../helpers/parseContent"

interface TagContent {
	id: string
	category_id: string
	content_id: string
	tag: string
}

interface ContentType {
	image: string
	content: string
}

export class StaticTag extends StaticBaseTask<{
	tags: TagContent[],
	contents: ContentType[]
}> {
	public readonly isTraining: boolean = false
	public readonly type: string = "tag"
	public tags: TagContent[]
	public contents: ContentType[]

	protected init(contents: {
		tags: TagContent[],
		contents: ContentType[]
	}): void {
		this.tags = contents.tags
		this.contents = contents.contents
	}

	protected getContents(): {
		tags: TagContent[],
		contents: ContentType[]
	} {
		return {
			tags: this.tags,
			contents: this.contents,
		};
	}
}

export class Tag extends AsyncBaseTask<StaticTag> {
	public readonly type: string = "tag"
	public readonly isTraining: boolean = false
	public tags: AsyncIterableWrapper<TagContent>
	public contents: AsyncSingleInterface<ContentType[]>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* from() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					for await (const answer of quest.answers) {
						yield {
							id: answer.id,
							category_id: quest.id,
							content_id: content.id,
							tag: answer.content,
						}
					}
				}
			}
		}

		this.tags = AsyncIterableWrapper.fromAsyncIterable(from())

		this.contents = contents
			.reduceLazy((acc, value) => {
				return acc + value.content
			}, "")
			.then((content) => {
				return parseContent(content, "--").map((match) => {
					return {
						image: match.id,
						content: match.content
					}
				})
			})
	}

	async getStatic(): Promise<StaticTag> {
		return new StaticTag({
			...this,
			contents: {
				tags: await this.tags.toArray(),
				contents: await this.contents.value(),
			}
		});
	}

	createAnswer(answers: TagContent[]): NSUserTaskSolution.UserTaskSolutionModel {
		return this.createSolutionFromContentAnswers(answers.map((answer) => {
			return {
				content_id: answer.content_id,
				quest_id: answer.category_id,
				answer_id: answer.id
			}
		}))
	}
}
