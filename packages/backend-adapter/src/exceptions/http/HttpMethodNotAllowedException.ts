import { HttpException } from "./HttpException"

export default class HttpMethodNotAllowedException extends HttpException {
	protected defaultName = "401 Method Not Allowed"
}
