import { remark } from 'remark'
import html from 'remark-html'

export async function markdownToHtml (input, options = {}) {
	const parser = await remark()

	if (options.plugins && options.plugins.length) {
		for (const plugin of options.plugins) {
			parser.use(plugin)
		}
	}

	parser.use(html, options)
	parser.data('settings', { commonmark: true, emphasis: '_', strong: '*' })
	const file = await parser.process(input)
	return file
}
