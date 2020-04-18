type ParsedContent = {
	id?: string
	content: string
}

type NamedParsedContent<Names> = ParsedContent & ({
	id?: string
	name?: Names
} | {
	id: string,
	name: Names
})

/**
 * this matches everything except the tag sequence.
 * should work for most use cases
 * @param tag Tag sequence of matcher
 */
export const matchAnyInsideTag = (tag: string) => `((?!${tag})*).+`

export const matchInput = {
	name: "input",
	tag_sequence: "##",
	match: matchAnyInsideTag("##"),
}

export const matchImage = {
	name: "image",
	tag_sequence: "--",
	match: matchAnyInsideTag("--"),
}

export function parseContentMultiple<MatcherName extends string>(
	content: string,
	matchers: {
		name: MatcherName,
		tag_sequence: string,
		match: string
	}[]
) {
	return matchers.reduce((acc, matcher) => {
		const res: typeof acc = []

		for (const previousContent of acc) {
			if (!previousContent.content.length) {
				res.push(previousContent)
				continue
			}

			const parts = parseContent(previousContent.content, matcher.tag_sequence, matcher.match).map((part) => {
				return {
					...part,
					name: part.id ? matcher.name : undefined,
				}
			})

			for (const part of parts) {
				res.push(part)
			}

			if (previousContent.id) {
				res.push({
					...previousContent,
					content: "",
				})
			}
		}

		return res
	}, [{
		content
	}] as NamedParsedContent<MatcherName>[])
}

export function parseContent(content: string, tag_sequence: string, match: string = "\\d+"): ParsedContent[] {
	const matchRegex = new RegExp(`${tag_sequence}${match}${tag_sequence}`, "gm")

	const matches = content.match(matchRegex) || []

	// iterating over matches may result in missing text at the end
	// and iterating over a string split by regex may result in wrong
	// assignments of matches to text
	// (there may be empty strings and we don't know where the match belongs)
	// this solution is less elegant but works.
	let str = content
	const ret: ParsedContent[] = matches.map((match) => {
		const [text, ...rest] = str.split(match)
		str = rest.join(match)

		return {
			id: match.replace(new RegExp(tag_sequence, "g"), ""),
			content: text,
		}
	}, content)

	if (str.length > 0) {
		ret.push({
			content: str,
		})
	}

	return ret
}
