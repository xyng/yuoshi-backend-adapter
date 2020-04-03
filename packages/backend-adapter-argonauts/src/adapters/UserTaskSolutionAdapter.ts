import { NSUserTaskSolution } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import AbstractUserTaskSolutionAdapter = NSUserTaskSolution.AbstractUserTaskSolutionAdapter
import Answer = NSUserTaskSolution.Answer

export class UserTaskSolutionAdapter<RequestBackendConfigType> extends AbstractUserTaskSolutionAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	async getCurrentTaskPosition(task_id: string, solution_id?: string): Promise<{
		id: string
		current_content?: string
		current_quest?: string
		done_contents: string[]
		done_quests: string[]
	}> {
		const reqPath = solution_id
			? `plugins.php/argonautsplugin/task_solutions/${solution_id}`
			: `plugins.php/argonautsplugin/tasks/${task_id}/current_task_solution`

		const { data } = await this.requestAdapter.getAuthorized(
			reqPath,
			{
				params: {
					include: [
						"current_content_solution.current_quest",
						"current_content_solution.done_quests",
						"current_content_solution.content",
						"done_content_solutions.content",
						"done_content_solutions.done_quests",
					].join(",")
				}
			}
		)

		if (!data || !data?.data) {
			throw new Error("could not get current solution for given task")
		}

		const { data: jsonData, included = [] } = data

		const currentContentSolutionInfo = jsonData.relationships.current_content_solution.data
		const currentContentSolution = !currentContentSolutionInfo ? undefined : included.find((elem) => {
			return elem.type === currentContentSolutionInfo.type && elem.id === currentContentSolutionInfo.id
		})
		const currentContentInfo = currentContentSolution ? currentContentSolution.relationships.content.data : undefined
		const currentQuestInfo = currentContentSolution ? currentContentSolution.relationships.current_quest.data : undefined

		const done_content_solutionsInfo = jsonData.relationships.done_content_solutions.data || []
		const done_content_solutions = included.filter((elem) => {
			return done_content_solutionsInfo.find(info => info.type === elem.type && info.id === elem.id)
		})

		return {
			id: jsonData.id,
			current_content: currentContentInfo?.id,
			current_quest: currentQuestInfo?.id,
			done_contents: done_content_solutions.map((contentSolution) => {
				return contentSolution.relationships.content.data?.id
			}).filter(Boolean),
			done_quests: done_content_solutions.map((contentSolution) => {
				return (contentSolution.relationships.done_quests.data || []).map(data => data.id)
			}).flat(),
		}
	}

	async saveContentSolution(content_id: string, value: object): Promise<{
		id: string,
		value: string
	} | undefined> {
		const { data } = await this.requestAdapter.postAuthorized(
			`plugins.php/argonautsplugin/content_solutions`,
			{
				data: {
					attributes: {
						value,
					},
					relationships: {
						content: {
							type: "contents",
							data: {
								id: content_id,
							}
						}
					}
				}
			},
			{
				headers: {
					"Content-Type": "application/vnd.api+json"
				}
			}
		)

		if (!data || !data.data) {
			return undefined
		}

		return {
			id: data.id,
			value: data.data.attributes.value,
		}
	}

	async saveQuestSolution(quest_id: string, answers: Answer[]): Promise<{
		id: string,
		is_correct: boolean
		score: number
		sent_solution: boolean,
	} | undefined> {
		const { data } = await this.requestAdapter.postAuthorized(
			`plugins.php/argonautsplugin/quest_solutions`,
			{
				data: {
					attributes: {},
					relationships: {
						quest: {
							type: "quests",
							data: {
								id: quest_id,
							}
						},
						answers: answers.map((answer) => {
							return {
								type: "quest_solution_answers",
								data: {
									attributes: {
										custom: answer.custom,
										sort: answer.sort,
									},
									relationships: answer.answer_id ? {
										answer: {
											type: "answers",
											data: {
												id: answer.answer_id
											}
										}
									} : undefined
								}
							}
						})
					}
				}
			},
			{
				headers: {
					"Content-Type": "application/vnd.api+json"
				}
			}
		)

		if (!data || !data.data) {
			return undefined
		}

		return {
			id: data.data.id,
			is_correct: data.data.attributes.is_correct,
			score: data.data.attributes.score,
			sent_solution: data.data.attributes.sent_solution,
		}
	}

	async getSampleSolution(quest_solution_id: string): Promise<{
		quest_id: string
		answers: {
			id: string
			sort: number | undefined
			is_correct: boolean
			content: string
		}[]
	} | undefined> {
		const { data } = await this.requestAdapter.getAuthorized(
			`plugins.php/argonautsplugin/quest_solutions/${quest_solution_id}/sample_solution`
		)

		return data
	}
}
