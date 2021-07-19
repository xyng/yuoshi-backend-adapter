import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"
import { AbstractPaginator } from "./AbstractPaginator"

export namespace NSLearningObjectiveAdapter {
	export interface LearningObjective<T = any> extends DefaultEntity<T> {
		title: string
		description?: string
		image?: string
	}
	export abstract class AbstractLearningObjectiveAdapter<
		RequestConfigType,
		AuthenticationHandler extends AuthenticationHandlerInterface
	> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		abstract getLearningObjectivesForPackage(package_id: string): AbstractPaginator<LearningObjective, any>
	}
}
