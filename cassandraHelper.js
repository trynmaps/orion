const cassandra = require('cassandra-driver');
const config = require('./config');

const client = new cassandra.Client({
    contactPoints: [config.cassandraURL],
});
client.connect((err) => {
    console.log('connected to cassandra');
    console.log('error:' + err);
});

function cassandraBatch(queries) {
    client.batch(queries, { prepare: true }, (err) => {
        if (err) {
            console.log('error:' + err);
        }
        console.log('Data updated on cluster');
    });
}

module.exports = cassandraBatch;
