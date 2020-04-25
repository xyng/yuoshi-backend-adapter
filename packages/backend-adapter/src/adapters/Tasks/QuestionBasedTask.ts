import { AsyncBaseTask, BaseTaskConstructData, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"
import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"
import TaskContent = NSTaskContentAdapter.TaskContent
import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest
import { NSTaskContentQuestAnswerAdapter } from "../AbstractTaskContentQuestAnswerAdapter"
import TaskContentQuestAnswer = NSTaskContentQuestAnswerAdapter.TaskContentQuestAnswer

type QuestAnswerInput = {
	content_id: string
	quest_id: string
	answer_id: string
}[]

export interface Quest extends Omit<TaskContentQuest, "answers"> {
	content_id: string
	answers: TaskContentQuestAnswer[]
}

export abstract class QuestionBasedStaticTask extends StaticBaseTask<Quest[]> {
	public contents: Quest[]

	protected init(contents: Quest[]): void {
		this.contents = contents
	}

	protected getContents(): Quest[] {
		return this.contents
	}
}

export abstract class QuestionBasedTask<T extends QuestionBasedStaticTask> extends AsyncBaseTask<T, QuestAnswerInput> {
	public contents: AsyncIterableWrapper<TaskContentQuest & { content_id: string }>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		async function* from() {
			for await (const content of contents) {
				for await (const quest of content.quests) {
					yield {
						content_id: content.id,
						...quest,
					}
				}
			}
		}

		this.contents = AsyncIterableWrapper.fromAsyncIterable(from())
	}

	protected abstract createStatic(data: BaseTaskConstructData<Quest[]>): T

	async getStatic(): Promise<T> {
		return this.createStatic({
			...this,
			contents: await this.contents.map(async quest => ({
				...quest,
				answers: await quest.answers.toArray()
			})).toArray()
		})
	}

	createAnswer(
		answers: QuestAnswerInput
	): NSUserTaskSolution.UserTaskSolutionModel {
		return this.createSolutionFromContentAnswers(answers)
	}
}
