const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;

const dropMongodbCollections = require('../');
const connectionString = 'mongodb://localhost:27017/drop-mongodb-collections-tests';

describe('drop-mongodb-collections', function () {
  this.timeout(5000);

  let client;

  beforeEach(async () => {
    client = await MongoClient.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => await client.close());

  it('should drop all collections', async () => {
    const db = client.db('drop-mongodb-collections-tests');
    const items = db.collection('items');

    await items.insertOne({ foo: 'bar' });

    await dropMongodbCollections(connectionString);

    const cols = await db.listCollections().toArray();

    expect(cols.length).to.be.lte(1); // 'system.indexes'
  });

  describe('mocha-before-each', function () {
    beforeEach(async () => {
      const db = client.db('drop-mongodb-collections-tests');
      const items = db.collection('items');

      await items.insertOne({ foo: 'bar' });
    });

    beforeEach(async () => await dropMongodbCollections(connectionString));

    it('Should drop all connections before tests', async () => {
      const db = client.db('drop-mongodb-collections-tests');

      const cols = await db.listCollections().toArray();

      expect(cols.length).to.be.lte(1); // 'system.indexes'
    });
  });
});
