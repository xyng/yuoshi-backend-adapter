import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper"

interface UserTaskContentQuestSolution extends DefaultEntity<never> {
	content_solution_id: string
	quest_id: string
	answer_id: string
}

interface UserTaskContentSolution extends DefaultEntity<never> {
	task_solution_id: string
	content_id: string
	value?: string
	quests: AsyncIterableWrapper<Omit<UserTaskContentQuestSolution, "content_solution_id">>
}

export namespace NSUserTaskSolution {
	export interface UserTaskSolution extends DefaultEntity<never> {
		task_id: string
		contents: AsyncIterableWrapper<Omit<UserTaskContentSolution, "task_solution_id">>
	}

	// splitting up the union-type-def into multiple interfaces seems to be
	// necessary as of typescript 3.8. feel free to shorten this when it becomes
	// possible!

	interface BaseAnswer {
		quest_id: string
		sort?: number
	}

	interface NormalAnswer extends BaseAnswer {
		answer_id: string
		custom?: never
	}

	interface CustomAnswer extends BaseAnswer {
		custom: string
		answer_id?: never
	}

	export type Answer = NormalAnswer | CustomAnswer

	interface BaseContent {
		content_id: string
		value?: string
		answers?: Answer[]
	}

	interface ContentWithValue extends BaseContent {
		value: string
		answers?: never
	}

	interface ContentWithAnswers extends BaseContent {
		answers: Answer[]
		value?: never
	}

	export type Content = ContentWithAnswers | ContentWithValue

	export interface UserTaskSolutionModel {
		task_id: string
		contents?: Content[]
	}

	export abstract class AbstractUserTaskSolutionAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		public abstract getCurrentTaskPosition(task_id: string, solution_id?: string): Promise<{
			id: string
			current_content?: string
			current_quest?: string
		}>

		public abstract saveContentSolution(content_id: string, value: object): Promise<{
			id: string,
			value: string
		} | undefined>

		public abstract saveQuestSolution(quest_id: string, answers: Answer[]): Promise<{
			id: string,
			is_correct: boolean
			score: number
			sent_solution: boolean
		} | undefined>

		public abstract getSampleSolution(quest_solution_id: string): Promise<{
			quest_id: string
			answers: {
				id: string
				sort: number | undefined
				is_correct: boolean
				content: string
			}[]
		} | undefined>
	}
}
