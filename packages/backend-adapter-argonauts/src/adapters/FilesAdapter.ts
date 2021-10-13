import { NSFilesAdapter } from "@xyng/yuoshi-backend-adapter"
import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"

export default class FilesAdapter<RequestBackendConfigType> extends NSFilesAdapter.AbstractFilesAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
> {
	async getFileById(file_id: string): Promise<NSFilesAdapter.StudipFile | undefined> {
		const {
			data: { data },
		} = await this.requestAdapter.getAuthorized(`/files/${file_id}/file-refs`)

		if (!data) {
			return undefined
		}

		return {
			id: data[0].id,
			name: data[0].attributes.name,
		}
	}
}
