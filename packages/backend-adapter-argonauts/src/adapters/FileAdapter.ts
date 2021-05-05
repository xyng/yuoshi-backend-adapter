import { NSFileAdapter } from "@xyng/yuoshi-backend-adapter"

import { StudipOauthAuthenticationHandler } from "../StudipOauthAuthenticationHandler"

export default class FileAdapter<RequestBackendConfigType> extends NSFileAdapter.AbstractFileAdapter<
	RequestBackendConfigType,
	StudipOauthAuthenticationHandler
> {
    async getFile(file_id: string): Promise<string> {
        const response = await this.requestAdapter.getAuthorized(`/yuoshi_images/${file_id}`, {
        	responseType: "blob"
		})

		return response.data;
    }
}
