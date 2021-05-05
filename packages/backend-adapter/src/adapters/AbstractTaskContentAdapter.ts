import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import AsyncIterableWrapper from "../helpers/AsyncIterableWrapper";
import { NSTaskContentQuestAdapter } from "./AbstractTaskContentQuestAdapter"
import { AbstractPaginator } from "./AbstractPaginator"

export namespace NSTaskContentAdapter {
	export interface TaskContent<T = any> extends DefaultEntity<T> {
		title: string
		intro?: string
		outro?: string
		content: string
		file?: string
		quests: AsyncIterableWrapper<NSTaskContentQuestAdapter.TaskContentQuest>
	}

	export abstract class AbstractTaskContentAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getContentsForTask(package_id: string): AbstractPaginator<TaskContent, any>
	}
}
