# drop-mongodb-collections

Drops all non system mongodb collections. To be used for tests.

[![Build Status](https://travis-ci.org/saintedlama/drop-mongodb-collections.svg?branch=master)](https://travis-ci.org/saintedlama/drop-mongodb-collections)

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
