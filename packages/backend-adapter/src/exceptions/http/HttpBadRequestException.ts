import { HttpException } from "./HttpException"

export default class HttpBadRequestException extends HttpException {
	protected defaultName = "400 Bad Request"
}
