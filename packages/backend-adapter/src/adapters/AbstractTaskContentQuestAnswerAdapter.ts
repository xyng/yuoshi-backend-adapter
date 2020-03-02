import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { AbstractPaginator } from "./AbstractPaginator"

export namespace NSTaskContentQuestAnswerAdapter {
	export interface TaskContentQuestAnswer<T = any> extends DefaultEntity<T> {
		content: string
	}

	export interface TaskContentQuestAnswerSolution<T = any> extends TaskContentQuestAnswer<T> {
		is_correct: boolean
	}

	export abstract class AbstractTaskContentQuestAnswerAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getAnswersForQuest(quest_id: string): AbstractPaginator<TaskContentQuestAnswer, any>
	}
}
