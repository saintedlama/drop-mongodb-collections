import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { MongoClient } from 'mongodb';
import dropMongodbCollections from '../src/index';

const connectionString = 'mongodb://localhost:27017/drop-mongodb-collections-tests';

describe('drop-mongodb-collections', () => {
  let client: MongoClient;

  beforeEach(async () => {
    client = await MongoClient.connect(connectionString);
  });

  afterEach(async () => {
    if (client) {
      await client.close();
    }
  });

  it('should drop all collections', async () => {
    const db = client.db('drop-mongodb-collections-tests');
    const items = db.collection('items');

    await items.insertOne({ foo: 'bar' });

    await dropMongodbCollections(connectionString);

    const cols = await db.listCollections().toArray();

    expect(cols.length).toBeLessThanOrEqual(1); // 'system.indexes'
  });

  describe('mocha-before-each', () => {
    beforeEach(async () => {
      const db = client.db('drop-mongodb-collections-tests');
      const items = db.collection('items');

      await items.insertOne({ foo: 'bar' });
    });

    beforeEach(async () => {
      await dropMongodbCollections(connectionString);
    });

    it('Should drop all connections before tests', async () => {
      const db = client.db('drop-mongodb-collections-tests');

      const cols = await db.listCollections().toArray();

      expect(cols.length).toBeLessThanOrEqual(1); // 'system.indexes'
    });
  });
});
