import { Quest, QuestionBasedStaticTask, QuestionBasedTask } from "./QuestionBasedTask"
import { BaseTaskConstructData } from "./BaseTask"

export class StaticSurvey extends QuestionBasedStaticTask {
	public readonly isTraining: boolean = false
	public readonly type: string = "survey"
}

export class Survey extends QuestionBasedTask<StaticSurvey> {
	public readonly type: string = "survey"
	public readonly isTraining: boolean = false

	protected createStatic(data: BaseTaskConstructData<Quest[]>): StaticSurvey {
		return new StaticSurvey(data);
	}
}
