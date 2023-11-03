import slug from '@sindresorhus/slugify'

export function capitalizeWord (word) {
	return word.charAt(0).toUpperCase() + word.substr(1)
}

export function capitalCase (phrase) {
	return phrase.split(' ').map((word) => {
		return capitalizeWord(word.trim())
	}).join(' ')
}

export function slugify (str, options = {}) {
	if (!options.separator) {
		options.separator = '_'
	}

	if (!str) {
		return str
	}

	return slug(str, options)
}

export function unslugify (slug, options = {}) {
	const { capitalize = true } = options

	if (capitalize) {
		return capitalCase(slug.replace(/_/g, ' '))
	}

	return slug.replace(/_/g, ' ')
}

/**
 * Convert an object's properties from strings to numbers where appropriate
 * @param {Object} [options]
 * @param {boolean} [options.convertLeadingZeroStrings=true]
 * @returns {Object}
 */
export function convertNumberProperties (obj, options = {}) {
	const { convertLeadingZeroStrings = true, exclude = [] } = options

	const updatedObj = {}
	for (const key in obj) {
		const value = obj[key]

		if (exclude.includes(key)) {
			updatedObj[key] = value
		} else if (!value) {
			updatedObj[key] = value
		} else {
			const parsed = parseFloat(value.replace(/,/g, ''))

			if (isNaN(parsed)) {
				updatedObj[key] = value
			} else {
				if (Number.isSafeInteger(parsed)) {
					if (convertLeadingZeroStrings && value[0] === '0' && value.length > 1) {
						updatedObj[key] = value
					} else {
						updatedObj[key] = parsed
					}
				} else {
					updatedObj[key] = parsed
				}
			}
		}
	}

	return updatedObj
}

/**
 * Convert an object's properties from empty strings to `null`
 * @param {Object} obj
 * @returns {Object}
 */
export function convertEmptyStringsToNull (obj, options = {}) {
	const { exclude = [] } = options
	const updatedObj = {}

	for (const key in obj) {
		const value = obj[key]

		if (exclude.includes(key)) {
			updatedObj[key] = value
		} else if (typeof value === 'string' && !value.length) {
			updatedObj[key] = null
		} else {
			updatedObj[key] = value
		}
	}

	return updatedObj
}
