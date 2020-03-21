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

	export interface UserTaskSolutionModel {
		task_id: string
		contents?: ({
			content_id: string
			value: string
		})[]
		answers?: ({
			quest_id: string
			sequence?: number,
		} & ({
			answer_id: string
		} | {
			custom: string
		}))[]
	}

	export abstract class AbstractUserTaskSolutionAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		public abstract saveSolution(solution: UserTaskSolutionModel): Promise<void>
	}
}
