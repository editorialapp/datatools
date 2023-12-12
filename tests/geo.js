import test from 'brittle'
import * as geo from '../lib/geo.js'

test('can use @turf/helpers function', (t) => {
    const point = geo.point([0, 0], { example: true })
    t.ok(point.type === 'Feature')
    t.ok(point.geometry.type === 'Point')
    t.ok(point.properties.example)
})
