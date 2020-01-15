import { HttpException } from "./HttpException"

export default class HttpUnauthorizedException extends HttpException {
	protected defaultName = "401 Unauthorized"
}
