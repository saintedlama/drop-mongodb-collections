const expect = require('chai').expect;
const mongojs = require('mongojs');

const dropMongodbCollections = require('../');
const connectionString = 'mongodb://localhost/drop-mongodb-collections-tests';

describe('drop-mongodb-collections', function() {
  it('should drop all collections', function(done) {
    const db = mongojs(connectionString);
    db.items.insert({ name: 'John Doe'}, (err) => {
      expect(err).to.not.exist;

      const dropTestDb = dropMongodbCollections(connectionString);

      dropTestDb((err) => {
        expect(err).to.not.exist;

        // And now verify that we have no more collections in the db
        db.getCollectionNames((err, cols) => {
          expect(err).to.not.exist;
          expect(cols.length).to.equal(1); // 'system.indexes'

          done();
        });
      });
    });
  });

  describe('mocha-before', function() {
    before(dropMongodbCollections(connectionString));

    it('Should drop all connections before tests', function(done) {
      const db = mongojs(connectionString);

      db.getCollectionNames((err, cols) => {
        expect(err).to.not.exist;
        expect(cols.length).to.equal(1); // 'system.indexes'

        done();
      });
    });
  })
});
