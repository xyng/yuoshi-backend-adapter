import { RequestAdapterConfiguration, RequestResponseType } from "../interfaces/RequestAdapterInterface"

export interface PaginationInfo {
	page: number,
	perPage: number,
	total: number,
}

export interface PaginationData<T> {
	content: T[],
	info: PaginationInfo
}

export abstract class AbstractPaginator<T, Config> implements AsyncIterable<T> {
	protected constructor(
		protected currentInfo: PaginationInfo,
		protected makeRequest: (config: RequestAdapterConfiguration<Config>) => Promise<RequestResponseType>
	) {}

	abstract paginate(page: number, perPage?: number): Promise<PaginationData<T>>

	abstract next(): Promise<PaginationData<T>>
	abstract previous(): Promise<PaginationData<T>>

	abstract setPerPage(perPage: number): void

	async *[Symbol.asyncIterator](): AsyncIterator<T> {
		let page = 0
		const { perPage } = this.currentInfo

		let lastInfo: PaginationInfo = undefined

		while (!lastInfo || page * perPage < lastInfo.total) {
			const { content, info } = await this.paginate(page++, perPage)

			lastInfo = info

			for (let item of content) {
				yield item
			}
		}
	}
}
