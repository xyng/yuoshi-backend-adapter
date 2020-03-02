import { HttpException } from "./HttpException"

export default class HttpForbiddenException extends HttpException {
	protected defaultName = "403 Forbidden"
}
