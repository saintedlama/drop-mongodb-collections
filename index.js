const MongoClient = require('mongodb').MongoClient;
const urlParser = require('mongodb/lib/url_parser');

const async = require('async');

const debug = require('debug')('drop-mongodb-collections');

module.exports = function cleanAll(connectionString) {
  return function(done) {
    connect(connectionString, (err, { client, db }) => {
      if (err) { return done(err); }

      db.listCollections().toArray((err, collections) => {
        if (err) { return done(err); }

        const collectionsToDrop = collections.filter(collection => collection.name.indexOf('system') != 0);

        async.each(collectionsToDrop, (collection, next) => db.dropCollection(collection.name, next), (err) => {
          if (err) {
            debug('Could not drop all collections due to error %s', err);

            return done(err);
          }

          debug('Finished dropping collections');
  
          client.close(true, (err) => {
            if (err) { 
              debug('Error while closing mongodb client %s', err); 
            } else {
              debug('Closed mongodb connection');
            }

            done();
          });
        });
      });
    });
  };
};

function connect(connectionString, next) {
  urlParser(connectionString, (err, parsedUrl) => {
    if (err) { return next(err); }

    MongoClient.connect(connectionString, function(err, client) {
      if (err) { return next(err); }
      
      const db = client.db(parsedUrl.dbName);
    
      next(null, { db, client });
    });
  });
}