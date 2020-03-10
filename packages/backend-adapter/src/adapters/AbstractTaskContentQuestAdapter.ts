import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper";
import { NSTaskContentQuestAnswerAdapter } from "./AbstractTaskContentQuestAnswerAdapter"
import { AbstractPaginator } from "./AbstractPaginator"

export namespace NSTaskContentQuestAdapter {
	export interface TaskContentQuest<T = any> extends DefaultEntity<T> {
		title: string
		question: string
		image?: string
		prePhrase?: string
		content?: string
		multiple: boolean,
		answers: AsyncIterableWrapper<NSTaskContentQuestAnswerAdapter.TaskContentQuestAnswer>
	}

	export abstract class AbstractTaskContentQuestAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getQuestsForContent(content_id: string): AbstractPaginator<TaskContentQuest, any>
	}
}
