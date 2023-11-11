export function round_decimal (number, precision = 2) {
    const factor = Math.pow(10, precision)
    return Math.round((number + Number.EPSILON) * factor) / factor
}

export function format_percentage (number, precision = 2) {
    return `${format_number(round_decimal(number * 100, precision))}%`
}

export function format_number (number) {
    return number.toLocaleString()
}
