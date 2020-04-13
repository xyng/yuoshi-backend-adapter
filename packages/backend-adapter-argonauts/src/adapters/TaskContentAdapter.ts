import { AsyncIterableWrapper, NSTaskContentAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import TaskContent = NSTaskContentAdapter.TaskContent

export default class TaskContentAdapter<
	RequestBackendConfigType
> extends NSTaskContentAdapter.AbstractTaskContentAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getContentsForTask(task_id: string): Paginator<TaskContent, any> {
		return new Paginator<TaskContent, any>((config) => {
			return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/tasks/${task_id}/contents`, config)
		}, (data): TaskContent => {
			return {
				id: data.id,
				title: data.attributes.title,
				content: data.attributes.content,
				intro: data.attributes.intro,
				outro: data.attributes.outro,
				quests: AsyncIterableWrapper.fromAsyncIterable(this.backendAdapter.taskContentQuestAdapter.getQuestsForContent(data.id))
			}
		});
	}
}
