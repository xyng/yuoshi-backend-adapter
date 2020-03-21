import { Quest, QuestionBasedStaticTask, QuestionBasedTask } from "./QuestionBasedTask"
import { BaseTaskConstructData } from "./BaseTask"

class StaticMulti extends QuestionBasedStaticTask {
	public readonly isTraining: boolean = false
	public readonly type: string = "multi"
}

export class Multi extends QuestionBasedTask<StaticMulti> {
	public readonly type: string = "multi"
	public readonly isTraining: boolean = false

	protected createStatic(data: BaseTaskConstructData<Quest[]>): StaticMulti {
		return new StaticMulti(data);
	}
}
