import xlsx from 'node-xlsx'

export async function parseXlsx (filepath, options) {
	return xlsx.parse(filepath, options)
}
