import { S3 } from '@aws-sdk/client-s3'
import collect from 'collect-stream'
import mime from 'mime-types'
import { extname } from 'path'

const s3 = new S3({ region: 'us-east-1' })

export async function uploadFile (options) {
	const {
		bucket,
		filepath,
		body,
		contentType = mime.contentType(extname(filepath))
	} = options

	return s3.putObject({
		Bucket: bucket,
		Key: filepath,
		Body: body,
		ACL: 'public-read',
		ContentType: contentType
	})
}

export function uploadJson (options) {
	const {
		bucket,
		filepath,
		body
	} = options

	return uploadFile({
		bucket,
		filepath,
		body: JSON.stringify(body)
	})
}

export async function downloadFile (options) {
	const {
		bucket,
		filepath
	} = options

	const response = await s3.getObject({
		Bucket: bucket,
		Key: filepath
	})

	return new Promise((resolve, reject) => {
		collect(response.Body, (err, data) => {
			if (err) {
				return reject(err)
			}

			resolve(data.toString())
		})
	})
}

export async function downloadJson (options) {
	const str = await downloadFile(options)
	return JSON.parse(str)
}

export async function deleteFile (options) {
	const {
		bucket,
		filepath
	} = options

	return s3.deleteObject({
		Bucket: bucket,
		Key: filepath
	})
}

export async function listFiles (options) {
	const {
		bucket,
		filepath
	} = options

	let files = []
	let continuePagination = true
	let nextMarker = null

	while (continuePagination) {
		const options = {
			Bucket: bucket,
			Prefix: filepath
		}

		if (nextMarker) {
			options.Marker = nextMarker
		}

		const response = await s3.listObjects(options)

		files = [...files, ...response.Contents]

		if (response.IsTruncated) {
			const length = response.Contents.length
			nextMarker = response.Contents[length - 1].Key
		} else {
			continuePagination = false
			nextMarker = null
		}
	}

	return files.map((item) => {
		return {
			filepath: item.Key,
			...item
		}
	})
}

export async function downloadFiles (options) {
	const list = await listFiles(options)

	const results = list.map(async ({ filepath }) => {
		const file = await downloadFile({ bucket: options.bucket, filepath })

		return {
			filepath,
			file: file.length ? file : null
		}
	})

	return Promise.all(results)
}
