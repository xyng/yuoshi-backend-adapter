class AsyncIterableClass<T> implements AsyncIterable<T> {
	constructor(
		protected iterator: AsyncIterator<T>
	) {}

	[Symbol.asyncIterator](): AsyncIterator<T> {
		return this.iterator
	}
}

export default class AsyncIterableWrapper<T> implements AsyncIterable<T> {
	protected done = false
	protected buffer: T[] = []
	protected iterator: AsyncIterableClass<T>
	constructor(
		iterator: AsyncIterator<T>,
		protected repeatable = true
	) {
		this.iterator = new AsyncIterableClass<T>(iterator)
	}

	getIterable(): AsyncIterable<T> {
		return this
	}

	async *[Symbol.asyncIterator](): AsyncIterator<T> {
		if (!this.repeatable) {
			for await (const item of this.iterator) {
				yield item
			}

			return
		}

		if (this.done) {
			for (const item of this.buffer) {
				yield item
			}

			return
		}

		for await (const item of this.iterator) {
			this.buffer.push(item)

			yield item
		}

		this.done = true
	}

	static fromArray<T>(array: T[], repeatable = true) {
		return AsyncIterableWrapper.fromIterable(array, repeatable)
	}

	static fromAsyncIterable<T>(iterable: AsyncIterable<T>, repeatable = true) {
		return new AsyncIterableWrapper(iterable[Symbol.asyncIterator](), repeatable)
	}

	static fromIterable<T>(iterable: Iterable<T>, repeatable = true) {
		async function* from() {
			for (const item of iterable) {
				yield item
			}
		}

		return new AsyncIterableWrapper<T>(from(), repeatable)
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

	public async first(): Promise<T> {
		const iterator = this[Symbol.asyncIterator]()

		const { value } = await iterator.next()

		if (value === undefined) {
			throw new Error("Called first on empty iterator")
		}

		return value
	}
}
