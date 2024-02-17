import Database from 'better-sqlite3'
import matter from 'front-matter'
import Localdrive from 'localdrive'

import { writeCsv } from './lib/csv.js'
import { directoryExists } from './lib/fs.js'
import { markdownToHtml } from './lib/markdown.js'

export class Directory {
	constructor ({ directory }) {
		this.directory = directory
		this.local = new Localdrive(this.directory)
	}

	async ready () {
		if (!(await directoryExists(this.directory))) {
			throw new Error(`Directory does not exist at path: ${this.directory}`)
		}

		await this.local.ready()
	}

	async *list (filepath, options) {
		const stream = this.local.list(filepath, options)

		for await (const file of stream) {
			const buffer = await this.local.get(file.key)
			yield {
				filepath: file.key,
				content: buffer.toString()
			}
		}
	}

	async toCsv (csvFilepath) {
		const rows = []
		for await (const file of this.local.list('/')) {
			const buffer = await this.local.get(file.key)
			rows.push({
				filepath: file.key,
				content: buffer.toString()
			})
		}

		await writeCsv(csvFilepath, rows)
	}

	async close () {
		await this.hyper.close()
	}
}

export class MarkdownDirectory extends Directory {
	async toCsv (csvFilepath) {
		const rows = []

		for await (const file of this.local.list('/')) {
			const buffer = await this.local.get(file.key)
			const content = buffer.toString()
			const results = matter(content)
			const { attributes, body } = results
			rows.push({
				...attributes,
				content: body
			})
		}

		await writeCsv(csvFilepath, rows)
	}
}

/**
 * Create a sqlite table from a directory of markdown files. The markdown can have yaml front matter.
 * Make sure the front matter has all the same properties for each file. The markdown content will be in a column named `content`.
 * @param {Object} options
 * @param {String} options.tableName name of table to create
 * @param {String} options.directoryFilepath directory to read markdown files from
 * @param {Object} options.columns object of column names and types
 * @param {Boolean} [options.clearTable] whether to clear the table before inserting
 * @param {Object} [options.db] sqlite database instance. `options.databaseFilepath` will be ignored if this is provided.
 * @param {String} [options.databaseFilepath] filepath to sqlite database. ignored if `options.db` is provided.
 * @returns {Promise<Database>}
 */
export async function markdownDirectoryToTable (options = {}) {
	const dir = new MarkdownDirectory({ directory: options.directoryFilepath })
	await dir.ready()

	const columns = Object.keys(options.columns).map((key) => {
		return `${key} ${options.columns[key]}`
	}).join(', ')

	const db = options.db || new Database(options.databaseFilepath || ':memory:')

	if (options.clearTable) {
		await db.exec(`DROP TABLE IF EXISTS ${options.tableName};`)
	}

	await db.exec(`CREATE TABLE IF NOT EXISTS ${options.tableName} (${columns});`)

	for await (const file of dir.list('/')) {
		const { content } = file
		const results = matter(content)
		const { attributes, body } = results
		const { value } = await markdownToHtml(body, options)
		const row = {
			...attributes,
			content: value
		}

		const keys = Object.keys(row)
		const values = keys.map((key) => {
			const columnType = options.columns[key]
			const value = row[key]

			if (columnType.includes('[]')) {
				return `'[${
					value.map((item) => {
						return `${item}`
					}).join(',')
				}]'`
			}

			if (typeof value === 'string') {
				return `'${value.replace(/'/g, '\'\'')}'`
			}

			if (typeof value === 'boolean') {}

			return value
		})

		const sql = `INSERT INTO ${options.tableName} (${keys.join(', ')}) VALUES (${values.join(',')})`
		const query = await db.prepare(sql)

		await query.run()
	}

	return db
}
