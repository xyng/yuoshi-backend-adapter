import { AsyncIterableWrapper, NSTaskContentQuestAdapter, NSTaskContentQuestAnswerAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import Paginator from "../Paginator"

import TaskContentQuestAnswer = NSTaskContentQuestAnswerAdapter.TaskContentQuestAnswer
import TaskContentQuest = NSTaskContentQuestAdapter.TaskContentQuest

export default class TaskContentQuestAdapter<
	RequestBackendConfigType
> extends NSTaskContentQuestAdapter.AbstractTaskContentQuestAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	getQuestsForContent(content_id: string): Paginator<NSTaskContentQuestAdapter.TaskContentQuest, any> {
		return new Paginator<TaskContentQuest, any>((config) => {
			return this.requestAdapter.getAuthorized(`plugins.php/argonautsplugin/contents/${content_id}/quests`, config)
		}, (data): TaskContentQuest => {
			return {
				id: data.id,
				title: data.attributes.name as string,
				question: data.attributes.question as string,
				image: data.attributes.image as string,
				prePhrase: data.attributes.prePhrase as string,
				content: data.attributes.content as string,
				multiple: data.attributes.multiple,
				require_order: data.attributes.require_order,
				custom_answer: data.attributes.custom_answer,
				answers: AsyncIterableWrapper.fromAsyncIterable(this.backendAdapter.taskContentQuestAnswerAdapter.getAnswersForQuest(data.id))
			}
		});
	}
}
