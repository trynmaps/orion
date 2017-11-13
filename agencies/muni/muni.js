const axios = require('axios');
const addVehiclesToCassandra = require('../../vehicleUpdater');
const config = require('../../config');
const muniConfig = require('./muniConfig');

/*
 * Muni uses the NextBus API
 * We use our version of Restbus, which gets all the vehicles
 * https://github.com/trynmaps/restbus
 */

function updateMuniVehicles() {
  return axios.get('/agencies/sf-muni/vehicles', {
    baseURL: config.restbusURL
  })
    .then((response) => {
      const vehicles = response.data;
      console.log(vehicles);
      return vehicles.map(makeOrionVehicleFromNextbus);
    })
    .then((vehicles) => {
      return addVehiclesToCassandra(
        vehicles,
        muniConfig.keyspace,
        muniConfig.vehicleTable,
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function makeOrionVehicleFromNextbus(nextbusObject) {
  const { id, routeId, lat, lon, heading } = nextbusObject;
  return {
    rid: routeId,
    vid: id,
    lat,
    lon,
    heading,
  };
}

module.exports = updateMuniVehicles;
