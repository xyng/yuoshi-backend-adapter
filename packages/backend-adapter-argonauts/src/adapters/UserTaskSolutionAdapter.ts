import { NSUserTaskSolution } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"
import AbstractUserTaskSolutionAdapter = NSUserTaskSolution.AbstractUserTaskSolutionAdapter
import QuestSolution = NSUserTaskSolution.QuestSolution
import UserTaskSolutionModel = NSUserTaskSolution.UserTaskSolutionModel
import Paginator from "../Paginator"
export class UserTaskSolutionAdapter<RequestBackendConfigType> extends AbstractUserTaskSolutionAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
> {
	async getCurrentTaskPosition(
		task_id: string,
		solution_id?: string
	): Promise<{
		id: string
		current_content?: string
		current_quest?: string
		done_contents: string[]
		done_quests: string[]
	}> {
		const reqPath = solution_id ? `/task_solutions/${solution_id}` : `/tasks/${task_id}/current_task_solution`

		const { data } = await this.requestAdapter.getAuthorized(reqPath, {
			params: {
				include: [
					"current_content_solution.current_quest",
					"current_content_solution.done_quests",
					"current_content_solution.content",
					"done_content_solutions.content",
					"done_content_solutions.done_quests",
				].join(","),
			},
		})

		if (!data || !data?.data) {
			throw new Error("could not get current solution for given task")
		}

		const { data: jsonData, included = [] } = data

		const currentContentSolutionInfo = jsonData.relationships.current_content_solution.data
		const currentContentSolution = !currentContentSolutionInfo
			? undefined
			: included.find(elem => {
					return elem.type === currentContentSolutionInfo.type && elem.id === currentContentSolutionInfo.id
			  })
		const currentContentInfo = currentContentSolution
			? currentContentSolution.relationships.content.data
			: undefined
		const currentQuestInfo = currentContentSolution
			? currentContentSolution.relationships.current_quest.data
			: undefined

		const done_content_solutionsInfo = jsonData.relationships.done_content_solutions.data || []
		const done_content_solutions = included.filter(elem => {
			return done_content_solutionsInfo.find(info => info.type === elem.type && info.id === elem.id)
		})

		return {
			id: jsonData.id,
			current_content: currentContentInfo?.id,
			current_quest: currentQuestInfo?.id,
			done_contents: done_content_solutions
				.map(contentSolution => {
					return contentSolution.relationships.content.data?.id
				})
				.filter(Boolean),
			done_quests: done_content_solutions
				.map(contentSolution => {
					return (contentSolution.relationships.done_quests.data || []).map(data => data.id)
				})
				.flat(),
		}
	}

	getAllUserSolutions(user_id: string): Paginator<NSUserTaskSolution.UserTaskSolution, any> {
		return new Paginator<NSUserTaskSolution.UserTaskSolution, RequestBackendConfigType>(
			config => {
				return this.requestAdapter.getAuthorized(`/userTask_solutions/${user_id}`, config)
			},
			data => {
				return {
					id: data.id as string,
					task_id: data.attributes.task_id,
					contents: data.attributes,
				}
			}
		)
	}

	async saveContentSolution(
		content_id: string,
		value: object
	): Promise<
		| {
				id: string
				value: string
		  }
		| undefined
	> {
		const { data } = await this.requestAdapter.postAuthorized(
			`/content_solutions`,
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
							},
						},
					},
				},
			},
			{
				headers: {
					"Content-Type": "application/vnd.api+json",
				},
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

	async saveQuestSolution(
		quest_id: string,
		answers: QuestSolution[]
	): Promise<
		| {
				id: string
				is_correct: boolean
				score: number
				sent_solution: boolean
		  }
		| undefined
	> {
		const { data } = await this.requestAdapter.postAuthorized(
			`/quest_solutions`,
			{
				data: {
					attributes: {},
					relationships: {
						quest: {
							type: "quests",
							data: {
								id: quest_id,
							},
						},
						answers: answers.map(answer => {
							return {
								type: "quest_solution_answers",
								data: {
									attributes: {
										custom: answer.custom,
										sort: answer.sort,
									},
									relationships: answer.answer_id
										? {
												answer: {
													type: "answers",
													data: {
														id: answer.answer_id,
													},
												},
										  }
										: undefined,
								},
							}
						}),
					},
				},
			},
			{
				headers: {
					"Content-Type": "application/vnd.api+json",
				},
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

	async getSampleSolution(
		quest_solution_id: string
	): Promise<
		| {
				quest_id: string
				answers: {
					id: string
					sort: number | undefined
					is_correct: boolean
					content: string
				}[]
		  }
		| undefined
	> {
		const { data } = await this.requestAdapter.getAuthorized(
			`/quest_solutions/${quest_solution_id}/sample_solution`
		)

		return data
	}

	async saveCompleteTask(task_id: string, solution: NSUserTaskSolution.UserTaskSolutionModel) {
		if (!solution.contents) {
			return
		}

		const quest_solutions = []

		// save contents concurrently but every quests for every content sequentially (see below for reason)
		const content_solutions = solution.contents.map(async content => {
			let content_solution: ReturnType<UserTaskSolutionAdapter<RequestBackendConfigType>["saveContentSolution"]>
			if (content.value) {
				let value: object

				if (typeof content.value === "string") {
					value = {
						value: content.value,
					}
				} else {
					value = content.value
				}

				try {
					content_solution = this.saveContentSolution(content.content_id, value)
				} catch (ignore) {}
			}

			const answersByQuest = (content.answers || []).reduce<{
				[key: string]: QuestSolution[]
			}>((acc, value) => {
				acc[value.quest_id] = acc[value.quest_id] || []
				acc[value.quest_id].push(value)

				return acc
			}, {})

			for (const key in answersByQuest) {
				// make quest saves sequential.
				// the server may have hiccups (eg. create two content solutions for one content)
				// if we save concurrently
				quest_solutions.push(await this.saveQuestSolution(key, answersByQuest[key]))
			}

			return content_solution
		})

		return {
			content_solutions: await Promise.all(content_solutions),
			quest_solutions: quest_solutions,
		}
	}

	private resolveIncluded(data: any, entity?: { type: string; id: string }) {
		if (!entity) {
			return []
		}

		return (
			data.included.filter(e => {
				return e.type === entity.type && e.id === entity.id
			}) ?? []
		)
	}

	public async getCurrentSolution(task_id: string): Promise<UserTaskSolutionModel | undefined> {
		const { data } = await this.requestAdapter.getAuthorized(
			`/tasks/${task_id}/current_task_solution?no_create&include=content_solutions.quest_solutions.answers`
		)

		const solution = data?.data

		if (!solution) {
			return undefined
		}

		const content_solutions = this.resolveIncluded(data, solution?.relationships?.content_solution.data)

		return {
			task_id,
			contents: content_solutions.map(content_solution => {
				const quest_solutions = this.resolveIncluded(data, content_solution?.relationships?.quest_solution.data)

				return {
					content_id: content_solution.content_id,
					value: content_solution.value,
					answers: quest_solutions.reduce((acc, quest_solution) => {
						const answers = this.resolveIncluded(data, quest_solution?.relationships?.answers.data)

						return [
							...acc,
							...answers.map(
								(answer): QuestSolution => {
									if (answer.custom) {
										return {
											quest_id: quest_solution.data.quest_id,
											custom: answer.custom,
											sort: answer.sort,
										}
									}

									return {
										quest_id: quest_solution.data.quest_id,
										answer_id: answer.answer_id,
										sort: answer.sort,
									}
								}
							),
						]
					}, []),
				}
			}),
		}
	}
}
