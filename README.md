# drop-mongodb-collections

Drops all non system mongodb collections. To be used for tests.

# Usage

```
npm i drop-mongodb-collections --save-dev
```

```js
const dropMongoDbCollections = require('drop-mongodb-collections')('mongodb://localhost/tests');

// Mocha

describe('something', function() {
  // Cleanup db before running tests
  before(dropMongoDbCollections);

  // Your tests go here
});
```
