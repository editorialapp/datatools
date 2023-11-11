export function round_decimal (number, precision = 2) {
    const factor = Math.pow(10, precision)
    return Math.round((number + Number.EPSILON) * factor) / factor
}
