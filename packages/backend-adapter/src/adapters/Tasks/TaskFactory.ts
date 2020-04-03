import { BaseTask, BaseTaskConstructData, DefaultBaseTaskConstructData, StaticBaseTask } from "./BaseTask"
import { Multi, StaticMulti } from "./Multi"
import { StaticSurvey, Survey } from "./Survey"
import { Drag, StaticDrag } from "./Drag"
import { Cloze, StaticCloze } from "./Cloze"
import { StaticTag, Tag } from "./Tag"
import { Memory, StaticMemory } from "./Memory"
import { Card, StaticCard } from "./Card"
import { StaticTraining, Training } from "./Training"

export enum TaskTypeName {
	SURVEY = "survey",
	MULTI = "multi",
	DRAG = "drag",
	CLOZE = "cloze",
	TAG = "tag",
	MEMORY = "memory",
	CARD = "card",
	TRAINING = "training"
}

type TaskTypeMap = {
	[TaskTypeName.SURVEY]: Survey
	[TaskTypeName.MULTI]: Multi
	[TaskTypeName.DRAG]: Drag
	[TaskTypeName.CLOZE]: Cloze
	[TaskTypeName.TAG]: Tag
	[TaskTypeName.MEMORY]: Memory
	[TaskTypeName.CARD]: Card
	[TaskTypeName.TRAINING]: Training
}

type StaticTaskTypeMap = {
	[TaskTypeName.SURVEY]: StaticSurvey
	[TaskTypeName.MULTI]: StaticMulti
	[TaskTypeName.DRAG]: StaticDrag
	[TaskTypeName.CLOZE]: StaticCloze
	[TaskTypeName.TAG]: StaticTag
	[TaskTypeName.MEMORY]: StaticMemory
	[TaskTypeName.CARD]: StaticCard
	[TaskTypeName.TRAINING]: StaticTraining
}

type StaticTaskType<TKey extends keyof StaticTaskTypeMap> = StaticTaskTypeMap[TKey]
type TaskType<TKey extends keyof TaskTypeMap> = TaskTypeMap[TKey]

type InferContentType<T> = T extends BaseTask<infer C> ? C : never

export default class TaskFactory {
	static getTask<TKey extends keyof TaskTypeMap>(type: TKey, task: DefaultBaseTaskConstructData): TaskType<TKey> {
		// return and task typing is weird in here. seems to work from the outside though.
		switch (type) {
			case TaskTypeName.SURVEY:
				return new Survey(task) as any
			case TaskTypeName.MULTI:
				return new Multi(task) as any
			case TaskTypeName.DRAG:
				return new Drag(task) as any
			case TaskTypeName.CLOZE:
				return new Cloze(task) as any
			case TaskTypeName.TAG:
				return new Tag(task) as any
			case TaskTypeName.MEMORY:
				return new Memory(task) as any
			case TaskTypeName.CARD:
				return new Card(task) as any
			case TaskTypeName.TRAINING:
				return new Training(task) as any
			default:
				throw new Error("Unknown Task type given");
		}
	}

	static getStaticTask<TKey extends keyof StaticTaskTypeMap>(type: TKey, task: BaseTaskConstructData<InferContentType<StaticTaskType<TKey>>>): StaticTaskType<TKey> {
		// return and task typing is weird in here. seems to work from the outside though.
		switch (type) {
			case TaskTypeName.SURVEY:
				return new StaticSurvey(task as any) as any
			case TaskTypeName.MULTI:
				return new StaticMulti(task as any) as any
			case TaskTypeName.DRAG:
				return new StaticDrag(task as any) as any
			case TaskTypeName.CLOZE:
				return new StaticCloze(task as any) as any
			case TaskTypeName.TAG:
				return new StaticTag(task as any) as any
			case TaskTypeName.MEMORY:
				return new StaticMemory(task as any) as any
			case TaskTypeName.CARD:
				return new StaticCard(task as any) as any
			case TaskTypeName.TRAINING:
				return new StaticTraining(task as any) as any
			default:
				throw new Error("Unknown Task type given");
		}
	}
}
