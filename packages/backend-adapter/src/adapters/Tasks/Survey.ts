import { Quest, QuestionBasedStaticTask, QuestionBasedTask } from "./QuestionBasedTask"
import { BaseTaskConstructData } from "./BaseTask"
import { NSUserTaskSolution } from "../AbstractUserTaskSolutionAdapter"

class StaticSurvey extends QuestionBasedStaticTask {
	public readonly isTraining: boolean = false
	public readonly type: string = "survey"
}

export class Survey extends QuestionBasedTask<StaticSurvey> {
	public readonly type: string = "survey"
	public readonly isTraining: boolean = false

	protected createStatic(data: BaseTaskConstructData<Quest[]>): StaticSurvey {
		return new StaticSurvey(data);
	}

	createAnswer(
		answers: NSUserTaskSolution.UserTaskSolutionModel['answers']
	): NSUserTaskSolution.UserTaskSolutionModel {
		return {
			task_id: this.id,
			answers,
		}
	}
}
