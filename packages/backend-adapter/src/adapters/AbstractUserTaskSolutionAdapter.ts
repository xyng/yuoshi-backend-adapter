import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper"

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

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

	export type QuestSolution = NormalAnswer | CustomAnswer

	interface BaseContent {
		content_id: string
		value?: string | object
		answers?: QuestSolution[]
	}

	interface ContentWithValue extends BaseContent {
		value: string | object
		answers?: never
	}

	interface ContentWithAnswers extends BaseContent {
		answers: QuestSolution[]
		value?: never
	}

	export type ContentSolution = ContentWithAnswers | ContentWithValue | Required<BaseContent>

	export interface UserTaskSolutionModel {
		task_id: string
		contents?: ContentSolution[]
	}

	export abstract class AbstractUserTaskSolutionAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		public abstract getCurrentTaskPosition(task_id: string, solution_id?: string): Promise<{
			id: string
			current_content?: string
			current_quest?: string
		}>

		public abstract saveCompleteTask(task_id: string, solution: UserTaskSolutionModel): Promise<{
			content_solutions: ThenArg<ReturnType<AbstractUserTaskSolutionAdapter<RequestConfigType, AuthenticationHandler>['saveContentSolution']>>[]
			quest_solutions: ThenArg<ReturnType<AbstractUserTaskSolutionAdapter<RequestConfigType, AuthenticationHandler>['saveQuestSolution']>>[]
		} | undefined>

		public abstract saveContentSolution(content_id: string, value: object): Promise<{
			id: string,
			value: string
		} | undefined>

		public abstract saveQuestSolution(quest_id: string, answers: QuestSolution[]): Promise<{
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
