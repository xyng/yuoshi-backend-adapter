import { NSUserTaskSolution } from "@xyng/yuoshi-backend-adapter"
import AbstractUserTaskSolutionAdapter = NSUserTaskSolution.AbstractUserTaskSolutionAdapter
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"

export class UserTaskSolutionAdapter<RequestBackendConfigType> extends AbstractUserTaskSolutionAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	async saveSolution(solution: NSUserTaskSolution.UserTaskSolutionModel): Promise<void> {
		await this.requestAdapter.postAuthorized(
			`plugins.php/argonautsplugin/tasks/solutions`,
			{
				data: {
					type: "solutions",
					attributes: {
						task_id: solution.task_id
					},
					relationships: {
						content_solutions: solution.contents.map((content) => {
							return {
								data: {
									type: "content_solutions",
									attributes: {
										content_id: content.content_id,
										value: content.value,
									},
									relationships: {
										content_quest_solutions: (content.answers || []).map((answer) => {
											return {
												data: {
													type: "content_quest_solutions",
													attributes: {
														...answer,
													},
												}
											}
										})
									}
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
			})
	}
}
