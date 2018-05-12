const axios = require('axios');
const addVehiclesToCassandra = require('../../vehicleUpdater');
const config = require('../../config');
const ttcConfig = require('./ttcConfig');
const nextbus = require('../../nextbus');
const writeToS3 = require('../../s3Helper');

/*
 * TTC uses the NextBus API
 * We use our version of Restbus, which gets all the vehicles
 * https://github.com/trynmaps/restbus
 * 
 * A lot of this code is similar to the one used in Muni.js
 * See https://github.com/trynmaps/orion/issues/8 
 * 
 */

class TTC {
  updateCassandraVehicles() {
    return this.getTTCVehicles().then(vehicles => {
      map(nextbus.makeOrionVehicleFromNextbus);
    })
    .then((vehicles) => {
      return addVehiclesToCassandra(
        vehicles,
        ttcConfig.keyspace,
        ttcConfig.vehicleTable,
      );
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateS3Vehicles(currentTime) {
    return this.getTTCVehicles().then(
      (vehicles) => this.saveTTCVehicles(vehicles, currentTime)
    );
  }

  saveTTCVehicles(vehicles, currentTime) {
    return writeToS3('ttc-nextbus-bucket', currentTime, vehicles);
  }

  getTTCVehicles() {
    return axios.get('/agencies/ttc/vehicles', {
      baseURL: config.restbusURL
    })
      .then((response) => {
        const vehicles = response.data;
        console.log(vehicles);
        return vehicles;
      });
  }
}

module.exports = TTC;
