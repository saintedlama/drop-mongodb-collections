const mongojs = require('mongojs');
const async = require('async');

const debug = require('debug')('drop-mongodb-collections');

module.exports = function cleanAll(connectionString) {
  const db = mongojs(connectionString, []);

  return function(done) {
    debug('Starting to remove all entries from collections');

    db.getCollectionNames((err, cols) => {
      if (err) { return done(err); }

      cols = cols.filter(col => col.indexOf('system.') != 0);

      async.each(cols, (col, next) => {
        db.collection(col).drop(next);
      }, (err) => {
        debug('Finished dropping collections with error result: %s', err || 'none');

        done(err);
      });
    });
  };
};
