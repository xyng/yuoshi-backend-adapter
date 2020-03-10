import { NSTaskContentQuestAnswerAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import TaskContentQuestAnswer = NSTaskContentQuestAnswerAdapter.TaskContentQuestAnswer

export default class TaskContentQuestAnswerAdapter<
	RequestBackendConfigType
> extends NSTaskContentQuestAnswerAdapter.AbstractTaskContentQuestAnswerAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getAnswersForQuest(quest_id: string): Paginator<TaskContentQuestAnswer, any> {
		return new Paginator<TaskContentQuestAnswer, any>((config) => {
			return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/quests/${quest_id}/answers`, config)
		}, (data): TaskContentQuestAnswer => {
			return {
				id: data.id,
				content: data.attributes.content as string,
			}
		});
	}
}
