import { test } from 'brittle'
import { round_decimal } from "../lib/numbers.js"

test('round_decimal', async (t) => {
    const one = round_decimal(1.23456789, 2)
    t.is(one, 1.23)

    const two = round_decimal(1.23456789, 3)
    t.is(two, 1.235)

    const three = round_decimal(1.327)
    t.is(three, 1.33)
})
