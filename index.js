const axios = require('axios');
const cassandraBatch = require('./cassandraHelper');
const config = require('./config');


while(true) {
    if (Math.floor(Date.now() / 1000) % 15 === 0) {
        updateMuniVehicles();
    }
}

function updateMuniVehicles() {
    axios.get('/agencies/sf-muni/vehicles', {
        baseURL: config.restbusURL
    })
    .then((response) => {
        console.log(response);
        const vehicles = response.data;
        return vehicles.map(makeOrionVehicleFromNextbus);
    })
    .then(addVehiclesToCassandra)
    .catch((error) => {
        console.log(error);
    });
}

function makeOrionVehicleFromNextbus(nextbusObject) {
    const { id, routeId, lat, lon, heading } = nextbusObject;
    return {
        rid: routeID,
        vid: id,
        lat,
        lon,
        heading,
    };
}

function addVehiclesToCassandra(vehicles) {
    const vtime = new Date(Date.now());
    const vhour = vtime.getHours();
    const vdate = vtime.toISOString().slice(0, 10);
    const queries = vehicles.map(vehicle => {
        const {rid, vid, lat, lon, heading} = vehicle;
        return {
            query: 'INSERT INTO muni (vdate, vhour, rid, vid, vtime, lat, lon, heading) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            params: [vdate, vhour, rid, vid, vtime, lat, lon, heading],
        };
    });
    cassandraBatch(queries);
}
