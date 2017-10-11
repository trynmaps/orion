const cassandra = require('cassandra-driver');
const config = require('./config');

const client = new cassandra.Client({
    contactPoints: [config.cassandraURL],
});
client.connect((err) => {
    assert.ifError(err);
});

function cassandraBatch(queries) {
    client.batch(queries, { prepare: true }, (err) => {
        assert.ifError(err);
        console.log('Data updated on cluster');
     });
}

module.exports = cassandraBatch;
