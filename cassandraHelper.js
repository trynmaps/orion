const cassandra = require('cassandra-driver');
const config = require('./config');

const client = new cassandra.Client({
  contactPoints: [config.cassandraURL],
});
client.connect((err) => {
  if (err) {
    console.log('error:' + err);
  } else {
    console.log('connected to cassandra');
  }
});

function cassandraBatch(queries) {
  return new Promise((resolve, reject) => {
    // yes, there are times when no Marin buses are
    // running - and this broke Orion
    if (queries.length === 0) {
      resolve();
    }
    client.batch(queries, { prepare: true }, (err) => {
      if (err) {
        reject('error:' + err);
      }
      resolve();
    });
  });
}

module.exports = cassandraBatch;
