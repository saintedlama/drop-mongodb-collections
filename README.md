# drop-mongodb-collections

Drops all non system mongodb collections. To be used for tests.

[![Node.js CI](https://github.com/saintedlama/drop-mongodb-collections/actions/workflows/ci.yml/badge.svg)](https://github.com/saintedlama/drop-mongodb-collections/actions/workflows/ci.yml)

[![Coverage Status](https://coveralls.io/repos/github/saintedlama/drop-mongodb-collections/badge.svg)](https://coveralls.io/github/saintedlama/drop-mongodb-collections)

## Usage

```bash
> npm i drop-mongodb-collections --save-dev
```

```js
const dropMongoDbCollections = require('drop-mongodb-collections')('mongodb://localhost/tests');

// Mocha

describe('something', function() {
  // Cleanup db before running tests
  beforeEach(dropMongoDbCollections);

  // Your tests go here
});
```
