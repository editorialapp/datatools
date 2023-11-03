import * as fs from 'fs/promises'
import * as path from 'path'

export async function directoryExists (directory) {
	try {
		const stat = await fs.stat(directory)
		return stat.isDirectory()
	} catch (error) {
		return false
	}
}

export async function fileExists (filepath) {
	try {
		await fs.access(filepath)
		return true
	} catch (e) {
		return false
	}
}

export async function mkdirp (filepath) {
	return fs.mkdir(filepath, {
		recursive: true,
		force: true
	})
}

export async function readDirs (filepath, options = {}) {
	const { readFiles = false } = options
	const filepaths = await fs.readdir(filepath)

	return Promise.all(filepaths.map(async (filename) => {
		const nestedFilepath = path.join(filepath, filename)
		const stat = await fs.stat(nestedFilepath)
		const parsedPath = await path.parse(nestedFilepath)

		if (stat.isDirectory()) {
			return readDirs(nestedFilepath, { readFiles })
		}

		if (readFiles) {
			const file = await fs.readFile(nestedFilepath, 'utf-8')

			return {
				...stat,
				filepath: nestedFilepath,
				...parsedPath,
				file
			}
		}

		return {
			...stat,
			filepath: nestedFilepath,
			...parsedPath
		}
	}))
}
