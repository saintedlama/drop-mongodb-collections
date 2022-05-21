const { MongoClient } = require('mongodb');
const { parseOptions } = require('mongodb/lib/connection_string');

const debug = require('debug')('drop-mongodb-collections');

module.exports = async function dropMongodbCollections(connectionString) {
  const { db, client } = await connect(connectionString);

  const collections = await db.listCollections().toArray();

  const collectionsToDrop = collections.filter((collection) => collection.name.indexOf('system') != 0);

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
};

async function connect(connectionString) {
  const connectionOptions = parseOptions(connectionString);

  const client = await MongoClient.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(connectionOptions.dbName);

  return { db, client };
}
