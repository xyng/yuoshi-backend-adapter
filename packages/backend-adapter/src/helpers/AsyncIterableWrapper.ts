export default class AsyncIterableWrapper<T> implements AsyncIterable<T> {
	constructor(
		protected iterator: AsyncIterator<T>
	) {}

	[Symbol.asyncIterator](): AsyncIterator<T> {
		return this.iterator
	}

	static fromArray<T>(array: T[]) {
		async function* from() {
			for (const item of array) {
				yield item
			}
		}

		return new AsyncIterableWrapper<T>(from())
	}

	static fromAsyncIterable<T>(iterable: AsyncIterable<T>) {
		return new AsyncIterableWrapper(iterable[Symbol.asyncIterator]())
	}

	public map<M>(mapper: (item: T) => Promise<M> | M): AsyncIterableWrapper<M> {
		return new AsyncIterableWrapper(async function* (that) {
			for await (const item of that) {
				yield await mapper(item)
			}
		}(this))
	}

	public filter(filter: (item: T) => Promise<boolean> | boolean) {
		return new AsyncIterableWrapper(async function* (that) {
			for await (const item of that) {
				if (!await filter(item)) {
					continue
				}

				yield item
			}
		}(this))
	}

	public async reduce<U>(callbackfn: (previousValue: U, currentValue: T) => U, initialValue: Promise<U> | U): Promise<U> {
		let accumulator = await initialValue

		for await (const item of this) {
			accumulator = await callbackfn(accumulator, item)
		}

		return accumulator
	}

	public async contains(fn: (item: T) => Promise<boolean> | boolean): Promise<boolean> {
		for await (const item of this) {
			if (fn(item)) {
				return true;
			}
		}

		return false;
	}

	public async toArray() {
		const arr: T[] = [];

		for await (const item of this) {
			arr.push(item)
		}

		return arr
	}
}
