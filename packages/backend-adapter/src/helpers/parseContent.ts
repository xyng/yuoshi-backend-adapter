export default function parseContent(content: string, tag_sequence: string, match: string = "\d") {
	// this regex finds placeholders and serves the id
	const matchRegex = new RegExp(`\\W*${tag_sequence}(${match})${tag_sequence}\\W*`, "gm")

	// this regex splits the string at the position of each placeholder
	// we need this other expression for the split because the tag-sequences would be left
	// at the end and start of the split string parts
	const splitRegex = new RegExp(`\\W*${tag_sequence}${match}${tag_sequence}\\W*`, "gm")

	const matches = content.match(matchRegex)

	if (!matches) {
		return [
			{
				id: undefined,
				content: content,
			},
		]
	}

	const parts = content.split(splitRegex)

	return parts.map((part, index) => {
		return {
			id: typeof matches[index] === "undefined" ? undefined : matches[index].replace(new RegExp(tag_sequence, "g"), ""),
			content: part
		}
	})
}
