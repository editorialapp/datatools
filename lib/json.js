import * as fs from 'fs/promises'
import { Transform } from 'stream'

export async function readJson (filepath) {
	const data = await fs.readFile(filepath, 'utf-8')
	return JSON.parse(data)
}

export async function writeJson (filepath, data, options = {}) {
	if (!data) {
		throw new Error(`data argument required but found data is ${data} when writing to ${filepath}`)
	}

	const { minify = true } = options

	let str
	try {
		if (minify) {
			str = JSON.stringify(data)
		} else {
			str = JSON.stringify(data, null, 2)
		}
	} catch (err) {
		throw new Error(`JSON.stringify error: \n${err}`)
	}

	try {
		return fs.writeFile(filepath, str)
	} catch (err) {
		throw new Error(`Error writing json file: \n${err}`)
	}
}

export async function stringifyJsonTransform (options = {}) {
	options.writableObjectMode = true

	return new Transform({
		...options,
		transform (row, encoding, next) {
			this.push(JSON.stringify(row))
			next()
		}
	})
}
