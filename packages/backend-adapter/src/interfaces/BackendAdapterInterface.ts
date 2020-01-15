import AuthenticationHandlerInterface from "./AuthenticationHandlerInterface"

import { NSUserAdapter } from "../adapters/AbstractUserAdapter"
import { NSCourseAdapter } from "../adapters/AbstractCourseAdapter"
import { NSPackageAdapter } from "../adapters/AbstractPackageAdapter"
import { NSTaskAdapter } from "../adapters/AbstractTaskAdapter"
import { NSTaskContentAdapter } from "../adapters/AbstractTaskContentAdapter"
import { NSTaskContentQuestAdapter } from "../adapters/AbstractTaskContentQuestAdapter"
import { NSTaskContentQuestAnswerAdapter } from "../adapters/AbstractTaskContentQuestAnswerAdapter"

export interface BackendAdapterInterface<
	RequestBackendConfigType,
	AuthenticationHandler extends AuthenticationHandlerInterface
> {
	readonly userAdapter: NSUserAdapter.AbstractUserAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly courseAdapter: NSCourseAdapter.AbstractCourseAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly packageAdapter: NSPackageAdapter.AbstractPackageAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly taskAdapter: NSTaskAdapter.AbstractTaskAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly taskContentAdapter: NSTaskContentAdapter.AbstractTaskContentAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly taskContentQuestAdapter: NSTaskContentQuestAdapter.AbstractTaskContentQuestAdapter<RequestBackendConfigType, AuthenticationHandler>
	readonly taskContentQuestAnswerAdapter: NSTaskContentQuestAnswerAdapter.AbstractTaskContentQuestAnswerAdapter<RequestBackendConfigType, AuthenticationHandler>
}
