import AsyncIterableWrapper from "../../helpers/AsyncIterableWrapper"
import { NSTaskContentAdapter } from "../AbstractTaskContentAdapter"

import { AsyncBaseTask, StaticBaseTask } from "./BaseTask"
import TaskContent = NSTaskContentAdapter.TaskContent
import { NSTaskContentQuestAdapter } from "../AbstractTaskContentQuestAdapter"
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest
import { NSTaskContentQuestAnswerAdapter } from "../AbstractTaskContentQuestAnswerAdapter"
import TaskContentQuestAnswer = NSTaskContentQuestAnswerAdapter.TaskContentQuestAnswer
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

type TrainingAnswerInput = {
	content_id: string
	answers: {
		quest_id: string
		answer_id: string
	}[]
}[]

interface Content extends Omit<TaskContent, "quests"> {
	quests: Quest[]
}

interface Quest extends Omit<TaskContentQuest, "answers"> {
	answers: TaskContentQuestAnswer[]
}

export class StaticTraining extends StaticBaseTask<Content[]> {
	public readonly isTraining: boolean = true
	public readonly type: string = "training"
	public contents: Content[]

	protected init(contents: Content[]): void {
		this.contents = contents
	}

	protected getContents(): Content[] {
		return this.contents;
	}
}

export class Training extends AsyncBaseTask<StaticTraining, TrainingAnswerInput> {
	public readonly type: string = "training"
	public readonly isTraining: boolean = true
	public contents: AsyncIterableWrapper<TaskContent>

	protected init(contents: AsyncIterableWrapper<NSTaskContentAdapter.TaskContent>): void {
		this.contents = contents
	}

	async getStatic(): Promise<StaticTraining> {
		return new StaticTraining({
			...this,
			contents: await this.contents.map(async content => ({
				...content,
				quests: await content.quests.map(async quest => ({
					...quest,
					answers: await quest.answers.toArray()
				})).toArray()
			})).toArray()
		})
	}

	createAnswer(
		contents: TrainingAnswerInput
	): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			contents: contents
		}
	}
}
