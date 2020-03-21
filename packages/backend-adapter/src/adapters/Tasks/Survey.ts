import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest
import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

class StaticSurvey extends StaticBaseTask<TaskContentQuest[]> {
	public readonly isTraining: boolean = false
	public readonly type: string = "survey"
	public contents: TaskContentQuest[]

	protected init(contents: TaskContentQuest[]): void {
		this.contents = contents
	}
}

export class Survey extends AsyncBaseTask<StaticSurvey> {
	public readonly type: string = "survey"
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

	async getStatic(): Promise<StaticSurvey> {
		return new StaticSurvey({
			...this,
			contents: await this.contents.toArray(),
		});
	}

	createAnswer(
		answers: NSUserTaskSolution.UserTaskSolutionModel['answers']
	): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			answers,
		}
	}
}
