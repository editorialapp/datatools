import { fetch } from 'undici'
export { fetch } from 'undici'

export async function fetchText (url, options) {
	const response = await fetch(url, options)
	const text = await response.text()
	return text
}

export async function fetchJson (url, options) {
	const response = await fetch(url, options)
	const json = await response.json()
	return json
}
