import { NSFilesAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"

export default class FilesAdapter<RequestBackendConfigType> extends NSFilesAdapter.AbstractFilesAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
> {
	async getFileById(file_id: string): Promise<NSFilesAdapter.StudipFile | undefined> {
		const {
			data: { data },
		} = await this.requestAdapter.getAuthorized(`/files/${file_id}`)

		if (!data) {
			return undefined
		}
		console.log("EVER????!!!", data)

		data => {
			return {
				id: data.id as string,
				mime_type: data.mime_type as string,
				name: data.name as string,
				user_id: data.user_id as string,
			}
		}
	}
}
