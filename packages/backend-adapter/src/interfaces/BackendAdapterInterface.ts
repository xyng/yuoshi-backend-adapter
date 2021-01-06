import AuthenticationHandlerInterface from "./AuthenticationHandlerInterface"

import { NSUserAdapter } from "../adapters/AbstractUserAdapter"
import { NSCourseAdapter } from "../adapters/AbstractCourseAdapter"
import { NSPackageAdapter } from "../adapters/AbstractPackageAdapter"
import { NSStationsAdapter } from "../adapters/AbstractStationsAdapter"
import { NSTaskAdapter } from "../adapters/AbstractTaskAdapter"
import { NSTaskContentAdapter } from "../adapters/AbstractTaskContentAdapter"
import { NSTaskContentQuestAdapter } from "../adapters/AbstractTaskContentQuestAdapter"
import { NSTaskContentQuestAnswerAdapter } from "../adapters/AbstractTaskContentQuestAnswerAdapter"
import { NSUserTaskSolution } from "../adapters/AbstractUserTaskSolutionAdapter"

export interface BackendAdapterInterface<
	RequestBackendConfigType,
	AuthenticationHandler extends AuthenticationHandlerInterface
> {
	readonly userAdapter: NSUserAdapter.AbstractUserAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly courseAdapter: NSCourseAdapter.AbstractCourseAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly packageAdapter: NSPackageAdapter.AbstractPackageAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly stationAdapter: NSStationsAdapter.AbstractStationsAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly taskAdapter: NSTaskAdapter.AbstractTaskAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly taskContentAdapter: NSTaskContentAdapter.AbstractTaskContentAdapter<
		RequestBackendConfigType,
		AuthenticationHandler
	>
	readonly taskContentQuestAdapter: NSTaskContentQuestAdapter.AbstractTaskContentQuestAdapter<
		RequestBackendConfigType,
		AuthenticationHandler
	>
	readonly taskContentQuestAnswerAdapter: NSTaskContentQuestAnswerAdapter.AbstractTaskContentQuestAnswerAdapter<
		RequestBackendConfigType,
		AuthenticationHandler
	>
	readonly userTaskSolutionAdapter: NSUserTaskSolution.AbstractUserTaskSolutionAdapter<
		RequestBackendConfigType,
		AuthenticationHandler
	>
}
