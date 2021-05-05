import { AsyncIterableWrapper, NSTaskContentAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import TaskContent = NSTaskContentAdapter.TaskContent

export default class TaskContentAdapter<
	RequestBackendConfigType
> extends NSTaskContentAdapter.AbstractTaskContentAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getContentsForTask(task_id: string): Paginator<TaskContent, any> {
		return new Paginator<TaskContent, any>((config) => {
			return this.requestAdapter.getAuthorized(`/tasks/${task_id}/contents`, config)
		}, async (data): Promise<TaskContent> => {
			let file: string | undefined = undefined
			if (data.attributes.file) {
				file = await this.backendAdapter.fileAdapter.getFile(data.attributes.file)
			}

			return {
				id: data.id,
				title: data.attributes.title,
				content: data.attributes.content,
				intro: data.attributes.intro,
				outro: data.attributes.outro,
				file,
				quests: AsyncIterableWrapper.fromAsyncIterable(this.backendAdapter.taskContentQuestAdapter.getQuestsForContent(data.id))
			}
		});
	}
}
