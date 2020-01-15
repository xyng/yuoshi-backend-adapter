import {
	NSUserAdapter,
	RequestError,
} from "@xyng/backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"

import User = NSUserAdapter.User
import UserInfo = NSUserAdapter.UserInfo

export const mapUserData = (data: any): User => {
	return {
		id: data.id || data.user_id,
		avatar: data.meta.avatar.original,
		name: {
			prefix: data.attributes["name-prefix"],
			suffix: data.attributes["name-suffix"],
			given: data.attributes["given-name"],
			family: data.attributes["family-name"],
		}
	}
}

export default class UserAdapter<
	RequestBackendConfigType
> extends NSUserAdapter.AbstractUserAdapter<RequestBackendConfigType, StudipOauthAuthenticationHandler> {
	async getInfo(user_id: string = "me"): Promise<UserInfo | undefined> {
		try {
			const { data } = await this.requestAdapter.get(`plugins.php/argonautsplugin/users/${user_id}`, {
				auth: true
			})

			if (typeof data !== "object") {
				return undefined
			}

			const { data: userData } = data

			let role: "teacher" | "student";
			switch (userData.attributes["global-permission"]) {
				case "dozent":
				case "tutor":
					role = "teacher"
					break;
				default:
					role = "student"
			}

			return {
				...mapUserData(userData),
				username: userData.attributes.username,
				role,
			}
		} catch (e) {
			if (e instanceof RequestError && e.status === 401) {
				return undefined
			}

			throw e
		}
	}
}
