// Basic Interfaces

export {
	RequestError,
	NetworkError,
	RequestResponseType,
	RequestAdapterConfiguration,
} from "./interfaces/RequestAdapterInterface"

export { BackendAdapterInterface } from "./interfaces/BackendAdapterInterface"

export { default as AuthenticationHandlerInterface } from "./interfaces/AuthenticationHandlerInterface"

export { OAuth1AuthenticationHandler } from "./adapters/OAuth1AuthenticationHandler"

export { AbstractPaginator, PaginationData } from "./adapters/AbstractPaginator"

export { AbstractRequestAdapter } from "./adapters/AbstractRequestAdapter"

// Adapter Interfaces
export { NSUserAdapter } from "./adapters/AbstractUserAdapter"
export { NSCourseAdapter } from "./adapters/AbstractCourseAdapter"
export { NSPackageAdapter } from "./adapters/AbstractPackageAdapter"
export { NSStationsAdapter } from "./adapters/AbstractStationsAdapter"
export { NSLearningObjectiveAdapter } from "./adapters/AbstractLearningObjectivesAdapter"
export { NSTaskAdapter } from "./adapters/AbstractTaskAdapter"
export { NSTaskContentAdapter } from "./adapters/AbstractTaskContentAdapter"
export { NSTaskContentQuestAdapter } from "./adapters/AbstractTaskContentQuestAdapter"
export { NSTaskContentQuestAnswerAdapter } from "./adapters/AbstractTaskContentQuestAnswerAdapter"
export { NSUserTaskSolution } from "./adapters/AbstractUserTaskSolutionAdapter"
export { NSFilesAdapter } from "./adapters/AbstractFilesAdapter"

// Helpers
export { default as AsyncIterableWrapper } from "./helpers/AsyncIterableWrapper"
export * from "./helpers/parseContent"

// Tasks
export * from "./adapters/Tasks/Survey"
export * from "./adapters/Tasks/Multi"
export * from "./adapters/Tasks/Drag"
export * from "./adapters/Tasks/Cloze"
export * from "./adapters/Tasks/Tag"
export * from "./adapters/Tasks/Memory"
export * from "./adapters/Tasks/Card"
export * from "./adapters/Tasks/Training"

export { default as TaskFactory } from "./adapters/Tasks/TaskFactory"
