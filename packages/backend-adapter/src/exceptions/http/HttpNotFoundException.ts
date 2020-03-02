import { HttpException } from "./HttpException"

export default class HttpNotFoundException extends HttpException {
	protected defaultName = "404 Not Found"
}
