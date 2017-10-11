const cassandra = require('cassandra-driver');
const config = require('./config');

const client = new cassandra.Client({
    contactPoints: [config.cassandraURL],
});
client.connect((err) => {
    console.log(err);
});

function cassandraBatch(queries) {
    client.batch(queries, { prepare: true }, (err) => {
        console.log(err);
        console.log('Data updated on cluster');
    });
}

module.exports = cassandraBatch;
