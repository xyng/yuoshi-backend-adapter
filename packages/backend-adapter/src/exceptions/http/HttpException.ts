export class HttpException extends Error {
	protected defaultName: string = "HttpException"

	constructor(
		name?: string,
		message?: string,
		stack?: string
	) {
		super(message)

		this.name = name || this.defaultName
		this.stack = stack
	}
}
