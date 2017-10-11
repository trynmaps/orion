const axios = require('axios');
const config = require('./dev-config');
const cassandra = require('cassandra-driver');

updateMuniVehicles();
const timestamp = Math.floor(Date.now() / 1000);

const client = new cassandra.Client({
    contactPoints: [config.cassandraURL],
});
client.connect((err) => {
  assert.ifError(err);
});

function updateMuniVehicles() {
    axios.get('/agencies/sf-muni/vehicles', {
        baseURL: config.restbusURL
    })
    .then((response) => {
        console.log(response);
        const vehicles = response.data;
        console.log(`there are ${vehicles.length} vehicles`);
        return vehicles.map(makeOrionVehicleFromNextbus);
    })
    .then(addVehiclesToCassandra)
    .catch((error) => {
        console.log(error);
    });
}

function addVehiclesToCassandra(vehicles) {
    const queries = vehicles.map(vehicle => `INSERT INTO sf_muni ((${date}, ${hour}), ${route_id}, ${vehicle_id}, ${vehicle_time}) VALUES (`
    + 

}

function makeOrionVehicleFromNextbus(nextbusObject) {
    const { id, routeId, lat, lon, heading } = nextbusObject;
    return {
        agency_id: 'SF-MUNI',
        route_id: routeID,

    }
}
