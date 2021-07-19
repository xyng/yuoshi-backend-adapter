import {
	AbstractRequestAdapter,
	BackendAdapterInterface,
	NSTaskContentAdapter,
	NSTaskContentQuestAdapter,
	NSTaskContentQuestAnswerAdapter,
} from "@xyng/yuoshi-backend-adapter"

import { StudipOauthAuthenticationHandler } from "./StudipOauthAuthenticationHandler"

import UserAdapter from "./adapters/UserAdapter"
import CourseAdapter from "./adapters/CourseAdapter"
import PackageAdapter from "./adapters/PackageAdapter"
import StationsAdapter from "./adapters/StationAdapter"
import TaskAdapter from "./adapters/TaskAdapter"
import TaskContentAdapter from "./adapters/TaskContentAdapter"
import TaskContentQuestAdapter from "./adapters/TaskContentQuestAdapter"
import TaskContentQuestAnswerAdapter from "./adapters/TaskContentQuestAnswerAdapter"
import { UserTaskSolutionAdapter } from "./adapters/UserTaskSolutionAdapter"
import LearningObjectiveAdapter from "./adapters/LearningObjectiveAdapter"

export default class BackendAdapter<RequestBackendConfigType>
	implements BackendAdapterInterface<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	readonly userAdapter: UserAdapter<RequestBackendConfigType>
	readonly courseAdapter: CourseAdapter<RequestBackendConfigType>
	readonly packageAdapter: PackageAdapter<RequestBackendConfigType>
	readonly stationAdapter: StationsAdapter<RequestBackendConfigType>
	readonly learningObjectiveAdapter: LearningObjectiveAdapter<RequestBackendConfigType>

	readonly taskAdapter: TaskAdapter<RequestBackendConfigType>
	readonly taskContentAdapter: TaskContentAdapter<RequestBackendConfigType>
	readonly taskContentQuestAdapter: TaskContentQuestAdapter<RequestBackendConfigType>
	readonly taskContentQuestAnswerAdapter: TaskContentQuestAnswerAdapter<RequestBackendConfigType>
	readonly userTaskSolutionAdapter: UserTaskSolutionAdapter<RequestBackendConfigType>

	constructor(requestAdapter: AbstractRequestAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler>) {
		this.userAdapter = new UserAdapter(requestAdapter, this)
		this.courseAdapter = new CourseAdapter(requestAdapter, this)
		this.packageAdapter = new PackageAdapter(requestAdapter, this)
		this.stationAdapter = new StationsAdapter(requestAdapter, this)
		this.learningObjectiveAdapter = new LearningObjectiveAdapter(requestAdapter, this)
		this.taskAdapter = new TaskAdapter(requestAdapter, this)
		this.taskContentAdapter = new TaskContentAdapter(requestAdapter, this)
		this.taskContentQuestAdapter = new TaskContentQuestAdapter(requestAdapter, this)
		this.taskContentQuestAnswerAdapter = new TaskContentQuestAnswerAdapter(requestAdapter, this)
		this.userTaskSolutionAdapter = new UserTaskSolutionAdapter(requestAdapter, this)
	}
}
