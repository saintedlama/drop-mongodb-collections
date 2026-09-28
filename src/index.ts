import { MongoClient, type Db } from 'mongodb';
import createDebug from 'debug';

const debug = createDebug('drop-mongodb-collections');

interface ConnectionResult {
  db: Db;
  client: MongoClient;
}

async function connect(connectionString: string): Promise<ConnectionResult> {
  const client = await MongoClient.connect(connectionString);
  const db = client.db();

  return { db, client };
}

async function dropMongodbCollections(connectionString: string): Promise<void> {
  const { db, client } = await connect(connectionString);

  const collections = await db.listCollections().toArray();

  const collectionsToDrop = collections.filter((collection) => collection.name.indexOf('system') !== 0);

  try {
    debug(`Dropping ${collectionsToDrop.length} collections...`);

    for (const collection of collectionsToDrop) {
      await db.dropCollection(collection.name);
    }

    debug('Finished dropping collections');
  } catch (e) {
    debug('Could not drop all collections due to error %s', e);
    throw e;
  }

  try {
    await client.close(true);
  } catch (e) {
    debug('Could not close client connection due to error %s', e);
  }
}

dropMongodbCollections.default = dropMongodbCollections;
dropMongodbCollections.dropMongodbCollections = dropMongodbCollections;

export = dropMongodbCollections;
