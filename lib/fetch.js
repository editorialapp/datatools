import { fetch } from 'undici-fetch'
export { fetch } from 'undici-fetch'

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
