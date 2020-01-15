import { RequestAdapterInterface } from "../interfaces/RequestAdapterInterface"
import { DefaultEntity, DefaultYuoshiAdapter } from "./DefaultYuoshiAdapter"
import AuthenticationHandlerInterface from "../interfaces/AuthenticationHandlerInterface"

export namespace NSUserAdapter {
	export interface User<T = any> extends DefaultEntity<T> {
		avatar?: string
		name: {
			prefix?: string
			suffix?: string,
			given: string,
			family: string,
		}
	}

	export interface UserInfo<T = any> extends User<T> {
		username: string
		role: "teacher" | "student"
	}

	export abstract class AbstractUserAdapter<RequestConfigType, AuthenticationHandler extends AuthenticationHandlerInterface> extends DefaultYuoshiAdapter<RequestConfigType, AuthenticationHandler> {
		public abstract getInfo(user_id?: string): Promise<UserInfo | undefined>
	}
}
