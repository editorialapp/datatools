import format from 'date-fns/format/index.js'

export function format_time (date, time_format = 'h:mm a') {
    return format(new Date(date), time_format)
}

export function format_date (date, date_format = 'MMMM d, yyyy') {
    return format(new Date(date), date_format)
}
