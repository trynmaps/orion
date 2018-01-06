const axios = require('axios');
const geolib = require('geolib');
const addVehiclesToCassandra = require('../../vehicleUpdater');
const config = require('../../config');
const muniConfig = require('./muniConfig');

/*
 * Muni uses the NextBus API
 * We use our version of Restbus, which gets all the vehicles
 * https://github.com/trynmaps/restbus
 */

let routes = {};
function getMuniStops(routeId) {
  return axios.get(`/agencies/sf-muni/routes/${routeId}`, {
    baseURL: config.restbusURL
  }).then((response) => {
    const route = response.data;
    routes[routeId] = route;
    route.stops.forEach((stop) => {
      stops[stop.id]
    })
  })
}

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
