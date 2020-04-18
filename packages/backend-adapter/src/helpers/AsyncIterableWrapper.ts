class AsyncIterableClass<T> implements AsyncIterable<T> {
	constructor(
		protected iterator: AsyncIterator<T>
	) {}

	[Symbol.asyncIterator](): AsyncIterator<T> {
		return this.iterator
	}
}

class AsyncSingle<T> {
	constructor(
		protected iterator: AsyncIterator<T>
	) {}

	public async value(): Promise<T> {
		const { value, done } = await this.iterator.next()

		if (value === undefined && done) {
			throw new Error("Called value on empty iterator")
		}

		return value
	}

	public then<U>(cb: (arg: T) => Promise<U> | U): AsyncSingle<U> {
		return new AsyncSingle<U>(async function* (that) {
			yield await cb(await that.value())
		}(this))
	}
}

export type AsyncSingleInterface<T> = AsyncSingle<T>

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

	public reduceLazy<U>(callbackFn: (previousValue: U, currentValue: T) => U, initialValue: Promise<U> | U): AsyncSingle<U> {
		return new AsyncSingle(async function* (that) {
			let accumulator = await initialValue

			for await (const item of that) {
				accumulator = await callbackFn(accumulator, item)
			}

			yield accumulator
		}(this))
	}

	public containsLazy(fn: (item: T) => Promise<boolean> | boolean): AsyncSingle<boolean> {
		return new AsyncSingle(async function* (that) {
			for await (const item of that) {
				if (await fn(item)) {
					yield true;
					return
				}
			}

			yield false
		}(this))
	}

	public toArrayLazy() {
		return new AsyncSingle(async function* (that) {
			const arr: T[] = [];

			for await (const item of that) {
				arr.push(item)
			}

			yield arr
		}(this))
	}

	public firstLazy(): AsyncSingle<T> {
		return new AsyncSingle(async function* (that) {
			const iterator = that[Symbol.asyncIterator]()

			const { value } = await iterator.next()

			if (value === undefined) {
				throw new Error("Called value on empty iterator")
			}

			yield value
		}(this))
	}

	public async reduce<U>(callbackFn: (previousValue: U, currentValue: T) => U, initialValue: Promise<U> | U): Promise<U> {
		return this.reduceLazy(callbackFn, initialValue).value()
	}

	public async contains(fn: (item: T) => Promise<boolean> | boolean): Promise<boolean> {
		return this.containsLazy(fn).value()
	}

	public async toArray(): Promise<T[]> {
		return this.toArrayLazy().value()
	}

	public async first(): Promise<T> {
		return this.firstLazy().value()
	}
}
