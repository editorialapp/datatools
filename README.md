# @editorialapp/datatools

A collection of dependencies organized into useful tools for working with data in ways that are common in data cleaning and in building news apps.

These tools assume they will be used as part of scripts run with Node.js.

## Turn a directory of markdown into a sqlite3 table
An example taken from the tests:

```js
import * as dirname from 'desm'
import { markdownDirectoryToTable } from '@editorialapp/datatools'

const markdownDirectory = dirname.join(import.meta.url, './fixtures/markdown')

// an instance of Database from better-sqlite3 is returned
const db = await markdownDirectoryToTable({
    directoryFilepath: markdownDirectory,
    tableName: 'markdown',
    columns: {
        title: 'TEXT',
        content: 'TEXT'
    }
})

const rows = await db.prepare('SELECT * FROM markdown;').all()

console.log(rows)
// returns:
// [
// 	{ title: 'B', content: '<p>This is b.</p>\n' },
// 	{ title: 'C', content: '<p>This is c.</p>\n' },
// 	{ title: 'A', content: '<p>This is a.</p>\n' }
// ]
```

## License
[Apache-2.0](LICENSE.md)
