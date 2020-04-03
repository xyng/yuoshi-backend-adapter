import { AbstractPaginator, PaginationData, RequestAdapterConfiguration, RequestResponseType } from "@xyng/yuoshi-backend-adapter"

export default class Paginator<T, Config> extends AbstractPaginator<T, Config> {
	constructor(
		makeRequest: (config: RequestAdapterConfiguration<Config>) => Promise<RequestResponseType>,
		protected mapData: (data: any) => (Promise<T> | T) = (data) => data
	) {
		super({
			total: 0,
			page: 1,
			perPage: 20,
		}, makeRequest);
	}

	async paginate(page: number = 1, perPage: number = this.currentInfo.perPage): Promise<PaginationData<T>> {
		const { data } = await this.makeRequest({
			// params: {
			// 	"page[offset]": page * perPage,
			// 	"page[limit]": perPage,
			// }
		})

		return {
			content: await Promise.all((data.data || []).map(this.mapData)),
			info: {
				total: data.meta.page.total,
				page: data.meta.page.offset / data.meta.page.limit,
				perPage: data.meta.page.limit
			}
		};
	}

	next(): Promise<PaginationData<T>> {
        return this.paginate(++this.currentInfo.page)
    }

    previous(): Promise<PaginationData<T>> {
        return this.paginate(Math.min(--this.currentInfo.page, 1))
    }

    setPerPage(perPage: number) {
		this.currentInfo.perPage = perPage
	}
}
