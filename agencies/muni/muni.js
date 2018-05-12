const axios = require('axios');
const addVehiclesToCassandra = require('../../vehicleUpdater');
const config = require('../../config');
const muniConfig = require('./muniConfig');
const nextbus = require('../../nextbus');
const writeToS3 = require('../../s3Helper');

/*
 * Muni uses the NextBus API
 * We use our version of Restbus, which gets all the vehicles
 * https://github.com/trynmaps/restbus
 */

class Muni {
  updateCassandraVehicles() {
    return this.getMuniVehicles().then(vehicles => {
      return vehicles.map(nextbus.makeOrionVehicleFromNextbus);
    })
    .then(vehicles => {
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

  updateS3Vehicles(currentTime) {
    return this.getMuniVehicles().then(
      (vehicles) => this.saveMuniVehicles(vehicles, currentTime)
    );
  }

  saveMuniVehicles(vehicles, currentTime) {
    if (!vehicles) console.log('bad');
    return writeToS3('muni-nextbus-bucket', currentTime, vehicles);
  }

  getMuniVehicles() {
    return axios.get('/agencies/sf-muni/vehicles', {
      baseURL: config.restbusURL
    })
      .then((response) => {
        const vehicles = response.data;
        console.log(vehicles);
        return vehicles;
      });
  }
};

module.exports = Muni;
