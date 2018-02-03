const axios = require('axios');
const addVehiclesToCassandra = require('../../vehicleUpdater');
const config = require('../../config');
const muniConfig = require('./muniConfig');
const nextbus = require('../../nextbus');

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
      return vehicles.map(nextbus.makeOrionVehicleFromNextbus);
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

module.exports = updateMuniVehicles;
