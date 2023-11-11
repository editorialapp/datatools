import { test } from 'brittle'
import { round_decimal, format_number, format_percentage } from "../lib/numbers.js"

test('round_decimal', async (t) => {
    const one = round_decimal(1.23456789, 2)
    t.is(one, 1.23)

    const two = round_decimal(1.23456789, 3)
    t.is(two, 1.235)

    const three = round_decimal(1.327)
    t.is(three, 1.33)
})

test('format_percentage', async (t) => {
    const one = format_percentage(0.123456789)
    t.is(one, '12.35%')

    const two = format_percentage(0.5432115, 3)
    t.is(two, '54.321%')
})

test('format_number', async (t) => {
    const one = format_number(123456789)
    t.is(one, '123,456,789')

    const two = format_number(123456789.123456789)
    t.is(two, '123,456,789.123')
})
