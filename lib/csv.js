import { createWriteStream } from 'fs'
import { pipeline } from 'stream'

import { stringify } from 'csv'

export async function writeCsv (filepath, rows, options) {
	const stream = createWriteStream(filepath)
	const csv = stringify({
		header: true
	})

	return new Promise((resolve, reject) => {
		pipeline(csv, stream, (err) => {
			if (err) {
				return reject(err)
			}

			resolve()
		})

		for (const row of rows) {
			csv.write(row)
		}

		csv.end()
	})
}

export async function createCsvWriteStream (options) {
	return stringify(options)
}

// TODO: read csv with csv-parse
