import test from 'brittle'
import * as dirname from 'desm'
import { markdownDirectoryToTable } from '../index.js'

test('markdownDirectoryToTable', async (t) => {
	const markdownDirectory = dirname.join(import.meta.url, './fixtures/markdown')

	const db = await markdownDirectoryToTable({
		directoryFilepath: markdownDirectory,
		tableName: 'markdown',
		columns: {
			title: 'TEXT',
			content: 'TEXT'
		}
	})

	const rows = db.prepare('SELECT * FROM markdown;').all()

	const expected = [
		{ title: 'B', content: '<p>This is b.</p>\n' },
		{ title: 'C', content: '<p>This is c.</p>\n' },
		{ title: 'A', content: '<p>This is a.</p>\n' }
	]

	t.alike(rows, expected)
})
