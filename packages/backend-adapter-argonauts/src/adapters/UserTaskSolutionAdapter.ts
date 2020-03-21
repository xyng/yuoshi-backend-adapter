import { NSUserTaskSolution } from "@xyng/yuoshi-backend-adapter"
import AbstractUserTaskSolutionAdapter = NSUserTaskSolution.AbstractUserTaskSolutionAdapter
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"

export class UserTaskSolutionAdapter<RequestBackendConfigType> extends AbstractUserTaskSolutionAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	async saveSolution(solution: NSUserTaskSolution.UserTaskSolutionModel): Promise<void> {
		await this.requestAdapter.post(`plugins.php/argonautsplugin/tasks/solutions`, solution, {
			auth: true
		})
	}
}
