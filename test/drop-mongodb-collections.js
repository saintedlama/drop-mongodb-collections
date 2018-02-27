const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const dropMongodbCollections = require('../');
const connectionString = 'mongodb://localhost/drop-mongodb-collections-tests';

describe('drop-mongodb-collections', function() {
  let client;

  beforeEach((next) => {
    MongoClient.connect(connectionString, function(err, c) {
      if (err) { return next(err); }
      
      client = c;
    
      next(null);
    });
  });

  afterEach((next) => client.close(next));

  it('should drop all collections', function(done) {
    const db = client.db('drop-mongodb-collections-tests');
    const items = db.collection('items');

    items.insert({ foo: 'bar' }, (err) => {
      if (err) { return done(err); }

      const dropTestDb = dropMongodbCollections(connectionString);

      dropTestDb((err) => {
        if (err) { return done(err); }

        // And now verify that we have no more collections in the db
        db.listCollections()
          .toArray((err, cols) => {
            if (err) { return done(err); }

            expect(cols.length).to.be.lte(1); // 'system.indexes'

            done();
        });
      });
    });
  });

  describe('mocha-before-each', function() {
    beforeEach((next) => {
      const db = client.db('drop-mongodb-collections-tests');
      const items = db.collection('items');

      items.insert([{ foo: 'bar' }], next);
    });

    beforeEach(dropMongodbCollections(connectionString));

    it('Should drop all connections before tests', function(done) {
      const db = client.db('drop-mongodb-collections-tests');

      db.listCollections()
        .toArray((err, cols) => {
          if (err) { return done(err); }

          expect(cols.length).to.be.lte(1); // 'system.indexes'

          done();
      });
    });
  })
});
